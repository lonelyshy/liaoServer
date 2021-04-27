let fs = require('fs')

const userIcon1 = fs.readdirSync('./public/userIcon')
const host = "http://127.0.0.1:3000/"
userIcon = userIcon1.map(item=>{
  item = host+"public/userIcon/"+item
  return item
})
module.exports = {
  userIcon,
  host
}