// time.js
var allurl = 'https://zzzz.natapp4.cc/wx/'

Page({
  /**
   * 页面的初始数据
   */

  data: {
    'checkArr': [],
    tel: "",
    department: "",
    reason: "",
    date: '',
    maxdate: '',
    maxdate1: '',
    startdate: '',
    enddate: '',
    arr: [],

    ad_src: "../../pic/icon/map.png",
    pe_src: "../../pic/icon/people.png",
    fa_src: "../../pic/icon/equip.png",
    te_src: "../../pic/icon/phone.png",

    classTitle: "",
    address: "",
    capacity: "",
    facility: "",
    phone: "",

    id: '',

    userIden: '',

    switchChecked: false,

    list: [
      {
        class: "第一节课",
        time: "08:00-08:45",
        times: [480, 525],
        value: "0",
        status: 0,
        checked: false,
      }, {
        class: "第二节课",
        time: "08:55-09:40",
        times: [535, 580],
        value: "1",
        status: 0,
        checked: false,
      }, {
        class: "第三节课",
        time: "10:00-10:45",
        times: [600, 645],
        value: "2",
        status: 0,
        checked: false,
      }, {
        class: "第四节课",
        time: "10:55-11:40",
        times: [655, 700],
        value: "3",
        status: 0,
        checked: false,
      }, {
        class: "第五节课",
        time: "14:20-15:05",
        times: [860, 905],
        value: "4",
        status: 0,
        checked: false,
      }, {
        class: "第六节课",
        time: "15:15-16:00",
        times: [915, 960],
        value: "5",
        status: 0,
        checked: false,
      }, {
        class: "第七节课",
        time: "16:20-17:05",
        times: [980, 1025],
        value: "6",
        status: 0,
        checked: false,
      }, {
        class: "第八节课",
        time: "17:15-18:00",
        times: [1035, 1080],
        value: "7",
        status: 0,
        checked: false,
      }, {
        class: "第九节课",
        time: "19:00-19:45",
        times: [1140, 1185],
        value: "8",
        status: 0,
        checked: false,
      }, {
        class: "第十节课",
        time: "19:55-20:40",
        times: [1195, 1240],
        value: "9",
        status: 0,
        checked: false,
      }, {
        class: "第十一节课",
        time: "20:50-21:35",
        times: [1250, 1295],
        value: "10",
        status: 0,
        checked: false,
      }
    ],

    multiArray: [['每周', '每月'], ['周一', '周二', '周三', '周四', '周五', '周六', '周日'], ['', '']],
    objectMultiArray: [
      [
        {
          id: 0,
          name: '每周'
        },
        {
          id: 1,
          name: '每月'
        }
      ], [
        {
          id: 0,
          name: '周一'
        },
        {
          id: 1,
          name: '周二'
        },
        {
          id: 2,
          name: '周三'
        },
        {
          id: 3,
          name: '周四'
        },
        {
          id: 4,
          name: '周五'
        }, {
          id: 5,
          name: '周六'
        }, {
          id: 6,
          name: '周日'
        }
      ], [
        {
          id: 0,
          name: ''
        },
        {
          id: 1,
          name: ''
        }
      ]
    ],
    multiIndex: [0, 0, 0],
  },

  //函数部分
  //加载过程
  onLoad: function (options) {
    var allurl = 'https://zzzz.natapp4.cc/wx/'
    var that = this

    //根据缓存信息设置用户权限
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
    2
    //获取传递的参数
    var obj = eval('(' + options.classrooms + ')');
    var choosed_date = eval('(' + options.date + ')')

    console.log(obj)
    console.log('obj.date=' + obj.date)
    that.setData({
      id: obj.id,
      classTitle: obj.name,
      capacity: obj.capacity,
      facility: obj.intro,
      date: choosed_date,
    })
    console.log('获取id' + this.data.id)
    console.log('获取教室' + obj.name)

    //在单次picker显示当前日期
    var timestamp = Date.parse(new Date());
    console.log('调试日期' + timestamp)
    timestamp = timestamp / 1000;
    console.log("当前时间戳为：" + timestamp);
    var n = timestamp * 1000;
    var date = new Date(n);
    var Y = date.getFullYear();
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    console.log("当前时间：" + Y + "-" + M + "-" + D);
    if (that.data.date == undefined) {
      that.setData({
        date: Y + "-" + M + "-" + D,
      })
      console.log('从pretime进入，出现错误或从classroom进入')
    } else {
      console.log('从pretime进入')
    }
    this.setData({
      startdate: Y + "-" + M + "-" + D,
      enddate: Y + "-" + M + "-" + D,
    })
    //计算最大可预约日期
    //单次预约
    var maxdate = new Date(this.data.date);
    maxdate.setMonth(maxdate.getMonth() + 2);
    var yyy = maxdate.getFullYear();
    var mmm = (maxdate.getMonth() + 1 < 10 ? '0' + (maxdate.getMonth() + 1) : maxdate.getMonth() + 1);
    var ddd = maxdate.getDate() < 10 ? '0' + maxdate.getDate() : maxdate.getDate();
    this.setData({
      maxdate: yyy + "-" + mmm + "-" + ddd,
    })
    console.log('maxdate=' + this.data.maxdate)
    //批量预约
    var maxdate1 = new Date(this.data.startdate)
    maxdate1.setMonth(maxdate1.getMonth() + 6)
    var YYY = maxdate1.getFullYear();
    var MMM = (maxdate1.getMonth() + 1 < 10 ? '0' + (maxdate1.getMonth() + 1) : maxdate1.getMonth() + 1);
    var DDD = maxdate1.getDate() < 10 ? '0' + maxdate1.getDate() : maxdate1.getDate();
    this.setData({
      maxdate1: YYY + "-" + MMM + "-" + DDD,
    })
    console.log('maxdate1=' + this.data.maxdate1)

    //从服务器获取数据
    wx.request({
      url: allurl + 'apply',
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        'user_num': wx.getStorageSync('user_num'),
        'target': 'check',
        'apply_time': that.data.date,
        'apply_room_id': that.data.id,
      },
      success: function (qaq) {
        console.log(eval(qaq.data));
        //处理数据
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
        console.log(parse(qaq.data)[9].count)
        console.log(that.data.list[9].status)
        console.log(qaq.data.length)
        //循环渲染list
        for (var i = 0; i < qaq.data.length; i++) {
          var param = {};
          var string = "list[" + i + "].status";
          param[string] = parse(qaq.data)[i].count;
          that.setData(param);
        }
      },
      fail: function () {
        wx.showToast({
          title: '加载失败',
          icon: 'loading',
          duration: 2000
        })
      }
    })
  },

  //监控课时复选框变化
  checkboxChange: function (e) {
    var list = this.data.list;
    var checkArr = e.detail.value;
    console.log(checkArr)
    this.setData({
      'checkArr': checkArr,
    })
    for (var i = 0; i < list.length; i++) {
      if (checkArr.indexOf(i + "") != -1) {
        list[i].checked = true;
      } else {
        list[i].checked = false;
      }
    }
    this.setData({
      list: list
    })
  },

  //批量预约switchOn
  switch1Change: function () {
    var that = this
    console.log('switch change')
    console.log(!this.data.switchChecked)
    var a = !this.data.switchChecked
    this.setData({
      switchChecked: a
    })
    if (a) {
      console.log('event=' + a)
    }
  },
  switch1Checked: function (e) {
    console.log('switch1 发生 change 事件，携带值为', e.detail.value)
  },

  //批量开始时间
  bindDateChange1: function (e) {
    this.setData({
      startdate: e.detail.value,
    })
    console.log('开始日期' + this.data.startdate)
    console.log('maxdate1=' + this.data.maxdate1)
  },

  //批量结束时间 
  bindDateChange2: function (e) {
    var that = this
    this.setData({
      enddate: e.detail.value,
    })
    console.log('结束日期' + this.data.enddate)
    //判断结束日期是否在开始日期之后
    var date1 = new Date(that.data.startdate)
    var date2 = new Date(that.data.enddate)
    console.log(date2 - date1)
    if (date2 - date1 < 0) {
      wx.showToast({
        title: '日期错误',
        icon: 'loading',
        duration: 1000
      })
    }
  },

  //选择频率picker
  bindMultiPickerChange: function (e) {
    var that = this
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      multiIndex: e.detail.value
    })

    //把批量频率处理为可读字段,处理完迁移下去
    var date1 = new Date(that.data.startdate)
    var date2 = new Date(that.data.enddate)
    var arr = []
    var index = that.data.multiIndex;
    //检查开始日期和结束日期
    console.log('date2-date1=' + date2 - date1)
    console.log('date2=' + date2.getDay())
    if (date2 - date1 < 0) {
      wx.showToast({
        title: '日期错误',
        icon: 'loading',
        duration: 1000
      })
    } else {
      //没有错误开始计算频率
      if (index[0] == 0) {
        //每周模式
        console.log('每周模式')
        var weekday = (index[1] + 1 == 7 ? index[1] - 6 : index[1] + 1)
        console.log('weekday=' + weekday)
        for (var i = 1 + (date2 - date1) / 86400000; i--; i > 0) {
          console.log('i=' + i)
          console.log('date1g=' + date1)
          if (weekday == date1.getDay()) {
            var Y = date1.getFullYear();
            var M = (date1.getMonth() + 1 < 10 ? '0' + (date1.getMonth() + 1) : date1.getMonth() + 1);
            var D = date1.getDate() < 10 ? '0' + date1.getDate() : date1.getDate();
            console.log("a=" + Y + "-" + M + "-" + D);
            var a = Y + "-" + M + "-" + D
            arr.push(a)
          }
          that.setData({
            arr: arr,
          })
          date1.setDate(date1.getDate() + 1);
        }
        console.log(arr)
        if (arr.length == 0) {
          wx.showToast({
            title: '所选日期内没有符合频率条件的日期',
            icon: 'loading',
            duration: 2000,
          })
        }
      } else {
        //每月模式
        console.log('每月模式')
        var weekday = (index[2] + 1 == 7 ? index[2] - 6 : index[2] + 1)
        console.log('weekday=' + weekday)
        for (var i = 1 + (date2 - date1) / 86400000; i--; i > 0) {
          console.log('i=' + i)
          console.log('date1g=' + date1)
          if (weekday == date1.getDay()) {
            var Y = date1.getFullYear();
            var M = (date1.getMonth() + 1 < 10 ? '0' + (date1.getMonth() + 1) : date1.getMonth() + 1);
            var D = date1.getDate() < 10 ? '0' + date1.getDate() : date1.getDate();
            console.log("a=" + Y + "-" + M + "-" + D);
            console.log('D=' + D)
            var d = parseInt(D)
            //查询周数
            var weeks = 0
            if (0 < d && d < 8) {
              var weeks = 1
            } else if (7 < d && d < 15) {
              var weeks = 2
            } else if (14 < d && d < 22) {
              var weeks = 3
            } else if (21 < d && d < 29) {
              var weeks = 4
            } else {
              var weeks = 5
            }
            console.log('第' + weeks + '周')
            //查询模式
            var mode = index[1] + 1
            console.log('mode=' + mode)
            if (0 < mode && mode < 5) {
              if (weeks == mode) {
                var a = Y + "-" + M + "-" + D
                arr.push(a)
              }
            } else if (mode = 5) {
              //查询该月最后一周是几号
              var last = new Date(Y, M - 1, 1)
              console.log('last1=' + last)
              last.setMonth(M)
              last.setDate(last.getDate() - 7)
              console.log('last2=' + last)
              var ld = parseInt(last.getDate())
              //判断日期在这个区间
              if (ld < d || ld == d) {
                var a = Y + "-" + M + "-" + D
                arr.push(a)
              }
            } else {
              console.log('模式错误' + mode)
            }
          }
          that.setData({
            arr: arr
          })
          date1.setDate(date1.getDate() + 1);
        }
        console.log(arr)
        //判断所选日期内没有符合频率条件的日期
        if (arr.length == 0) {
          wx.showToast({
            title: '没有符合频率条件的日期',
            icon: 'loading',
            duration: 2000,
          })
        }
      }
    }
  },

  //选择频率
  bindMultiPickerColumnChange: function (e) {
    var that = this
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    switch (e.detail.column) {
      case 0:
        switch (data.multiIndex[0]) {
          case 0:
            data.multiArray[1] = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
            data.multiArray[2] = ['', ''];
            break;
          case 1:
            data.multiArray[1] = ['第一个', '第二个', '第三个', '第四个', '最后的'];
            data.multiArray[2] = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
            break;
        }
        data.multiIndex[1] = 0;
        data.multiIndex[2] = 0;
        break;
      case 1:
        switch (data.multiIndex[0]) {
          case 0:
            switch (data.multiIndex[1]) {
              case 0:
                data.multiArray[2] = [''];
                break;
              case 1:
                data.multiArray[2] = [''];
                break;
              case 2:
                data.multiArray[2] = [''];
                break;
              case 3:
                data.multiArray[2] = [''];
                break;
              case 4:
                data.multiArray[2] = [''];
                break;
              case 5:
                data.multiArray[2] = [''];
                break;
              case 6:
                data.multiArray[2] = [''];
                break;
            }
            break;
          case 1:
            switch (data.multiIndex[1]) {
              case 0:
                data.multiArray[2] = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
                break;
              case 1:
                data.multiArray[2] = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
                break;
              case 2:
                data.multiArray[2] = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
                break;
              case 3:
                data.multiArray[2] = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
                break;
              case 4:
                data.multiArray[2] = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
                break;
            }
            break;
        }
        data.multiIndex[2] = 0;
        console.log(data.multiIndex);
        break;
    }
    that.setData(data);
  },

  //选择单次时间picker
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value,
    })
    //改变picker时查询一次空闲情况
    var allurl = 'https://zzzz.natapp4.cc/wx/'
    var that = this;
    wx.request({
      url: allurl + 'apply',
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        'user_num': wx.getStorageSync('user_num'),
        'target': 'check',
        'apply_time': e.detail.value,
        'apply_room_id': that.data.id,
      },
      success: function (qaq) {
        console.log(eval(qaq.data));
        //处理数据
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
        console.log(parse(qaq.data)[9].count)
        console.log(that.data.list[9].status)
        console.log(qaq.data.length)
        //循环赋值list
        for (var i = 0; i < qaq.data.length; i++) {
          var param = {};
          var string = "list[" + i + "].status";
          param[string] = parse(qaq.data)[i].count;
          that.setData(param);
        }
      }
    })
  },

  //设置页面数据
  tel: function (e) {
    this.setData({
      tel: e.detail.value
    })
  },
  department: function (e) {
    this.setData({
      department: e.detail.value
    })
  },
  reason: function (e) {
    this.setData({
      reason: e.detail.value
    })
  },

  //提交按钮
  submit: function () {
    var allurl = 'https://zzzz.natapp4.cc/wx/'
    var that = this
    console.log('触发提交事件')
    //从页面获取数据
    var classes = this.data.checkArr
    var tel = this.data.tel
    var department = this.data.department
    var reason = this.data.reason
    var date = this.data.date
    var arr = this.data.arr
    var date1 = new Date(this.data.startdate)
    var date2 = new Date(this.data.enddate)
    var piliang = this.data.switchChecked
    var dates = ''

    //异常流处理，待补充
    //是否批量
    if (piliang) {
      console.log(date2 - date1)
      if (date2 - date1 < 0) {
        wx.showToast({
          title: '日期错误',
          icon: 'loading',
          duration: 1000
        })
      }
      if (arr.length == 0) {
        wx.showToast({
          title: '没有符合批量条件的日期',
          icon: 'loading',
          duration: 1000
        })
      }
    }

    if (reason.length == 0) {
      wx.showToast({
        title: '请填写申请事由',
        icon: 'loading',
        duration: 2000,
      })
    }
    if (department.length == 0) {
      wx.showToast({
        title: '请填写单位',
        icon: 'loading',
        duration: 2000,
      })
    }
    if (tel.length == 0) {
      wx.showToast({
        title: '请填写手机号码',
        icon: 'loading',
        duration: 2000,
      })
    }
    if (classes.length == 0) {
      wx.showToast({
        title: '请选择时间',
        icon: 'loading',
        duration: 2000,
      })
    }
    //转换数据
    if (piliang) {
      //把批量频率处理为可读字段,处理完迁移下去
      var date1 = new Date(that.data.startdate)
      var date2 = new Date(that.data.enddate)
      var arr = []
      var index = that.data.multiIndex;
      that.setData({
        arr: []
      })
      //检查开始日期和结束日期
      console.log('date2-date1=' + date2 - date1)
      console.log('date2=' + date2.getDay())
      if (date2 - date1 < 0) {
        wx.showToast({
          title: '日期错误',
          icon: 'loading',
          duration: 1000
        })
      } else {
        //没有错误开始计算频率
        if (index[0] == 0) {
          //每周模式
          console.log('每周模式')
          var weekday = (index[1] + 1 == 7 ? index[1] - 6 : index[1] + 1)
          console.log('weekday=' + weekday)
          for (var i = 1 + (date2 - date1) / 86400000; i--; i > 0) {
            console.log('i=' + i)
            console.log('date1g=' + date1)
            if (weekday == date1.getDay()) {
              var Y = date1.getFullYear();
              var M = (date1.getMonth() + 1 < 10 ? '0' + (date1.getMonth() + 1) : date1.getMonth() + 1);
              var D = date1.getDate() < 10 ? '0' + date1.getDate() : date1.getDate();
              console.log("a=" + Y + "-" + M + "-" + D);
              var a = Y + "-" + M + "-" + D
              arr.push(a)
            }
            that.setData({
              arr: arr,
            })
            date1.setDate(date1.getDate() + 1);
          }
          console.log(arr)
          if (arr.length == 0) {
            wx.showToast({
              title: '所选日期内没有符合频率条件的日期',
              icon: 'loading',
              duration: 2000,
            })
          }
        } else {
          //每月模式
          console.log('每月模式')
          var weekday = (index[2] + 1 == 7 ? index[2] - 6 : index[2] + 1)
          console.log('weekday=' + weekday)
          for (var i = 1 + (date2 - date1) / 86400000; i--; i > 0) {
            console.log('i=' + i)
            console.log('date1g=' + date1)
            if (weekday == date1.getDay()) {
              var Y = date1.getFullYear();
              var M = (date1.getMonth() + 1 < 10 ? '0' + (date1.getMonth() + 1) : date1.getMonth() + 1);
              var D = date1.getDate() < 10 ? '0' + date1.getDate() : date1.getDate();
              console.log("a=" + Y + "-" + M + "-" + D);
              console.log('D=' + D)
              var d = parseInt(D)
              //查询周数
              var weeks = 0
              if (0 < d && d < 8) {
                var weeks = 1
              } else if (7 < d && d < 15) {
                var weeks = 2
              } else if (14 < d && d < 22) {
                var weeks = 3
              } else if (21 < d && d < 29) {
                var weeks = 4
              } else {
                var weeks = 5
              }
              console.log('第' + weeks + '周')
              //查询模式
              var mode = index[1] + 1
              console.log('mode=' + mode)
              if (0 < mode && mode < 5) {
                if (weeks == mode) {
                  var a = Y + "-" + M + "-" + D
                  arr.push(a)
                  console.log(arr)
                }
              } else if (mode = 5) {
                //查询该月最后一周是几号
                var last = new Date(Y, M - 1, 1)
                console.log('last1=' + last)
                last.setMonth(M)
                last.setDate(last.getDate() - 7)
                console.log('last2=' + last)
                var ld = parseInt(last.getDate())
                //判断日期在这个区间
                if (ld < d || ld == d) {
                  var a = Y + "-" + M + "-" + D
                  arr.push(a)
                  console.log(arr)
                }
              } else {
                console.log('模式错误' + mode)
              }
            }
            console.log(arr)
            that.setData({
              arr: arr
            })
            date1.setDate(date1.getDate() + 1);
          }
          //判断所选日期内没有符合频率条件的日期
          if (arr.length == 0) {
            wx.showToast({
              title: '没有符合频率条件的日期',
              icon: 'loading',
              duration: 2000,
            })
          }
        }
      }
    }
    //把批量日期转换为可传输日期
    if (arr.length > 0) {
      for (var i = 0; i < arr.length; i++) {
        dates = dates + arr[i] + '|'
      }
      console.log('dates=' + dates)
    }
    //删除被预约课室
    for (var i = 0; i < this.data.list.length; i++) {
      if (this.data.list[i].status == -1) {
        var va = this.data.list[i].value
        function removeByValue(arr, val) {
          for (var i = 0; i < arr.length; i++) {
            if (arr[i] == val) {
              arr.splice(i, 1);
              console.log("splice sth")
              break;
            } else {
              console.log('have not splice')
            }
          }
        }
        removeByValue(classes, va);
      }
    }
    //把课时转换为标准时间
    //判断课时是否连续
    console.log(classes)
    var max = classes[0]
    var min = classes[0]
    for (var i = 0; i < classes.length; i++) {
      if (parseInt(max) < parseInt(classes[i])) {
        max = classes[i]
      }
      if (parseInt(min) >= parseInt(classes[i])) {
        min = classes[i]
      }
      console.log(that.data.list[classes[i]].times)
    }
    console.log(max + "|" + min)
    //如果连续则提交
    if (max - min == classes.length - 1) {
      var times = that.data.list[min].times[0] + "-" + that.data.list[max].times[1]
      console.log(times)
      //提交数据

      if (piliang) {
        //批量提交
        if (dates.length > 0) {
          wx.request({
            url: allurl + 'apply',
            method: 'POST',
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            data: {
              'user_num': wx.getStorageSync('user_num'),
              'target': 'many_submit',
              'apply_time': dates + times,
              'apply_room_id': that.data.id,
              'phone_num': tel,
              'reason': reason,
              'organization': department,
            },
            success: function (qaq) {
              console.log('yuyuechngegong');
              if (tel != '' && department != '' && reason != '') {
                wx.showToast({
                  title: '提交成功',
                  icon: 'success',
                  duration: 2000,
                  success: function (se) {
                    wx.redirectTo({
                      url: '../information/history/history'
                    })
                  },
                })
              } else {
                console.log('批量提交失败')
              }
            }
          })
        } else {
          console.log('没有符合条件的日期')
          wx.showToast({
            title: '没有符合条件的日期',
            icon: 'loading',
            duration: 1000
          })
        }
      } else {
        //单次提交
        wx.request({
          url: allurl + 'apply',
          method: 'POST',
          header: { 'content-type': 'application/x-www-form-urlencoded' },
          data: {
            'user_num': wx.getStorageSync('user_num'),
            'target': 'submit',
            'apply_time': date + "|" + times,
            'apply_room_id': that.data.id,
            'phone_num': tel,
            'reason': reason,
            'organization': department,
          },
          success: function (qaq) {
            console.log('yuyuechngegong');
            if (tel != '' && department != '' && reason != '') {
              wx.showToast({
                title: '提交成功',
                icon: 'success',
                duration: 2000,
                success: function (se) {
                  wx.redirectTo({
                    url: '../information/history/history'
                  })
                },
              })
            } else {
              console.log('单次提交失败')
            }
          }
        })
      }
    } else {
      console.log("所选课时不连续")
      wx.showToast({
        title: '所选课时不连续',
        icon: 'loading',
        duration: 1000
      })
    }
  },

  //监听返回键
})