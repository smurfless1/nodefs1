let crypto = require('crypto');
let express = require('express');
const fs = require('fs');
let fscache = require('../../watcher');
let router = express.Router();

/**
 * Before I venture farther off:
 * What if we kept various lengths of hashes on the starts of each file; 1, 100, 200, 400, etc.
 * We can pre-calculate various hashes to limit the number of files we search. Then when we get a
 * search string, we can:
 * 1. calculate its hash up to the biggest pre-calculated hash:
 *  input:
 *   'this is the song that never ends, yes it goes on and on my friends ...'
 *   -> calculate the hash of its first say 800 bytes if it's 900 bytes long
 *   -> calculate the hash of its first 400 bytes if it's 750 bytes long, etc.
 *   Take that hash, and search for it in the map that stores the 400 byte hashes.
 *   Take the filenames that resolve from that and do the deep match against those files,
 *    and reject/approve accordingly.
 *
 * This requires:
 *  for every file, we need multiple hashes - one per size
 *  {
 *  sizeA : { hash1 : listofnames, hash2: listofnames},
 *  sizeB : { hash3 : listofnames },
 *  ...
 *  example:
 *  20 : { 'asdfghjkl' : ['silence of the lambs.mp4'], 'lkjhgfdsa' : ['star wars.mp4', 'empire strikes back.mp4'] }
 *  }
 *
 *  Proposed use code:
 *  var matched = [];
 *  var knownsize = known_size_for_pattern(mypattern);
 *  var hash_to_find = hash_for(mypattern, knownsize);
 *  var table_to_use = sizehashes[knownsize];
 *  if hash_to_find in sizehashes[knownsize] {
 *      // attempt to add the file name
 *      matched.add(sizehashes[knownsize][hash_to_find];
 *  }

 */

const hash = crypto.createHash('md5');  // yeah, yeah, I know. md5.
const sizelist = [1, 10, 20, 50, 100, 200, 400, 800, 1600, 2000, 4000];

/*
This is a sparse 'list' of hashes of various sizes:
Think of it more like a std::multi-map<int, std::vector<std::string>>
hashesOfSize[1]
hashesOfSize[10] ... etc.
one for every size in sizelist
 */
let hashesOfSize = {};
for (const i in sizelist) {
    hashesOfSize[sizelist[i]] = [];
}

function longest_matching_size(input) {
    if (input.length === 0) {
        throw new Error('input of size 0 will not hash');
    }
    let currentindex = sizelist.length - 1;
    let outsize = sizelist[currentindex];
    while (input.length < outsize) {
        //console.log(`${input.length} < ${outsize} ?`);
        currentindex--;
        outsize = sizelist[currentindex];
    }
    return outsize;
}

/**
 * Given a file name
 * When asked to create hashes,
 * Create hashes for each length and store them in the hash multi-maps
 * @param afile
 */
function create_hashes_for(afile) {
    return new Promise((resolve, reject) => {
        let willread = function(bytestoread) {
            return new Promise((resolve, reject) => {
                try {
                    const readable = fs.createReadStream(afile);
                    readable.on('readable', () => {
                        let chunk;
                        if (null !== (chunk = readable.read(bytestoread))) {
                            //console.log(`Received ${chunk.length} bytes of data.`);
                            let result = crypto.createHash('md5').update(chunk).digest("hex");
                            hashesOfSize[bytestoread][result].push(afile);
                        }
                        readable.close();
                        resolve(result);
                    });
                    readable.on('end', () => {
                        //console.log('end');
                    });
                } catch (e) {
                    console.log(e.message);
                    reject(e);
                }
            });
        };

        let allreads = () => {
            let returnme = [];
            for (const chunksize in sizelist) {
                const resolved = sizelist[chunksize];
                //console.log(`Asking for ${resolved} bytes of data.`);
                returnme.push(willread(resolved));
            }
            return returnme;
        };

        Promise.all(allreads()).then(list_of_hashes => {
            //console.log('done!');
            //console.log(list_of_hashes);
        });
    });

}

/**
 * Return the matching files for a given byte pattern.
 * @param pattern bytes to match
 */
function pattern_searching(pattern) {
    // yes, I can see the potential optimizations of b-trees, tries and so on,
    // but i'm worried about the web services more today
    results = [];
    try {
        files = fscache.getcache();
        //todo security/cleaning of the pattern
        let repattern = RegExp("^" + pattern + ".*");
        files.forEach(elt => {
            try {
                if (repattern.test(elt)) {
                    results.push(elt);
                }
            } catch (ee) {
                console.log("An element match went horribly wrong; continuing");
            }
        });
        return results;
    } catch (e) {
        console.log("Something in the pattern matching loop went horribly wrong; continuing.")
    }
    return results;
}

/* ==================== Visual Marker ========================================
 * External API calls
 * ==================== Visual Marker ========================================*/

// so I can unit test this externally. There's probably a better way.
exports.longest_matching_size =  longest_matching_size;

exports.start = () => {
    fscache.start;

    for (const filename in fscache.getcache()) {
        create_hashes_for(filename).then(()=>{console.log(`Cached hashes for ${filename}`)});
    }

    // todo register a handler for new files needing to get hashed, including updates/renames
    // which would call create_hashes_for and delete old values
};

/* Stop the persistent file system cache watcher, or the process won't want to exit.*/
exports.stop = function(req, res, next) {
    fscache.stop();
};

/*
Get the cached list of files from the filesystem watcher.
 */
exports.get_all_files = function(req, res, next) {
    try {
        res.json(fscache.getcache());
    } catch (e) {
        console.log('failed to read the filesystem cache, returning an empty response');
        res.json([]);
    }
};

/*
Filter the list of cached files to only match files with a given starting sequence
If all else fails it will return an empty list.

Sooo there's a problem here, as get requests are limited in the number of bytes you can send, plus encoding
gets weird when things are urlencoded, and I don't even know all the rules. I know POST is the better way though.

exports.get_with_prefix = function(req, res, next) {
    try {
        res.json(pattern_searching(req.params.prefix));
    } catch (e) {
        res.json([]);
    }
};
 */

/*
Get the list of files that match the prefix bytes posted to this file
This needs:
Request is of type application/json
Request actually parses to json
otherwise you get an empty list
 */
exports.post = function(req, res, next) {
    // todo limit bytes that come in to less than required amount in a better way?
    try {
        if (typeof req.body === 'undefined') { res.json([]); }
        if (req.body.prefix.length > 4096) {
            res.json({err: 'The maximum match amount is 4096 bytes'});
        }
        res.json(pattern_searching(req.body.prefix));
    } catch (e) {
        res.json([]);
    }
};

/* ==================== Visual Marker ========================================
 * End external API calls
 * ==================== Visual Marker ========================================*/
