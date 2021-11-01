const express = require('express');
const createError = require('http-errors');
const db = require("./dbConnectivity/mongodb");
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
// const nftRouter = require('./Routes/nftRouter');
const config = require("./config/config.json");
const app = express();
// // view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');
const cors = require("cors");
app.use(cors());
app.use(logger('dev'));
app.use(express.urlencoded({ extended: true, limit: "1000mb" }));
app.use(express.json({ limit: "1000mb" }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// Index router call for routing
const index = require("./routes/indexRoute");
app.use("/api/v1", index);


// Swagger documentation
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
var swaggerDefinition = {
  info: {
    title: "Need_Blockchain_&_Full_Stack_Development_Firm_to_Develop_NFT_Platform ",
    version: "2.0.0",
    description: "Need_Blockchain_&_Full_Stack_Development_Firm_to_Develop_NFT_Platform For NFTS API DOCS",
  },
  host: `${global.gConfig.swaggerURL}`,
  basePath: "/",
};

var options = {
  swaggerDefinition: swaggerDefinition,
  apis: ["./routes/*/*.js"],
};

var swaggerSpec = swaggerJSDoc(options);
app.get("/swagger.json", function (req, res) {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

// initialize swagger-jsdoc
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));


// catch 404 and forward to error handler
// app.use(function (req, res, next) {
//   next(createError(404));
// });

// error handler
// app.use(function (err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

app.listen(global.gConfig.node_port, function () {
  console.log("Server is listening on", global.gConfig.node_port);
});

module.exports = app;
