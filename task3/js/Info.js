
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
					(function(){
						Task.prototype.setEd(me.taskDom);
						Tasks.prototype.setNum(-1);
					})()
					me.updateData();
					me.finishDialog.style.display='none';
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