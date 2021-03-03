const { host } = require('./constant.js')
async function getRoomUserList(io,roomName,userMap){//获取用户名列表
  let curRoomUserList = {}
  let socketList = await io.of('/').in(roomName).allSockets()//返回promise 获取room中的所有套接字id
  socketList.forEach(item => {
    curRoomUserList[item] = {
      "userName":userMap.get(item).get('name'),
      "userIcon":host+"userIcon/"+userMap.get(item).get('userIcon')
      }
  })
  return curRoomUserList
}

async function isEmptyRoom(io,roomName){
  let socketList = await io.of('/').in(roomName).allSockets()//返回promise 获取room中的所有套接字id
  console.log('socketList',socketList)
  if(socketList.size === 0){//如果当前房间下的socket列表为空 说明当前房间为空
    return true
  }else{
    return false
  }
}

function emit(socket,roomName,eventName,data){
  // socket.to(curRoomName).emit('addNewUserclient',curRoomUserList)//返回用户列表 sockeet.to(room) 会广播房间里所有人 但是不包括发件人
  // socket.emit('addNewUserclient',curRoomUserList)//sockeet.to(room) 会广播房间里所有人 但是不包括发件人 所以写两便  发送给所有人
  socket.emit(eventName,data)
  socket.to(roomName).emit(eventName,data)
}

module.exports = {
  getRoomUserList,
  emit,
  isEmptyRoom
}