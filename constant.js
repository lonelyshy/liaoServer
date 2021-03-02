let fs = require('fs')
const userIcon = fs.readdirSync('./userIcon')
const host = "http://127.0.0.1:3000/"
module.exports = {
  userIcon,
  host
}