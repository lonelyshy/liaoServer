
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http, { cors: true });
var utils = require('./utils')
// var io = require('socket.io')(http);
var Room = require('./Room.js')//导入房间类
var room = new Room()//实例化
var User = require('./User.js')
app.all('*', function(req, res, next) {  //解决http跨域 并没有解决socket io 跨域
  res.header("Access-Control-Allow-Origin", "*");  
  res.header("Access-Control-Allow-Headers", "X-Requested-With");  
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");  
  res.header("X-Powered-By",' 3.2.1')  
  res.header("Content-Type", "application/json;charset=utf-8");  
  next();  
}); 
app.get('/', function(req, res){// 监听 默认路径
  res.send('test');
});

app.get('/addRoom',function(req,res){//监听 增加房间
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
})

app.get('/queryRoom',function(req,res){//监听 查询房间
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

const users = new User() //用户列表 socketid对应名字
io.on('connection', function(socket){
  // console.log('a user connected');
  const curRoomName = socket.request._query.roomName
  socket.join(curRoomName,()=>{//加入房间
    console.log("joinRoom",socket.id,socket.rooms)
  })
  socket.on('sendMessageServer',(data)=>{//有新消息  
    utils.emit(socket,curRoomName,'sendMessageClient',{socketId:socket.id,msg:data})
  })
  socket.on('addNewUserServer',async (user)=>{//
    //如果存在 那么就 命名重复怎么办？暂时名字后面加个数字
    users.setUserName(socket.id,user.userName)
    //获取当前房间的用户名列表
    let curRoomUserList = await utils.getRoomUserList(io,curRoomName,users.getUserMap())
    console.log(curRoomName,curRoomUserList)
    // socket.to(curRoomName).emit('addNewUserclient',curRoomUserList)//返回用户列表 sockeet.to(room) 会广播房间里所有人 但是不包括发件人
    // socket.emit('addNewUserclient',curRoomUserList)//sockeet.to(room) 会广播房间里所有人 但是不包括发件人 所以写两便  发送给所有人
    utils.emit(socket,curRoomName,'addNewUserclient',curRoomUserList)
  }) 
  socket.on('disconnect',()=>{
    // console.log('删除socket')
    users.deleteUser(socket.id)
    // console.log('当前socket',users.getUserMap())
  })
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
    