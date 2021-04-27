const formidable = require('formidable')//上传文件处理模块
let {app,room,users} = require('../app.js')
let http = require('http').Server(app);
let io = require('socket.io')(http, { cors: true });
let utils = require('../utils/utils.js')
// let User = require('../class/User.js')
// const users = new User() //用户列表 socketid对应名字
io.on('connection', function(socket){
  const curRoomName = socket.request._query.roomName
  socket.join(curRoomName,()=>{//加入房间
    console.log("joinRoom",socket.id,socket.rooms)
  })
  socket.on('sendMessageServer',(data)=>{//有新消息  
    utils.emit(socket,curRoomName,'sendMessageClient',{socketId:socket.id,data:data})
  })
  socket.on('addNewUserServer',async (user)=>{//有新用户加入
    //如果存在 那么就 命名重复怎么办？暂时名字后面加个数字
    users.setUserName(socket.id,user.userName,user.userIcon)//设置用户名和socketId绑定
    //获取当前房间的用户名列表
    let curRoomUserList = await utils.getRoomUserList(io,curRoomName,users.getUserMap())
    utils.emit(socket,curRoomName,'addNewUserclient',curRoomUserList)
  }) 
  socket.on('disconnect',async ()=>{//用户断开链接
    console.log('删除socket',users.getUserMap().get(socket.id))
    users.deleteUser(socket.id)
    let curRoomUserList = await utils.getRoomUserList(io,curRoomName,users.getUserMap())
      // utils.emit(socket,curRoomName,'addNewUserclient',curRoomUserList)//更新用户列表 就不用向这个socket发送 了 因为已经关闭了
    socket.to(curRoomName).emit('addNewUserclient',curRoomUserList)
    console.log('当前房间用户列表curRoomUserList',curRoomName,curRoomUserList)
  
    console.log('chatServer.js getRoomList',room.getRoomList())
  })
});
setInterval(() => {//每分钟查询有没有空房间 有的话那么就删除空房间中的内容
  room.getRoomList().forEach(async(roomName)=>{
    if(await utils.isEmptyRoom(io,roomName)){//如果当前房间的用户数为 0  那么就后删除房间
      room.removeRoom(roomName)//删除当前房间
      console.log('删除',roomName)
      utils.rmdirSync(roomName)//删除当前文件下所有文件
    }
  })

}, 60000);

http.listen(3000, function(){
  console.log('listening on *:3000');
});
