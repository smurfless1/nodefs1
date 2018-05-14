let express = require('express');
let router = express.Router();
let fscache = require('../../watcher');

/**
 * Before I venture farther off:
 * What if we kept various lengths of hashes on the starts of each file:
 * len | hash
 * 1 | ...
 * for each length as it doubles up to the max 4000:
 * 1, 2, 4, 8, 16, 32, 64, ...
 *
 * When searching for a pattern:
 * 1. get the biggest number we can capture from the above range thing.
 * 2. hash that length of the source pattern
 * 3. compare that to the hashes we know of the known-cached files
 * 4. any file that matches, do the deep compare, and add if matching
 *
 * This requires:
 *  for every file, we need multiple hashes - one per size
 *  {
 *  sizeA : { hash1 : filename1, hash2: filename2 },
 *  sizeB : { hash3 : filename3 },
 *  ...
 *  }
 *  I could see this being accessed as:
 *  var matched = [];
 *  var knownsize = known_size_for_pattern(mypattern);
 *  var hash_to_find = hash_for(mypattern, knownsize);
 *  var table_to_use = sizehashes[knownsize];
 *  if hash_to_find in sizehashes[knownsize] {
 *      // attempt to add the file name
 *      matched.add(sizehashes[knownsize][hash_to_find];
 *  }

 let crypto = require('crypto');
 crypto.createHash('md5').update(data).digest("hex");

 */

/**
 * Return the matching files for a given pattern. Used to share code between get and post.
 * @param pattern
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

exports.start = fscache.start;

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
    try {
        if (typeof req.body === 'undefined') { res.json([]); }
        res.json(pattern_searching(req.body.prefix));
    } catch (e) {
        res.json([]);
    }
};

/* ==================== Visual Marker ========================================
 * End external API calls
 * ==================== Visual Marker ========================================*/
