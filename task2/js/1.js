;(function(){
	var btn=document.getElementById('btn1');
	btn.onclick=function(){
		var str=document.getElementById('input1').value;
		// str=polly.trimAll(str,'g');
		console.log(str);
		// function fenge(s){
		// 	var character=[" ","\n",",","，","、",";"];
		// 	var str=s,
		// 		array=[];
		// 	while(str){
		// 		for(var j=0;j<character.length;j++)
		// 		{
		// 			var index=str.indexOf(character[j]);
		// 			if(index>-1)
		// 			{
		// 				array.push(str.substring(0,index));
		// 				str=str.substring(index);
		// 				break; 
		// 			}
		// 		}

		// 	}
		// 	array.push(str);

		// }
		// var strArray= fenge(str);
		strArray=str.split(',');
		var option='';
		console.log(strArray.length);
		if(strArray.length)
		{
			polly.repeatArray(strArray);
			for(var i=0;i<strArray.length;i++)
			{
				option+='<option>'+strArray[i]+'</option>';
			}
			var select=document.getElementById('select1');
			select.innerHTML=option;
		}
	};
})()