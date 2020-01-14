// pages/game/game.js
const app = getApp()
let room_thread = null
Page({

  /**
   * 页面的初始数据
   */
  data: {

    isowner:true,//是不是房主
    word:"二叉树",//自己拿到的词语
    isStart:false,//判断游戏是否开始
    voteList:[],//投票列表
    isVote:false,//是否投票
    isOut:false,//自己是否出局?
    isOver:false,//游戏是否结束
    userlist:[],//所有用户列表
    outWindow:false,//是否打开出局弹框
    sendMsg:false,//是否能发送数据(自己的回合)
    spyVictory:false,//卧底获胜
    otherVictory:true,//平民获胜

    countTime:0,//倒计时时间
    back:false,
  },
  // isInvited:function(){
    
  // },
  back(){
    this.setData({
      back:true
    })
  },
  backcancel(){
    this.setData({
      back:false
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
    this.setData({
      isStart:true
    })
  },


  sendMsg(){
    console.log(112)
    // room_thread.send({
    //   data:"11111",
    //   success(){
    //     console.log(1111)
    //   }
    // })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    // isInvited();
    //先开启连接
    room_thread = wx.connectSocket({
      url: 'ws://10.4.223.246:8082/game/1',
      success(SocketTask){
        // console.log(SocketTask)
        console.log("连接成功")
      }
    })
    room_thread.onMessage((data)=>{
      console.log(data)
    })
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
      path: '/pages/game/game'
    }
  }
})