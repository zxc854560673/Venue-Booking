// // preclassroom.js
var app = getApp();
var allurl = 'https://zzzz.natapp4.cc/wx/';
Page({
  data: {
    date: '',
    building_id: '',
    name: '',
    address: '',
    capacity: '',
    phone: '',
    listhide: true,
    classrooms: [
      {
        id: '',
        name: '',
        intro: '',
        capacity: '',
        src: '',
      }
    ],
  },
  onLoad: function (options) {
    var that = this;
    //获取传递的参数
    var obj = JSON.parse(options.obj);
    that.setData({
      'date': obj.date,
    })
    wx.request({
      url: allurl + 'details',
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        'user_num': wx.getStorageSync('user_num'),
        'people_min': obj.people_min,
        'people_max': obj.people_max,
        'parent': '/' + obj.building_id,
      },
      //请求成功返回
      success: function (res) {
        if (res.data.length != undefined) {
          var parse = function (data) {
            var ck = eval(data);
            if (Object.prototype.toString.call(ck) === '[object]') {
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

            var content = "classrooms[" + i + "].id";
            param[content] = parse(res.data)[i].id;
            that.setData(param);

            var content2 = "classrooms[" + i + "].name";
            param[content2] = parse(res.data)[i].room_name;
            that.setData(param);

            var content3 = "classrooms[" + i + "].intro";
            param[content3] = parse(res.data)[i].more_detail;
            that.setData(param);

            var content4 = "classrooms[" + i + "].src";
            param[content4] = 'https://zzzz.natapp4.cc/Content/building_img/' + parse(res.data)[i].img;
            that.setData(param);

            var markk = that.data.classrooms;
            that.setData({ classrooms: markk })
          }
        } else {
            that.setData({
              'listhide': false,
            })
          wx.showToast({
            title: '没有符合的教室，请重新选择',
            icon: 'success',
            duration: 3000,
            success: function () {
              setTimeout(function(){wx.navigateBack({
                delta: 1,
              })}, 3000)
            },
          })
        }
      },
    })
  },
  toNextPage: function (e) {
    console.log('git commit')
    console.log(e)
    console.log(e.currentTarget.id);
    // var choosed_date = this.data.date
    var i;
    for (i = 0; i < this.data.classrooms.length; i++) {
      if (e.currentTarget.id == this.data.classrooms[i].id.toString()) break;
    }
    console.log('ss' + i);
    wx.navigateTo({
      url: '../../time/time?classrooms=' + JSON.stringify(this.data.classrooms[i]) + '&date=' + JSON.stringify(this.data.date),
    })
  }
})

