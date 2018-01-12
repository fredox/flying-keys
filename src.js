var kb = require("USBKeyboard");

var WIFI_NAME = "";
var WIFI_KEY = "";
var wifi;

// This serves up the webpage
function onPageRequest(req, res) {
  var a = url.parse(req.url, true);
  if (a.pathname=="/") {
    // handle the '/' (root) page...
    // If we had a POST, handle the data we're being givem
    if (req.method=="POST" && 
        req.headers["Content-Type"]=="application/x-www-form-urlencoded")
      handlePOST(req);
    // Otherwise write the main page. We're using
    // ES6 Template Literals here to make the HTML easy
    // to read.
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(`
<html>
 <meta name="viewport" content="width=device-width, initial-scale=1" />
 <body>
  <form align="center" action="#" method="post">
    <input type="text" id="mytext" name="mytext" value="JAJAJAJA"/><br/>
    <button style="padding-top:30px;margin-top:30px;">FLYING KEY!</button>
  </form>
 </body>
</html>`);
  } else {
    // Page not found - return 404
    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.end("404: Page "+a.pathname+" not found");
  }
}

// This handles any received data from the POST request
function handlePOST(req) {
  var data = "";
  req.on('data', function(d) { data += d; });
  req.on('close', function() {
    // closed - now handle the url encoded data we got
    var postData = {};
    data.split("&").forEach(function(el) {
      var els = el.split("=");
      postData[els[0]] = decodeURIComponent(els[1]);
    });
    
    kb.setModifiers(kb.MODIFY.SHIFT, function() {
      kb.type(postData.mytext, function() {
        kb.setModifiers(0, function() {
          kb.tap(kb.KEY.ENTER); 
        });
      });
    });   
  });
}


// This is called when we have an internet connection
function onConnected() {
  console.log("Connected!");
  wifi.getIP(function(err, ip) {
    console.log("Connect to http://"+ip.ip);
    require("http").createServer(onPageRequest).listen(80);
  });
}

// Initialisation for Espruino WiFi ONLY
function onInit() {
  wifi = require("EspruinoWiFi");
  wifi.connect(WIFI_NAME, { password : WIFI_KEY }, function(err) {
    if (err) {
      console.log("Connection error: "+err);
      return;
    }
    onConnected();
  });
}
