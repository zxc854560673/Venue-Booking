 // pages/information/history/history.js
var app = getApp()
var wx_yeshu = 0;
var wx_y_r = false;
var allurl = 'https://zzzz.natapp4.cc/wx/';
var ccio = 0;
Page({
  data: {
    listhide: true,
    historys: [
      {
        id: '',
        building_name: '',
        classroom_name: '',
        organization: '',
        status: '0',
        src: '',
        apply_time:'',
        apply_for_time: '',
        start_time: '',
        end_time: '',
        phone_num: '',
        reply_time: '',
        reason: '',
      },
    ],
    hasMore: true,
    loadingMore: false,
  },
  onLoad: function (options) {

    var that = this;
    wx.request({
      url: allurl + 'my',
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        'user_num': wx.getStorageSync('user_num'),
        'target': 'mybook',
      },
      success: function (e) {
        console.log('球球大作战')
        console.log(e)
        console.log(e.data.length)
        if (e.data.length != 0) {
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
        var obj = parse(eval(e.data))
        ccio += obj.length;
        for (var i = 0; i < obj.length; i++) {
          var param = {};

          var content1 = "historys[" + i + "].id";
          param[content1] = obj[i].id;

          var content2 = "historys[" + i + "].building_name";
          param[content2] = obj[i].building_name;

          var content3 = "historys[" + i + "].classroom_name";
          param[content3] = obj[i].room_name;

          var content4 = "historys[" + i + "].organization";
          param[content4] = obj[i].organization;

          var content5 = "historys[" + i + "].apply_for_time";
          param[content5] = obj[i].apply_for_time;

          var content5 = "historys[" + i + "].apply_time";
          param[content5] = obj[i].apply_time;

          var content5 = "historys[" + i + "].start_time";
          param[content5] = obj[i].start_time;

          var content5 = "historys[" + i + "].end_time";
          param[content5] = obj[i].end_time;

          var content5 = "historys[" + i + "].phone_num";
          param[content5] = obj[i].phone_num;

          var content5 = "historys[" + i + "].reply_time";
          param[content5] = obj[i].reply_time;

          var content5 = "historys[" + i + "].reason";
          param[content5] = obj[i].reason

          var wsp = "historys[" + i + "].status";
          param[wsp] = obj[i].status;

          var room_img = "historys[" + i + "].src";
          param[room_img] = 'https://zzzz.natapp4.cc/Content/building_img/' + obj[i].img;
          that.setData(param);
        }
        // }
        } else {
          that.setData({
            'listhide': false,
          })
          wx.showToast({
            title: '您还没有预约记录',
            icon: 'loading',
            duration: 3000,
            success: function () {
              setTimeout(function () {
                wx.navigateBack({
                  delta: 1,
                })
              }, 3000)
            },
          })
        }
      },
    })
  },
  onReachBottom: function (e) {
    if (wx_y_r) return;//增加获取完毕的处理
    var that = this;
    wx_yeshu++;
    wx.request({
      url: allurl + 'my',
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        'user_num': wx.getStorageSync('user_num'),
        'target': 'mybook',
        'yeshu': wx_yeshu,
      },
      success: function (e) {
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
        var obj = parse(eval(e.data));
        let dimo = ccio;
        let ooook = 0;
        ccio += obj.length;
        for (var i = dimo; i < ccio; i++) {
          ooook = i - dimo;
          var param = {};

          var content1 = "historys[" + i + "].id";
          param[content1] = obj[ooook].id;

          var content2 = "historys[" + i + "].building_name";
          param[content2] = obj[ooook].building_name;

          var content3 = "historys[" + i + "].classroom_name";
          param[content3] = obj[ooook].room_name;

          var content4 = "historys[" + i + "].organization";
          param[content4] = obj[ooook].organization;

          var content5 = "historys[" + i + "].apply_for_time";
          param[content5] = obj[ooook].apply_for_time;

          var content5 = "historys[" + i + "].apply_time";
          param[content5] = obj[ooook].apply_time;

          var content5 = "historys[" + i + "].start_time";
          param[content5] = obj[ooook].start_time;

          var content5 = "historys[" + i + "].end_time";
          param[content5] = obj[ooook].end_time;

          var content5 = "historys[" + i + "].phone_num";
          param[content5] = obj[ooook].phone_num;

          var content5 = "historys[" + i + "].reply_time";
          param[content5] = obj[ooook].reply_time;

          var wsp = "historys[" + i + "].status";
          param[wsp] = obj[ooook].status;

          var wsp = "historys[" + i + "].src";
          param[wsp] = obj[ooook].img;

          var room_img = "historys[" + i + "].src";
          param[room_img] = 'https://zzzz.natapp4.cc/Content/building_img/' + obj[ooook].img;
          that.setData(param);
        }
        if (e.data.length != 0) {
          that.setData({
            loadingMore: true,
          })
        }else {
          wx_y_r = true;
          that.setData({
            loadingMore: false,
          })
        }
      }
    })
  },
  cancel: function (e) {
    wx.request({
      url: allurl + 'my',
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        'user_num': wx.getStorageSync('user_num'),
        'id': e.currentTarget.id,
        'target': 'cancle',
      },
      success: function (res) {
        wx.showModal({
          title: '提示',
          content: '确定要取消预约吗？',
          success: function (res) {
            if (res.confirm) {
              wx.redirectTo({
                url: '../../information/history/history',
              })
            } else if (res.cancel) { }
          }
        })
      }
    })
  },

  toNextPage: function(e){
    for (var i = 0; i < this.data.historys.length; i++) {
      if (e.currentTarget.id == this.data.historys[i].id.toString()) break;
    }
    wx.navigateTo({
      url: '../historydetail/historydetail?historys=' + JSON.stringify(this.data.historys[i]),
    })
  }
})