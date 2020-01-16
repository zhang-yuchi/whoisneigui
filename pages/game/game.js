// pages/game/game.js
const app = getApp()
const msgUtil = require('../../utils/message.js')
const util = require('../../utils/util.js')
let room_thread = null
let roomkey = null
var time = require('../../utils/time.js')
var currentPlayer = 0;

var gameNo = 0;

var userid = 3;//记得改


var turns = 1;
var personNum = 5//最大人数
var msglist = []
var alivelist = []
var hostId = 1
Page({

  /**
   * 页面的初始数据
   */
  data: {
    msglist:[],//信息列表
    alivelist:[],//存活列表
    isowner:false,//是不是房主
    isready:false,//用户准备
    word:"",//自己拿到的词语
    isStart:false,//判断游戏是否开始
    voteList:[],//投票列表
    isVote:false,//是否投票
    isOut:false,//自己是否出局?
    isOver:false,//游戏是否结束
    userlist:[],//所有用户列表()

    gamelist:[],//(进入的游戏人数列表)
    userNow:[],
    userId:null,
    gameNo:null,
    personNum: 5,//最大人数
    roomName:'',
    outWindow:false,//是否打开出局弹框(是否有别人出局)

    sendMsg:true,//是否能发送数据(是否是自己的回合)

    spyVictory:false,//卧底获胜
    otherVictory:true,//平民获胜
    gameNo:0,//自己的游戏编号
    countTime:0,//倒计时时间
    back:false,//是否开启返回弹窗
    isOutWindow:true,//是否关闭结束页面的弹窗 默认开启
    hiddenvalue:1,//倒计时的透明度
    interval:null,//计时器
    describe:'',//要发送的描述
    voteNo:'',
    voteNum:'',
    inviteNum:4,//房间待邀请人数
  },
  back(){
    this.setData({
      back:true
    })
  },
  leaveroom(){
    let that = this
    wx.showModal({
      title: '退出',
      content: '您要中途退出吗?',
      success(){
        wx.redirectTo({
          url: '../index/index',
          success: function(res) {},
          fail: function(res) {},
          complete: function(res) {},
        })
      },
    })
  },
  //准备
  readyfinish(){
    
    room_thread.send({
      data:util.jsonToString({
        head:"getReady",
        msg:{
          roomKey:roomkey,
          gameNo:gameNo
        }
      })
    })
    this.setData({
      isready:true,
    })
  },
  //取消准备
  readycancel(){
    room_thread.send({
      data:util.jsonToString({
        head:'readyCancel',
        msg:{
          roomKey:roomkey,
          gameNo:gameNo
        }
      })
    })
    this.setData({
      isready:false
    })
  },
  backcancel(){
    this.setData({
      back:false
    })
  },
  continuegame(){
    let that = this
    that.setData({
      isOutWindow:false,
    })
  },
  //退出房间
  backsure(){
    room_thread.close({
      success(){
        wx.reLaunch({
          url: '../index/index',
        })
      },
      fail(err){
        console.log(err)
      },
      complete(){
        wx.reLaunch({
          url: '../index/index',
        })
      }
    })
  },
  readytogame(){
    let that = this
    

    room_thread.send({
      data: util.jsonToString({
        head:"startGame",
        msg:{
          roomKey: roomkey
        }
      })
    })
    this.setData({
      isStart:true
    })

    




  },
  hiddenwindow(){
    let that = this
    if(that.data.hiddenvalue==0.1){
      that.setData({
        hiddenvalue:1
      })
    }else{
      that.setData({
        hiddenvalue: 0.1
      })
    }
  },
  getDescribe:function(e){
    this.setData({
      describe:e.detail.value
    })
  },
  

  sendMsg(){
    let that = this
    let word = this.data.word
    let describe = this.data.describe
    let flag = true
    for(let w of word){
      let reg = new RegExp(w+'+','img')
      let result = reg.test(describe)
      if (result){
        wx.showToast({
          title: '包含关键字，无法发送',
          icon:'none'
        })
        flag = false;
        break;
      }
    }
    if (describe != '' && flag){
      console.log('发送成功')
      clearInterval(this.data.interval)
      room_thread.send({
        data:util.jsonToString({
          head:'speak',
          msg:{
            roomKey:roomkey,
            gameNo:that.data.gameNo,
            content:that.data.describe
          }
        })
      })
      this.setData({
        countTime: 15,
        sendMsg: false
      })
    }
    
  },
  sendVote:function(){
    room_thread.send({
      data:util.jsonToString({
        head:'vote',
        msg:{
          voteMsg:'1|2',
          roomKey:roomkey
        }
      })
    })
    this.setData({
      isVote:false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    console.log(options)
    if (wx.getStorageSync('userInfo')){
      //先开启连接
      room_thread = wx.connectSocket({

        url: app.wsHost+userid,

        success(SocketTask) {
          // console.log(SocketTask)
          console.log("连接成功")
        }
      })
      that.setData({
        roomName:options.roomName
      })
      console.log(options.roomNum)
      room_thread.onOpen(function(){
        if (!options.roomNum) {
          //建立房间
          console.log(111)
          room_thread.send({
            data: JSON.stringify({
              head: "IMhost",
              msg: {
                userId: 1,
                maxPlayer: parseInt(options.roomNum),
                roomName: options.roomName,
                userName: wx.getStorageSync("userInfo").nickName
              },
              success(){
                wx.showToast({
                  title: '创建房间成功',
                })
                that.setData({
                  roomName: options.roomName
                })
              },
              fail(){
                wx.showToast({
                  title: '创建房间失败!',
                  icon:"none",
                })
              }
            })})
        }else{
          //其他人加入房间
          // console.log(util.jsonToString({
          //   head: "IMplayer",
          //   msg: {
          //     userId: 2,
          //     userName: "123",
          //     hostId: 1
          //   }
          // }))
          room_thread.send({
            data:util.jsonToString({
              head:"IMplayer",
              msg:{

                userId: userid,
                userName: "123",
                hostId: 1

              }
            })
          })
        }
        room_thread.onMessage((data) => {
          console.log(data)
          let res = util.stringToJson(data.data)
          console.log(res)
          if (res.head =="joinSuccess"){//私发
            roomkey = msgUtil.joinSuccess(res)
            console.log(res)
            
            that.setData({
              userId:res.msg.userId,
              gameNo:res.msg.gameNo
            })
            gameNo = res.msg.gameNo
          }
          if(res.head =="readyOK"){//玩家准备ok
            let arr = []
            for (let item of res.msg) {
              arr.push(item)
            }
            that.setData({
              userNow: arr
            })
            console.log(arr)
          }
          if(res.head=="playerJoinOK"){//有人加入
            // msgUtil.readyOk(that.res)
            console.log(res)
            let arr =[]
            for(let item of res.msg){
              arr.push(item)
            }
            that.setData({
              inviteNum: inviteNum-1
            })
            if (that.data.inviteNum < 0) {
              that.setData({
                inviteNum: 0
              })
            }
            that.setData({
              userNow:arr
            })
            console.log('房间人数：'+ arr.length)
            console.log(arr)
          }

          if (res.head == "playerSpeakOK") {//下一个发言者 null为一轮结束
            console.log("接收到了")
            if (!res.msg) {
              //开始投票
              console.log("开始投票")
              that.setData({
                isVote: true,
              })
            } else {
              //该下一个人说了
              currentPlayer = res.msg
              if (currentPlayer == gameNo) {
                //是自己
                that.setData({
                  sendMsg: true
                })
              }
            }
          }
          if(res.head =="playerSpeak"){//发言
            console.log("说话了")
            // msglist.push()
            // let msg = res.msg
            let msg = res.msg
            let numIndex = msg.indexOf("说")
            let flagIndex = msg.indexOf("：")
            console.log(numIndex)
            console.log(flagIndex)
            let num = msg.substring(0,numIndex)
            let content = msg.substring(flagIndex+1)
            console.log(num)
            console.log(content)
            
            let obj = {
              gameNo:num,
              content:content,
              
            }
            that.data.msglist.push(obj)
            for (let item of that.data.msglist){
              
            }
            that.setData({
              msglist: that.data.msglist
            })
          }
          
          if (res.head =="GAMESTARTED"){//房主开始游戏
            console.log("游戏开始了")
            that.setData({
              msglist:[
                {
                  content: "第1轮",
                  isTips: true,
                },
              ],
              isStart:true
            })
            currentPlayer = res.msg
            console.log(that.data.gameNo)
            console.log(currentPlayer)
            if(that.data.gameNo==currentPlayer){
              that.setData({
                sendMsg:true,
              })
            }
            console.log(that.data.sendMsg)
          }
          if(res.head=="playerList"){
            //开始游戏时的人数
            var arr = res.msg
            for(let item of arr){
              item.alive = true
            }
            that.setData({
              gamelist:res.msg
            })
            console.log(that.data.gamelist)
          }
          if(res.head =="playerWordKey"){
            //渲染每个词语,并且赋给用户
            let arr = that.data.gamelist
            let list = res.msg
            let word = ""
            for(let item of arr){
              item.word = list[item.gameNo]
            }
            for(let item of arr){
              if(that.data.gameNo==item.gameNo){
                that.setData({
                  word:item.word
                })
                break;
              }
            }
            that.setData({
              gamelist:arr
            })
            console.log(that.data)
          }
          if(res.head == 'cancelReadyOK'){//取消准备
            let arr = []
            for (let item of res.msg) {
              arr.push(item)
            }
            that.setData({
              userNow: arr
            })
          }
          if (res.head == "voteResult"){
            console.log("展示投票结果")
            that.setData({
              votedNo: res.msg.split(':')[0],
              voteNum: res.msg.split(':')[1]
            })
            
          }
          if (res.head == 'voteSet') {
            let voteList = util.getArr(res.msg)
            that.setData({
              voteList: voteList
            })

          }
          if (res.head == 'AfterVote'){//投票后存活列表
            
          }
          if (res.head == "spyVotedOUT"){//平民获胜
            console.log("间谍投出")
            that.setData({
              isOver: true,
              spyVictory:true,
              otherVictory:false
            })
          }
          if(res.head == "civilianVotedOUT"){
            //间谍获胜
            that.setData({
              isOver:true,
              spyVictory: true,
              otherVictory: false
            })
          }

          if (res.head == "gameResult"){
            //游戏结束---分为间谍和平民
            

          }
          if(res.head == 'civilianVoteOUT'){
            //卧底赢

          }
          if(res.head =="beforeVote"){
            console.log("存活列表")
            console.log(res.msg)
            let userlist = that.data.gamelist;
            let alive = res.msg
            for(let item of userlist){
              item.alive = false
              for(let key of alive){
                if(item.gameNo==key.gameNo){
                  item.alive = true
                  break
                }
              }
            }
            that.setData({
              gamelist:userlist
            })
            console.log(that.data)
          }

        })
        
      })
      
      
    }else{
      wx.redirectTo({
        url: '../login/login?roomid='+roomkey,
      })
    }

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    return {
      title: '谁是卧底，快来玩呀',
      path: '/pages/game/game?roomid='+roomkey
    }
  }
})