//index.js
const app = getApp()

Page({
  data: {
    products: [],
    column1Products: [],
    column2Products: [],
  },
  uploadImgToDB: function(){
    wx.getImageInfo({
      src: './product4.jpg',
      success: res => {
        console.log(res.path);
        wx.cloud.uploadFile({
          cloudPath: 'products/product4.jpg',
          filePath: res.path, // 文件路径
        }).then(res => {
          // get resource ID
          console.log(res.fileID)
          let fileID = res.fileID;
            //把图片存到users集合表
          const db = wx.cloud.database();
          db.collection("products").add({
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
  onLoad: function() {
    // this.uploadImgToDB();
    const db = wx.cloud.database();
    db.collection("products").get().then(res => {
      this.setData({
        products: res.data,
        column1Products: res.data.filter((v, index) => index % 2 === 0),
        column2Products: res.data.filter((v, index) => index % 2 !== 0)
      })
    }) 
  },
})
