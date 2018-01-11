var video = document.getElementById("video");
var vLength;
var pgFlag = "";
var pro = {},isMax = false;
// 检测浏览器是否HTML5 video视频播放
if (video.canPlayType) {
	window.onload = function(){
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
	// 视频加载一部分，可以播放
	video.addEventListener("canplay",function(){
		document.getElementById("buttonbar").style.display =  "block";
	});
	// 加载视频元数据
	video.addEventListener("loadedmetadata",function(){
		vLenght = video.duration.toFixed(1);
		document.getElementById('vLen').textContent = vLenght;
	},false);
	// 视频当前播放处于的位置
	video.addEventListener("timeupdate",function(){
		var vTime = video.currentTime;
		document.getElementById("curTime").textContent = vTime;
		document.getElementById("vRemaining").textContent = (vLenght - vTime).toFixed(1);
	},false);
	//  Play
    document.getElementById("play").addEventListener("click", vidplay, false);

	// 使用 onpause 和 onplaying 事件保持按钮同步
	video.addEventListener("pause",function(){
		document.getElementById("play").textContent = ">";
	},false);

	video.addEventListener("playing",function(){
		document.getElementById("play").textContent = "||";
	},false);

	// 音量控制
	video.addEventListener("volumechange",function(){
		// 静音时
		if (video.muted) {
			document.getElementById("mute").innerHTML = "<img alt='volume off button' src='mute2.png' />";
		}else{
			document.getElementById("mute").innerHTML = "<img alt='volume on button' src='vol2.png' />";
		}
	},false);
	// 全屏
	document.getElementById("allView").addEventListener("click",function(){
		

	},false)


}else{
	alert("您的浏览器暂不支持该视频播放！");

}

function getVideo(){
	var fileURL = document.getElementById("videoFile").value;
	if (fileURL !== "") {
		video.src = fileURL;
		video.load();
		document.getElementById("play").click();
	}
}

// 控制视频播放
function vidplay(evt){
	var button = evt.target;
	// 暂停情况下播放
	if (video.paused) {
		video.play();
		button.textContent = "||";
	}else{
		video.pause();
		button.textContent = ">";
	}
}





