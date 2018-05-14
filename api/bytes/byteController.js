let express = require('express');
let router = express.Router();
let fscache = require('../../watcher');

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

/*
Filter the list of cached files to only match files with a given starting sequence
If all else fails it will return an empty list.
 */
exports.get_with_prefix = function(req, res, next) {
    try {
        res.json(pattern_searching(req.params.prefix));
    } catch (e) {
        res.json([]);
    }
};

/*
Get the cached list of files from the filesystem watcher.
The field "prefix" will be used similarly to the prefix arg in the get method

This needs:
Request is of type application/json
Request actually parses to json
otherwise you get an empty list
 */
exports.post = function(req, res, next) {
    try {
        if (typeof req.body == 'undefined') { res.json([]); }
        // todo clean the request body
        res.json(pattern_searching(req.body.prefix));
    } catch (e) {
        res.json([]);
    }
};

// =====
router.get('/stop', function(req, res, next) {
    fscache.stop();
});

/*
Get the cached list of files from the filesystem watcher.
 */
router.get('/', function(req, res, next) {
    try {
        res.json(fscache.getcache());
    } catch (e) {
        console.log('failed to read the filesystem cache, returning an empty response');
        res.json([]);
    }
});

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

