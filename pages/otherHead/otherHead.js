//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    motto: 'Hello World',
    Sheight:0,
    userInfo: {},
    focus:'',
    imgUrl:app.data.url
  },
  //事件处理函数
  bindViewTap: function(event) {
    let arr = this.data.askInfo[event.currentTarget.dataset.itemindex];
    
    wx.navigateTo({
      url: '../otherQA/otherQA?item='+JSON.stringify(arr)
    })
  },
  Praise:function(event){  
    let that = this;
    app.ajax({
      url:'app/questionAnswerController/praiseOrCancel',
      data:{questionAnswerId:event.currentTarget.dataset.qaid},//这里还差一个参数
      success:function(res){
        if(res.data.status=="200"){
          let arr = that.data.askInfo;
          arr[event.currentTarget.dataset.id].praiseCount += arr[event.currentTarget.dataset.id].isPraise == 0 ? 1 : -1;
          arr[event.currentTarget.dataset.id].isPraise = arr[event.currentTarget.dataset.id].isPraise == 0 ? 1 : 0;
          that.setData({askInfo:arr})
        }else{
          console.log("网络异常，请稍后再试试。")
        }
      }
    })
  },
  follow:function(event){
    let that = this;
    app.ajax({
      url:'app/attentionController/attOrCancelAtt',
      data:{user0:app.data.userId,user1:event.currentTarget.dataset.otherid},
      success:function(res){
        if(res.data.status=="200"){
          if(res.data.result=="添加关注成功"){
            that.setData({focus:'取消关注'})
          }else{
            that.setData({focus:'关注'})
          }     
        }
      }
    })
  },
  update:function(){
    let that = this;
    wx.getLocation({
      type: 'wgs84', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
      success: function(data){
        // success
          app.ajax({
                url:'app/visitController/visitUser',
                data:{visitorId:that.data.userId,beVisitorId:that.data.visitorId},
                success:function(res){
                  if(res.data.result){
                    let arr = res.data.result;
                    let len = arr.length;
                    for(var i =0 ; i<len;i++){
                      arr[i].onlineTime = app.Time(arr[i].askTime);
                      arr[i].distance = app.Distance(data.latitude,arr[i].latitude,data.longitude,arr[i].longitude)
                    }
                    that.setData({askInfo:arr})
                  }
                  
                  
                }
              })
      }
    })
    
  },
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          Sheight:(res.windowHeight-57)
        })
      }
    })
    wx.getStorage({
      key: 'SessionKey',
      success: function(ses){
        // success
        that.setData({userId:ses.data.userId,visitorId:options.userId})
        app.ajax({
          url:'app/attentionController/isAttention',
          data:{
            user0:ses.data.userId,
            user1:options.userId
          },
          success:function(res){
            if(res.data.result=="未关注"){
              that.setData({focus:"关注"})
              console.log('关注')
            }else{
              that.setData({focus:'取消关注'})
              console.log('未关注')
            }
          }
        })
    wx.getLocation({
      type: 'wgs84', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
      success: function(data){
        // success
              app.ajax({
                url:'app/userInfoController/getUserInfo',
                data:{anyoneId:options.userId},
                success:function(res){
                  if(res.data.result[0].label!==null&&res.data.result[0].label.length){
                    let arr = res.data.result[0].label;
                    arr = arr.split(',',arr.length>4?4:arr.length);
                    //console.log(arr)
                    res.data.result[0].label = arr;
                  }
                  res.data.result[0].onlineTime = app.Time(res.data.result[0].onlineTime);
                  res.data.result[0].distance = app.Distance(data.latitude,res.data.result[0].latitude,data.longitude,res.data.result[0].longitude)
                  that.setData({userDetail:res.data.result[0]})
                }
              })
              that.update();
            },
            fail: function() {
              // fail
            },
            complete: function() {
              // complete
            }
          })
      }
    })
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
    })
  }
})
