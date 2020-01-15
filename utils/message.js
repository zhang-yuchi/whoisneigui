
let msgUtil = {
  joinSuccess(res) {
    console.log(res)
    return res.msg.roomKey
  },
  readyOk(that, data) {
    console.log(data)
    
  },

}
module.exports=msgUtil