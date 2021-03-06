// Example express application adding the parse-server module to expose Parse
// compatible API routes.
import "regenerator-runtime/runtime";

var express = require("express");
var ParseServer = require("parse-server").ParseServer;
var path = require("path");
var ParseDashboard = require("parse-dashboard");

var databaseUri = process.env.DATABASE_URI || process.env.MONGODB_URI;

if (!databaseUri) {
  console.log("DATABASE_URI not specified, falling back to localhost.");
}

var api = new ParseServer({
  databaseURI: databaseUri,
  cloud: process.env.CLOUD_CODE_MAIN || __dirname + "/cloud/main.js",
  appId: process.env.APP_ID,
  masterKey: process.env.MASTER_KEY, //Add your master key here. Keep it secret!
  serverURL: process.env.SERVER_URL // Don't forget to change to https if needed
});
// Client-keys like the javascript key or the .NET key are not necessary with parse-server
// If you wish you require them, you can set them as options in the initialization above:
// javascriptKey, restAPIKey, dotNetKey, clientKey

var dashboard = new ParseDashboard(
  {
    apps: [
      {
        serverURL: process.env.SERVER_URL,
        appId: process.env.APP_ID,
        masterKey: process.env.MASTER_KEY,
        appName: "ElMotawef"
      }
    ],
    users: [
      {
        user: process.env.APP_ID,
        pass: process.env.MASTER_KEY
      }
    ]
  },
  { allowInsecureHTTP: true }
);

var app = express();
// make the Parse Dashboard available at /dashboard
app.use("/dashboard", dashboard);
// Serve static assets from the /public folder
app.use("/public", express.static(path.join(__dirname, "..", "/public")));

// Serve the Parse API on the /parse URL prefix
var mountPath = process.env.PARSE_MOUNT || "/parse";
app.use(mountPath, api);

var port = process.env.PORT || 1337;
var httpServer = require("http").createServer(app);
httpServer.listen(port, function() {
  console.log("parse-server-example running on port " + port + ".");
});
