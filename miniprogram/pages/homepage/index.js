//index.js
const app = getApp()

Page({
  data: {
    peopleArray: ['jorce', 'jorce'],
    currentPeople: 0,
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    filePath: '',
    recoding: false,
    currentSelectedDate: {}
  },
  getdate:function (e) {
    console.log(e);
    this.setData({
      currentSelectedDate: e.detail
    })
    // console.log(e)
  },
  bindPickerChange: function(e){
    this.setData({
      currentPeople: Number(e.detail.value)
    })
  }
})
