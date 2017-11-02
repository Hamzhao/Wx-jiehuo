//label.js
var app = getApp()
Page({
	data: {
		curTxIndex: 1,
		labelType: [],
		keyword: [],
		labelId: [],
		labelItem: [],
		phclass:'placeholder-style'

	},
	tabFun: function(e) {
		//获取触发事件组件的dataset属性 
		var _datasetId = e.target.dataset.id;
		this.setData({
			curTxIndex: _datasetId
		});
	},
	phFun:function(){
		this.setData({
			phclass:'placeholder-none'
		})
	},
	blurFun:function(e){ 
		var val = e.detail.value;
		if(val == ''){
			this.setData({	
				phclass:'placeholder-style'
			})
		}else{
			this.setData({
				phclass:'placeholder-none'
			})
		}
		
	},
	tabLabel: function(e) {
		var val = e.target.dataset.value;
		var id = e.target.dataset.id;
		var arr = this.data.keyword;
		var idArr = this.data.labelId;
		for(var i = 0; i < idArr.length; i++) {
			if(id == idArr[i]) {
				wx.showToast({
					title: '不能重复选取',
					icon: 'success'
				});
				return
			}
			if(arr.length > 8) {
				wx.showToast({
					title: '最多9个',
					icon: 'success'
				});
				return
			}
		}
		this.data.keyword.push(val);
		this.data.labelId.push(id);
		this.setData({
			keyword: arr,
			labelId: idArr
		});
	},
	delLabel: function(e) {
		var index = e.target.dataset.index;
		var keyArr = this.data.keyword;
		var idArr = this.data.labelId;
		keyArr.splice(index, 1);
		idArr.splice(index, 1);
		this.setData({
			keyword: keyArr,
			labelId: idArr
		});
		wx.showToast({
			title: '已删除',
			icon: 'success'
		});
	},
	Confirm: function(e) {
		var that = this
		var _Arr = this.data.labelId
		var cindex = this.data.curTxIndex
		var kw = this.data.keyword
		wx.setStorage({
			key: "key",
			data: {
				Array: _Arr,
				curIndex: cindex,
				keyword:kw
			}
		})
		wx.navigateBack({
			delta: 1
		})
	},
	onLoad: function(options) {
		console.log(options.id)
		console.log(options.kw)
		if(options.kw == 'undefined' || options.kw == ''){
			this.setData({
				curTxIndex: options.id,
			})
		}else if(options.lid == 'undefined' || options.lid == ''){
			this.setData({
				curTxIndex: options.id,
				keyword:options.kw.split(',')
			})
		}else{
			this.setData({
				curTxIndex: options.id,
				keyword:options.kw.split(','),
				labelId:options.lid.split(',')
			})
		}
		
		var that = this;
		wx.setNavigationBarTitle({
			title: '标签管理'
		})
		app.ajax({
			data: {},
			url: 'app/labelCategoryController/getLabelCategorys',
			success: function(res) {
				that.setData({
					labelType: res.data.result
				})
			}
		});
		app.ajax({
			url: 'app/labelController/getLabelsByCategory', //仅为示例，并非真实的接口地址
			data: {
				labelCategoryId: options.id
			},
			success: function(res) {
				that.setData({
					labelItem: res.data.result
				})
			}
		})
	},
	getItem: function(e) {
		console.log(e)
		var that = this;
		app.ajax({
			url: 'app/labelController/getLabelsByCategory', //仅为示例，并非真实的接口地址
			data: {
				labelCategoryId: e.target.dataset.id
			},
			success: function(res) {
				console.log(res.data.result)
				that.setData({
					labelItem: res.data.result
				})
			}
		})
	},
	onPullDownRefresh:function(){
    // this.setData({
    //   SearchPage:1,
    //   IndexPage:1,
    //   ChoosePage:1,
    //   view:'I'
    // })
    // this.update(this.data.select1);
    //console.log(this.data.select1,'after')
    //this.updateScroll();
    wx.stopPullDownRefresh();
  	}
})