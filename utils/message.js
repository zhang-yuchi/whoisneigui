function joinSuccess(res){
  console.log(res)
  return res.msg.roomKey
}
module.exports={
  joinSuccess: joinSuccess
}