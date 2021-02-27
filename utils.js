async function getRoomUserList(io,roomName,userMap){//获取用户名列表
  let curRoomUserList = {}
  let socketList = await io.of('/').in(roomName).allSockets()//返回promise 获取room中的所有套接字id
  console.log('userMap:',userMap)
  socketList.forEach(item => {
    curRoomUserList[item] = userMap.get(item).get('name')
  })
  return curRoomUserList
}

function emit(socket,roomName,eventName,data){
  socket.emit(eventName,data)
  socket.to(roomName).emit(eventName,data)
}

module.exports = {
  getRoomUserList,
  emit
}