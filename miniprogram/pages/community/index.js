//index.js
const app = getApp()

Page({
  data: {
    imgSrc: '',
    data: {},
    commentsData: [
      {
        avatar: 1,
        background: 'pink',
        title: '粉丝一号',
        content: '哇真是太帅了！'
      },
      {
        avatar: 2,
        background: 'blue',
        title: '粉丝二号',
        content: '裴姐！'
      },
      {
        avatar: 3,
        background: 'orange',
        title: '粉丝三号',
        content: '大柱哥！'
      },
      {
        avatar: 4,
        background: 'red',
        title: '粉丝四号',
        content: '白菜！'
      },
    ]
  },

  onLoad: function() {
    const db = wx.cloud.database();
    db.collection("community").get().then(res => {
      this.setData({
        data: res.data[0],
        imgSrc: res.data[0].src
      })
    }) 
  },
})
