//index.js
//获取应用实例

var app = getApp()

Page({

  data: {

    motto: 'Hello World',

    Sheight:0,

    userInfo: {},

    isShow:true,

    isTest:true,

    text:'获取验证码',

    t:true,

    imgUrl:app.data.url,

    me:false

  },

  //事件处理函数

  bindViewTap: function() {

    wx.navigateTo({
 
      url: '../myHead/myHead'

    })

  },

  goAbout:function(){

    wx.navigateTo({

      url: '../about/about'

    })

  },

  goMyQ:function(){

    wx.navigateTo({

      url: '../myQ/myQ'

    })

  },

  choose:function(){

    this.setData({isShow:!this.data.isShow})

  },

  test:function(){

    var that = this;

    wx.getStorage({

      key: 'SessionKey',

      success: function(res){

        // success

          app.ajax({

            url:'app/userInfoController/getUserInfo',

            data:{anyoneId:res.data.userId},

            success:function(rs){

              //console.log(rs.data.result)

              let arr = rs.data.result[0]

              if(arr.picture.indexOf('qlogo')==-1){

                          arr.picture = that.data.imgUrl + arr.picture;

                        }

              that.setData({userDetail:arr})

            }

          })

     }

    })

  },

  onShow:function(){

    this.test()

  },

  onLoad: function () {

    var that = this;

    this.test();

    wx.setNavigationBarTitle({

      title: '发现'

    });

    wx.getSystemInfo({

      success: function(res) {

        console.log(res.windowHeight-57);

        that.setData({
          Sheight:res.windowHeight

        })

      }

    });

    //调用应用实例的方法获取全局数据

    app.getUserInfo(function(userInfo){

      //更新数据

      that.setData({

        userInfo:userInfo

      })

    })

  }
})
