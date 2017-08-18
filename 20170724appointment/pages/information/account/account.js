

// account.js
var app = getApp()
Page({
  data: {
    userInfo: {},
    phone: '',
    userIden: '0',
  },

  onLoad: function (options) {
    var that = this
    //获取用户信息
    wx.getStorage({
      key: 'user_auth',
      success: function (res) {
        console.log('权限值' + res.data)
        that.setData({
          userIden: res.data
        })
      }
    })
    app.getUserInfo(function (userInfo) {
      that.setData({
        userInfo: userInfo
      })
    })
  },

})