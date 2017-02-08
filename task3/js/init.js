;(function(){
	var addBtn=document.getElementById('addBtn'),
		addClassicBox=document.getElementById('addClassicBox');
	addBtn.addEventListener('click',function(){
		var eg=new addDialog(addClassicBox);
	 	eg.initAll();
		eg.show();
	});
	function addDialog(dom){
		this.box=dom;
		this.input=dom.querySelector('input');
		this.okBtn=dom.querySelector('.ok-btn');
		this.cancelBtn=[dom.querySelector('.cancel-btn'),dom.querySelector('.del-btn')];
	}
	addDialog.prototype={
		initAll:function(){
			this.initEvent();
		},
		show:function(){
			this.box.style.display='block';
			this.input.focus();
		},
		initEvent:function(){
			var me=this;
			me.cancelBtn[0].addEventListener('click',function(){
					me.box.style.display='none';
				});
			me.cancelBtn[1].addEventListener('click',function(){
					me.box.style.display='none';
				});
			

		}
	}
})()