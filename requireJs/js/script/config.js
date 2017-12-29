
define(function(){
	require.config({
		baseUrl:'./js/',
		paths:{
			'jquery':'lib/jquery-1.11.3.min',
			hello:'script/hello'
		},
		// 非AMD模板输出
		shim:{
			// hello:{exports:'hello'}
			hello:{
				init:function(){
					return {
						hello:hello,
						bye:bye
					}
				}
				
			}
		}
	});
})