const crypto = require('crypto');
const hash = crypto.createHash('md5');  // yeah, yeah, I know. md5.
const fs = require('fs');

describe('files', function() {
    it('should create a hash of something', function (done) {
        data = 'this is a test';
        result = crypto.createHash('md5').update(data).digest("hex");
        console.log(result);
        done();
    });

    it('wonders if you can do this, my precious', () => {
       let hashesOfSize = {};
       hashesOfSize[32] = 'foo';
       hashesOfSize[64] = 'foo';

       // why yes, I can
       console.log(`${hashesOfSize[32]}`);
    });

    it('should let me read a partial file', done=> {
        const sizelist = [100, 200, 400, 800, 1600, 2000, 4000];

        let willread = function(bytestoread) {
            return new Promise((resolve, reject) => {
                try {
                    const readable = fs.createReadStream('api/api.js');
                    readable.on('readable', () => {
                        let chunk;
                        if (null !== (chunk = readable.read(bytestoread))) {
                            //console.log(`Received ${chunk.length} bytes of data.`);
                            let result = crypto.createHash('md5').update(chunk).digest("hex");
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
            done();
        });
        // todo why is it calling the data events multiple times?
    });
});

