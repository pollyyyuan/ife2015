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
				if(about.querySelector('[class="active"]')){	
					about.querySelector('[class="active"]').setAttribute('class','');	
				}
				this.setAttribute('class','active');
				input.value=this.innerHTML;
			}
		}
		if(index>-1){
			if(about.querySelector('[class="active"]')){	
				about.querySelector('[class="active"]').setAttribute('class','');	
			}			
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
		var key=e.keyCode;
		var inputValue=input.value;
		if(key==37||key==38||key==39||key==40){
			keyAbout(e);
		}
		else{		
			if(inputValue){
				lastIndex=0;
				about.style.display='block';
				for (num in data){
					if(num==inputValue)
					{
						dom(data[num]);
						break;
					}
				}
			}
			else{
				about.style.display='none';
			}
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
   		else if ((key==39||key==40)&&lastIndex<lis.length) {
        	lastIndex++;
        	console.log('lastIndex='+lastIndex);
        	activeDom(lastIndex-1);
    	}   		 
	}

	
})()