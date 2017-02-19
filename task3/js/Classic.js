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
				//绑定列表s
				this.bindDom();
				this.bindNumAllTask();
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
			bindNumAllTask:function(){
				var n=document.getElementById('num-allTask');
				n.innerHTML=this.bindNum();
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
			bindNum:function(){
				var allNum=0;
				var me=this,
				 	a=me.classicDom.querySelectorAll('.h-classic a');
				for(var i=0;i<a.length;i++){
					var search=me.searchData(a[i].querySelector('span').innerHTML);
					Tasks.prototype.init(search.index,search.tasks);
					var num=me.tasks.bindNum(a[i].parentNode.parentNode);
					console.log('num='+num);
					allNum+=num;
					a[i].querySelector('.id-list').innerHTML=num;
				} 
				return allNum;
			},
			bindEvent:function(){
				var me=this;
				//folder
				var lis=me.classicDom.children;
				for(var li=0;li<lis.length;li++){
					var a=lis[li].querySelector('.h-classic a'),//获得标题
						list=lis[li].querySelectorAll('.list li a');//tasks
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
					if(list.length){
						var search=me.searchData(a.querySelector('span').innerHTML);
						me.tasks.init(search.index,search.tasks);
						me.tasks.bindEvent(list,a);
					}
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
				me.bindNumAllTask();	
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
								if(as[a].innerHTML==addinput.value){
									addinput.value='';
									addinput.focus();
									message.innerHTML='该类别已存在';
									break;
								}
							}
						}
						if(a==as.length){	
							me.addFolder(addinput.value);
							me.addDialog.style.display='none';
							addinput.value='';
							message.innerHTML='';
						}
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
							message.innerHTML='';
						}
					}
				});
			},
			bindTasks:function(){
				var folder=this.classicDom.firstChild.querySelectorAll('.h-classic a');
				var search=this.searchData(folder[0].querySelector('span').innerHTML);
				this.tasks.init(search.index,search.tasks);
				this.tasks.bindTask();
			}
		}
		return Classic;
	})();