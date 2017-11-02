//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    item:{},
    reply:{},
    isShow:true,
    placeHolder:'请输入评论内容',
    search:'',
    comment:[],
    f:false,
    disabled:false,
    imgUrl:app.data.url,
    replyCount:0
  },
  // searchInput:function(event){
  //   this.setData({search:event.detail.value})
  // },
  onUnload:function(){
    let that = this;
    wx.setStorage({
      key: 'comment',
      data: {comment:that.data.comment,replyCount:that.data.replyCount},
      success: function(res){
        // success
      },
      fail: function() {
        // fail
      },
      complete:function(){
      }
    })
  },
  Focus:function(){
    this.setData({
      f:true
    })
  },
  searchInput:function(event){
    //console.log(event)
      this.setData({search:event.detail.value})
  },
  showChoose:function(event){
      this.setData({
        isShow:false
      })
  },
  Delete:function(event){
    let that = this;
    app.ajax({
      url:'app/questionAnswerController/delQuestionAnswer',
      data:{
        questionAnswerId:that.data.reply[event.currentTarget.dataset.reqaid].answerId
      },
      success:function(res){
        if(res.data.message=="删除成功"){
          that.update()
        }
      }
    })
  },
  closeChoose:function(event){
      this.setData({
        isShow:true,
        search:'',
        f:false
      })    
  },
  PreviewImage:function(e){
    let arr = e.currentTarget.dataset.pic;
    let that = this;
    for(var i = 0 ; i<arr.length ; i++){
      if(arr[i]==''){
        arr.splice(i,1);
        i--;
      }else{
        arr[i]=that.data.imgUrl+arr[i];
      };

    }
    //console.log(arr)
    wx.previewImage({
      current:arr[e.currentTarget.dataset.index],
      urls:arr
    })
  },
  formSubmit:function(e){
    this.setData({disabled:true,search:e.detail.value.input});
    let that = this;
    if(e.detail.value.input==''){
      wx.showToast({
        title:'请输入评论内容',
        icon:'loading',
        duration:1000
      })
      this.setData({disabled:false});
      return;
    };
    let obj = {
            parentId:that.data.questionAnswerId,
            userId:that.data.uId,
            content:e.detail.value.input,
            isPrivacy:0,
            'picture1':'',
            'picture2':'',
            'picture3':'',
            'picture4':'',
            'picture5':'',
            'picture6':'',
            'picture7':'',
            'picture8':'',
            'picture9':''
            }
    app.ajax({
      url:'app/questionAnswerController/isBan',
      data:{},
      success:function(res){
        //console.log(res)
        if(res.data.result==0){
          // that.data.comment.push(e.detail.value.input);
          keyWord(obj);
        }else{
          that.setData({disabled:false})
          wx.showToast({
            title:'您被禁言了！',
            icon:'success',
            duration:1000
          })
        }
      }
    })
    let keyWord = function(obj){
      app.ajax({
						data: {
							content:e.detail.value.input
						},
						url: 'app/questionAnswerController/findOutKeyWord',
						success: function(rs) {
							//console.log(rs)
							var words = '';
							if(rs.data.result.length > 0){
									words = rs.data.result[0];
								wx.showToast({
									title: '提问内容有敏感词：'+words,
									mask:true,
									icon: 'success',
									duration: 2000,
                  mask:true,
                  complete:function(){
                    that.setData({disabled:false})
                  }
								})
								return
							};
              reply(obj);
            }
      })
    }
    let reply = function(object){
      app.ajax({
          url:'app/questionAnswerController/reply',
          data:{
            answerVoJson:JSON.stringify(object)
          },
            success:function(res){
              that.setData({
                disabled:false
              })
              that.closeChoose();
              that.update();
            }
        })
    }
  },
  Praise:function(event){
    let that = this;
    app.ajax({
      url:'app/questionAnswerController/praiseOrCancel',
      data:{questionAnswerId:event.currentTarget.dataset.qaid},
      success:function(res){
        // if(res.status=="200"){
          let arr = that.data.reply;
          arr[event.currentTarget.dataset.id].isPraise = arr[event.currentTarget.dataset.id].isPraise == 0 ? 1 : 0;
          arr[event.currentTarget.dataset.id].praiseCount +=  arr[event.currentTarget.dataset.id].isPraise == 1 ? 1 : -1;
            that.setData({
              reply:arr
            })
        // }else{
        //   console.log("网络异常，请稍后再试试。")
        // }
      }
    })
  },
  PreviewImage:function(e){
    let arr = e.currentTarget.dataset.pic;
    let that = this;
    for(var i = 0 ; i<arr.length ; i++){
      if(arr[i]==''){
        arr.splice(i,1);
        i--;
      }else{
        arr[i]=that.data.imgUrl+arr[i];
      };

    }
    //console.log(arr)
    wx.previewImage({
      current:arr[e.currentTarget.dataset.index],
      urls:arr
    })
  },
  update:function(){
    let that = this;
    console.log(this.data.comment)
    wx.getLocation({
      type: 'wgs84', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
      success: function(data){
        // success
        app.ajax({
          url:'app/questionAnswerController/clickReply',
          data:{questionAnswerId:that.data.questionAnswerId},
          success:function(res){
            if(res.data.message=='操作成功'){
              let arr = res.data.result;
              var com = [];
              let len = arr.length?arr.length:0;
                if(len>0){
                  for(var i = 0 ; i<len ; i++){
                    if(arr[i].userId == that.data.uId){
                      arr[i].isMe = false;
                      com.push(arr[i].content);
                    }else{
                      arr[i].isMe = true;
                    }
                    if(arr[i].userPicture&&arr[i].userPicture.indexOf('qlogo')==-1){
                          arr[i].userPicture = that.data.imgUrl + arr[i].userPicture;
                    }
                    arr[i].askTime = app.Time(arr[i].askTime);
                    
                    arr[i].distance = app.Distance(data.latitude,arr[i].latitude,data.longitude,arr[i].longitude)
                  }     
                  console.log(com)
                  that.setData({reply:arr,replyCount:len,comment:com})          
                }else{
                  // wx.showModal({
                  //   title:'无评论记录',
                  //   showCancel:false,
                  //   confirmText:'确定',
                  //   confirmColor:'#17B1F7',
                  //   success:function(modal){
                  //     // that.update(that.data.select1)
                  //   }
                  // })
                  that.setData({reply:arr,comment:[],replyCount:0}) 
                }
            }
          }
        })
      },
      fail: function() {
        // fail
      }
    })
  },
  onLoad: function (options) {
    var that = this
    // console.log(JSON.parse(options.item))
    console.log(options);
    let arr = options.item;
    //console.log(arr.label);
    this.setData({questionAnswerId:arr})
    
    wx.setNavigationBarTitle({
      title: '评论'
    });
    wx.getStorage({
      key: 'SessionKey',
      success: function(res){
        // success
        that.setData({uId:res.data.userId})
      }
    })
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
    })
    app.ajax({
      url:'app/questionAnswerController/specificContent',
      data:{questionAnswerId:arr},
      success:function(res){
        let item = res.data.result;
        let label = item.questionLabels;
        if(label.length && label.lengt>4){
          label.splice(4);
        }
        item.questionLabels = label;
        item.isPicture = item.pictureUrls.length>3?true:false;
        that.setData({
          item:item
        })
      }
    })
    wx.getStorage({
      key: 'location',
      success: function(res){
        // success
        console.log('location on');
        that.setData({disabled:true})
      }
    })
    this.update();
  }
})
