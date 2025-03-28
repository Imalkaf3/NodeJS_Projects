// Require modules
var http = require('http'),
    url = require('url'),
    path = require('path'),
    fs = require('fs');

// Array of Mime Types
var mimeTypes = {
    "html": "text/html",
    "jpeg": "image/jpeg",
    "jpg": "image/jpeg",
    "png": "image/png",
    "js": "text/javascript",
    "css": "text/css"
};

// Create Server
http.createServer(function(req, res) {
  var uri = url.parse(req.url).pathname;
  var filename = path.join(process.cwd(), unescape(uri));
  var stats;

  try {
    stats = fs.lstatSync(filename); // throws if path doesn't exist
  } catch (e) {
    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.write('404 Not Found\n');
    res.end();
    return;
  }

  if (stats.isFile()) {
    // path exists, is a file
    var mimeType = mimeTypes[path.extname(filename).split(".").reverse()[0]];
    res.writeHead(200, {'Content-Type': mimeType || 'application/octet-stream'});

    var fileStream = fs.createReadStream(filename);
    fileStream.pipe(res);
  } else if (stats.isDirectory()) {
    // path exists, is a directory
    var indexFile = path.join(filename, "index.html");
    if (fs.existsSync(indexFile)) {
      // Serve index.html if it exists
      res.writeHead(200, { 'Content-Type': 'text/html' });
      fs.createReadStream(indexFile).pipe(res);
    } else {
      // Otherwise, list directory contents
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.write('Index of ' + uri + '\n');
      res.end();
    }
    return;
  } else {
    // Other types of errors
    res.writeHead(500, {'Content-Type': 'text/plain'});
    res.write('500 Internal server error\n');
    res.end();
    return;
  }

}).listen(3000);

console.log("Server running at http://localhost:3000/");

