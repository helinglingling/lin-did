// 可以把开始和进度条的样式放到js来写
var pro = {},isMax = false;
window.onload = function(){
	// video的事件绑定
	// video.addEventListener("play",myPlay,false);
	// video.addEventListener("pause",myPause,false);
	// mini状态时的数据
	 //在onload状态下，offsetHeight才会获取到正确的值 ****
	pro.miniInfo = {
		width:video.offsetWidth + "px",
		height:video.offsetHeight + "px",
		position: vRoom.style.position,
		transform: "translate(0,0) rotate(0)"
	};

	var info = [
		document.documentElement.offsetWidth || document.body.offsetWidth,
		document.documentElement.offsetHeight || document.body.offsetHeight 
		],
		w = info[0],
		h = info[1],
		cha = Math.abs(h-w)/2;

	pro.maxInfo = {
		width: h + "px",
		height: w + "px",
		position:"fixed",
		transform:"translate(-" + cha + "px," + cha + "px) rotate(90deg)"
	}

}
//全屏 mini 两种模式切换
pro.switch = function() {
    var vR = this.vRoom;
    //获取需要转换的样式信息
    var info = this.isMax ? this.miniInfo : this.maxInfo;
    for(var i in info) {
        vR.style[i] = info[i];
    }
    this.isMax = !this.isMax;
}

var isFull = document.querySelectorAll(".isFull")[0];
isFull.addEventListener("touchend",function(){
    //获取需要转换的样式信息
    var info = isMax ? pro.miniInfo : pro.maxInfo;
	console.log("full",info);
    for(var i in info) {
        vRoom.style[i] = info[i];
    }
    isMax = !isMax;
});




var video = document.getElementsByTagName("video")[0];
var vRoom = video.parentNode;
// 遮罩层的开始按钮点击视频播放
var startStop = document.querySelectorAll(".start-stop")[0];

startStop.addEventListener("touchend",function(){
	this.style.display = "none";
	myPlay();
});

video.addEventListener("touchend",function(){
	// console.log("ended",this.ended);
	if (this.ended)	this.currentTime = 0;
	 return video.paused ? myPlay() : myPause();

});
// 获取到元数据
var allTime, currentTime;
var allTimeSpan = document.querySelectorAll(".allTime")[0];
video.addEventListener("loadedmetadata",function(){
	// 视频的全部时间
	allTime = video.duration;
	allTimeSpan.innerHTML = do_time(allTime);
});
// 视频播放中事件
video.addEventListener("timeupdate",function(){
	if (this.ended){
		startStop.style.display = "block";
		statue.setAttribute("class","statue");
		this.currentTime = 0;
	} 
	currentTime = video.currentTime;
	var pecent;
	// 更新进度条
	pecent = parseInt(currentTime/allTime*100);
	timingSpan.innerHTML = do_time(currentTime);
	// 修改进度条宽度
	processD.style.width = pecent + "%";
	
});

//视频手势右滑动事件
this.video.addEventListener('swiperight',function(e){
    this.currentTime += 5;
});
//视频手势左滑动事件
this.video.addEventListener('swipeleft',function(e){
    this.currentTime -= 5;
});

// 进度条拖动改变视频进度

// 全屏播放

// 时间进度显示
var statue = document.querySelectorAll(".statue")[0];
var timingSpan = document.querySelectorAll(".timing")[0];
var processD = document.querySelectorAll(".processing .current")[0];



function myPlay(){	
	video.play();
	var classValue = statue.getAttribute("class");
	classValue = classValue + " hide";
	setTimeout(function(){
		statue.setAttribute("class",classValue);
	},800);
}

function myPause(){
	video.pause();
	startStop.style.display = "block";
	var classValue = statue.getAttribute("class");
	console.log(classValue);
	classValue = classValue.slice(0,6);
	statue.setAttribute("class",classValue);
}
// 处理时间，视频的秒数处理成 小时/分钟/秒 显示
function do_time(times){
	var hour = Math.floor(times/(60*60)),
		min = Math.floor(times/60),
		second = parseInt(times % 60);
	var hourString = hour <= 0 ? "" : hour,
		minString = min < 10 ? "0"+min : min,
		secondString = second < 10 ? "0"+second : second;
	return hourString == "" ? minString + ":" + secondString : hourString + ":" + minString +":"+secondString;
}

