//index.js
const app = getApp()

Page({
  data: {
    avatarUrl: './user.jpg',
    userInfo: null,
    logged: false,
    takeSession: false,
    requestResult: '',
  },

  onLoad: function() {
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
              console.log(res)
            }
          })
        }
      },
      fail: err => {
        console.log(err);
      }
    })
  },
  onGetUserInfo: function(e){
    console.log(e);
    if (!e.detail.userInfo) {
      wx.showToast({
        title: "为了您更好的体验,请先同意授权",
        icon: 'none',
        duration: 2000
      });
      return;
    }
    this.setData({
      avatarUrl: e.detail.userInfo.avatarUrl,
      userInfo: e.detail.userInfo
    })
  }
})
