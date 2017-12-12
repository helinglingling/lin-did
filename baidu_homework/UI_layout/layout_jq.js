var Class = (function() {
    var _mix = function(r, s) {
        for (var p in s) {
          if (s.hasOwnProperty(p)) {
            r[p] = s[p]
          }
        }
    }
    var _extend = function() {
        //开关 用来使生成原型时,不调用真正的构成流程init
        this.initPrototype = true
        var prototype = new this()
        this.initPrototype = false
        var items = Array.prototype.slice.call(arguments) || []
        var item
        //支持混入多个属性，并且支持{}也支持 Function
        while (item = items.shift()) {
          _mix(prototype, item.prototype || item)
        }
        // 这边是返回的类，其实就是我们返回的子类
        function SubClass() {
          if (!SubClass.initPrototype && this.init)
            this.init.apply(this, arguments)//调用init真正的构造函数
        }
        // 赋值原型链，完成继承
        SubClass.prototype = prototype
        // 改变constructor引用
        SubClass.prototype.constructor = SubClass
        // 为子类也添加extend方法
        SubClass.extend = _extend
        return SubClass
    }
      //超级父类
    var Class = function() {}
      //为超级父类添加extend方法
    Class.extend = _extend
    return Class
})()



    //辅组函数，获取数组里某个元素的索引 index
    var _indexOf = function(array,key){
      if (array === null) return -1
      var i = 0, length = array.length
      for (; i < length; i++) if (array[i] === item) return i
      return -1
    }
var Event = Class.extend({
      //添加监听
      on:function(key,listener){
        //this.__events存储所有的处理函数
        if (!this.__events) {
          this.__events = {}
        }
        if (!this.__events[key]) {
          this.__events[key] = []
        }
        if (_indexOf(this.__events,listener) === -1 && typeof listener === 'function') {
          this.__events[key].push(listener)
        }
        return this
      },
      //触发一个事件，也就是通知
      fire:function(key){
        if (!this.__events || !this.__events[key]) return
        var args = Array.prototype.slice.call(arguments, 1) || []
        var listeners = this.__events[key]
        var i = 0
        var l = listeners.length
        for (i; i < l; i++) {
          listeners[i].apply(this,args)
        }
        return this
      },
      //取消监听
      off:function(key,listener){
        if (!key && !listener) {
          this.__events = {}
        }
        //不传监听函数，就去掉当前key下面的所有的监听函数
        if (key && !listener) {
          delete this.__events[key]
        }
        if (key && listener) {
          var listeners = this.__events[key]
          var index = _indexOf(listeners, listener)
          (index > -1) && listeners.splice(index, 1)
        }
        return this;
      }
    })
    var Base = Class.extend(Event,{
      init:function(config){
        //自动保存配置项
        this.__config = config
        this.bind()
        this.render()
      },
      //可以使用get来获取配置项
      get:function(key){
        return this.__config[key]
      },
      //可以使用set来设置配置项
      set:function(key,value){
        this.__config[key] = value
      },
      bind:function(){
      },
      render:function() {
      },
      //定义销毁的方法，一些收尾工作都应该在这里
      destroy:function(){
        //去掉所有的事件监听
        this.off()
      }
    })
