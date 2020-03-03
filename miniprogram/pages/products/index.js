//index.js
const app = getApp()

Page({
  data: {
    products: [],
    column1Products: [],
    column2Products: [],
    active: '0',
  },
  changeActiveTab: function(e) {
    console.log(e);
    this.setData({
      active: e.target.dataset.index
    })
    this.setData({
      column1Products: this.randomArray(this.data.column1Products),
      column2Products: this.randomArray(this.data.column2Products),
    })
  },
  randomArray(array){
    const arr = [...array];
    for (let index = 0; index < array.length; index++) {
      const random = Math.floor(Math.random() * (index + 1));
      [arr[index], arr[random]] = [arr[random], arr[index]];
    }
    return arr;
  },
  uploadImgToDB: function(){
    wx.getImageInfo({
      src: './community.jpg',
      success: res => {
        console.log(res.path);
        wx.cloud.uploadFile({
          cloudPath: 'community/community.jpg',
          filePath: res.path, // 文件路径
        }).then(res => {
          // get resource ID
          console.log(res.fileID)
          let fileID = res.fileID;
            //把图片存到users集合表
          const db = wx.cloud.database();
          db.collection("community").add({
            data: {
              src: fileID
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
        }).catch(error => {
          // handle error
          console.log(error);
        })
      }
    })
  },
  initData: function (){
    const db = wx.cloud.database();
    db.collection("products").get().then(res => {
      console.log(res.data);
      this.setData({
        products: res.data,
        column1Products: res.data.filter((v, index) => index % 2 === 0),
        column2Products: res.data.filter((v, index) => index % 2 !== 0)
      })
    }) 
  },
  onLoad: function() {
    // this.uploadImgToDB();
    this.initData();
  },
  onPullDownRefresh: function(){
    setTimeout(() => {
      this.initData();
      wx.stopPullDownRefresh();
      wx.showToast({
        title: '刷新成功',
        icon: 'success',
        duration: 2000
      })
    }, 1000);
  },
  onReachBottom: function() {
    wx.showLoading({
      title: '加载中',
    })
    setTimeout(() => {
      const column1 = this.data.products.filter((v, index) => index % 2 === 0);
      const column2 = this.data.products.filter((v, index) => index % 2 !== 0);
      this.setData({
        column1Products: [...this.data.column1Products, ...column1],
        column2Products: [...this.data.column2Products, ...column2],
      })
      wx.hideLoading()
    }, 1500);
  }
})
