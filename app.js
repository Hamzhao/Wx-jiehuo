//app.js
App({
  data:{
    currentIndex:"1",
     url:"https://www.jiehuoapp.com/",
     ajaxUrl:'https://www.jiehuoapp.com/',
    userId:25
  },
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs);
  },
  Time: function(timestamp) {
    let date = timestamp?new Date(timestamp):new Date();
    let dm = date.getMonth() + 1;
		let dd = date.getDate();
    let dt = date.toTimeString().slice(0,5);
    let today = new Date();
    let tm = today.getMonth() + 1;
    let td = today.getDate();
    let tt = today.toTimeString().slice(0,5);
		let str = '';
    let format = function(t){
      if(t&&typeof t == 'number'){
        return t>9?t:'0'+t;
      }
    }
    if(today>date){
      if(td!=dd||tm!=dm){
        return format(dm)+'-'+format(dd)
      }else if(tt>dt){
        return dt;
      }else{
        return '刚刚'
      }
    }
    
	},
  Distance:(lat1,lat2,long1,long2)=>{
    let that = this;
    var EARTH_RADIUS = 6378.137;    //单位公里
    let radLat1 = lat1 * Math.PI/180.0;
    let radLat2 = lat2 * Math.PI/180.0;
    var a = radLat1 - radLat2;  
    var b = long1* Math.PI/180.0 - long2* Math.PI/180.0 ;    
    var s = 2*Math.asin(Math.sqrt(Math.pow(Math.sin(a/2),2) + Math.cos(radLat1)*Math.cos(radLat2)*Math.pow(Math.sin(b/2),2)));  
    s = s*EARTH_RADIUS;  
    s = Math.round(s*10000)/10000.0;  
    return s.toFixed(1)+'km'
  },
  Login:function(obj){
    let that = this;
    wx.login({
      success: function(login){
        // success
        wx.getUserInfo({
            success: function (user) {
              wx.request({
                url:that.data.ajaxUrl+'app/userInfoController/miniappsLogin',
                data:{
                  code:login.code,
                  avatarUrl:user.userInfo.avatarUrl,
                  city:user.userInfo.city,
                  country:user.userInfo.country,
                  gender:user.userInfo.gender,
                  language:user.userInfo.language,
                  nickName:user.userInfo.nickName,
                  province:user.userInfo.province
                },
                method:"POST",
                header: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
                success:function(res){
                  if(res.data.result){
                    that.globalData.userId = res.data.result.userId;
                    wx.setStorage({
                      key: 'SessionKey',
                      data: res.data.result,
                      success: function(rs){
                        // success 
                        //console.log('set')
                        that.ajax(obj)
                      }
                    })
                  }else if(res.data.message=="操作异常"){
                    console.log(res)
                  }                 
                },
                fail:function(res){console.log('miniappsLogin请求失败',JSON.stringify(res))}
              })
            },
            fail:function(res){
              that.Login(obj)
            }
        })
      },
      fail: function() {
        // fail
        console.log('登录失败')
        that.Login(obj)
      },
      complete: function() {
        // complete
      }
    })
  },
  ajax:function(obj){
    let that = this;
        wx.getStorage({
          key: 'SessionKey',
          success: function(res){
            if(res.data){
              obj.data.trdSessionKey = res.data.trdSessionKey;
              obj.data.userId = res.data.userId;
              wx.request({
                url: that.data.ajaxUrl + obj.url,
                data: obj.data,
                method:"POST",
                header: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
                success: function(data){
                    if(data.data.message=="登录超时"){
                      that.Login(obj);
                    }else{
                      obj.success(data)
                    }                           
                },
                fail:obj.fail?obj.fail:function(){console.log('请求失败')},
                complete:obj.complete?obj.complete:function(){}
              })
            }else{
               that.Login(obj);
            }
            
          },
          fail: function(res) {
            // fail
            that.Login(obj);
            //console.log(res,'getStorage')
          }
        }) 
  },
  getUserInfo:function(cb){
    var that = this
    if(typeof this.globalData.userInfo == 'object'){ 
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      //调用登录接口
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(res.userInfo)
            }
          })
    }
  },
  globalData:{
    userInfo:undefined,
    userId:null
   },
})