
const express = require('express')//导入express类
const path = require('path')//导入path
const fs = require("fs")
const app = express()//实例化express
const Room = require('./class/Room')
const room = new Room()
let User = require('./class/User.js')
const users = new User() //用户列表 socketid对应名字
const multer = require("multer")
const { userIcon } = require('./utils/constant.js')
const storagePic = multer.diskStorage({//设置图片存储位置和存储的名字
  destination: function (req, file, cb) {
    try{
      fs.mkdirSync(`./public/images/${req.body.roomName}`)
    }catch(err){
      console.log('路径已经存在')
    }
  cb(null, `./public/images/${req.body.roomName}`)//${req.body.roomName}
  },
  filename: function (req, file, cb) {
  cb(null, path.parse(file.originalname).name +path.parse(file.originalname).ext)
  }
  })
//设置保存规则
const storageFile = multer.diskStorage({//设置文件存储位置和存储的名字
  //destination：字段设置上传路径，可以为函数
  destination: function (req, file, cb) {
    try{
      fs.mkdirSync(`./public/files/${req.body.roomName}`)
    }catch(err){
      console.log('路径已经存在')
    }
  cb(null, `./public/files/${req.body.roomName}`)//${req.body.roomName}
  },
  //filename：设置文件保存的文件名
  filename: function (req, file, cb) {
  cb(null, path.parse(file.originalname).name + path.parse(file.originalname).ext)
  }
  })
 //设置音频保存规则
const storageSound = multer.diskStorage({//设置音频存储位置和存储的名字
  //destination：字段设置上传路径，可以为函数
  destination: function (req, file, cb) {
    try{
      fs.mkdirSync(`./public/sounds/${req.body.roomName}`)
    }catch(err){
      console.log('路径已经存在')
    }
  cb(null, `./public/sounds/${req.body.roomName}`)//${req.body.roomName}
  },
  //filename：设置文件保存的文件名
  filename: function (req, file, cb) {
  cb(null, `${req.body.fileName}`)
  }
  }) 
const uploadPic = multer({ storage: storagePic })
const uploadFile = multer({ storage: storageFile })
const uploadSound = multer({ storage: storageSound })
const singleMidlePic = uploadPic.single("uploadPic");//一次处理一张
const singleuploadFile = uploadFile.single("uploadFile");//一次处理一张 uploadFile是上传的字段名
const singleuploadSound = uploadSound.single("uploadSound");//一次处理一张 uploadFile是上传的字段名

app.use('/public/userIcon',express.static(__dirname + '/public/userIcon'),(req, res, next)=>{//设置静态文件路径，返回用户头像的路径，设置response的响应透为image/png
  res.header('Content-Type',"image/png")
  next()
})
app.use('/public/images',express.static(__dirname + '/public/images'),(req, res, next)=>{//设置静态文件路径，返回图片的路径，设置response的响应透为image/png
  res.header('Content-Type',"image/png;image/jpeg")
  next()
})
app.use('/public/files',express.static(__dirname + '/public/files'),(req, res, next)=>{//设置静态文件路径，返回文件的路径，设置response的响应透为image/png
  res.header('Content-Type',"*")
  next()
})
app.use('/public/sounds',express.static(__dirname + '/public/sounds'),(req, res, next)=>{//设置静态文件路径，返回音频的路径，设置response的响应透为image/png
  res.header('Content-Type',"*")
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
//监听上传文图片路径
app.post("/uploadPic", singleMidlePic, function (req, res) {
  res.send({
    code:0,
    data:{
      path:req.file,
      roomName:req.body.roomName
    },
    msg:"图片上传成功"
  });
});
//监听上传文件路径
app.post("/uploadFile", singleuploadFile, function (req, res) {
  res.send({
    code:0,
    data:{
      path:req.file,
      roomName:req.body.roomName
    },
    msg:"文件上传成功"
  });
});
//监听发送音频路径
app.post("/uploadSound", singleuploadSound, function (req, res) {
  res.send({
    code:0,
    data:{
      path:req.file,
      roomName:req.body.roomName,//房间名称
      duration:req.body.duration//录音时长
    },
    msg:"音频上传成功"
  });
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
app.get('/getIconList',function(req,res){
    res.send({
      code:0,
      data:userIcon,
      msg:"获取iconList成功"
    })
})
// 监听 默认路径
app.get('/', function(req, res){
  res.send('test');
});
module.exports = {
  app,
  room,
  users
}