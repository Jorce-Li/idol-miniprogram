//index.js
const app = getApp()

Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    filePath: '',
    recoding: false,
  },
  startRecord() {
    wx.getSetting({
      success(res) {
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
        }
      }
    })
    
  },
  startPlay() {
    const innerAudioContext = wx.createInnerAudioContext()
    innerAudioContext.autoplay = true
    innerAudioContext.src = this.data.filePath
    innerAudioContext.onPlay(() => {
      console.log('开始播放')
    })
    innerAudioContext.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })
  }
})
