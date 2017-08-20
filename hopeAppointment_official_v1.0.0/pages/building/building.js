// building.js
//获取应用实例
var app = getApp()
var allurl = 'https://zzzz.natapp4.cc/wx/';
Page({
  data: {
    buildings: [
      {
        id: 4,
        name: '',
        address: '',
        capacity: '',
        phone: '',
        src:'',
      },
    ],

  },
  onLoad: function (options) {
    var that = this;
    //请求用户信息
    app.getUserInfo(function (userInfo) {
      wx.setStorageSync("userInfo", userInfo);
      wx.getStorage({
        key: 'userInfo',
        success: function (res) {
          that.setData({
            userInfo: res.data
          })
          console.log(that.data.userInfo)
        }
      })
    })
    //请求服务器数据
    wx.request({
      url: allurl + 'detail',
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        'user_num': wx.getStorageSync('user_num'),
        'room_name': 'none',
        'parent': 'NONE',
      },
      //请求成功返回
      success: function (res) {
        console.log(res)
        var parse = function (data) {
          var ck = eval(data);
          if (Object.prototype.toString.call(ck) === '[object Array]') {
            var out = new Array();
            for (var k = 0; k < ck.length; k++) {
              out[k] = eval('(' + ck[k] + ')');
            }
            return out;
          } else {
            return ck;
          }
        };
        for (var i = 0; i < res.data.length; i++) {
          var param = {};

          var content = "buildings[" + i + "].name";
          param[content] = parse(res.data)[i].Value.building_name;
          that.setData(param);

          // var content = "buildings[" + i + "].address";
          // param[content] = parse(res.data)[i].Value;
          // that.setData(param);

          // var content = "buildings[" + i + "].capacity";
          // param[content] = parse(res.data)[i].Value.more_detail;
          // that.setData(param);

          // var content = "buildings[" + i + "].phone";
          // param[content] = parse(res.data)[i].Value.building_name;
          // that.setData(param);

          var content = "buildings[" + i + "].id";
          param[content] = parse(res.data)[i].Value.id;
          that.setData(param);

          var content = "buildings[" + i + "].src";
          param[content] = 'https://zzzz.natapp4.cc/Content/building_img/' + parse(res.data)[i].Value.img;
          that.setData(param);

          var markk = that.data.buildings;
          that.setData({ buidlings: markk })

        }
      },
      fail: function (err) {
        console.log(err)
      }
    })


  },

  onShow:function(){
    var that = this;
    //请求用户信息
    app.getUserInfo(function (userInfo) {
      wx.setStorageSync("userInfo", userInfo);
      wx.getStorage({
        key: 'userInfo',
        success: function (res) {
          that.setData({
            userInfo: res.data
          })
          console.log(that.data.userInfo)
        }
      })
    })
    //请求服务器数据
    wx.request({
      url: allurl + 'detail',
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        'user_num': wx.getStorageSync('user_num'),
        'room_name': 'none',
        'parent': 'NONE',
      },
      //请求成功返回
      success: function (res) {
        console.log(res)
        var parse = function (data) {
          var ck = eval(data);
          if (Object.prototype.toString.call(ck) === '[object Array]') {
            var out = new Array();
            for (var k = 0; k < ck.length; k++) {
              out[k] = eval('(' + ck[k] + ')');
            }
            return out;
          } else {
            return ck;
          }
        };
        for (var i = 0; i < res.data.length; i++) {
          var param = {};

          var content = "buildings[" + i + "].name";
          param[content] = parse(res.data)[i].Value.building_name;
          that.setData(param);

          // var content = "buildings[" + i + "].address";
          // param[content] = parse(res.data)[i].Value;
          // that.setData(param);

          // var content = "buildings[" + i + "].capacity";
          // param[content] = parse(res.data)[i].Value.more_detail;
          // that.setData(param);

          // var content = "buildings[" + i + "].phone";
          // param[content] = parse(res.data)[i].Value.building_name;
          // that.setData(param);

          var content = "buildings[" + i + "].id";
          param[content] = parse(res.data)[i].Value.id;
          that.setData(param);

          var content = "buildings[" + i + "].src";
          param[content] = 'https://zzzz.natapp4.cc/Content/building_img/' + parse(res.data)[i].Value.img;
          that.setData(param);

          var markk = that.data.buildings;
          that.setData({ buidlings: markk })

        }
      },
      fail: function (err) {
        console.log(err)
      }
    })

  },
  //传递参数
  toNextPage: function(e) {
    console.log('giretj')
    console.log(e)
    var i;
    for(i=0; i<this.data.buildings.length; i++){
      if (e.currentTarget.id == this.data.buildings[i].id.toString())break;
    }
    wx.navigateTo({
      url: '../classroom/classroom?buildings=' + JSON.stringify(this.data.buildings[i]),
    })
  }
})
