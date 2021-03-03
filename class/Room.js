class Room {
  constructor(){
    this.roomList = []//房间名列表
  }
  getRoomList(){
    return this.roomList
  }
  addRoom(roomName){
    if(!this.searchRoom(roomName)){//如果不存在 就表示可以添加,添加成功
      this.roomList.push(roomName)
      return true
    }else{
      return false
    }
  }
  removeRoom(roomName){
    if(this.searchRoom(roomName)){//如果存在 那么就移除房间
      this.roomList.splice(this.roomList.indexOf(roomName),1)
      return true //删除成功
    }else{//如果roomName不存在 那么就移除失败
      return false
    }
    console.log('roomList房间列表',this.getRoomList())
  }
  searchRoom(roomName){
    if(this.roomList.includes(roomName)){//如果存在房间 那么就返回真
      return true
    }else{//不存在 返回假
      return false
    }
  }

}

module.exports = Room
// const test = new Room()
// test.addRoom('房间一')
// test.addRoom('房间2')
// console.log(test.getRoomList())
// test.removeRoom('房间一')
// console.log(test.getRoomList())
