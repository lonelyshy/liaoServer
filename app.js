
const express = require('express')//导入express类
const path = require('path')//导入path
const fs = require("fs")
const app = express()//实例化express
const Room = require('./class/Room')
const room = new Room()
let User = require('./class/User.js')
const users = new User() //用户列表 socketid对应名字
const multer = require("multer")
const storage = multer.diskStorage({//设置存储位置和存储的名字
  destination: function (req, file, cb) {
    try{
      fs.mkdirSync(`./public/images/${req.body.roomName}`)
    }catch(err){
      console.log('路径已经存在')
    }
  cb(null, `./public/images/${req.body.roomName}`)//${req.body.roomName}
  },
  filename: function (req, file, cb) {
  cb(null, path.parse(file.originalname).name + '-' + Date.now()+path.parse(file.originalname).ext)
  }
  })
const upload = multer({ storage: storage })

const singleMidle = upload.single("singleFile");//一次处理一张

app.use('/public/userIcon',express.static(__dirname + '/public/userIcon'),(req, res, next)=>{//设置静态文件路径，返回图片的路径，设置response的响应透为image/png
  res.header('Content-Type',"image/png")
  next()
})
app.use('/public/images',express.static(__dirname + '/public/images'),(req, res, next)=>{//设置静态文件路径，返回图片的路径，设置response的响应透为image/png
  res.header('Content-Type',"image/png;image/jpeg")
  next()
})
//解决http跨域 并没有解决socket io 跨域
app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");  
  res.header("Access-Control-Allow-Headers", "X-Requested-With");  
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");  
  res.header("X-Powered-By",' 3.2.1')  
  res.header("Content-Type", "application/json;charset=utf-8");  
  next();  
}); 
app.post("/singup", singleMidle, function (req, res) {
  res.send({
    code:0,
    data:{
      path:req.file,
      roomName:req.body.roomName
    },
    msg:"文件上传成功"
  });
});

// 监听 默认路径
app.get('/', function(req, res){
  res.send('test');
});
//监听 增加房间
app.get('/addRoom',function(req,res){
  const roomName = req.query.name
  if(room.addRoom(roomName)){//如果添加成功
    res.send({
      code:0,
      data:{},
      msg:"创建房间成功"
    })
  }else{
    res.send({
      code:1,
      data:{},
      msg:"创建房间失败，房间已经存在"
    })
  }
  console.log('room.getRoomList()',room.getRoomList())
})
//监听 查询房间
app.get('/queryRoom',function(req,res){
  const roomName = req.query.name
  if(room.searchRoom(roomName)){//如果查询存在
    res.send({
      code:0,
      data:{},
      msg:"房间存在"
    })
  }else{
    res.send({
      code:1,
      data:{},
      msg:"房间不存在"
    })
  }
})
//查询用户名是否重复
app.get('/queryUserName',function(req,res){
  const userName = req.query.name
  if(users.queryUserName(userName) == '重复'){
    res.send({
      code:-1,
      data:{},
      msg:"用户名已经存在"
    })
  }else{
    res.send({
      code:0,
      data:{},
      msg:"姓名没有重复"
    })
  }
})

module.exports = {
  app,
  room,
  users
}