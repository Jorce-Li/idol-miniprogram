const moment = require("moment");

//index.js
const app = getApp()

Page({
  data: {
    articles: [{}, {}],
  },

  onShow: function() {
    wx.showLoading({
      duration: 2000,
      title: '正在加载中'
    })
    const db = wx.cloud.database();
    db.collection("articles").get().then(res => {
      this.setData({
        articles: res.data.sort((a,b) => moment(b.date).isAfter(moment(a.date))).map(v => {
          return {...v, date: moment(v.date).fromNow()}
        })
      })
    }) 
  },
})
