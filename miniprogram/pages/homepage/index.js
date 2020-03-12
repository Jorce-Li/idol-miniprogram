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
<<<<<<< HEAD
  getdate:function (e) {
    console.log(e);
    this.setData({
      currentSelectedDate: e.detail
=======
  startRecord() {
    console.log(1111);
    wx.getSetting({
      success: res => {
        if (!res.authSetting['scope.record']) {
          wx.authorize({
            scope: 'scope.record',
            success () {
              console.log(111111);
              // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
              const recoder = wx.getRecorderManager();
              recoder.start({
                duration: 2000,
              });
              this.setData({
                recoding: true
              })
              recoder.onStop(res => {
                this.setData({
                  filePath: res.tempFilePath,
                  recoding: false
                })
              });
            },
            fail (err) {
              wx.showToast({
                title: "为了您更好的体验,拒绝后请自行在设置中打开麦克风权限",
                icon: 'none',
                duration: 2000
              });
            }
          })
        } else {
          const recoder = wx.getRecorderManager();
          recoder.start({
            duration: 2000,
          });
          this.setData({
            recoding: true
          })
          recoder.onStop(res => {
            this.setData({
              filePath: res.tempFilePath,
              recoding: false
            })
          });
        }
      }
>>>>>>> a749bb1b317eb53cdebdaf9e99f2b186af439e46
    })
    // console.log(e)
  },
  bindPickerChange: function(e){
    this.setData({
      currentPeople: Number(e.detail.value)
    })
  }
})
