var express = require("express");
var app = express();
var router = express.Router();
var path = __dirname + '/views/';

app.use('/static', express.static('content'));

router.use(function (req,res,next) {
  next();
});

router.get("/",function(req,res){
  res.sendFile(path + "index.html");
});

router.get("/login",function(req,res){
  res.sendFile(path + "login.html");
});

router.get("/ciclos",function(req,res){
  res.sendFile(path + "ciclos.html");
});

router.get("/minutas",function(req,res){
  res.sendFile(path + "minutas.html");
});

router.get("/productos",function(req,res){
  res.sendFile(path + "productos.html");
});

router.get("/pedidos",function(req,res){
  res.sendFile(path + "pedidos.html");
});

app.use("/",router);

app.use("*",function(req,res){
  res.sendFile(path + "404.html");
});

app.listen(process.env.PORT || 3040,function(){
  console.log("Live at Port 3040");
});
