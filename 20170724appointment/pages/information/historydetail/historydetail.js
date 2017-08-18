// historydetail.js
// var allurl = 'https://zzzz.natapp4.cc/wx/';
Page({
  data: {
    booked_id: '',
    building_name: '',
    classroom_name: '',
    organization: '',
    status: '0',
    src: '',
    apply_time: '',
    apply_for_time: '',
    start_time: '',
    end_time: '',
    phone_num: '',
    reply_time: '',
    reason: '',
  },
  onLoad: function (options) {
    var obj = eval('(' + options.historys + ')');
    console.log(obj)
    
    this.setData({
      'booked_id': obj.id,
      'building_name': obj.building_name,
      'classroom_name': obj.classroom_name,
      'organization': obj.organization,
      'phone_num': obj.phone_num,
      'apply_time': obj.apply_time,
      'apply_for_time': obj.apply_for_time,
      'reply_time': obj.reply_time,
      'reason': obj.reason,
      'status': obj.status,
    })
    console.log(this.data.reason)
  },
  cancel: function (e) {
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