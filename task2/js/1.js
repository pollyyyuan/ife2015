;(function(){
	var btn=document.getElementById('btn1'),
		info=document.getElementById('info');
	btn.onclick=function(){
		var str=document.getElementById('input1').value;
		str=polly.trimAll(str,'g');
		console.log(str);
		strArray=str.split(',');
		var option='';
		console.log(strArray.length);
		if(str)
		{
			polly.repeatArray(strArray);
			if(strArray.length>10){
			info.innerHTML='个数不能超过10个';
			}
			else{
				info.innerHTML='';
				for(var i=0;i<strArray.length;i++)
				{
					option+='<input type="checkbox" id="c'+i+'"><label for="c'+i+'">'+strArray[i]+'</label>'
;
				}
				var checkbox=document.getElementById('check-box');
				checkbox.innerHTML=option;
			}			
		}
		else{
			info.innerHTML='不能为空';
		}
	};
})()