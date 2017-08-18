// pretime.js
var allurl = 'https://zzzz.natapp4.cc/wx/';

Page({
  data: {
    people_min: '',
    people_max: '',

    date: '',
    buildings: [
      {
        building_id: '',
        building_name: '',
      }
    ],
    // name: [0],
    capacity: [['1', '20', '40', '60', '80', '100',], ['40', '60', '80', '100', '120', '150']],
    detail: [],
    // peoplenumber: [0,0],
  },
  onLoad: function () {
    var that = this;
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
          var content = 'buildings[' + i + '].building_name';
          param[content] = parse(res.data)[i].Value.building_name;
          that.setData(param);

          var content2 = 'buildings[' + i + '].building_id';
          param[content2] = parse(res.data)[i].Value.id;
          that.setData(param);

        }
      }
    })
  },
  //选择时间、人数、建筑
  bindPickerChange: function (e) {
    this.setData({
      date: e.detail.value,
    })

  },
  bindCapacityChange: function (e) {
    console.log('dfjk回复等级')
    console.log(e)
    this.setData({
      'peoplenumber': e.detail.value
    })
    var min = e.detail.value[0];
    var people_min = this.data.capacity[0][min];
    var max = e.detail.value[1];
    var people_max = this.data.capacity[1][max];
    this.setData({
      'people_min': people_min,
      'people_max': people_max,
    })

  },
  bindBuildingChange: function (e) {
    var building_id = this.data.buildings[e.detail.value].building_id;
    this.setData({
      'name': e.detail.value,
      'building_id': building_id,
    })
  },
  function() {
  },

  toNextPage: function (e) {
    var obj = {
      people_min: this.data.people_min,
      people_max: this.data.people_max,
      building_id: this.data.building_id,
      date: this.data.date,
    };
    console.log('youidma'+obj.building_id)
    console.log(obj.people_max)
    console.log(obj.people_min)
    if (obj.date == '') {
      wx.showToast({
        title: '请选择预约时间',
        icon: 'loading',
        duration: 500,
      })
    } else if (obj.people_min == '' || obj.people_min == '' || obj.people_min > obj.people_max) {
      wx.showToast({
        title: '请选择正确人数',
        icon: 'loading',
        duration: 500,
      })
    } else if (obj.building_id == undefined) {
      wx.showToast({
        title: '请选择建筑物',
        icon: 'loading',
        duration: 500,
      })
    } else {
      wx.navigateTo({
        url: 'preclassroom/preclassroom?obj=' + JSON.stringify(obj),
      })
    }
  }
})