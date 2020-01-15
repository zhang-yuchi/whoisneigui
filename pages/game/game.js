// pages/game/game.js
const app = getApp()
const msgUtil = require('../../utils/message.js')
const util = require('../../utils/util.js')
let room_thread = null
let roomkey = null
var time = require('../../utils/time.js')
var personNum = 10//最大人数
Page({

  /**
   * 页面的初始数据
   */
  data: {

    isowner:false,//是不是房主
    isready:false,//用户准备
    word:"二叉树",//自己拿到的词语
    isStart:false,//判断游戏是否开始
    voteList:[],//投票列表
    isVote:false,//是否投票
    isOut:false,//自己是否出局?
    isOver:false,//游戏是否结束
    userlist:[],//所有用户列表
    userNow:[],
    outWindow:true,//是否打开出局弹框(是否有别人出局)
    sendMsg:false,//是否能发送数据(自己的回合)

    spyVictory:false,//卧底获胜
    otherVictory:true,//平民获胜

    countTime:0,//倒计时时间
    back:false,//是否开启返回弹窗
    isOutWindow:true,//是否关闭结束页面的弹窗 默认开启
    hiddenvalue:1,//倒计时的透明度
    interval:null,//计时器
    describe:'',//要发送的描述
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
          gameNo:"2"
        }
      })
    })
    this.setData({
      isready:true,
    })
  },
  //取消准备
  readycancel(){
    this.setData({
      isready:false,
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
            gameNo:'2',
            content:'1111111111111111111111111'
          }
        })
      })
      this.setData({
        countTime: 15,
        sendMsg: false
      })
    }
    

    // console.log(112)
    // room_thread.send({
    //   data:"11111",
    //   success(){
    //     console.log(1111)
    //   }
    // })
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

        url: 'ws://10.4.223.246:8082/game/1',

        success(SocketTask) {
          // console.log(SocketTask)
          console.log("连接成功")
        }
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
          console.log(util.jsonToString({
            head: "IMplayer",
            msg: {
              userId: 2,
              userName: "123",
              hostId: 1
            }
          }))
          room_thread.send({
            data:util.jsonToString({
              head:"IMplayer",
              msg:{
                userId: 2,
                userName: "123",
                hostId: 1
              }
            })
          })
        }
        room_thread.onMessage((data) => {
          // console.log(data)
          let res = util.stringToJson(data.data)
          console.log(res)
          if (res.head =="joinSuccess"){
            // msgUtil.joinSuccess(res)
            roomkey = msgUtil.joinSuccess(res)
            console.log(roomkey)
          }else if(res.head =="readyOk"){
            msgUtil.readyOk(that,res)
          }else if(res.head=="playerJoinOk"){
            msgUtil.readyOk(that.res)
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