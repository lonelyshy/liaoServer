
const express = require('express')//导入express类
var app = express()//实例化express
const Room = require('./class/Room')
const room = new Room()
app.use('/userIcon',express.static(__dirname + '/public/userIcon'),(req, res, next)=>{//设置静态文件路径，返回图片的路径，设置response的响应透为image/png
  res.header('Content-Type',"image/png")
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

module.exports = {
  app,
  room
}