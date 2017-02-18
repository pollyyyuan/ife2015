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
	// 				content:'完成编码',
	//				status:0
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
				this.classic=new Classic(this.classicDom,this.taskDom,this.infoDom);
				this.classic.init(this.myData);
			},
			bindDelBtn:function(){
				var delBtns=document.querySelectorAll('a.del-btn'),
					cancelBtns=document.querySelectorAll('.cancel-btn');
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
	//修改个数
	var setNum=function(tasksDom,num){
		var list=tasksDom.querySelector('.id-list');
		list.innerHTML=num;
	}
	// 分类模块
	var Classic=(function(){
		function Classic(classicDom,taskDom,infoDom){//Datas[]
			// 获取classicDom
			this.classicDom=classicDom;
			//获取tasksDialog
			this.tasksDialog=document.getElementById('addTasksBox');
			this.addDialog=document.getElementById('addClassicBox');
			this.tasks=new Tasks(classicDom,taskDom,infoDom);
			// this.numAllTask=0;
		}
		Classic.prototype={
			init:function(data){
				this.myData=data;
				//绑定个数
				// this.bindNumAllTask();
				//绑定列表s
				this.bindDom();
				// 绑定事件
				this.bindEvent();
				//绑定首次
				this.bindTasks();
			},
			searchData:function(name){
				var dataa=Data.getData();
				for(var i=0;i<dataa.length;i++){
					if(dataa[i].folderName==name){
						var index={
							folder:i
						};
						return {
							'tasks':dataa[i].tasks,
							'index':index
						};
					}
				}
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
								str+='<a href="#"><i class="icon-file"></i><span>'+tasksData.tasksName+'</span>(<i class="id-list">0</i>)';
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
					a.addEventListener('click',function(event){
						var event=window.event||event;
						event.stopPropagation();
					});
					//绑定tasks
					var search=me.searchData(a.querySelector('span').innerHTML);
					me.tasks.init(search.index,search.tasks);
					me.tasks.bindEvent(list,a);
				}
				//dialog
				this.bindTasksDialogEvent();
				this.bindAddDialogEvent();			
			},
			delDom:function(li){
				var me=this;
				var spanStr=li.querySelector('span').innerHTML;
				for(var i=0;i<me.myData.length;i++){
					if(me.myData[i].folderName==spanStr)
					{
						me.myData.splice(i,1);
						me.classicDom.removeChild(li.parentNode.parentNode);
						break;
					}
				}
				Data.updateStorage(me.myData);	
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
				this.bindEvent();
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
							var search=me.searchData(a.querySelector('span').innerHTML);							
							me.tasks.init(search.index,search.tasks);	
							me.tasks.addDom(input.value,list);
							me.tasksDialog.style.display='none';
							input.value='';
						}
					}
				});
			},
			bindTasks:function(){
				var folder=this.classicDom.firstChild.querySelectorAll('.h-classic a');
				var search=this.searchData(folder[0].querySelector('span').innerHTML);
				this.tasks.init(search.index,search.tasks);
				this.tasks.bindTask();
			},
			setNum:function(){
				
			}
		}
		return Classic;
	})();
	//任务集模块
	var Tasks=(function(){
		function Tasks(classicDom,taskDom,infoDom){//tasks[]
			// this.numAllTask=0;
			this.classicDom=classicDom;
			//taskDom
			this.taskDom=taskDom;
			//task
			this.task=new Task(this.taskDom,infoDom);
		}	
		Tasks.prototype={
			init:function(index,data){
				this.index=index;
				this.myData=data;
			},
			searchData:function(name){
				for(var i=0;i<this.myData.length;i++)
				{
					if(this.myData[i].tasksName==name){
						var index=this.index;
						index.tasks=i;
						return {
							'task':this.myData[i].task,
							'index':index
						};
					}
				}
			},
			updateData:function(){
				var dataa=Data.getData();
				dataa[this.index.folder].tasks=this.myData;
				Data.updateStorage(dataa);
			},
			addDom:function(data,listDom,spanStr){
				var li=document.createElement('li');
				var str='<a href="#"><i class="icon-file"></i><span>'+data+'</span>(<i class="id-list">0</i>)';
				str+='<button class="del-btn"><i class="icon-del"></i></button>';
				str+='</a></li>';
				li.innerHTML=str;
				listDom.appendChild(li);
				var tasks={
					tasksName:data,
					task:[]
				};
				this.myData.push(tasks);
				this.updateData();
				this.bindTasks(li.querySelector('a'),spanStr);
			},
			delDom:function(list){
				var spanStr=list.querySelector('span').innerHTML;
				console.log(this.myData);
				for(var i=0;i<this.myData.length;i++){
					if(this.myData[i].tasksName==spanStr){
						this.myData.splice(i,1);
						this.updateData();
						list.parentNode.parentNode.removeChild(list.parentNode);
						break;
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
						console.log(this);
						if(me.classicDom.querySelector('a.active')){
							me.classicDom.querySelector('a.active').removeAttribute('class');	
						}
						this.setAttribute('class','active');
						var h=this.parentNode.parentNode.parentNode.querySelector('.h-classic a span').innerHTML;
						console.log(h);
						(function(){
							var search=Classic.prototype.searchData.call(this,h);
							console.log(search);
							me.myData=search.tasks;
							console.log(me.myData);
							me.index=search.index;
						})()
						var search=me.searchData(this.querySelector('span').innerHTML);
						me.task.init(search.index,search.task);
					});
					list[l].querySelector('.del-btn').addEventListener('click',function(e){
						var d=this;
						var delBox=document.getElementById('delBox');
						Dialog.call(this,me.classicDom,delBox);
						delBox.style.display='block';
						delBox.querySelector('.ok-btn').addEventListener('click',function(){
							me.delDom(d.parentNode);
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
						me.delDom(d.parentNode);
						delBox.style.display='none';
					});
				});	
			},
			bindTask:function(){
				var task=this.classicDom.firstChild.querySelectorAll('.list a');
				if(task.length){	
					var search=this.searchData(task[0].querySelector('span').innerHTML);
					this.task.init(search.index,search.task);
					task[0].setAttribute('class','active');
				}
			}
		}
		return Tasks;
	})();
	//任务模块
	var Task=(function(){
		function Task(taskDom,infoDom){
			this.taskDom=taskDom;
			//addDialog
			this.addDialog=document.getElementById('addTaskBox');
			//button
			this.noFinish=document.getElementById('noFinish');
			this.finished=document.getElementById('finished');
			this.allFinish=document.getElementById('allFinish');
			//info
			this.info=new Info(taskDom,infoDom);
		}
		Task.prototype={
			init:function(index,data){
				this.index=index;
				console.log(index);
				this.myData=data;
				this.searching=this.myData;
				// this.folderDom=this.tasksDom.parentNode.parentNode.parentNode;
				// this.folderName=this.folderDom.querySelector('.h-classic a span').innerHTML;
				// this.tasksName=this.tasksDom.querySelector('span').innerHTML;
				//绑定
				if(this.searching){
					this.bindDom();
					this.bindEvent();
					this.bindInfo();
				}
				else{
					this.taskDom.innerHTML='';
				}
			},
			searchData:function(time,name){
				for(var i=0;i<this.myData.length;i++)
				{
					var task=this.myData[i];
					if(this.myData[i].time==time){
						for(var j=0;j<task.toDo.length;j++)
						{
							if(task.toDo[j].taskName==name){
								var index=this.index;
								index.task=i;
								index.toDo=j;
								return {
									'toDo':task.toDo[j],
									'index':index
								};
							}
						}
					}
				}
			},
			updateData:function(){
				var dataa=Data.getData();
				dataa[this.index.folder].tasks[this.index.tasks].task=this.myData;
				Data.updateStorage(dataa);
			},
			bindDom:function(){
				var str='';
				for(var i=0;i<this.searching.length;i++)
				{
					var dl=this.searching[i];
					str+='<dl>';
					if(dl.time){
						str+='<dt>'+dl.time+'</dt>';
					}
					if(dl.toDo){
						for(var j=0;j<dl.toDo.length;j++){
							var s='';
							if(dl.toDo[j].status==1){
								s='ed';
							}
							str+='<dd class="'+s+'"><a href="#">'+dl.toDo[j].taskName+'</a></dd>';
						}
					}
					str+='</dl>';
				}
				this.taskDom.innerHTML=str;
			},
			bindEvent:function(){
				var me=this;
				//对话框
				this.addTaskDialogEvent();
				var dda=me.taskDom.querySelectorAll('dd a');
				for(var i=0;i<dda.length;i++){
					dda[i].addEventListener('click',function(){
						if(me.taskDom.querySelector('dd a.active')){
							me.taskDom.querySelector('dd a.active').removeAttribute('class');
						}
						this.setAttribute('class','active');
						var time=this.parentNode.parentNode.querySelector('dt').innerHTML,
							search=me.searchData(time,this.innerHTML);
						me.info.init(search.index,search.toDo,time);
					});
				}
				//finish
				me.noFinish.addEventListener('click',function(){
					this.parentNode.querySelector('.active').removeAttribute('class');
					this.setAttribute('class','active');
					me.search(1);
					me.bindDom();
					me.bindEvent();
					me.bindInfo();
				});
				me.finished.addEventListener('click',function(){
					this.parentNode.querySelector('.active').removeAttribute('class');
					this.setAttribute('class','active');
					me.search(0);
					me.bindDom();
					me.bindEvent();
					me.bindInfo();
				});
				me.allFinish.addEventListener('click',function(){
					this.parentNode.querySelector('.active').removeAttribute('class');
					this.setAttribute('class','active');
					me.search(3);
					me.bindDom();
					me.bindEvent();
					me.bindInfo();
				});
			},
			search:function(status){
				this.searching=this.myData;
				for(var i=0;i<this.searching.length;i++)
				{
					for(var j=0;j<this.searching[i].toDo.length;j++){
						var s=this.searching[i].toDo[j].status;
						if(s==status){
							this.searching[i].toDo.splice(j,1);
						}
					}
				}
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
									content:'',
									status:0
									};
								for(var t=0;t<me.myData.length;t++){
									if(me.myData[t].time==timeDom.innerHTML)
									{
										me.myData[t].toDo.push(todo);
										me.updateData();
										if(me.taskDom.querySelector('dd a.active'))
										{
											me.taskDom.querySelector('dd a.active').removeAttribute('class');
										}
										timeDom.parentNode.lastChild.querySelector('a').setAttribute('class','active');
										var search=me.searchData(timeDom.innerHTML,input.value);
										me.info.init(search.index,search.toDo,timeDom.innerHTML);
										me.addDialog.style.display='none';
										input.value='';
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
										content:'',
										status:0
									}]
								};
							me.myData.unshift(task);
							me.updateData();
							if(me.taskDom.querySelector('dd a.active'))
							{
								me.taskDom.querySelector('dd a.active').removeAttribute('class');
							}
							me.taskDom.firstChild.querySelector('dd a').setAttribute('class','active');
							var search=me.searchData(time,input.value);
							me.info.init(search.index,search.toDo,time);
							me.addDialog.style.display='none';
							input.value='';
						}
					}
					else{
						message.innerHTML='不能为空!';
					}
					
				});
			},
			bindInfo:function(){
				if(this.taskDom){
					var infoTime=this.taskDom.firstChild.querySelector('dt'),
						infoTitle=this.taskDom.firstChild.querySelectorAll('dd a');
						search=this.searchData(infoTime.innerHTML,infoTitle[0].innerHTML);
					this.info.init(search.index,search.toDo,infoTime.innerHTML);
					infoTitle[0].setAttribute('class','active');
				}
			},
			setEd:function(taskDom){
				var me=this,
					active=taskDom.querySelector('a.active').parentNode;
				active.setAttribute('class','ed');
			},
			calNum:function(){

			}
		}
		return Task;
	})();
	//详细信息模块
	var Info=(function(){
		function Info(taskDom,infoDom){
			this.taskDom=taskDom;
			this.infoDom=infoDom;
			this.finishDialog=document.getElementById('finishBox');
			this.iconEdit=this.infoDom.querySelector('.m-header .icon-edit').parentNode;
			this.iconOk=this.infoDom.querySelector('.m-header .icon-ok').parentNode;
			this.noEditDom=this.infoDom.querySelector('.m-info .no-edit');
			this.editDom=this.infoDom.querySelector('.edit');
		}
		Info.prototype={
			init:function(index,data,time){
				this.index=index;
				this.myData=data;//toDo
				this.time=time;
				//绑定dom
				this.bindDom();
				//绑定事件
				this.bindEvent();
			},
			updateData:function(){
				var dataa=Data.getData();
				dataa[this.index.folder].tasks[this.index.tasks].task[this.index.task].toDo[this.index.toDo]=this.myData;
				Data.updateStorage(dataa);
			},
			bindDom:function(){
				if(this.myData.status==1){
					this.iconOk.setAttribute('class','active');
				}
				else{
					this.iconOk.removeAttribute('class');
				}
				this.bindNoEditDom();
				if(this.myData.content==''){
					this.iconEdit.setAttribute('class','active');
					this.editDom.style.display='block';
					this.bindEditDom();
				}
			},
			bindEvent:function(){
				var me=this;
				//edit
				me.iconEdit.addEventListener('click',function(){
					if(this.getAttribute('class')!='active'){
						if(me.iconOk.getAttribute('class')!='active'){
							this.setAttribute('class','active');
							me.editDom.style.display='block';
							me.bindEditDom();
						}
					}
				});
				//finish
				me.iconOk.addEventListener('click',function(){
					if(this.getAttribute('class')!='active'){
						this.setAttribute('class','active');
						me.finishDialog.style.display='block';
						me.bindfinishDialogEvent();
					}
				});
			},
			bindfinishDialogEvent:function(){
				var me=this;
				var okBtn=me.finishDialog.querySelector('.ok-btn');
				okBtn.addEventListener('click',function(){
					//Task.call(this);
					me.myData.status=1;
					me.updateData();
					(function(){
						Task.prototype.setEd(me.taskDom);
					})()
				});
			},
			bindNoEditDom:function(){
				this.editDom.style.display='none';
				this.iconEdit.setAttribute('class','');
				var headerDom=this.infoDom.querySelector('.h-main'),
					dateDom=this.infoDom.querySelector('.m-date span');
				headerDom.innerHTML=this.myData.taskName;
				dateDom.innerHTML=this.time;
				this.noEditDom.innerHTML=this.myData.content;
				if(this.status==1){
					this.iconOk.setAttribute('class','active');
				}
			},
			bindEditDom:function(){
				var me=this;
				var textBox=me.editDom.querySelector('textarea'),
					okBtn=me.editDom.querySelector('.ok-btn');
				//if(me.noEditDom.innerHTML){	
					textBox.value=me.noEditDom.innerHTML;
				//}
				textBox.focus();
				okBtn.addEventListener('click',function(){
					if(!textBox.value){
						me.myData.content='';
					}
					else
					{
						me.myData.content=textBox.value;
					}
					me.updateData();
					me.noEditDom.innerHTML=me.myData.content;
					me.editDom.style.display='none';
					me.iconEdit.removeAttribute('class');
				});
			}
		}
		return Info;
	})();
	//使用
	var classicDom=document.getElementById('classicDom');
	var taskDom=document.getElementById('taskDom');
	var infoDom=document.getElementById('infoDom');
	var main=new Main(classicDom,taskDom,infoDom);
	main.init();
})()