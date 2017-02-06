;(function(){
	var box=document.getElementById('box'),
		boxWidth=box.offsetWidth,
		boxHeight=box.offsetHeight;
	var leftBox=document.getElementById('leftBox'),
		leftLis=leftBox.children,
		leftLeft=leftBox.offsetLeft,
		rightBox=document.getElementById('rightBox'),
		rightLis=rightBox.children,
		rightLeft=rightBox.offsetLeft,
		allTop=leftBox.offsetTop,
		allWidth=leftBox.offsetWidth,
		allHeight=leftBox.offsetHeight;
	var moveLi=null;
	for(var i=0;i<leftLis.length;i++)
	{
		leftLis[i].addEventListener('mousedown',move);	
	}
	for(var j=0;j<rightLis.length;j++)
	{
		rightLis[j].addEventListener('mousedown',move);	
	}
	function move(e){
		var that=this,
			index=0;
		var left=this.parentNode.offsetLeft;
		if(left==leftLeft){
			leftBox.setAttribute('class','box left box-hover');
		}
		else{
			rightBox.setAttribute('class','box right box-hover');
		}
		var	cx=e.clientX-left,
			cy=e.clientY-allTop-this.offsetTop;
		this.setAttribute('class','li-hover');
		moveLi=this.cloneNode(true);//连着内容拷贝
		moveLi.setAttribute('class','move');
		moveLi.style.left=left+'px';
		moveLi.style.top=(allTop+this.offsetTop+1)+'px';
		box.appendChild(moveLi);
		moveLi.addEventListener('mousemove',function(e){
			var x=e.clientX-cx,
				y=e.clientY-cy;
			if(x<0)
			{
				x=0;
			}
			else if(x>boxWidth-this.offsetWidth)
			{
				x=boxWidth-this.offsetWidth;
			}
			if(y<0)
			{
				y=0;
			}
			else if(y>boxHeight-this.offsetHeight)
			{
				x=boxHeight-this.offsetHeight;
			}
			if(y>allTop&&y<allHeight+allTop){
				//左区域
				if(x>leftLeft&&x<leftLeft+allWidth){
					leftBox.setAttribute('class','box left box-hover');
					rightBox.setAttribute('class','box right');
					index=parseInt((y-allTop)/30);
					clearHover();
					if(x>leftLeft&&x<leftLeft+allWidth){
						leftLis[index].setAttribute('class','li-hover');
					}
					else if(x>rightLeft&&x<rightLeft+allWidth){
						rightLis[index].setAttribute('class','li-hover');
					}	
				}
				else if(x>rightLeft&&x<rightLeft+allWidth){
					leftBox.setAttribute('class','box left');
					rightBox.setAttribute('class','box right box-hover');
					index=parseInt((y-allTop)/30);
					clearHover();
					if(x>leftLeft&&x<leftLeft+allWidth){
						leftLis[index].setAttribute('class','li-hover');
					}
					else if(x>rightLeft&&x<rightLeft+allWidth){
						rightLis[index].setAttribute('class','li-hover');
					}						
				}
			}
			moveLi.style.left=x+'px';
			moveLi.style.top=y+'px';
		});	
		moveLi.addEventListener('click',function(e){
			var x=e.clientX-cx,
				y=e.clientY-cy;
			var result=that.parentNode.removeChild(that);
			if(x>leftLeft&&x<leftLeft+allWidth){
				leftLis[index].setAttribute('class','');
				leftBox.insertBefore(result,leftLis[index]);
				leftLis[index].setAttribute('class','li-hover');
			}
			else if(x>rightLeft&&x<rightLeft+allWidth){
				rightLis[index].setAttribute('class','');
				rightBox.insertBefore(result,rightLis[index]);	
				rightLis[index].setAttribute('class','li-hover');
			}
			box.removeChild(moveLi);
			// this.style.display='none';
		});
	}
	function clearHover(){
		for(var kk=0;kk<rightLis.length;kk++){
			rightLis[kk].setAttribute('class','');
		}
		for(var tt=0;tt<leftLis.length;tt++){
			leftLis[tt].setAttribute('class','');
		}
	}
})()