var RichBase = Base.extend({
    EVENTS:{},
    template:'',
    init:function(config){
        //存储配置项
        this.__config = config
        //解析代理事件
        this.setUp()
        this._delegateEvent()
    },
      //循环遍历EVENTS，使用jQuery的delegate代理到parentNode
    _delegateEvent:function(){
        var self = this
        var events = this.EVENTS || {}
        var eventObjs,fn,select,type
        var parentNode = $(this.get('parentNodeEvent')) || $(document.body)
        console.log(parentNode);
        for (select in events) {
          eventObjs = events[select]
          for (type in eventObjs) {
            fn = eventObjs[type]
            parentNode.delegate(select,type,function(e){
              fn.call(null,self,e)
            })
          }
        }
    },
      //支持underscore的极简模板语法
      //用来渲染模板，这边是抄的underscore的。非常简单的模板引擎，支持原生的js语法
    _parseTemplate:function(str,data){
        /**
         * http://ejohn.org/blog/javascript-micro-templating/
         * https://github.com/jashkenas/underscore/blob/0.1.0/underscore.js#L399
         */
        var fn = new Function('obj',
            'var p=[],print=function(){p.push.apply(p,arguments);};' +
            'with(obj){p.push(\'' + str
                .replace(/[\r\t\n]/g, " ")
                .split("<%").join("\t")
                .replace(/((^|%>)[^\t]*)'/g, "$1\r")
                .replace(/\t=(.*?)%>/g, "',$1,'")
                .split("\t").join("');")
                .split("%>").join("p.push('")
                .split("\r").join("\\'") +
            "');}return p.join('');")
        return data ? fn(data) : fn
    },
      //提供给子类覆盖实现
    setUp:function(){
        this.render()
    },
      //用来实现刷新，只需要传入之前render时的数据里的key还有更新值，就可以自动刷新模板
    setChuckdata:function(key,value){
        var self = this
        var data = self.get('__renderData')
        //更新对应的值
        data[key] = value
        if (!this.template) return;
        //重新渲染
        var newHtmlNode = $(self._parseTemplate(this.template,data))
        //拿到存储的渲染后的节点
        var currentNode = self.get('__currentNode')
        if (!currentNode) return;
        //替换内容
        currentNode.replaceWith(newHtmlNode)
        self.set('__currentNode',newHtmlNode)
    },
      //使用data来渲染模板并且append到parentNode下面
    render:function(data){
        var self = this
        //先存储起来渲染的data,方便后面setChuckdata获取使用
        self.set('__renderData',data)
        if (!this.template) return;
        //使用_parseTemplate解析渲染模板生成html
        //子类可以覆盖这个方法使用其他的模板引擎解析
        var html = self._parseTemplate(this.template,data)
        var parentNode = this.get('parentNode') || $(document.body)
        var currentNode = $(html)
        //保存下来留待后面的区域刷新
        //存储起来，方便后面setChuckdata获取使用
        self.set('__currentNode',currentNode)
        parentNode.append(currentNode)
    },
    destroy:function(){
        var self = this
        //去掉自身的事件监听
        self.off()
        //删除渲染好的dom节点
        self.get('__currentNode').remove()
        //去掉绑定的代理事件
        var events = self.EVENTS || {}
        var eventObjs,fn,select,type
        var parentNode = self.get('parentNode')
        for (select in events) {
          eventObjs = events[select]
          for (type in eventObjs) {
            fn = eventObjs[type]
            parentNode.undelegate(select,type,fn)
          }
        }
    }
})

var TextCount = RichBase.extend({ 
    //事件直接在这里注册，会代理到parentNode节点，parentNode节点在下面指定
    EVENTS:{
        // 选择器字符串，支持所有jquery风格的选择器
        '.agree,.cancel':{
            // 注册keyup事件
            touchend:function(self,e){
                $("#"+self.get("box_id")).remove();
                
            }
        }
    },
    // 指定当前组件的模板
    template:'<div class="thick" id="<%= box_id %>"><div class="layout">\
                <div class="layout_top"><%= top_txt %></div>\
                <div class="layout_content"><%= main_txt %></div>\
                <div class="layout_bot">\
                    <button class="agree"><%= l_btn %></button>\
                    <button class="cancel"><%= r_btn %></button>\
                </div>\
            </div>\
            </div>  ',
    // 私有方法
    // _getNum:function(){
    //     return this.get('input').val().length || 0;
    // },
    // 覆盖实现setUp方法，所有逻辑写在这里，最后可以使用render来决定需不需要渲染模板
    // 模板渲染后会append到parentNode节点下面，如果未指定，会append到documen.body
    setUp:function(){
        var self = this;
        // var button = this.get('btn_do');
        // self.set('button',button);
        var box_id = this.get("box_id");
        var top_txt = this.get("top_txt");
        var main_txt = this.get("main_txt");
        var l_btn = this.get("l_btn");
        var r_btn = this.get("r_btn");
        // 赋值数据，渲染模板，选用。有的组件没有对应的模板就可以不调用这步
        self.render({
            box_id:box_id,
            top_txt:top_txt,
            main_txt:main_txt,
            l_btn:l_btn,
            r_btn:r_btn

        });

    }
})

$(function(){

    document.querySelector(".lay").addEventListener("click",function(){
        new TextCount({
            box_id: "myBox",
            top_txt: "我是头部文案",
            main_txt: "我是中间主文本文案",
            l_btn: "确定",
            r_btn: "取消",
            parentNodeEvent: "#myBox",
            parentNode: $(".doo"),
        })
    })
})


    
