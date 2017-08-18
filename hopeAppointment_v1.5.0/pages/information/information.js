// information.js
var app = getApp()
Page({
  data: {
    userInfo: {},
    userIden: '0',
  },

  onLoad: function () {
    console.log('onLoad')
    var that = this
    //获取用户信息
    wx.getStorage({
      key: 'userInfo',
      success: function (res) {
        that.setData({
          userInfo: res.data
        })
      },
    })
    wx.getStorage({
      key: 'user_auth',
      success: function (res) {
        console.log('权限值' + res.data)
        that.setData({
          userIden: res.data
        })
        console.log(that.data.userIden)
      }
    })
  },

  mainInfo: function () {
    wx.navigateTo({
      url: 'account/account',
    })
  },
  history: function () {
    wx.navigateTo({
      url: 'history/history',
    })
  },
  authority: function () {
    wx.navigateTo({
      url: 'authority/authority',
    })
  },
  aboutUs: function () {
    wx.navigateTo({
      url: 'about/about',
    })
  },


})