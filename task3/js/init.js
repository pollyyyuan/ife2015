;(function(){
	// 模拟数据
	// var dataa=[{
	// 	folderName:'默认列表',
	// 	tasks:[{
	// 		tasksName:'task1',
	// 		task:[{
	// 			time:'2017-7-10',
	// 			toDo:[{
	// 				taskName:'to do1',
	// 				content:'完成编码'
	// 			}]
	// 		}]
	// 	}]
	// }];

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
				//绑定关闭按钮
				this.bindDelBtn();
			},
			bindDoms:function(){
				//绑定分类
				this.classic=new Classic(this.myData);
				this.classic.init(this.classicDom,this.taskDom,this.infoDom);
			},
			bindDelBtn:function(){
				var delBtns=document.querySelectorAll('a.del-btn'),
					cancelBtns=document.querySelectorAll('.cancel-btn');
					console.log(delBtns);
				for(var d=0;d<delBtns.length;d++){
					delBtns[d].addEventListener('click',function(){
						this.parentNode.style.display='none';
						this.parentNode.querySelector('.add-input').value='';
					});
				}
				for(var c=0;c<cancelBtns.length;c++){
					cancelBtns[c].addEventListener('click',function(){
						this.parentNode.parentNode.style.display='none';
						this.parentNode.querySelector('.add-input').value='';
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
				//获取tasksDialog
				this.tasksDialog=document.getElementById('addTasksBox');
				this.addDialog=document.getElementById('addClassicBox');
				//绑定Taskss
				this.tasks=new Tasks(classicDom,taskDom);
				//绑定个数
				// this.bindNumAllTask();
				//绑定列表s
				this.bindDom();
				// 绑定事件
				this.bindEvent();
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
				var lis=me.classicDom.children;
				for(var li=0;li<lis.length;li++){
					var a=lis[li].querySelector('.h-classic a'),//获得标题
						list=lis[li].querySelectorAll('.lists li a');//tasks
					a.addEventListener('mouseover',function(){
						var addTasksBtn=this.querySelector('.addTask-btn'),
							delBtn=this.querySelector('.del-btn');
						delBtn.style.display='block',
						addTasksBtn.style.display='block';
						addTasksBtn.addEventListener('click',function(){
							console.log(me.tasksDialog)
							Dialog.call(this,me.classicDom,me.tasksDialog);
						});	
						delBtn.addEventListener('click',function(){
							var d=this;
							var delBox=document.getElementById('delBox');
							Dialog.call(this,me.classicDom,delBox);
							delBox.style.display='block';
							delBox.querySelector('.ok-btn').addEventListener('click',function(){
								me.delDom(d.parentNode);
								delBox.style.display='none';
							});
						});
					});
					a.addEventListener('mouseout',function(){
						this.querySelector('.del-btn').style.display='none';
						this.querySelector('.addTask-btn').style.display='none';
					});
					//绑定tasks
					me.tasks.bindEvent(list,a);
				}
				//dialog
				this.bindTasksDialogEvent();
				this.bindAddDialogEvent();			
			},
			delDom:function(li){
				var me=this;
				var spanStr=li.querySelector('span').innerHTML;
					console.log(spanStr);
				myData=Data.getData();
				for(var i=0;i<myData.length;i++){
					if(myData[i].folderName==spanStr)
					{
						myData.splice(i,1);
						console.log(me.classicDom);
						console.log(li.parentNode);
						me.classicDom.removeChild(li.parentNode.parentNode);
						break;
					}
				}
				Data.updateStorage(myData);	
			},
			addFolder:function(name){
				var li=document.createElement('li');
				var str='<h3 class="h-classic">';
				str+='<a href="#"><i class="icon-folder"></i><span>'+name+'</span>(<i class="id-list">0</i>)';
				str+='<button class="addTask-btn"><i class="icon-add"></i></button>';		
				str+='<button class="del-btn"><i class="icon-del"></i></button>';		
				str+='</a></h3><ul class="list"></ul>';
				li.innerHTML=str;
				this.classicDom.appendChild(li);
				var data={
					folderName:name,
					tasks:[]
				};
				this.myData.push(data);
				Data.updateStorage(this.myData);
				this.bindAddDialogEvent();
			},
			//addDialog
			bindAddDialogEvent:function(){
				var me=this;
				var addClassicBtn=document.getElementById('addClassicBtn');
				addClassicBtn.addEventListener('click',function(){
					me.addDialog.style.display='block';
					me.addDialog.querySelector('.add-input').focus();
				});
				me.addDialog.querySelector('.ok-btn').addEventListener('click',function(){
					var as=me.classicDom.querySelectorAll('.h-classic a span');
					var addinput=me.addDialog.querySelector('.add-input'),
						message=me.addDialog.querySelector('.message');
					if(addinput.value){
						if(as){	
							for(var a=0;a<as.length;a++){
								if(as[a].value==addinput.value){
									addinput.value='';
									message.value='该类别已存在';
									return;
								}
							}
						}
						me.addFolder(addinput.value);
						me.addDialog.style.display='none';
						addinput.value='';
					}
					else{
						message.innerHTML='空!';
					}
				});
			},
			//tasksDialog
			bindTasksDialogEvent:function(){
				var me=this;
				me.tasksDialog.querySelector('.ok-btn').addEventListener('click',function(){
					var a=me.classicDom.querySelector('.h-classic a.active'),//获得task
						list=a.parentNode.nextSibling,//获得task
						tasksDom=list.querySelectorAll('li span');//获得task
					var input=me.tasksDialog.querySelector('.add-input'),
						message=me.tasksDialog.querySelector('.message');
					if(input.value){
						if(tasksDom){	
							for(var t=0;t<tasksDom.length;t++){	
								if(tasksDom[t].innerHTML==input.value)
								{
									message.innerHTML='该任务集已存在！';
									input.value='';
									input.focus();
									break;
								}
							}
						}
						if(t==tasksDom.length){	
						me.tasks.addDom(input.value,list,a.querySelector('span').innerHTML);
						me.tasksDialog.style.display='none';
						input.value='';
						}
					}
				});
			},
			bindNumAllTask:function(){
				var dom=document.getElementById('num-allTask');
				dom.innerHTML=this.numAllTask;
			}
		}
		return Classic;
	})();
	//任务集模块
	var Tasks=(function(){
		function Tasks(classicDom,taskDom){//tasks[]
			//this.myData=data;
			// this.numAllTask=0;
			//classicDom
			this.classicDom=classicDom;
			//taskDom
			this.taskDom=taskDom;
			//task
			this.task=new Task();
		}	
		Tasks.prototype={
			addDom:function(data,listDom,spanStr){
				var li=document.createElement('li');
				var str='<a href="#"><i class="icon-file"></i><span>'+data+'</span>(<i>0</i>)';
				str+='<button class="del-btn"><i class="icon-del"></i></button>';
				str+='</a></li>';
				li.innerHTML=str;
				listDom.appendChild(li);
				var tasks={
					tasksName:data,
					task:[]
				},
				myData=Data.getData();
				for(var i=0;i<myData.length;i++){
					if(myData[i].folderName==spanStr)
					{
						myData[i].tasks.push(tasks);
						console.log(myData[i].tasks);
						Data.updateStorage(myData);
					}
				}
				this.bindTasks(li.querySelector('a'),spanStr);
			},
			delDom:function(list,folderStr){
				var spanStr=list.querySelector('span').innerHTML;
					console.log(spanStr);
					console.log(folderStr);
				myData=Data.getData();
				for(var i=0;i<myData.length;i++){
					if(myData[i].folderName==folderStr)
					{
						var tasksArray=myData[i].tasks;
						console.log(tasksArray);
						for(var j=0;j<tasksArray.length;j++)
						{
							if(tasksArray[j].tasksName==spanStr){
								tasksArray.splice(j,1);
								list.parentNode.parentNode.removeChild(list.parentNode);
								break;
							}
						}
						Data.updateStorage(myData);
					}
				}
			},
			bindEvent:function(list,a){
				var me=this;
				for(var l=0;l<list.length;l++){
					list[l].addEventListener('mouseover',function(){
						var delBtn=this.querySelector('.del-btn');
						delBtn.style.display='block';
					});
					list[l].addEventListener('mouseout',function(){
						this.querySelector('.del-btn').style.display='none';
					});
					list[l].addEventListener('click',function(){
						if(me.classicDom.querySelector('a.active')){
							me.classicDom.querySelector('a.active').removeAttribute('class');	
						}
						this.setAttribute('class','active');
						me.task.init(me.taskDom,this.querySelector('span').innerHTML);
					});
					list[l].querySelector('.del-btn').addEventListener('click',function(e){
						var d=this;
						var delBox=document.getElementById('delBox');
						Dialog.call(this,me.classicDom,delBox);
						delBox.style.display='block';
						delBox.querySelector('.ok-btn').addEventListener('click',function(){
							me.delDom(d.parentNode,a.querySelector('span').innerHTML);
							delBox.style.display='none';
						});

					});	
				}
			},
			bindTasks:function(a,spanStr){
				var me=this;
				a.addEventListener('mouseover',function(){
					var delBtn=this.querySelector('.del-btn');
					delBtn.style.display='block';
				});
				a.addEventListener('mouseout',function(){
					this.querySelector('.del-btn').style.display='none';
				});
				a.querySelector('.del-btn').addEventListener('click',function(){
					var d=this;
					var delBox=document.getElementById('delBox');
					var delBox=document.getElementById('delBox');
					Dialog.call(this,me.classicDom,delBox);
					delBox.style.display='block';
					delBox.querySelector('.ok-btn').addEventListener('click',function(){
						me.delDom(d.parentNode,spanStr);
						delBox.style.display='none';
					});
				});	
			},
			bindTask:function(taskDom){
				if(this.myData[0].tasks){
					this.task=new Task(this.myData[0].tasks[0]);
					this.task.init(taskDom);
				}
			}
		}
		return Tasks;
	})();
	//任务模块
	var Task=(function(){
		function Task(){
			//addDialog
			this.addDialog=document.getElementById('addTaskBox');
		}
		Task.prototype={
			init:function(taskDom,task){
				this.taskDom=taskDom;
				this.taskName=task;
				console.log(this.taskDom);
				this.myData=this.searchData(task);
				//绑定
				this.bindDom();
				this.bindEvent();
			},
			searchData:function(){
				var ddata=Data.getData();
				outer:for(var i=0;i<ddata.length;i++){
					for(var j=0;j<ddata[i].tasks.length;j++)
					{
						var tasks=ddata[i].tasks[j];
						if(tasks.tasksName==this.taskName){
							return tasks.task;
						}
					}
				}
			},
			updateData:function(){
				var ddata=Data.getData();
				outer:for(var i=0;i<ddata.length;i++){
					for(var j=0;j<ddata[i].tasks.length;j++)
					{
						var tasks=ddata[i].tasks[j];
						if(tasks.tasksName==this.taskName){
							tasks.task=this.myData;
							break outer;
						}
					}
				}
				Data.updateStorage(ddata);
			},
			bindDom:function(){
				var str='';
				for(var i=0;i<this.myData.length;i++)
				{
					var dl=this.myData[i];
					str+='<dl>';
					if(dl.time){
						str+='<dt>'+dl.time+'</dt>';
					}
					if(dl.toDo){
						for(var j=0;j<dl.toDo.length;j++){
							str+='<dd><a href="#">'+dl.toDo[j].taskName+'</a></dd>';
						}
					}
					str+='</dl>';
				}
				this.taskDom.innerHTML=str;
			},
			bindEvent:function(){
				//对话框
				this.addTaskDialogEvent();
			},
			addTaskDialogEvent:function(){
				var me=this;
				var addTaskBtn=document.getElementById('addTaskBtn'),
					input=me.addDialog.querySelector('.add-input'),
					message=me.addDialog.querySelector('.message');			
				addTaskBtn.addEventListener('click',function(){
					me.addDialog.style.display='block';
					input.focus();
				});
				me.addDialog.querySelector('.ok-btn').addEventListener('click',function(){
					if(input.value){
						var date=new Date(),
							year=date.getFullYear(),
							month=date.getMonth()+1,
							day=date.getDate();
						var time=year+'-'+month+'-'+day;
						var timeDom,
							lis=me.taskDom.children;
						for(var i=0;i<lis.length;i++){
							var dt=lis[i].querySelector('dt');
							console.log(dt);
							if(time==dt.innerHTML){
								timeDom=dt;
								break;
							}
						}
						if(timeDom){
							var dds=timeDom.parentNode.querySelectorAll('dd a');
							for(var j=0;j<dds.length;j++)
							{
								if(dds[j].innerHTML==input.value)
								{
									message.innerHTML='任务名称重复';
									break;
								}
							}
							if(j==dds.length){
								var dd=document.createElement('dd');
								dd.innerHTML='<a href="#">'+input.value+'</a>';
								timeDom.parentNode.appendChild(dd);
								var todo={
									taskName:input.value,
									content:''
									};
								for(var t=0;t<me.myData.length;t++){
									if(me.myData[t].time==timeDom.innerHTML)
									{
										me.myData[t].toDo.push(todo);
										console.log(me.myData[t].toDo);
										me.updateData();
									}
								}
							}
						}
						else{
							var dl=document.createElement('dl');
							var str='';
							str+='<dt>'+time+'</dt>';
							str+='<dd><a href="#">'+input.value+'</a></dd>';
							dl.innerHTML=str;
							me.taskDom.insertBefore(dl,me.taskDom.firstChild);
							var task={
									time:time,
									toDo:[{
										taskName:input.value,
										content:''
									}]
								};
							me.myData.unshift(task);
							me.updateData();
						}
					}
					else{
						message.innerHTML='不能为空!';
					}
				});
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