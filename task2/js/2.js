// new Date(dateStr); 把字符串转为Date对象，其中dateStr格式有两种:

// 1) yyyy/MM/dd HH:mm:ss （推荐）：若省略时间，返回的Date对象的时间为 00:00:00。

// 2) yyyy-MM-dd HH:mm:ss ：若省略时间，返回的Date对象的时间为 08:00:00(加上本地时区)。
;(function(){
	var btn=document.getElementById('btn');
	btn.onclick=function(){	
	var dateStr=document.getElementById('input1').value,
		show=document.getElementById('show-box'),
		userArray=dateStr.split('-'),
		userDate=new Date(dateStr),
		currentDate;
	var timer=setInterval(function(){
		currentDate=new Date();	
		bet=(userDate-currentDate)/1000;//化为秒数
		if(parseInt(bet)==0){
			show.innerHTML='已到达';
			clearInterval(timer);
		}
		else{	
		var	betDay=parseInt(bet/24/3600),
			betHour=parseInt((bet-betDay*24*3600)/3600),
			betMin=parseInt((bet-betDay*24*3600-betHour*3600)/60),
			betsec=parseInt(bet-betDay*24*3600-betHour*3600-betMin*60);
			show.innerHTML='距离'+userArray[0]+'年'+userArray[1]+'月'+userArray[2]+'日'+'还有'+betDay+'天'+betHour
			+'小时'+betMin+'分'+betsec+'秒';
			}
		},1000);
	}
})()