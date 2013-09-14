var util = {
	bind: function (fn, context) {
		var args = arguments.length > 2 ? Array.prototype[$slice].call(arguments, 2) : null;
		return function () {
			return fn.apply(context, args || arguments);
		};
	},
	formatNum: function (num, digits) {
		return Number(Number(num).toFixed(digits?digits:0));
	},
	inArray:function(arr, val){
		for(var i in arr){
			if(arr[i]==val){
				return true;
			}
		}
		return false;
	},
	setOptions: function (obj, opts) {
		obj.opts = M.Extend({}, obj.opts, opts);
		return obj.opts;
	}
};

win.util = util;