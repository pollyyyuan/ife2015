;(function(){
	//初始化
	//console.log(myStorage);
	var Main=(function(){
		function Main(dom1,dom2,dom3){
			this.defaults=[
				{
					folderName:"默认分类",
					tasks:[]
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
					console.log(localStorage.mytask);
				}
				//绑定dom
				this.bindDoms();
			},
			bindDoms:function(){
				//绑定分类
				this.classic=new Classic(this.myData);
				this.classic.init(this.classicDom,this.taskDom,this.infoDom);
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
	// 分类模块
	var Classic=(function(){
		function Classic(data){
			this.myData=data;
			this.numAllTask=0;
			this.domStr='';
		}
		Classic.prototype={
			init:function(classicDom,taskDom){
				// 获取classicDom
				this.classicDom=classicDom;
				//绑定个数
				this.bindNumAllTask();
				//绑定列表
				for(var folder in this.myData)
				{	
					console.log(this.myData.length);
					this.bindDom(this.myData[folder]);
				}
				console.log(this.domStr);
				this.classicDom.innerHTML=this.domStr;
				//绑定任务列表
				this.bindTask(taskDom);
				this.bindEvent();
			},
			bindEvent:function(){
				var me=this;
				//绑定add按钮
				me.addDialog();
				//folder的hover
				var lis=me.classicDom.querySelector('li');
				for(var li=0;li<lis.length;li++){
					li.addEventListener('mouseover',function(){
						this.querySelector('.del-btn').style.display='block';
					});
					li.addEventListener('mouseout',function(){
						this.querySelector('.del-btn').style.display='block';
					});
				}

			},
			//添加对话框操作
			addDialog:function(){
				var me=this,
					dialog=document.getElementById('addClassicBox'),
					addBtn=document.getElementById('addClassicBtn'),
					input=dialog.parentNode.querySelector('.add-input'),
					message=dialog.querySelector('message');
				var AddDialog={
					init:function(){},
					bindEvent:function(){
						addBtn.addEventListener('click',function(){
							dialog.style.display='block';
							input.focus();
						});
						dialog.querySelector('.del-btn').addEventListener('click',function(){
							dialog.style.display='none';
							input.value='';
						});
						dialog.querySelector('.cancel-btn').addEventListener('click',function(){
							dialog.style.display='none';
							input.value='';
						});
						dialog.querySelector('.ok-btn').addEventListener('click',function(){
							if(input.value){
								for(var folder in me.myData)
								{	
									if(folder==input.value)
									{
										message.value='该分类名已存在！';
										return;
									}
								}
								me.addFolder(input.value);
								dialog.style.display='none';
								input.value='';
							}
						});

					}

				};
				AddDialog.bindEvent();
			},
			addFolder:function(name){
				var li=document.createElement('li');
				var str='<h3 class="h-classic">';
				str+='<a href="#"><i class="icon-folder"></i>'+name+'(<i class="id-list">0</i>)</a>';
				str+='<a href="#" class="del-btn"><i class="icon-del"></i></a>';		
				str+='</h3>';
				li.innerHTML=str;
				this.classicDom.appendChild(li);
				var data={
					folderName:name,
					tasks:{}
				};
				this.myData.push(data);
				Data.updateStorage(this.myData);
			},
			bindNumAllTask:function(){
				var dom=document.getElementById('num-allTask');
				dom.innerHTML=this.numAllTask;
			},
			bindDom:function(data){
				this.domStr+='<li>';
				if(data.folderName){				
					this.domStr+='<h3 class="h-classic">';
					this.domStr+='<a href="#"><i class="icon-folder"></i>'+data.folderName+'(<i class="id-list">0</i>)</a>';
					this.domStr+='<a href="#" class="del-btn"><i class="icon-del"></i></a>';		
					this.domStr+='</h3>';
				}
				if(data.tasks){
					this.domStr+='<ul class="list">';
					for(var task in data.tasks){
						this.domStr+='<li class="active">';
						this.domStr+='<a href="#"><i class="icon-file"></i>'+task+'(<i></i>)</a>';
						this.domStr+='<a href="#" class="del-btn"><i class="icon-del"></i></a>';
						this.domStr+='</li>';
					} 
					this.domStr+='</ul>';
				}		
				this.domStr+='</li>';
			},
			bindTask:function(taskDom){
				if(this.myData[0].tasks){
					this.task=new Task(this.myData[0].tasks[0]);
					this.task.init(taskDom);
				}
			}
		}
		return Classic;
	})();
	//任务模块
	var Task=(function(){
		function Task(){}
		Task.prototype={
			init:function(){},
			bindDom:function(){

			}
		}
		return Task;
	})();
	//详细信息模块
	var Info=(function(){
		function Info(){}
		Info.prototype={}
		return Info;
	})();
	//使用
	var classicDom=document.getElementById('classicDom');
	var taskDom=document.getElementById('taskDom');
	var infoDom=document.getElementById('infoDom');
	var main=new Main(classicDom,taskDom,infoDom);
	main.init();
})()