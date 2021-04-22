const { host } = require('./constant.js')
const fs = require('fs')
const path = require('path')
async function getRoomUserList(io,roomName,userMap){//获取用户名列表
  let curRoomUserList = {}
  let socketList = await io.of('/').in(roomName).allSockets()//返回promise 获取room中的所有套接字id
  socketList.forEach(item => {
    curRoomUserList[item] = {
      "userName":userMap.get(item).get('name'),
      "userIcon":host+"public/userIcon/"+userMap.get(item).get('userIcon')
      }
  })  
  return curRoomUserList
}

async function isEmptyRoom(io,roomName){//判断房间是否为空？ 人数为0
  let socketList = await io.of('/').in(roomName).allSockets()//返回promise 获取room中的所有套接字id
  console.log('socketList',socketList)
  if(socketList.size === 0){//如果当前房间下的socket列表为空 说明当前房间为空
    return true
  }else{
    return false
  }
}

function emit(socket,roomName,eventName,data){//socket emit 事件
  // socket.to(curRoomName).emit('addNewUserclient',curRoomUserList)//返回用户列表 sockeet.to(room) 会广播房间里所有人 但是不包括发件人
  // socket.emit('addNewUserclient',curRoomUserList)//sockeet.to(room) 会广播房间里所有人 但是不包括发件人 所以写两便  发送给所有人
  socket.emit(eventName,data)
  socket.to(roomName).emit(eventName,data)
}

function rmdirSync(path){//删除空房间 及文件 后面优化
  console.log('删除',path)
    fs.access('../public/files'+path, fs.constants.F_OK, (err) => {//判断文件夹路径是否存在
      try{
        if(err){
          console.log(__dirname +'\\..\\public\\files\\'+ path)
          deleteFolder(__dirname +'\\..\\public\\files\\'+ path)//删除文件夹必须用绝对路径
        }else{
          console.log("给定的路径不存在，请给出正确的路径");
        }
      }catch(err){
        console.log('路径不存在，不删除')
      }
     
    });
    fs.access('../public/images'+path, fs.constants.F_OK, (err) => {//判断文件夹路径是否存在
      try{
        if(err){
          deleteFolder(__dirname +'\\..\\public\\images\\' + path)
        }else{
          console.log("给定的路径不存在，请给出正确的路径");
        }
      }catch(err){
        console.log('路径不存在，不删除')
      }
     
    });
    fs.access('../public/sounds'+path, fs.constants.F_OK, (err) => {//判断文件夹路径是否存在
      try{
        if(err){
          deleteFolder(__dirname +'\\..\\public\\sounds\\' + path)
        }else{
          console.log("给定的路径不存在，请给出正确的路径");
        }
      }catch(err){
        console.log('路径不存在，不删除')
      }
      
    });
  }



function deleteFolder(url) {
  let files = [];
  /**
   * 判断给定的路径是否存在
   */
 
    /**
     * 返回文件和子目录的数组
     */
    
    files = fs.readdirSync(url);
    files.forEach(function (file, index) {

      const curPath = path.join(url, file);
      console.log(curPath);
      /**
       * fs.statSync同步读取文件夹文件，如果是文件夹，在重复触发函数
       */
      if (fs.statSync(curPath).isDirectory()) { // recurse
        deleteFolder(curPath);

      } else {
        fs.unlinkSync(curPath);
      }
    });
    /**
     * 清除文件夹
     */
    fs.rmdirSync(url);

 
}



module.exports = {
  getRoomUserList,
  emit,
  isEmptyRoom,
  rmdirSync
}