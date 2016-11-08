const fs = require('fs');
const path = require('path');
const express = require('express');
const vueServerRenderer = require('vue-server-renderer');
const app = express();

// Get the HTML layout
const layout = fs.readFileSync('./index.html', 'utf8')

// Server-Side Bundle File
const serverBundleFilePath = path.join(__dirname, '../dist/bundle.server.js')
const serverBundleFileCode = fs.readFileSync(serverBundleFilePath, 'utf8');
const bundleRenderer = vueServerRenderer.createBundleRenderer(serverBundleFileCode);

// Client-Side Bundle File
const clientBundleFilePath = path.join(__dirname, '../dist/bundle.client.js');
const clientBundleFileUrl = '/bundle.client.js';

app.use('/assets', express.static(__dirname + '/assets'));

// Server-Side Rendering
app.get('/', function (req, res) {
  bundleRenderer.renderToString((err, html) => {
    if (err){
      res.status(500).send(`
        <h1>Error: ${err.message}</h1>
        <pre>${err.stack}</pre>
      `);
    } else {
       res.send(layout.replace('<div id="app"></div>', html));
    }
  });
});

app.get('/data', function (req, res) {
  function randNum() {
    return Math.round(Math.random() * 100);
  }
  res.send({
    name: `Hans-${randNum()}`,
    age: randNum(),
  });
});

// Client-Side Bundle File
app.get(clientBundleFileUrl, function (req, res) {
  const clientBundleFileCode = fs.readFileSync(clientBundleFilePath, 'utf8');
  res.send(clientBundleFileCode);
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
  console.log(`Example app listening on port ${PORT}!`);
});
