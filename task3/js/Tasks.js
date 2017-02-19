	
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
			bindNum:function(name){
				var allNum=0;
				var me=this;
				var a=name.querySelectorAll('.list a');
				for(var i=0;i<a.length;i++){
					var search=me.searchData(a[i].querySelector('span').innerHTML);
					var num=me.task.calNum(search.task);
					allNum+=num;
					a[i].querySelector('.id-list').innerHTML=num;
				}
				return allNum;
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
				a.addEventListener('click',function(){
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
			},
			bindTask:function(){
				var task=this.classicDom.firstChild.querySelectorAll('.list a');
				if(task.length){	
					var search=this.searchData(task[0].querySelector('span').innerHTML);
					this.task.init(search.index,search.task);
					task[0].setAttribute('class','active');
				}
			},
			setNum:function(n){
				var classicDom=document.getElementById('classicDom');
					tasks=classicDom.querySelector('.list a.active .id-list');
					folder=classicDom.querySelector('.list a.active').parentNode.parentNode.parentNode.querySelector('.h-classic a .id-list');
				var num1=parseInt(tasks.innerHTML),
					num2=parseInt(folder.innerHTML);
				num1=num1+n;
				num2=num2+n;
				tasks.innerHTML=num1;
				folder.innerHTML=num2;
			}
		}
		return Tasks;
	})();