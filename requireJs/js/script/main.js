
// 加载模块
require(['config'],function(){
	require(['jquery','hello'],function($,hello){
		$(document).on("click",'#contentBtn',function(){
			$("#messagebox").html("you have access jquery by using require()");
			require(['script/desc'],function(alertDesc){
				alertDesc();
			});
		});
		hello.hello();
		hello.bye();
	})
})
