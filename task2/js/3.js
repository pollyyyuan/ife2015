;(function(){
	var data={
		"y":["yu","yuan","ye"],
		"yu":["yun","yuan"],
		"yua":["yuan"],
		"ye":["ye"]
	};
	var input=document.getElementById('input1'),
		about=document.getElementById('about');
	var num,
		lastIndex=0,
		lis;
	function dom(array){
		lis=about.getElementsByTagName('li');
		var str='';
		for(var i=0;i<array.length;i++){
			str+='<li>'+array[i]+'</li>';
		}
		about.innerHTML=str;
		activeDom();
	}
	function activeDom(index){
		console.log(lis);
		// lis[0].setAttribute('class','active');
		var li;
		for(li in lis)
		{	
			lis[li].onclick=function(){
				about.querySelector('[class="active"]').setAttribute('class','');	
				this.setAttribute('class','active');
				input.value=this.innerHTML;
			}
		}
		if(index>-1){
			lis[index].setAttribute('class','active');
			input.value=lis[index].innerHTML;
		}
	}
	input.onfocus=function(){
		var inputValue=input.value;
		if(inputValue){
			about.style.display='block';
		}
		else{
			about.style.display='none';
		}
		for (num in data){
			if(num==inputValue)
			{
				dom(data[num]);
				break;
			}
		}
	}
	input.onkeyup=function(e){
		var inputValue=input.value;
		if(inputValue){
			about.style.display='block';
			lastIndex=0;
			for (num in data){
				if(num==inputValue)
				{
					dom(data[num]);
					break;
				}
			}
			keyAbout(e);
		}
		else{
			about.style.display='none';
		}
		

	}
	input.parentNode.onblur=function(){
		about.style.display='none';
	}
	function keyAbout(e){
		var key=e.keyCode;
    	if ((key==37||key==38)&&lastIndex>0) {
        	lastIndex--;
        	activeDom(lastIndex-1);
   		} 
   		else if ((key==39||key==40)&&lastIndex<lis.length-1) {
        	lastIndex++;
        	activeDom(lastIndex-1);
    	}   		 
	}

	
})()