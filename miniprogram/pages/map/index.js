//index.js
const app = getApp()

Page({
 data: {
   center: {
   },
  //  markers: [{
  //    id: 0,
  //    iconPath: '/static/tabs/shop.png',
  //    latitude: 23.099994,
  //    longitude: 113.324520,
  //    width: 20,
  //    height: 20
  //  }],
   polyline: [
     {
      points:[
        {
          longitude: 113.3245211,
          latitude: 23.21229
        },
        {
          longitude: 113.324520,
          latitude: 23.21229
        },
      ],
      color: '#FF0000DD',
      width: 2,
      dottedLine: true
     }
   ],
 },
 onLoad: function(){
  wx.getLocation({
    type: 'gcj02',
    success: res => {
      console.log(res);
      this.setData({
        center: res
      })
    }
  })
 },
 regionchange(e) {
   console.log(e.type);
 },
 markertap(e){
  console.log(e.markerId);
 },
 controltap(e){
   console.log(e.controlId);
 }
})
