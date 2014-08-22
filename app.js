/**
 * This is a simple static file server used to serve the js file.
 *
 * You'll need to compile via grunt for this to be useful
 */

var http = require("http"),
    url = require("url"),
    path = require("path"),
    fs = require("fs"),
    port = process.argv[2] || 4080;

http.createServer(function(request, response) {

  var uri = url.parse(request.url).pathname,
      header = {"Content-Type": "text/html"},
      filename = path.join(process.cwd(), uri);

  path.exists(filename, function(exists) {
    if(!exists) {
      response.writeHead(404, {"Content-Type": "text/plain"});
      response.write("404 Not Found\n");
      response.end();
      return;
    }

    if (fs.statSync(filename).isDirectory()) {
        filename += '/index.html';
    }

    fs.readFile(filename, "binary", function(err, file) {
      if(err) {
        response.writeHead(500, {"Content-Type": "text/plain"});
        response.write(err + "\n");
        response.end();
        return;
      }

      if(filename.match(/\.js$/)) {
          header = {"Content-Type": "text/javascript"};
      }
      if(filename.match(/\.css$/)) {
          header = {"Content-Type": "text/css"};
      }

      response.writeHead(200, header);
      response.write(file, "binary");
      response.end();
    });
  });
}).listen(parseInt(port, 10));

console.log("Static file server running at\n  => http://localhost:" + port + "/\nCTRL + C to shutdown");