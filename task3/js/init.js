	//初始化
	//localStorage.removeItem('mytask');
	console.log(localStorage.mytask);
	var Main=(function(){
		function Main(dom1,dom2,dom3){
			this.defaults=[
				{
					folderName:"默认分类",
					tasks:[{
						tasksName:'task1',
						task:[]
					}]
				}
			];
			this.classicDom=dom1;
			this.taskDom=dom2;
			this.infoDom=dom3;
		}
		Main.prototype={
			init:function(){
				if(!localStorage.mytask)
				{
					this.myData=this.defaults;
					Data.updateStorage(this.myData);
				}
				else{
					this.myData=Data.getData();
				}
				//绑定dom
				this.bindDoms();
				//绑定关闭按钮
				this.bindDelBtn();
			},
			bindDoms:function(){
				//绑定分类
				this.classic=new Classic(this.classicDom,this.taskDom,this.infoDom);
				this.classic.init(this.myData);
			},
			bindDelBtn:function(){
				var delBtns=document.querySelectorAll('a.del-btn'),
					cancelBtns=document.querySelectorAll('.cancel-btn');
				for(var d=0;d<delBtns.length;d++){
					delBtns[d].addEventListener('click',function(){
						this.parentNode.style.display='none';
						if(this.parentNode.querySelector('.add-input')){	
							this.parentNode.querySelector('.add-input').value='';
						}
					});
				}
				for(var c=0;c<cancelBtns.length;c++){
					cancelBtns[c].addEventListener('click',function(){
						this.parentNode.parentNode.style.display='none';
						if(this.parentNode.querySelector('.add-input')){	
							this.parentNode.querySelector('.add-input').value='';
						}
					});
				}
			}
		}
		return Main;
	})();
	// 处理数据
	var Data={
		updateStorage:function(data){
			localStorage.mytask=JSON.stringify(data);
		},
		getData:function(){
			return JSON.parse(localStorage.mytask);
		}
	};
	// 对话框模块
	var Dialog=function(scope,dialog){
		var del=scope.querySelector('a.active'),
			input=dialog.querySelector('.add-input');
		if(del){
			del.removeAttribute('class');
		}
		this.parentNode.setAttribute('class','active');
		dialog.style.display='block';
		if(input){
			input.focus();
		}
	};