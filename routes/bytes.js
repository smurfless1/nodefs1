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
