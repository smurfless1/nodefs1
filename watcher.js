const nsfw = require('nsfw');

/*
Reference: https://github.com/Axosoft/nsfw https://www.gitkraken.com/nsfw
In my mind, the most deadly thing here is the reading of the filesystem, which would be
1. expensive
2. block other things
3. not taking advantage of convenient watcher APIs that individual filesystems already have for this very reason.

The downside is that now I'm keeping a list of all the files cached, manually, and I have to keep an eye on that code.
 */

var watcher1;

const fs = require('fs');

var fscache = new Set();

exports.start = function start() {
    let mydir = process.cwd();
    /*
    Load an initial cache of the current set of files,
    and set up a watcher to update the in-memory cache.
    This prevents us from hitting it multiple times at once.
     */
    fs.readdir(process.cwd(), (err, files) => {
        fscache = new Set(files);
        //console.log(fscache);
    });

    /**
     * Now set up the monitor that will update the in-memory cache.
     */
    // todo : why "return"?
    return nsfw(
        mydir,
        function (events) {
            events.forEach(event => {
                switch (event.action) {
                    case 0:
                        fscache.add(event.file);
                        break;
                    case 1:
                        fscache.delete(event.file);
                        break;
                    case 2:
                        fscache.add(event.file);  // overkill, but you know.
                        break;
                    case 3:
                        fscache.delete(event.oldFile);
                        fscache.add(event.newFile);
                        break;
                    default:
                        console.log('a new and unknown kind of filesystem change was found');
                        break;
                }
            });
        })
        .then(function (watcher) {
            watcher1 = watcher;
            return watcher.start();
        })
        .then(function () {
            console.log('watching for filesystem changes');
        });
};

exports.stop = function stop() {
    watcher1.stop();
};

exports.getcache = function getcache() {
    // This conversion is done every time, which hurts my eyes.
    // but the parent caller doesn't know what to do with a set.
    return Array.from(fscache);
};
