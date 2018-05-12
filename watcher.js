const nsfw = require('nsfw');

/*
Reference: https://github.com/Axosoft/nsfw
In my mind, the most deadly thing here is the reading of the filesystem, which would be
1. expensive
2. block other things
3. not taking advantage of convenient watcher APIs that individual filesystems already have for this very reason.

The downside is that now I'm keeping a list of all the files cached, manually, and I have to keep an eye on that code.
 */

let mydir = process.cwd();
var watcher1;

const fs = require('fs');

var fscache = new Set();

function start() {
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
            // define how to handle events
            //console.log('firstblock');
            //console.log(events);
            events.forEach(event => {
                /*
                console.log(event);
                */
                switch (event.action) {
                    case 0:
                        //console.log('CREATED');
                        fscache.add(event.file);
                        break;
                    case 1:
                        //console.log('Deleted');
                        fscache.delete(event.file);
                        break;
                    case 2:
                        //console.log('modified');
                        fscache.add(event.file);  // overkill, but you know.
                        break;
                    case 3:
                        //console.log('renamed');
                        fscache.delete(event.oldFile);
                        fscache.add(event.newFile);
                        break;
                    default:
                        //console.log('WAT');
                        break;
                }
                //console.log(fscache);
            });
            //console.log('/firstblock');
        })
        .then(function (watcher) {
            watcher1 = watcher;
            return watcher.start();
            //console.log('started');
        })
        .then(function () {
            // we are now watching dir1 for events!
            //console.log('watching');
        });
}

function stop() {
    watcher1.stop();
}

function getcache() {
    // This conversion is done every time, which hurts my eyes.
    // but the parent caller doesn't know what to do with a set.
    // todo learn how to get the express response.json call to like Set
    return Array.from(fscache);
}

module.exports.start = start;
module.exports.stop = stop;
module.exports.getcache = getcache;

