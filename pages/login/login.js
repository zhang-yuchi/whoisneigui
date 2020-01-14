// pages/login/login.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
  getUserInfo: function (e) {
    var that = this;
    console.log(e.detail)
    if (e.detail.errMsg == "getUserInfo:ok"){
      wx.setStorageSync('userInfo', JSON.parse(e.detail.rawData))
      console.log(wx.getStorageSync("userInfo"))
      wx.setStorageSync("authImg", wx.getStorageSync("userInfo").avatarUrl)
      app.globalData.userInfo = e.detail.userInfo
      that.setData({
        userInfo: e.detail.userInfo
      })
      //邀请进来



      //自己进来
      console.log('自己进来')
      wx.reLaunch({
        url: '../index/index'
      })

      
    }else{
      wx.showToast({
        title: '授权失败',
        icon:'none'
      })
    }
    
    // new Promise(resolve => {
    //   wx.getUserInfo({
    //     lang: "zh_CN",
    //     success(res) {
    //       console.log("entry")
    //       app.globalData.userInfo = res.userInfo
    //       wx.setStorageSync('userInfo', res.userInfo)
    //       console.log(wx.getStorageSync("userInfo"))
    //       resolve()
    //     },
    //   })
    // })
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