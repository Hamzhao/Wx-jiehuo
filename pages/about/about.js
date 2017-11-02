//index.js
//获取应用实例
var app = getApp()
Page({
	data: {
		phone: '',
		code: '',
		password: '',
		isShow: true,
		isTest: true,
		text: '获取验证码',
		pwdType:'password',
		isHidden:true,
		btnfc:false,
		t: true
	},
	choose: function() {
		this.setData({
			isShow: !this.data.isShow
		})
	},
	savePhone: function(e) {
		var tel = e.detail.value
		this.setData({
			phone: tel
		})
	},
	call: function() {
		var that = this
		wx.makePhoneCall({
			phoneNumber: that.data.tel
		})
	},
	saveCode: function(e) {
		var code = e.detail.value
		this.setData({
			code: code
		})
	},
	savePassword: function(e) {
		var pwd = e.detail.value
		this.setData({
			password: pwd
		})
	},
	pwdType: function(){
		var that = this
		var condition = that.data.isHidden
		if(condition){
			that.setData({
				pwdType:'text',
				isHidden:false,
				btnfc:true,
			})
			console.log(that.data.pwdType)
		}else{
			that.setData({
				pwdType:'password',
				isHidden:true,
				btnfc:true,
			})
			console.log(that.data.pwdType)
		}
	},
	onPullDownRefresh:function(){
    wx.stopPullDownRefresh();
  	},
	confirm: function() {
		var that = this
		var num = this.data.code
		var tel = this.data.phone
		var pwd = this.data.password
		if(tel == "") {
			wx.showToast({
				title: '手机号码不能为空',
				icon: 'success',
				duration: 2000
			})
			return
		} else if(num == "") {
			wx.showToast({
				title: '验证码不能为空',
				icon: 'success',
				duration: 2000
			})
			return
		} else if(pwd == "") {
			wx.showToast({
				title: '密码不能为空',
				icon: 'success',
				duration: 2000
			})
			return
		} else if(pwd.length < 6) {
			wx.showToast({
				title: '密码长度不少于6位',
				icon: 'success',
				duration: 2000
			})
			return
		}
		var reg = /^1[3|4|5|7|8][0-9]{9}$/
		var tel = this.data.phone
		if(reg.test(tel)) {
			app.ajax({
				data: {
					phone: tel,
					inputCode: num,
					password: pwd
				},
				url: 'app/userInfoController/register',
				success: function(res) {
					console.log(res)
					that.setData({
						isShow: !that.data.isShow
					})
					if(res.data.message == "操作成功"){
						wx.showToast({
							title: '注册成功',
							icon: 'success',
							duration: 2000
						})
						that.setData({
							phone: '',
							code: '',
							password: '',
							pwdType:'password',
							isHidden:true,
						})
					}else{
						wx.showToast({
							title: '注册失败',
							icon: 'success',
							duration: 2000
						})
						that.setData({
							phone: '',
							code: '',
							password: '',
							text: '获取验证码',
							t: true,
							pwdType:'password',
							isHidden:true,
							isTest: true
						})
					}
				}
			});
		}else {
			wx.showToast({
				title: '请输入正确的手机号',
				icon: 'success',
				duration: 2000
			})
		}
	},
	test: function() {
		var reg = /^1[3|4|5|7|8][0-9]{9}$/;
		var tel = this.data.phone
		let that = this;
		if(reg.test(tel)) {
			if(this.data.t) {
				var s = 60;
				app.ajax({
					data: {
						phone: tel
					},
					url: 'app/userInfoController/getPhoneAuthCode',
					success: function(res) {
						//console.log(res)
						wx.showToast({
							title: res.data.message,
							icon: 'success',
							duration: 2000
						})
						if(res.data.message=='验证码发送失败'){
							that.setData({
								text: '获取验证码',
								t: true,
								isTest: true
							})
							return
						}
						if(res.data.message == "帐号已经被使用") {
							return
						}
						that.setData({
							isTest: !that.data.isTest,
							t: false
						})
						var time = setInterval(function() {
							if(!that.data.t){
								that.setData({
									text: s + 's'
								})
							}
							if(s == 0) {
								that.setData({
									text: '获取验证码',
									t: true,
									isTest: !that.data.isTest
								});
								clearInterval(time);
							}
							s = s - 1;
						}, 1000);
						// }
					},
				});
			}
		} else {
			wx.showToast({
				title: '请输入正确的手机号',
				icon: 'success',
				duration: 2000
			})
		}
	},
	onLoad: function() {
		wx.setNavigationBarTitle({
			title: '联系我们'
		})
	}
})