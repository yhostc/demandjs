(function(win){
	var http = {
		request: function (url) {
			var node = document.createElement("script");
			node.src = url;
			node.type = "text/javascript";
			node.charset = "utf-8";

            if (node.addEventListener){// not ie
                node.addEventListener("load", function (e) {
                    var target = e.target;
                    target.parentNode.removeChild(target)
                }, false)
            }else if(node.attachEvent){ // ie
				node.attachEvent("onreadystatechange", function () {
					var target = window.event.srcElement;
					if (target && (target.readyState == "loaded" || target.readyState == "complete")) {
						target.parentNode.removeChild(cJ)
					}
				})
            }
            setTimeout(function () {
                document.getElementsByTagName("head")[0].appendChild(node);
                node = null;
            }, 1)
        }
	};
	var demand = {
		// 配置获取模块的地址
		moduleUrl: "modules.php?v=1.3",
		// 模块依赖
        dependence: {
            map: ["util","pixel"],
            marker: ["infowindow"],
            util: ["marker"],
            infowindow: []
        },
		// 是否锁定状态，用于当前队列处理
        locking: 0,
		// 待加载模块名称队列
		planQueue:[],
		// 正在加载的模块队列
		currentQueue: {},
		// 加载方法
        load: function (cls_name, cls_cbk) {
            var cls = this.current(cls_name);
            if (cls.status == 1) {//请求完成 1
                return
            } else {
                if (cls.status == 0) {// 初始化
                    this.combine(cls_name);
                    this.pushUniqueMdl(cls_name);
                    var that = this;
                    if (!that.locking) {
                        that.locking = 1;
                        window.setTimeout(function () {
							// 将当前队列中的模块全部一次加载
                            var url = that.moduleUrl + "&m=" + that.planQueue.join(",");
                            http.request(url);// 发送请求
                            that.planQueue = [];//清空待加载队列
                            that.locking = 0;//表示队列已发送结束
                        }, 1)
                    }
                    cls.status = -1//标识为警告, 0
                }
                cls.callbacks.push(cls_cbk)//将需要执行的回调函数加入队列
            }
        },
		// 根据当前模块检查其依赖，进行合并加载
        combine: function (cls_name) {
            if (cls_name && this.dependence[cls_name]) {
                var dependency = this.dependence[cls_name];// 此包依赖
                for (var i = 0; i < dependency.length; i++) {
                    this.combine(dependency[i]);// 递归检查此包的依赖
                    if (!this.currentQueue[dependency[i]]) {// 如果此模块尚未加载，则加入队列
                        this.pushUniqueMdl(dependency[i])
                    }
                }
            }
        },
		// 加入唯一包名到队列
        pushUniqueMdl: function (cls_name) {
            for (var i = 0; i < this.planQueue.length; i++) {
                if (this.planQueue[i] == cls_name) {
                    return
                }
            }
            this.planQueue.push(cls_name)
        },
		// 将字符流转化为对象
        run: function (cls_name, cls_text) {
            var cls = this.current(cls_name);// 获取此类对应的状态和回调函数等
			// 异常捕获
            try {
                eval(cls_text)// text 2 class
            } catch (e) {
				console.log(e);
                return
            }
            cls.status = 1;//标识为完成
            for (var i = 0, j = cls.callbacks.length; i < j; i++) {
                cls.callbacks[i]()
            }
            cls.callbacks = [];//清空回调数组
        },
		// 模块检查，如不存在则加载
        check: function (cls_name, cls_cbk) {
            var that = this;
            that.timeout = setTimeout(function () {
                var status = that.currentQueue[cls_name].status;
                if (status != 1) {
                    that.remove(cls_name);
                    that.load(cls_name, cls_cbk)
                } else {
                    clearTimeout(that.timeout)
                }
            }, 5000);
        },
		// 获取当前模块对应的数据，含状态，回调函数数组等
        current: function (/*模块名称*/cls_name) {
            if (!this.currentQueue[cls_name]) {
                this.currentQueue[cls_name] = {};
                this.currentQueue[cls_name].status = 0;
                this.currentQueue[cls_name].callbacks = []
            }
            return this.currentQueue[cls_name]
        },
		// 移出此模块
        remove: function (cls_name) {
            var current = this.current(cls_name);
            delete current;
        }
	}
	
	win['_jsload_'] = function(cls_name, cls_text){
		demand.run(cls_name, cls_text);
	};
	
	function map(id, opts){
		this.id = id;
		this.opts = opts;
		
		var that = this;
		demand.load("map", function () {
            console.log('util is loaded!');
        });
	}
	map.prototype.getOptions = function(name){
		return this.opts[name]
	}
	
	
	win['amap'] = map;
})(window);

// 定义模块加载类
