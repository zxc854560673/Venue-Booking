// alert.js
var app = getApp()
var allurl = 'https://zzzz.natapp4.cc/wx/';
Page({
  data: {
    rooms: [
      {
        status: '未通过',
      },
      {
        status: '已通过',
      }
    ],
  },
  
  onLoad: function () {
    var that = this;
    console.log('获取状态' + this.data.rooms[0].status)

    wx.request({
      url: allurl + 'my',
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        'user_num': wx.getStorageSync('user_num'),
        'target': 'mybook',
      },
      success: function (qaq) {
        console.log(eval(qaq.data));
        console.log('预约信息')
        //处理json的函数parse
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
        }
        console.log(parse(eval(qaq.data)));
        var obj = parse(eval(qaq.data))
        for (var i = 0; i < obj.length; i++) {
          var param = {};
          var wsp = "rooms[" + i + "].status";
          param[wsp] = obj[i].status;
          that.setData(param);
          console.log('昔我往矣' + obj[i].status)
        }
      },
    })
  },
  toNextPage: function (e) {
    console.log(e)
    console.log('创造函数' + e.target.dataset.status);
    var i;
    for (i = 0; i < this.data.rooms.length; i++) {
      if (e.currentTarget.id == this.data.rooms[i].status.toString()) break;
    }
    wx.navigateTo({
      url: '../information/history/history',
    })
  },

  toPreviousPage: function () {
    wx.navigateBack({
      delta: 1,
    })
  },
})
