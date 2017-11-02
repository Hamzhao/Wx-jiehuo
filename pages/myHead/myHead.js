//index.js
//获取应用实例
var app = getApp()
Page({
	data: {
		id: '25',
		isTxt: '',
		nameShow: true,
		jobShow: true,
		ageShow: true,
		nickName: '',
		homeTown: '',
		sex: '',
		sexType: ["男", "女"],
		age: '0',
		job: '未知',
		radius: '未知',
		Lslogintime: '未知',
		src: '../../image/discover_starlv.png',
		nexticon: '../../image/discover_next.png',
		hobby: [],
		goodAnswer: [],
		userInfo: {},
		WeChatInfo: {},
		registerTime: "未知"
	},
	//事件处理函数
	bindViewTap: function() {
		wx.navigateBack();
	},
	goLabel: function() {
		wx.navigateTo({
			url: '../label/label'
		})
	},
	inputTxt: function(e) {
		var val = e.detail.value
		this.setData({
			isTxt: val
		})
		console.log(this.data.isTxt)
	},
	//修改昵称
	nameShow: function() {
		this.setData({
			nameShow: false
		})
	},
	nameConfirm: function() {
		var tx = this.data.isTxt
		if(tx == '') {
			this.setData({
				nameShow: true
			})
		} else {
			this.setData({
				nickName: tx,
				nameShow: true
			})
		}
	},
	//修改年龄
	ageShow: function() {
		this.setData({
			ageShow: false
		})
	},
	ageConfirm: function() {
		var tx = this.data.isTxt
		if(tx == '') {
			this.setData({
				ageShow: true
			})
		} else {
			this.setData({
				age: tx,
				ageShow: true
			})
		}
	},
	//修改职位
	jobShow: function() {
		this.setData({
			jobShow: false
		})
	},
	jobConfirm: function() {
		var tx = this.data.isTxt
		if(tx == '') {
			this.setData({
				jobShow: true
			})
		} else {
			this.setData({
				job: tx,
				jobShow: true
			})
		}
	},
	//取消修改
	editCancel: function() {
		this.setData({
			nameShow: true,
			ageShow: true,
			jobShow: true,

		})
	},
	//修改性别
	bindPickerChange: function(e) {
		this.setData({
			sex: e.detail.value
		})
	},
	saveData: function() {
		var that = this
		var time = new Date().getTime
		app.ajax({
			data: {
				"id": that.data.id,
				"nickName": that.data.nickName,
				"sex": that.data.sex,
				"age": that.data.age,
				"job": that.data.job
			},
			url: 'app/userInfoController/updateUserInfo',
			success: function(res) {
				wx.switchTab({
					url: '../me/me'
				})
			}
		});
	},
	onLoad: function(options) {
		var that = this
			//调用应用实例的方法获取全局数据
		app.getUserInfo(function(userInfo) {
			//更新数据
			that.setData({
				WeChatInfo: userInfo
			})
			console.log(that.data.WeChatInfo)
		})
		wx.setNavigationBarTitle({
			title: '发现'
		})
		wx.getStorage({
			key: 'SessionKey',
			success: function(res) {
				var id = res.data.userId //传来的id
				console.log(id)
				wx.getLocation({
					type: 'wgs84', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
					success: function(rs) {
						app.ajax({
							url: 'app/userInfoController/getUserInfo', //仅为示例，并非真实的接口地址
							data: {
								anyoneId: id
							},
							success: function(res) {
								if(res.data.status == 400) {
									that.setData({
										id: id,
										nickName: that.data.WeChatInfo.nickName,
										sex: that.data.WeChatInfo.gender,
										homeTown: "" + that.data.WeChatInfo.province + "," + that.data.WeChatInfo.city + "",
									})
								} else {
									console.log(res)
									var str = res.data.result[0].label
									var distance = app.Distance(rs.latitude, res.data.result[0].latitude, rs.longitude, res.data.result[0].longitude)
									var distime = app.Time(res.data.result[0].onlineTime)
									var arr = str == null ? [] : str.split(",");
									var str2 = res.data.result[0].hobby
									var arr2 = str2 == null ? [] : str2.split(";")

									function time(timestamp) {
										if(timestamp == null || typeof(timestamp) == 'string') {
											return timestamp;
										} else {
											var d = new Date(timestamp);
											return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
										}
									}
									var Rtime = time(res.data.result[0].registerTime)
									that.setData({
										id: id,
										userInfo: res.data.result[0],
										nickName: res.data.result[0].nickName,
										sex: res.data.result[0].sex,
										age: res.data.result[0].age,
										job: res.data.result[0].job,
										goodAnswer: arr,
										hobby: arr2,
										homeTown: res.data.result[0].homeTown,
										registerTime: Rtime,
										radius: distance,
										Lslogintime: distime
									})
								}
							}
						})
					}
				})
			}
		})
	}
})