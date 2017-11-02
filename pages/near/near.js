//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    sex:'choose-item-active',
    isShow:true,
    isShow1:true,
    view:'I',
    init:[],
    SearchPage:1,
    IndexPage:1,
    ChoosePage:1,
    placeHolder:'请输入你要搜索的内容',
    search:'',
    search1:'',
    scrollTop:0,
    sex:[
      {
        name:'女生',
        val:1,
        bol:false
      },
      {
        name:'男生',
        val:0,
        bol:false
      },
      {
        name:'不限',
        val:2,
        bol:false
      }
    ],
    time:[
      {
        name:'15分钟',
        val:900,
        bol:false  
      },
      {
        name:'1小时',
        val:3600,
        bol:false
      },
      {
        name:'1天',
        val:86400,
        bol:false
      },
      {
        name:'3天',
        val:259200,
        bol:false
      }
    ],
    age:'不限',
    dis:"不限",
    userInfo: {},
    f:false,
    imgUrl:app.data.url,
    select:{
      sex:2,
      onlineTime:0,
      minAge:0,
      maxAge:0,
      minDis:0,
      maxDis:0
    },
    select1:{
      sex:2,
      onlineTime:0,
      minAge:0,
      maxAge:0,
      minDis:0,
      maxDis:0
    },
    selectChange:false
  },
  // onHide:function(){
  //   wx.switchTab({
  //     url: '/pages/near/near',
  //     success:function(data){
  //       console.log(data)
  //     }
  //   })
  //   wx.setStorage({
  //     key: 'LoginOut',
  //     data: true,
  //     success: function(res){
  //       // success
  //     }
  //   })
  // },
  onShow:function(){
    let that = this;
    wx.getStorage({
      key: 'comment',
      success: function(res){
        // success
        var i = that.data.init;
        i[that.data.comIndex].replyCount = res.data.replyCount;
        if(res.data.comment.length==0){
          i[that.data.comIndex].childs = [];
          that.setData({init:i});
          return
        };
        let commentObj = {
          userPicture:that.data.userInfo.avatarUrl,
          nickName:that.data.userInfo.nickName,
          content:res.data.comment[res.data.comment.length-1]
        };
        i[that.data.comIndex]&&
        i[that.data.comIndex].childs.length==0&&
        i[that.data.comIndex].childs.push(commentObj)&&
        that.setData({init:i});
        wx.removeStorage({
          key: 'comment',
          success:function(res){}
        })
      },
      fail: function(res) {
        // fail
      },
      complete: function(res) {
        // complete
      }
    })
    wx.getStorage({
      key: 'pickerData',
      success: function(res){
        // success
        that.setData({selectChange:true})
        let obj = that.data.select;
        if(res.data!==null){
          if(res.data&&res.data.fo=='岁'){
            if(res.data.checked==true){
              obj.minAge = 0;
              obj.maxAge = 0;
              that.setData({age:'不限',select:obj})
            }else{
              obj.minAge = res.data.one;
              obj.maxAge = res.data.two;
              that.setData({
                age:res.data.one + '~' + res.data.two + res.data.fo,
                select:obj
              })
            }      
          }else{
            if(res.data.checked==true){
              obj.minDis = 0;
              obj.maxDis = 0;
              that.setData({dis:'不限',select:obj})
            }else{
              obj.minDis = res.data.one * 1000;
              obj.maxDis = res.data.two * 1000;
              that.setData({
                dis:res.data.one + '~' + res.data.two + res.data.fo,
                select:obj
              })
            }
          }
        }
        wx.removeStorage({
          key: 'pickerData',
          success: function(res){
            // success
          }
        })
      },
      fail: function() {
        // fail
        console.log('无picker')
        that.updateScroll();
        that.setData({scrollTop:0})
      },
      complete: function() {
        // complete
        let s = that.data.select;
        if(that.data.age=='不限'){
          s.minAge = 0;
          s.maxAge = 0;
        }
        if(that.data.dis=='不限'){
          s.minDis = 0;
          s.maxDis = 0;
        }
        that.setData({
          select:s
        })
      }
    })
    
  },
  //事件处理函数
  bindViewTap: function(event) {
    let arr = this.data.init[event.currentTarget.dataset.itemindex];
    this.setData({comIndex:event.currentTarget.dataset.itemindex})
    console.log(arr)
    wx.navigateTo({
      url: '../otherQA/otherQA?item='+arr.questionAnswerId
    })
  },
  goPicker:function(event){
    let that = this;
    wx.navigateTo({
      url: '../picker/picker?fo='+event.currentTarget.dataset.fo+'&minAge='+that.data.select.minAge+'&maxAge='+that.data.select.maxAge+'&minDis='+that.data.select.minDis+'&maxDis='+that.data.select.maxDis
    })
  },
  timeShow:function(event){
    let k = Number(event.target.dataset.hi);
    let arr = this.data.time;
    let s = this.data.select;
    for(var i in arr){
      if(i==k)continue;
      arr[i].bol=false;
    };
    arr[k].bol=!arr[k].bol;
    s.onlineTime = arr[k].bol==true?arr[k].val:0;
    this.setData({
      time:arr,
      select:s,
      selectChange:true
    })
  },
  sexShow:function(event){
    let k = Number(event.target.dataset.hi);
    let arr = this.data.sex;
    let s = this.data.select;
    for(var i in arr){
      if(i==k)continue
      arr[i].bol = false
    };
      arr[k].bol = !arr[k].bol;
      s.sex = arr[k].bol==true?arr[k].val:2;
      this.setData({
        sex:arr,
        select:s,
        selectChange:true
      })
  },
  showChoose:function(event){
    if(event.currentTarget.dataset.show=="isShow"){
      this.setData({
        isShow:false
      })
    }else{
      this.setData({
        isShow1:false,
        f:true
      })
    }
  },
  Focus:function(){
    this.setData({
      f:true
    })
  },
  searchInput:function(event){
    // console.log(event.detail.value)
    // if(event.detail.value=="请输入你要搜索的内"){
    //   this.setData({search:''})
    // }else if(event.detail.value==''){
    //   this.setData({search:'请输入你要搜索的内容',color:'#d3d3d3'});
    //   return;
    // }else if(event.detail.value.indexOf('请输入你要搜索的内容')==-1){
      this.setData({search:event.detail.value})
    // }else{
    //   this.setData({search:event.detail.value.slice(10),color:'#666666'})
    // }
    
  },
  closeChoose:function(event){
    let sex = [
      {
        name:'女生',
        val:1,
        bol:false
      },
      {
        name:'男生',
        val:0,
        bol:false
      },
      {
        name:'不限',
        val:2,
        bol:false
      }
    ];
    let time = [
      {
        name:'15分钟',
        val:900,
        bol:false  
      },
      {
        name:'1小时',
        val:3600,
        bol:false
      },
      {
        name:'1天',
        val:86400,
        bol:false
      },
      {
        name:'3天',
        val:259200,
        bol:false
      }
    ];
    if(event.currentTarget.dataset.update=='true'&&event.currentTarget.dataset.show=="isShow"){
      this.setData({init:[]})
      let s = this.data.selectChange==true?this.data.select:this.data.select1
      this.update(s);
        this.setData({
          view:'C',
          isShow:true,
          SearchPage:1,
          IndexPage:1,
          ChoosePage:1,
          // sex:sex,
          // time:time,
          // age:'不限',
          // dis:"不限",
          select:this.data.selectChange==true?this.data.select:this.data.select1,
          selectChange:false
        })
         
         return;
    }
    if(event.currentTarget.dataset.update=='false'&&event.currentTarget.dataset.show=="isShow"){
      wx.removeStorage({
          key: 'pickerData',
          success: function(res){
            // success
          }
        })
      this.setData({
        isShow:true,
        sex:sex,
        time:time,
        age:'不限',
        dis:"不限",
        select:this.data.select1
      })
    }else{
      this.setData({
        isShow1:true
      })
    }
    this.setData({
      SearchPage:1,
      IndexPage:1,
      ChoosePage:1,
      search:''
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
  Search:function(obj){
    wx.showToast({
          title: '加载中',
          icon: 'loading',
          duration:5000
        })   
        let that = this;
        obj.pageNo = that.data.SearchPage;
        obj.pageSize = obj.pageSize?obj.pageSize:10;
        if(obj.condition==''){
          this.update(this.data.select1);
          this.setData({view:'I'})
          return
        };
        // obj.condition = obj.condition==''?this.data.search1:obj.condition;
        wx.getLocation({
          type: 'wgs84', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
          success: function(res){
            // success
            obj.longitude = res.longitude;
            obj.latitude = res.latitude;
            app.ajax({
                url:'app/userInfoController/seekUsers',
                data:obj,
                success:function(rs){
                  let arr = rs.data.result;
                  let len = arr.length?arr.length:0;
                  let compare = that.data.init==[]?false:that.data.init[that.data.init.length-1];
                  if(compare&&len!==0&&compare.askTime == arr[arr.length-1].askTime){
                    return
                  }
                    if(len>0){
                      for(var i = 0 ; i<len ; i++){
                        if(arr[i].userId == app.globalData.userId){
                          arr[i].isMe = false;
                        }else{
                          arr[i].isMe = true;
                        }
                        if(arr[i].userPicture.indexOf('qlogo')==-1){
                          arr[i].userPicture = that.data.imgUrl + arr[i].userPicture
                        }
                        if(arr[i].childs&&arr[i].childs.length&&arr[i].childs[0].userPicture.indexOf('qlogo')==-1){
                          arr[i].childs[0].userPicture = that.data.imgUrl + arr[i].childs[0].userPicture;
                        }
                        arr[i].time = app.Time(arr[i].askTime);
                        
                        //arr[i].distance = app.Distance(arr[i].latitude,arr[i].longitude);
                        arr[i].distance = app.Distance(res.latitude,arr[i].latitude,res.longitude,arr[i].longitude)
                        arr[i].isPicture = arr[i].pictureUrl3?true:false;
                        arr[i].content = arr[i].content.indexOf('他问:')==-1?arr[i].content:arr[i].content.slice(3);
                        arr[i].content = arr[i].content.indexOf('她问:')==-1?arr[i].content:arr[i].content.slice(3);
                        arr[i].content = arr[i].content.indexOf('她答:')==-1?arr[i].content:arr[i].content.slice(3);
                        arr[i].content = arr[i].content.indexOf('他答:')==-1?arr[i].content:arr[i].content.slice(3);
                      }
                      let s = that.data.init;
                      if(obj.pageNo>1){
                        let compare = that.data.init.length>10?that.data.init.slice(that.data.init.length-10):that.data.init;
                        if(JSON.stringify(compare)==JSON.stringify(arr)){return}
                         arr = s.concat(arr);
                      }
                      //console.log(arr);
                      that.setData({
                          init:arr
                      })   
                    }else{           
                    // }else if(that.data.SearchPage>1){
                          // wx.showModal({
                          //   title:'没有更多信息',
                          //   content:'搜索不到更多相关信息',
                          //   showCancel:false,
                          //   confirmText:'确定',
                          //   confirmColor:'#17B1F7',
                          //   success:function(modal){
                          //     // that.update(that.data.select1)
                          //   }
                          // })
                          setTimeout(function(){
                            let pages = getCurrentPages();
                            if(pages[pages.length-1].__route__=='pages/near/near'){
                                wx.showToast({
                                  title: '加载已完成',
                                  icon:'success',
                                  duration: 2000,
                                  success:function(res){console.log(res,'showToast success')},
                                  fail:function(res){console.log(res,'showToast fail')}
                                })
                            }
                            
                          },500)
                          return
                    }
                    // }else if(rs.data.message=='操作成功'){
                    //       // wx.showModal({
                    //       //   title:'搜索失败',
                    //       //   content:'搜索不到相关信息',
                    //       //   showCancel:false,
                    //       //   confirmText:'确定',
                    //       //   confirmColor:'#17B1F7',
                    //       //   success:function(modal){
                    //       //     that.setData({view:'I'})
                    //       //      that.update(that.data.select1)
                    //       //   }
                    //       // })
                    //       setTimeout(function(){
                    //         let pages = getCurrentPages();
                    //         if(pages[pages.length-1].__route__=='pages/near/near'){
                    //             wx.showToast({
                    //               title: '搜索不到信息',
                    //               icon:'success',
                    //               duration: 2000,
                    //               success:function(res){console.log(res,'showToast success')},
                    //               fail:function(res){console.log(res,'showToast fail')}
                    //             })
                    //         }
                            
                    //       },500)
                    //       return
                    //     }
                }
              })
          },
          fail: function() {
            // fail
            // setTimeout(function(){
            //                 let pages = getCurrentPages();
            //                 if(pages[pages.length-1].__route__=='pages/near/near'){
            //                     wx.showToast({
            //                       title: '获取不到位置',
            //                       icon:'success',
            //                       duration: 2000,
            //                       success:function(res){console.log(res,'showToast success')},
            //                       fail:function(res){console.log(res,'showToast fail')}
            //                     })
            //                 }
                            
            //               },500)
          },
          complete: function() {
            // complete
            wx.hideToast();
            that.setData({
              search:''
            })
          }
        })
  },
  Delete:function(event){
    let that = this;
    app.ajax({
      url:'app/questionAnswerController/delQuestionAnswer',
      data:{
        questionAnswerId:event.currentTarget.dataset.qaid
      },
      success:function(res){
        if(res.data.message=="删除成功"){
          let arr = that.data.init;
          arr.splice(event.currentTarget.dataset.index,1);
          that.setData({init:arr});
          wx.showToast({
            title:'删除成功',
            icon:'success',
            duration:2000
          })
        }
      }
    })
  },
  Praise:function(event){  
    let that = this;
    app.ajax({
      url:'app/questionAnswerController/praiseOrCancel',
      data:{questionAnswerId:event.currentTarget.dataset.qaid},//这里还差一个参数
      success:function(res){
         if(res.data.status=="200"){
          let arr = that.data.init;
          arr[event.currentTarget.dataset.id].praiseCount += arr[event.currentTarget.dataset.id].isPraise == 0 ? 1 : -1;
          arr[event.currentTarget.dataset.id].isPraise = arr[event.currentTarget.dataset.id].isPraise == 0 ? 1 : 0;
            that.setData({
              init:arr
              })
          }else{
            console.log("网络异常，请稍后再试试。")
          }
      }
    })
  },
  update:function(obj){
    let that = this;
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration:10000,
      success:function(res){
        f();
        //console.log(res,'加载中');
      }
    })
    
    let f = function(){ 
    wx.getLocation({
      type: 'wgs84', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
      success: function(res){
        app.ajax({
            url:"app/userInfoController/filtrateUser",
            data:{
              "sex":obj.sex,//0,
              "onlineTime":obj.onlineTime,//0,
              "minAge":obj.minAge,//0,
              "maxAge":obj.maxAge,//0,
              "longitude":res.longitude?res.longitude:0,
              "latitude":res.latitude?res.latitude:0,
              "minDistance":obj.minDis,//0,
              "maxDistance":obj.maxDis,//0,
              "adept":"",
              "isSmallProgram":1,
              "pageNo":obj.pageNo?obj.pageNo:1,
              "pageSize":obj.pageSize?obj.pageSize:10
            },
            success:function(data){    
              
              //console.log(data)         
              let arr = data.data.result;
              //console.log(data,'near')
              let len = arr.length?arr.length:0;
              let compare = that.data.init==[]?false:that.data.init[that.data.init.length-1];
              if(compare&&len!==0&&compare.askTime == arr[arr.length-1].askTime){
                      console.log('数据一样，不做数组拼接')
                      return
              }
              if(len>0){
                for(var i = 0; i<len; i++){
                  if(arr[i].userId == that.data.uId){
                    arr[i].isMe = false;
                  }else{
                    arr[i].isMe = true;
                  }
                  if(arr[i].userPicture.indexOf('qlogo')==-1){
                          arr[i].userPicture = that.data.imgUrl + arr[i].userPicture
                        }
                  if(arr[i].childs&&arr[i].childs.length&&arr[i].childs[0].userPicture.indexOf('qlogo')==-1){
                    arr[i].childs[0].userPicture = that.data.imgUrl + arr[i].childs[0].userPicture;
                  }
                  arr[i].time = app.Time(arr[i].askTime);
                  //arr[i].distance = app.Distance(arr[i].latitude,arr[i].longitude);
                  arr[i].distance = app.Distance(res.latitude,arr[i].latitude,res.longitude,arr[i].longitude);
                  arr[i].isPicture = arr[i].pictureUrl3?true:false;
                  arr[i].content = arr[i].content.indexOf('他问:')==-1?arr[i].content:arr[i].content.slice(3);
                  arr[i].content = arr[i].content.indexOf('她问:')==-1?arr[i].content:arr[i].content.slice(3);
                  arr[i].content = arr[i].content.indexOf('她答:')==-1?arr[i].content:arr[i].content.slice(3);
                  arr[i].content = arr[i].content.indexOf('他答:')==-1?arr[i].content:arr[i].content.slice(3);
                }      
                let s = that.data.init;
                if(obj.pageNo&&obj.pageNo>1){  
                    arr = s.concat(arr);
                }else{
                  that.setData({init:[]})
                }
                //console.log(arr);
                that.setData({init:arr})
              }else{
              // }else if(that.data.ChoosePage>1){
                 setTimeout(function(){
                   let pages = getCurrentPages();
                   if(pages[pages.length-1].__route__=='pages/near/near'){
                      wx.showToast({
                        title: '加载已完成',
                        icon:'success',
                        duration: 2000,
                        success:function(res){console.log(res,'showToast success')},
                        fail:function(res){console.log(res,'showToast fail')}
                      })
                   }
                  
                },500)
              }
              // }else if(data.data.message=='操作成功'){
              //   setTimeout(function(){
              //     let pages = getCurrentPages();
              //     if(pages[pages.length-1].__route__=='pages/near/near'){
              //         wx.showToast({
              //           title: '搜索不到信息',
              //           icon:'success',
              //           duration: 2000,
              //           success:function(res){console.log(res,'showToast success')},
              //           fail:function(res){console.log(res,'showToast fail')}
              //         })
              //     }
              //   },500)
                
                
              // }
            },
            fail:function(result){
              wx.hideToast();
              console.log('update fail')
            },
            complete:function(){
              wx.hideToast();
              console.log('update complete')
            }
          })
      },
      fail: function(res) {

        // fail
        wx.getStorage({
          key: 'location',
          success: function(res){
            // success
            return;
          },
          fail: function() {
            // fail
            if(that.data.sys){
              f()
            }else{
              wx.setStorage({
                key: 'location',
                data: true
              })
            }
          }
        })
        // setTimeout(function(){
        //                     let pages = getCurrentPages();
        //                     if(pages[pages.length-1].__route__=='pages/near/near'){
        //                         wx.showToast({
        //                           title: '获取不到位置',
        //                           icon:'success',
        //                           duration: 2000,
        //                           success:function(res){console.log(res,'showToast success')},
        //                           fail:function(res){console.log(res,'showToast fail')}
        //                         })
        //                     }
                            
        //                   },500)
        console.log(res,'getLocation fail')
      }
    })
  }
  },
  searchSubmit:function(submit){
      this.setData({
          view:'S',
          isShow1:true,
          SearchPage:1,
          IndexPage:1,
          f:false,
          search:submit.detail.value.input,
          search1:submit.detail.value.input,
          ChoosePage:1,
          init:[]
        })
      let obj = {condition:submit.detail.value.input}
      //console.log(submit)
      this.Search(obj);
  },
  updateScroll:function(){
    var obj;
    console.log('updateScroll')
    if(this.data.view=='S'){
      obj = {condition:this.data.search1,pageNo:this.data.SearchPage}
      this.Search(obj)
    }else{
      obj = JSON.stringify(this.data.view=='I'?this.data.select1:this.data.select);
      obj = JSON.parse(obj);
      obj.pageNo = this.data.view=="I"?this.data.IndexPage:this.data.ChoosePage;
      //obj.pageSize = this.data.view=="I"?this.data.IndexPage*10:this.data.ChoosePage*10;
      // obj.pageSize = this.data.view=="I"?this.data.IndexPage:this.data.ChoosePage;
      this.update(obj);
    }
  },
  onReachBottom:function(){
    this.LoadMore();
  },
  LoadMore:function(){
    console.log('LoadMore')
    if(this.data.view=='S'){
      this.setData({SearchPage:this.data.SearchPage+1})
      let s = {condition:this.data.search1,pageNo:this.data.SearchPage}
      
      this.Search(s)
    }else{
      let obj = JSON.stringify(this.data.view=='I'?this.data.select1:this.data.select);
      this.data.view=="I"?this.setData({IndexPage:this.data.IndexPage+1}):this.setData({ChoosePage:this.data.ChoosePage+1});
      obj = JSON.parse(obj);
      obj.pageNo = this.data.view=="I"?this.data.IndexPage:this.data.ChoosePage;
     
      this.update(obj);
    }
  },
  onShareAppMessage: function () {
    return {
      title: '解惑问答交友',
      path: '/pages/near/near'
    }
  },
  onPullDownRefresh:function(){
    this.setData({
      SearchPage:1,
      IndexPage:1,
      ChoosePage:1,
      init:[]
    })
    // this.update(this.data.select1);
    //console.log(this.data.select1,'after')
    this.updateScroll();
    wx.stopPullDownRefresh();
  },
  onLoad: function () {
    var that = this
    //调用应用实例的方法获取全局数据
    //console.log('onLoad')
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
    });
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          Sheight:res.windowHeight-152,
          sys:res.system.indexOf('iOS')==-1?true:false
        })
      }
    });  
    wx.getStorage({
      key: 'SessionKey',
      success: function(res){
        // success
        that.setData({uId:res.data.userId})
      },
      fail:function(res){console.log('无SessionKey')}
    })
    // this.update(this.data.select);
  },
  onUnload:function(){
    console.log('Unload')
  }
})
