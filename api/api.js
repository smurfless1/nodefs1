/*
    Web Programming Exercise:

1.  Implement a web server in Node that hosts a simple web service.  The
service should accept both GET and POST requests and should deliver the
following:

input - a sequence of 100 or less characters.
output -  The list of filenames in the server's working directory that begin with those characters.
Scale:  The server should support 0 < n < 25 simultaneous requests without
major degradation of performance assuming sufficient server CPU and I/O
capabilities are available. Assume that there will be less than 1000 files in
the server working directory.

2.  Build a simple test framework in either Python or Node to verify the
implementation from the client-side.

Be prepared to discuss how the Node server logic (and potentially the usage of
HTTP) might need to change if the requirements evolved to be: return the list
of files that contain the input sequence anywhere within the file.  Note that
size of individual files is arbitrary -- could be 1TB or more per file.  Also,
be prepared to discuss how you might scale this architecture on the server
side if the number of files needed to grow into the hundreds of thousands, and
also if the number of clients needed to grow to the same scale.  Don't
implement this part of it!  Just be prepared to discuss.

Optional Phase II (if time allows -- this is a slightly more advanced version
and NOT expected for you to complete... it's just there in case you want to
try something tougher):

Modify the code in Phase I to handle a sequence of up to 4k bytes of binary
data.  The service should return the list of filenames in the working
directory that begin with those bytes.  Don't worry about big/little endian
conversion or other encodings, just assume the native byte order on the
platform that the web server is running on.  Warning:  there may be some extra
considerations for the GET request with this one.  It's OK if you only
implement POST, as long as you can tell us what the problems might be with GET.

To reinforce, there is no hidden expectation here -- we only would like you to
do the first part.  We will not think less of you if you don't do the second
part.  Do the second part only if you have time and want to give it a crack.
*/

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

let router = require('express').Router();

// Include the various routes we have set up
router.use('/files', require('./files/fileRoutes'));
router.use('/bytes', require('./bytes/byteRoutes'));

module.exports = router;
