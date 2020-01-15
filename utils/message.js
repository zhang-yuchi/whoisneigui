
let msgUtil = {
  joinSuccess(res) {
    console.log(res)
    return res.msg.roomKey
  },
  readyOk(that, data) {
    console.log(data)
    
  },
  gamelist(that,userlist,alivelist,numflag){//整合出一个所有用户的列表,这个列表要符合前端需要的标准,对后端给的列表进行合并 第2个参数是所有用户的列表,第3个参数是存活用户列表,第4个参数是到谁的标识 
  for(let item of userlist){
    item.alive = true;//用户是否存活 默认存活
    item.numflag = false;//用户是否到他 默认没到
  }
  if(alivelist){
    //如果传了第三个参数

  }
  if(numflag){
    //如果传了第四个参数
    
  }

  },
}
module.exports=msgUtil