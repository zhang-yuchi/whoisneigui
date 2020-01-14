//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    rankDisplay:'none',
    wrapDisplay:'none',
    joinDisplay:'none',
    creDisplay:'none',
    roomNum:0,
    roomName:wx.getStorageSync('userInfo').nickName +'的房间'
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  toRank: function(){
    this.setData({
      wrapDisplay:'block',
      rankDisplay: 'block'
    })
  },
  closeRank: function(){
    this.setData({
      wrapDisplay:'none',
      rankDisplay: 'none'
    })
  },
  toRoomlist:function(){
    this.setData({
      joinDisplay:'block',
      wrapDisplay:'block'
    })
  },
  closeRoomlist:function(){
    this.setData({
      wrapDisplay:'none',
      joinDisplay:'none'
    })
  },
  toCregame:function(){
    this.setData({
      wrapDisplay:'block',
      creDisplay:'block'
    })
  },
  closeCregame:function(){
    this.setData({
      wrapDisplay: 'none',
      creDisplay: 'none'
    })
  },
  getPnum:function(e){
    let num = e.detail.value;
    if(num>=5 && num <=10){
      this.setData({
        roomNum: num
      })
    }
    else{
      wx.showToast({
        title: '请输入正确的房间人数',
        icon:'none'
      })
    }
  },
  getRoomname:function(e){
    this.setData({
      roomName:e.detail.value
    })
  },
  creRoom:function(){
    let that = this;
    wx.redirectTo({
      url: '../game/game?roomNum=' + that.data.roomNum+'&roomName=' +that.data.roomName,
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
