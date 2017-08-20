// pages/classroom/classroom.js
var app = getApp()
var allurl = 'https://zzzz.natapp4.cc/wx/';
Page({
  data: {
    id: '',
    name: '',
    address: '',
    capacity: '',
    phone: '',
    src: '',
    classrooms: [
      {
        id: '',
        name: '',
        intro: '',
        capacity: '',
        src:'',
      }
    ],
  },
  onLoad: function (options) {
    var that = this;
    //获取传递的参数
    var obj = eval('('+options.buildings+')');
      that.setData ({
        id: obj.id,
        name: obj.name,
        address: obj.address,
        phone: obj.phone,
        src: obj.src
      })
    //请求服务器数据
    wx.request({
      url: allurl + 'detail',
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        'user_num': wx.getStorageSync('user_num'),
        'room_name': 'none',
        'parent': '/' + this.data.id,
      },

      success: function (res) {
        console.log('fing')
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
        
        //修改页面表头

        for (var i = 0; i < res.data.length; i++) {
          var param = {};

          var content = "classrooms[" + i + "].id";
          param[content] = parse(res.data)[i].Value.id;
          that.setData(param);

          var content = "classrooms[" + i + "].name";
          param[content] = parse(res.data)[i].Value.room_name;
          that.setData(param);

          var content = "classrooms[" + i + "].intro";
          var str = parse(res.data)[i].Value.more_detail
          var n = str.split("<")
          console.log(n[0])
          param[content] = n[0];
          that.setData(param);

          var content = "classrooms[" + i + "].src";
          param[content] = 'https://zzzz.natapp4.cc/Content/building_img/' + parse(res.data)[i].Value.img;
          that.setData(param);

          var markk = that.data.classrooms;
          that.setData({ classrooms: markk })

        }
      },
      fail: function (err) {
        console.log(err)
      }
    })
  },

  //参数传递
  toNextPage: function (e) {
    console.log(e.currentTarget.id);
    var i;
    for (i = 0; i < this.data.classrooms.length; i++) {
      if (e.currentTarget.id == this.data.classrooms[i].id.toString()) break;
    }
    console.log('ss' + i);
    wx.navigateTo({
      url: '../time/time?classrooms=' + JSON.stringify(this.data.classrooms[i]),
    })
  }
})