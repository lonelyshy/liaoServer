const { userIcon } = require('../utils/constant.js')
class User{
  constructor(){
    this.userMap = new Map()
  }
  //获取用户列表
  getUserMap(){
    return this.userMap
  }
  //设置用户名
  setUserName(socketId,name,icon){
    this.userMap.set(socketId,new Map())//给当前socket新建一个 map
    this.userMap.get(socketId).set('name',name)//设置当前socket的用户名
    this.userMap.get(socketId).set('userIcon',icon)//设置随机用户头像
    console.log("当前IO所有链接的socketthis.userMap:",this.userMap)
    // this.queryUserName(name,socketId)
  }
  queryUserName(name,socketId=''){
    console.log('name',name)
    for(let item of this.userMap){
      console.log("item",item)
      if(item[0] == socketId){
        continue
      }
      if(this.userMap.get(item[0]).get('name') === name){
        // this.userMap.get(item[0]).set('name',name+Math.ceil(Math.random()*100))
        return '重复'
      } 
    }
    return '不重复'
  }
  deleteUser(socketId){//断开链接时  删除当前用户socket
    return this.userMap.delete(socketId)//删除断开链接的用户
  }
}

module.exports = User