;(function(){
	// 模拟数据
	var data=[{
		folderName:'默认列表',
		tasks:[{
			tasksName:'task1',
			task:[]
		}]
	}]
	//初始化
	//localStorage.removeItem('mytask');
	// console.log(myStorage);
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
	// 对话框模块
	var Dialog=function(me,addBtn,dialog,okFn){
		var input=dialog.parentNode.querySelector('.add-input'),
			message=dialog.querySelector('message');
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
				okFn(me,input.value,message);
				dialog.style.display='none';
				input.value='';
			}
		});
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
					this.bindDom(this.myData[folder]);
				}
				this.classicDom.innerHTML=this.domStr;
				// 绑定事件
				this.bindEvent();
				//绑定任务列表
				this.bindTask(taskDom);
			},
			bindEvent:function(){
				var me=this;
				//folder
				var lis=me.classicDom.querySelectorAll('li');
				for(var li=0;li<lis.length;li++){
					var a=lis[li].querySelector('.h-classic a');
					a.addEventListener('mouseover',function(){
						var addTasksBtn=this.querySelector('.addTask-btn'),
							delBtn=this.querySelector('.del-btn');
						delBtn.style.display='block',
						addTasksBtn.style.display='block';
						addTasksBtn.addEventListener('click',function(){
							var TasksDialog=document.getElementById('addTasksBox');
							function tasksOkFn(me,input,message){
								for(var tasks in{	
									if(tasks==input)
									{
										message.value='该任务集已存在！';
										return;
									}
								}
								me.addTasks(input);
							}
							Dialog(a,this,TasksDialog,tasksOkFn);
						});
					});
					a.addEventListener('mouseout',function(){
						this.querySelector('.del-btn').style.display='none';
						this.querySelector('.addTask-btn').style.display='none';
					});
					
				}
				//绑定add按钮
				var ClassicDialog=document.getElementById('addClassicBox'),
					addBtn=document.getElementById('addClassicBtn');
				function classicOkFn(me,input,message){
					for(var folder in me.myData){	
						if(folder==input)
						{
							message.value='该分类名已存在！';
							return;
						}
					}
					me.addFolder(input);
				}
				Dialog(me,addBtn,ClassicDialog,classicOkFn);

			},
			addFolder:function(name){
				var li=document.createElement('li');
				var str='<h3 class="h-classic">';
				str+='<a href="#"><i class="icon-folder"></i>'+name+'(<i class="id-list">0</i>)';
				str+='<button class="addTask-btn"><i class="icon-add"></i></button>';		
				str+='<button class="del-btn"><i class="icon-del"></i></button>';		
				str+='</a></h3>';
				li.innerHTML=str;
				this.classicDom.appendChild(li);
				var data={
					folderName:name,
					tasks:[]
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
					this.domStr+='<a href="#"><i class="icon-folder"></i>'+data.folderName+'(<i class="id-list">0</i>)';
					this.domStr+='<button class="addTask-btn"><i class="icon-add"></i></button>';		
					this.domStr+='<button class="del-btn"><i class="icon-del"></i></button>';		
					this.domStr+='</a></h3>';
				}
				if(data.tasks){
					this.domStr+='<ul class="list">';
					for(var tasksName in data.tasks)
					{	
						var tasks=new Tasks();
						this.domStr+=tasks.bindDom(data.tasks[tasksName]);
					}
					this.domStr+='</ul>';
					this.domStr+='</li>';		
				}
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
	//任务集模块
	var Tasks=(function(){
		function Tasks(data){
			this.myData=data;
			// this.numAllTask=0;
			this.domStr='';
		}	
		Tasks.prototype={
			init:function(tasksDom){
				// 获取classicDom
				this.tasksDom=tasksDom;
				//绑定列表
				for(var tasksin this.myData)
				{	
					this.bindDom(this.myData[tasks]);
				}
				this.tasksDom.innerHTML=this.domStr;
				// 绑定事件
				this.bindEvent();
				// 绑定任务列表
				// this.bindTask(taskDom);
			},
			bindEvent:function(){
				var me=this;
				//tasks
				var lis=me.classicDom.querySelectorAll('li');
				for(var li=0;li<lis.length;li++){
					var a=lis[li].querySelector('.h-classic a');
					a.addEventListener('mouseover',function(){
						var addTasksBtn=this.querySelector('.addTask-btn'),
							delBtn=this.querySelector('.del-btn');
						delBtn.style.display='block',
						addTasksBtn.style.display='block';
						addTasksBtn.addEventListener('click',function(){
							var TasksDialog=document.getElementById('addTasksBox');
							function tasksOkFn(me,input,message){
								for(var tasks in{	
									if(tasks==input)
									{
										message.value='该任务集已存在！';
										return;
									}
								}
								me.addTasks(input);
							}
							Dialog(a,this,TasksDialog,tasksOkFn);
						});
					});
					a.addEventListener('mouseout',function(){
						this.querySelector('.del-btn').style.display='none';
						this.querySelector('.addTask-btn').style.display='none';
					});
					
				}
				//绑定add按钮
				var ClassicDialog=document.getElementById('addClassicBox'),
					addBtn=document.getElementById('addClassicBtn');
				function classicOkFn(me,input,message){
					for(var folder in me.myData){	
						if(folder==input)
						{
							message.value='该分类名已存在！';
							return;
						}
					}
					me.addFolder(input);
				}
				Dialog(me,addBtn,ClassicDialog,classicOkFn);

			},
			addTasks:function(name){
				var li=document.createElement('li');
				li.setAttribute('class','active');
				var str='<a href="#"><i class="icon-file"></i>'+name+'(<i>0</i>)';
				str+='<button class="del-btn"><i class="icon-del"</i></button>';
				str+='</a></li>';
				li.innerHTML=str;
				this.classicDom.querySelector('.list').appendChild(li);
				var data={
					tasksName:name,
					task:[]
				};
				this.myData.push(data);
				Data.updateStorage(this.myData);
			},
			addTasks:function(name){
				var li=document.createElement('li');
				li.setAttribute('class','active');
				var str='<a href="#"><i class="icon-file"></i>'+name+'(<i>0</i>)';
				str+='<button class="del-btn"><i class="icon-del"</i></button>';
				str+='</a></li>';
				li.innerHTML=str;
				this.classicDom.querySelector('.list').appendChild(li);
				var data={
					tasksName:name,
					task:[]
				};
				this.myData.push(data);
				Data.updateStorage(this.myData);
			},
			bindDom:function(data){
				var domStr='';
				domStr+='<li>';
				domStr+='<a href="#"><i class="icon-file"></i>'+task+'(<i>0</i>)';
				domStr+='<button class="del-btn"><i class="icon-del"></i></button>';
				domStr+='</a></li>';
				return domStr;
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