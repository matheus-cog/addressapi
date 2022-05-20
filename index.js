require('dotenv').config();
var express = require('express');
var http = require('http');
var path = require('path');
var cors = require('cors');
var app = express(); 
var swaggerUi = require('swagger-ui-express'), swaggerFile = require('./swagger_output.json');
var options = require('./assets/css/swagger_custom');

http.createServer(app).listen(process.env.PORT);
console.log("\nServidor iniciado em "+process.env.HOST+":"+process.env.PORT+"\n");

app.use(cors());

app.get('/', function(req, res) { 
    res.sendFile("index.html", { root: __dirname + "/pages/site" });
});

app.use('/assets', express.static(path.join(__dirname, '/assets')));
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile, options));

require('./endpoints')(app);

app.use((req, res, next) => {
    res.status(404).sendFile("index.html", { root: __dirname + "/pages/404" });
});