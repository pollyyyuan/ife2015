
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
				this.myData=data;
				// this.folderDom=this.tasksDom.parentNode.parentNode.parentNode;
				// this.folderName=this.folderDom.querySelector('.h-classic a span').innerHTML;
				// this.tasksName=this.tasksDom.querySelector('span').innerHTML;
				//绑定
				this.reload(3);
			},
			reload:function(n){
				//重新加载
				if(this.myData){
					this.bindDom(n);
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
			bindDom:function(status){
				var status=status;
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
							var s='';
							if(status==dl.toDo[j].status){
								continue;
							}
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
			bindClickEvent:function(){
				var me=this;
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
			},
			bindEvent:function(){
				var me=this;
				//对话框
				this.addTaskDialogEvent();
				//绑定单击事件
				me.bindClickEvent();
				//finish
				me.noFinish.addEventListener('click',function(){
					this.parentNode.querySelector('.active').removeAttribute('class');
					this.setAttribute('class','active');
					me.reload(1);
				});
				me.finished.addEventListener('click',function(){
					this.parentNode.querySelector('.active').removeAttribute('class');
					this.setAttribute('class','active');
					me.reload(0);
				});
				me.allFinish.addEventListener('click',function(){
					this.parentNode.querySelector('.active').removeAttribute('class');
					this.setAttribute('class','active');
					me.reload(3);
				});
			},
			addTaskDialogEvent:function(){
				var me=this;
				var addTaskBtn=document.getElementById('addTaskBtn'),
					input=me.addDialog.querySelector('.add-input'),
					message=me.addDialog.querySelector('.message');			
				addTaskBtn.addEventListener('click',function(){
						me.allFinish.parentNode.querySelector('.active').removeAttribute('class');
						me.allFinish.setAttribute('class','active');
						me.reload(3);
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
										Tasks.prototype.setNum(1);
										me.bindClickEvent();
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
							Tasks.prototype.setNum(1);
							me.bindClickEvent();
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
				console.log(this.taskDom);
				if(this.taskDom.innerHTML){
					var infoTime=this.taskDom.firstChild.querySelector('dt');
					if(this.taskDom.firstChild.querySelectorAll('dd a').length){
						infoTitle=this.taskDom.firstChild.querySelectorAll('dd a');
						search=this.searchData(infoTime.innerHTML,infoTitle[0].innerHTML);
						this.info.init(search.index,search.toDo,infoTime.innerHTML);
						infoTitle[0].setAttribute('class','active');
					}
				}
			},
			setEd:function(taskDom){
				var me=this,
					active=taskDom.querySelector('a.active').parentNode;
				active.setAttribute('class','ed');
			},
			calNum:function(data){
				var num=0;
				for(var i=0;i<data.length;i++){
					for(var j=0;j<data[i].toDo.length;j++){
						if(data[i].toDo[j].status==0){
							num++;
						}
					}
				}
				return num;
			}
		}
		return Task;
	})();