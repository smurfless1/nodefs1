let express = require('express');
let router = express.Router();
let fscache = require('../watcher');

fscache.start();

/*
//todo clear?
// this is used by the app object
function start() {
    fscache.start();
};
*/

/* Stop the persistent file system cache watcher, or the process won't want to exit.*/
router.get('/stop', function(req, res, next) {
    fscache.stop();
});

/*
Get the cached list of files from the filesystem watcher.
 */
router.get('/', function(req, res, next) {
    res.json(fscache.getcache());
});

/*
Get the cached list of files from the filesystem watcher.
Anything posted TO us is promptly ignored.
 */
router.post('/', function(req, res, next) {
    res.json(fscache.getcache());
});

module.exports = router;
