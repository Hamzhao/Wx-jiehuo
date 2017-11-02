//index.js
//获取应用实例
var app = getApp()
Page({
	data: {
		curTxIndex: '',
		imgItem: [],
		picData: [],
		labeltype: [],
		labelId: [],
		keyword:[],
		location: {},
		disabled:false,
		submit:true,
		content:''
	},
	onPullDownRefresh: function() {
		wx.stopPullDownRefresh()
	},
	tabFun: function(e) {
		//获取触发事件组件的dataset属性 
		var _datasetId = e.target.dataset.id;
		var kw = this.data.keyword;
		var lid = this.data.labelId;
		this.setData({
			curTxIndex: _datasetId,
		});
		
		wx.navigateTo({
			url: '../label/label?id=' + _datasetId +'&kw='+kw+'&lid='+lid
		})
	},
	addImg: function() {
		var that = this,
			URL = app.data.ajaxUrl,
			//多图上传(递归)
			urls = [],
			upload = function(tempFilePaths,key,index) {
				wx.uploadFile({
					url: URL + 'app/userInfoController/imageUpload',
					filePath: tempFilePaths[index],
					name: 'file',
					formData:{
						'trdSessionKey':key
					},
					success: function(res) {
						console.log(res)
						urls.push(JSON.parse(res.data).result)
							++index < tempFilePaths.length ?
							upload(tempFilePaths,key,index) : (function(){
								wx.showToast({
									title:'上传成功！',
									icon:'success',
									duration:1000,
									mask:true
								})
								that.setData({
									disabled:false,
									picData: urls,
									submit:true
								}) //TODO callback
							})()
							
					},
					fail: function(res) {
						console.log(res, 'uploaderr')
					}
				})
			};
			wx.getStorage({
				key: 'SessionKey',
				success: function(res){
					var key = res.data.trdSessionKey;
					wx.chooseImage({
						count: 9,
						success: function(data) {
							var tempFilePaths = data.tempFilePaths;
							that.setData({
								imgItem: tempFilePaths,
								submit:false
							});
							upload(tempFilePaths,key,0)
						}
					})
				}
			})
	},
	showToast:function(){
		wx.showToast({
			title:'图片上传中...',
			icon:'loading',
			duration:1000,
			success:function(){

			}
		})
	},
	delImg: function(e) {
		var index = e.target.dataset.index;
		var ImgArr = this.data.imgItem;
		ImgArr.splice(index, 1);
		this.setData({
			imgItem: ImgArr,
		});
		wx.showToast({
			title: '已删除',
			mask:true,
			icon: 'success'
		});
	},
	formSubmit: function(event) {
		this.setData({
			disabled:true
		})
		var that = this
		var lid = that.data.labelId
		//console.log(lid)
		if(event.detail.value.TxContent == '') {
			wx.showToast({
				title: '内容不能为空',
				mask:true,
				icon: 'success',
				duration: 2000
			})
			that.setData({
				disabled:false,
			})
			return false
		}
		if(lid == ""){
			wx.showToast({
				title: '请选择问题分类',
				mask:true,
				icon: 'success',
				duration: 2000
			})
			that.setData({
				disabled:false,
			})
			return false
		}
		var str = ""
		for(var i = 0; i < lid.length; i++) {
			str += lid[i] + ","
		}
		var labelids = str.substr(0, str.length - 1);
		app.ajax({
			url:'app/questionAnswerController/isBan',
			data:{},
			success:function(isBan){
				if(isBan.data.result==0){
					addQues()
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
		let addQues = function(){
			wx.getStorage({
				key: 'SessionKey',
				success: function(res) {
					//console.log(that.data.picData)
					var arr  ={
						'picture1': that.data.picData[0] == undefined ? '' : that.data.picData[0],
						'picture2': that.data.picData[1] == undefined ? '' : that.data.picData[1],
						'picture3': that.data.picData[2] == undefined ? '' : that.data.picData[2],
						'picture4': that.data.picData[3] == undefined ? '' : that.data.picData[3],
						'picture5': that.data.picData[4] == undefined ? '' : that.data.picData[4],
						'picture6': that.data.picData[5] == undefined ? '' : that.data.picData[5],
						'picture7': that.data.picData[6] == undefined ? '' : that.data.picData[6],
						'picture8': that.data.picData[7] == undefined ? '' : that.data.picData[7],
						'picture9': that.data.picData[8] == undefined ? '' : that.data.picData[8],
					}
					var _data = {
						'userId': res.data.userId,
						'longitude': that.data.location.x,
						'latitude': that.data.location.y,
						'content': event.detail.value.TxContent,
						'labelIds': labelids
					}
					for(var key in arr){
						if(arr[key]){
							console.log(key);
							var keyName = key
							_data[keyName] = arr[key]
						}
					}
					//console.log(_data)
					app.ajax({
						data: {
							content:event.detail.value.TxContent
						},
						url: 'app/questionAnswerController/findOutKeyWord',
						success: function(rs) {
							//console.log(rs)
							var words = ''
							if(rs.data.result.length > 0){
								for(var i=0;i<rs.data.result.length;i++){
									words += rs.data.result[i]+' ';
								}
								wx.showToast({
									title: '提问内容有敏感词：'+words,
									mask:true,
									icon: 'success',
									duration: 2000
								})
								that.setData({
									disabled:false,
								})
								return
							}
							console.log(_data)
							app.ajax({
								data: {
									questionVoJson: JSON.stringify(_data)
								},
								url: 'app/questionAnswerController/addQuestion',
								success: function(data) {
									wx.setStorage({
										key: "key",
										data: {
											Array: [],
											curIndex: '',
										}
									})
									// wx.navigateTo({
									// 	url: '../myQ/myQ?data=' + JSON.stringify(data.data.result) + '&imgItem=' + that.data.imgItem
									// })
									wx.showToast({
										title: '发布成功',
										mask:true,
										icon: 'success',
										duration: 2000
										})
									that.setData({
										content: "",
										disabled:false,
										imgItem: []
									})
								}
							});
						}
					});
				}
			})
		}
	},
	onShow: function() {
		var that = this;
		wx.getStorage({
			key: 'key',
			success: function(res) {
				that.setData({
					curTxIndex: res.data.curIndex,
					labelId: res.data.Array,
					keyword: res.data.keyword
				})
			}
		})
	},
	onLoad: function(options) {
		var that = this;
		wx.setNavigationBarTitle({
			title: '我要提问'
		})
		wx.getStorage({
			key: 'location',
			success: function(res){
				// success
				console.log('location on');
				that.setData({disabled:true})
			}
		})
		wx.setStorage({
			key: "key",
			data: {
				Array: [],
				curIndex: 0,
				keyword:[]
			}
		})
		wx.getLocation({
			type: 'wgs84',
			success: function(res) {
				console.log(res)
				var latitude = res.latitude
				var longitude = res.longitude
				that.setData({
					location: {
						"x": longitude,
						"y": latitude
					}
				})
			},
			fail: function(res) {
				console.log(res)
			}
		})
		app.ajax({
			data: {},
			url: 'app/labelCategoryController/getLabelCategorys',
			success: function(res) {
				that.setData({
					labelType: res.data.result,
				})
			},
			fail: function(res) {
				console.log(res)
			}
		});
	}
})