;(function(){
	// 模拟数据
	var dataa=[{
		folderName:'默认列表',
		tasks:[{
			tasksName:'task1',
			task:[]
		}]
	}];
	//初始化
	//localStorage.removeItem('mytask');
	 console.log(localStorage.mytask);
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
	var Dialog=function(addBtn,dialog){
		var input=dialog.parentNode.querySelector('.add-input');
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

	};
	// 分类模块
	var Classic=(function(){
		function Classic(data){//Datas[]
			this.myData=data;
			this.numAllTask=0;
		}
		Classic.prototype={
			init:function(classicDom,taskDom){
				// 获取classicDom
				this.classicDom=classicDom;
				//绑定个数
				// this.bindNumAllTask();
				//绑定列表s
				this.bindDom();
		
				// 绑定事件
				 this.bindEvent();
				//绑定Taskss
				this.tasks=new Tasks();
			},
			//绑定单个列表
			bindDom:function(){
				var str='';
				for(var i=0;i<this.myData.length;i++)
				{	
					var folderData=this.myData[i];
					str+='<li>';
					if(folderData.folderName){				
						str+='<h3 class="h-classic">';
						str+='<a href="#"><i class="icon-folder"></i><span>'+folderData.folderName+'</span>(<i class="id-list">0</i>)';
						str+='<button class="addTask-btn"><i class="icon-add"></i></button>';		
						str+='<button class="del-btn"><i class="icon-del"></i></button>';		
						str+='</a></h3>';
					}
					if(folderData.tasks){	
						str+='<ul class="list">';
						for(var j=0;j<folderData.tasks.length;j++)
						{	
							var tasksData=folderData.tasks[j];
							if(tasksData.tasksName){
								str+='<li>';
								str+='<a href="#"><i class="icon-file"></i><span>'+tasksData.tasksName+'</span>(<i>0</i>)';
								str+='<button class="del-btn"><i class="icon-del"></i></button>';
								str+='</a></li>';
							}
						}
						str+='</ul>';	
					}
					str+='</li>';
				}
				this.classicDom.innerHTML=str;		
			},
			bindEvent:function(){
				var me=this;
				//folder
				var lis=me.classicDom.querySelectorAll('li');
				for(var li=0;li<lis.length;li++){
					var a=lis[li].querySelector('.h-classic a'),//获得标题
						list=lis[li].querySelector('.list'),
						tasksDom=lis[li].querySelectorAll('.list li');//获得task
						console.log(a);
					a.addEventListener('mouseover',function(){
						var two=this;
						var addTasksBtn=this.querySelector('.addTask-btn'),
							delBtn=this.querySelector('.del-btn');
						delBtn.style.display='block',
						addTasksBtn.style.display='block';
						//dialog
						var TasksDialog=document.getElementById('addTasksBox');
						Dialog(addTasksBtn,TasksDialog);
						TasksDialog.querySelector('.ok-btn').addEventListener('click',function(){
							var input=TasksDialog.querySelector('input'),
								message=TasksDialog.querySelector('message');
							if(input.value){
								for(var t=0;t<tasksDom.length;t++){	
									if(tasksDom[t].value==input.value)
									{
										message.value='该任务集已存在！';
										return;
									}
								}
								me.tasks.addDom(input.value,list,two.querySelector('span').innerHTML);
								TasksDialog.style.display='none';
								input.value='';
							}
						});			
					});
					a.addEventListener('mouseout',function(){
						this.querySelector('.del-btn').style.display='none';
						this.querySelector('.addTask-btn').style.display='none';
					});
				}
				//addDialog
				var addDialog=document.getElementById('addClassicBox'),
					addClassicBtn=document.getElementById('addClassicBtn'),
					addinput=addDialog.querySelector('.input');
				Dialog(addClassicBtn,addDialog);
				addDialog.querySelector('.ok-btn').addEventListener('click',function(){
					for(var dt=0;dt<me.myData.length;dt++){
						if(my.myData[dt].folderName==input.value){
							input.value='';
							return;
						}
					}
					this.addFolder(input.value);
				});
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
		function Tasks(){//tasks[]
			//this.myData=data;
			// this.numAllTask=0;
		}	
		Tasks.prototype={
			init:function(tasksDom){
				this.tasksDom=tasksDom;
				// 绑定事件
				this.bindEvent();
				// 绑定任务列表
				// this.bindTask(taskDom);
			},
			addDom:function(data,listDom,spanStr){
				var li=document.createElement('li');
				var str='<a href="#"><i class="icon-file"></i>'+data+'(<i>0</i>)';
				str+='<button class="del-btn"><i class="icon-del"></i></button>';
				str+='</a></li>';
				li.innerHTML=str;
				listDom.appendChild(li);
				var tasks={
					tasksName:data,
					task:[]
				},
				myData=Data.getData();
				console.log(myData.length);
				for(var i=0;i<myData.length;i++){
					console.log('spanstr'+spanStr);
					console.log('folderName'+myData[i].folderName);
					if(myData[i].folderName==spanStr)
					{
						myData[i].tasks.push(tasks);
						console.log(myData[i].tasks);
						Data.updateStorage(myData);
					}
				}
				this.init(listDom);
			},
			bindEvent:function(){
				var me=this;
				//tasks
				var lis=me.tasksDom.querySelectorAll('li');
				console.log(lis);
				for(var li=0;li<lis.length;li++){
					lis[li].addEventListener('mouseover',function(){
						var delBtn=this.querySelector('.del-btn');
						delBtn.style.display='block';
					});
					lis[li].addEventListener('mouseout',function(){
						this.querySelector('.del-btn').style.display='none';
					});	
				}
			}
			// addTasks:function(name){
			// 	var li=document.createElement('li');
			// 	li.setAttribute('class','active');
			// 	var str='<a href="#"><i class="icon-file"></i>'+name+'(<i>0</i>)';
			// 	str+='<button class="del-btn"><i class="icon-del"</i></button>';
			// 	str+='</a></li>';
			// 	li.innerHTML=str;
			// 	this.classicDom.querySelector('.list').appendChild(li);
			// 	var data={
			// 		tasksName:name,
			// 		task:[]
			// 	};
			// 	this.myData.push(data);
			// 	Data.updateStorage(this.myData);
			// },
			// addTasks:function(name){
			// 	var li=document.createElement('li');
			// 	li.setAttribute('class','active');
			// 	var str='<a href="#"><i class="icon-file"></i>'+name+'(<i>0</i>)';
			// 	str+='<button class="del-btn"><i class="icon-del"</i></button>';
			// 	str+='</a></li>';
			// 	li.innerHTML=str;
			// 	this.classicDom.querySelector('.list').appendChild(li);
			// 	var data={
			// 		tasksName:name,
			// 		task:[]
			// 	};
			// 	this.myData.push(data);
			// 	Data.updateStorage(this.myData);
			// },
			
			//,bindTask:function(taskDom){
			// 	if(this.myData[0].tasks){
			// 		this.task=new Task(this.myData[0].tasks[0]);
			// 		this.task.init(taskDom);
			// 	}
			// }
		}
		return Tasks;
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