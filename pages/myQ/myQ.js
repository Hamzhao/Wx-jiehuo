//index.js
//获取应用实例
var app = getApp()
var p = 1
var Getdata = function(that, id) {
	that.setData({
		hidden: false
	});
	wx.getLocation({
		type: 'wgs84', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
		success: function(res) {
			console.log(p)
			app.ajax({
				data: {
					questionId: id,
					pageSize: 10,
					pageNo: p
				},
				url: 'app/questionAnswerController/referrer',
				success: function(data) {
					let arr = data.data.result;
					var pushArr = that.data.pushData;
					let len = arr.length;
					if(len > 0) {
						for(var i = 0; i < len; i++) {
							arr[i].onlineTime = app.Time(arr[i].onlineTime);
							arr[i].distance = app.Distance(res.latitude, arr[i].latitude, res.longitude, arr[i].longitude)
							pushArr.push(arr[i])
						}
					}
					console.log(pushArr)
					that.setData({
						pushData: pushArr,
						pushCount:pushArr.length
					})
					p++;
					that.setData({
						hidden: true
					});
				}
			});
		}
	})
}
Page({
	data: {
		keyword: ['电影', '社交'],
		pushNum: '125',
		questionData: {},
		labelArr:[],
		imgs: [],
		imgUrl: '',
		pushData: [],
		pushCount:'',
		disTime: ''
	},
	//事件处理函数
	bindViewTap: function() {
		wx.navigateTo({
			url: '../logs/logs'
		})
	},
	onLoad: function(options) {
		var that = this
		wx.setNavigationBarTitle({
			title: '我的提问'
		})
		var dt = JSON.parse(options.data)
		var nowTime = new Date().getTime()
		var askTime = dt.askTime
		var dsTime = app.Time(askTime)
		var arr = dt.questionLabel.slice(0,4)
		console.log(arr);
		console.log(dsTime)
		if(options.imgItem == '' || options.imgItem == 'undefined'){
			this.setData({
				questionData: dt,
				labelArr:arr,
				imgs: '',
				disTime: dsTime,
				imgUrl: app.data.url+'/'
			})
		}else{
			var ImgArr = options.imgItem.split(',')
			this.setData({
				questionData: dt,
				labelArr:arr,
				imgs: ImgArr,
				disTime: dsTime,
				imgUrl: app.data.url+'/'
			})
		}

		var id = this.data.questionData.questionId
		Getdata(that, id)
	},
	onReachBottom: function() {
		//上拉  
		console.log("上拉")
		var id = this.data.questionData.questionId
		var that = this
		Getdata(that, id)
	}
})