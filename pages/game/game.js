// pages/game/game.js
const app = getApp()
let room_thread = null
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  sendMsg(){
    // console.log(111)
    room_thread.send({
      data:"11111",
      success(){
        console.log(1111)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //先开启连接
    room_thread = wx.connectSocket({
      url: 'ws://localhost:3000',
      success(SocketTask){
        // console.log(SocketTask)
        console.log("连接成功")
      }
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
  onShareAppMessage: function () {

  }
})