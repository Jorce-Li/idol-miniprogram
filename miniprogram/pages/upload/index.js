//index.js
const app = getApp()
const moment = require('moment')
Page({
 data: {
  uploadedSrc: [],
  currentSrc: "",
  currentIndex: 0
 },
 uploadImg () {
   wx.chooseImage({
    sizeType: 'compressed',
    sourceType: ['album', 'camera'],
    success: res =>{
      this.setData({
        uploadedSrc: res.tempFilePaths,
        currentSrc: res.tempFilePaths[0]
      })
    }
   })
 },
 changeCurrentSrc (e) {
  this.setData({
    currentSrc:this.data.uploadedSrc[e.currentTarget.dataset.index],
    currentIndex:e.currentTarget.dataset.index
  })
 },
publish () {
  let userName = 'jorce'
  wx.getUserInfo({
    success: res => {
      userName = res.userInfo.nickName
    }
  })
  if (this.data.uploadedSrc.length <=0) {
    return;
  }
  Promise.all(this.data.uploadedSrc.map((src, index) => {
    return wx.cloud.uploadFile({
      cloudPath: `articles/${userName}/${moment().unix()}${index}${this.data.uploadedSrc[0].match(/\.[^.]+?$/)[0]}`,
      filePath: src // 文件路径
    })
  }))
    .then(res => {
      console.log(res);
      const db = wx.cloud.database();
      db.collection("articles").add({
        data: {
          src: res.map(v => v.fileID),
          nickName: userName,
          date: moment()
        },
        success: function () {
          wx.showToast({
            title: '图片存储成功',
            'icon': 'none',
            duration: 1000
          })
        },
        fail: function () {
          wx.showToast({
            title: '图片存储失败',
            'icon': 'none',
            duration: 3000
          })
        }
      }); 
    })
  }
})
