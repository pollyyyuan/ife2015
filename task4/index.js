;(function(){
  //假数据
  var datas = [{
    id:'1',
    title:'任务分类一',
    datas:[{
      id:'11',
      title:'任务分类一任务一',
      date:'2018-05-25',
      desc:'我是任务一的描述'
    },{
      id:'12',
      title:'任务分类一任务二',
      date:'2018-05-24',
      desc:'我是任务二的描述'
    }]
  },{
    id:'2',
    title:'任务分类二',
    datas:[{
      id:'21',
      title:'任务分类二任务一',
      date:'2014-05-25',
      desc:'我是任务一的描述'
    },{
      id:'22',
      title:'任务分类二任务二',
      date:'2017-05-24',
      desc:'我是任务二的描述'
    }]
  }];

  var dataService = {
    getDataById : function(id){
      if (id) {
        classic: for (var i = 0; i < datas.length; i++) {
          var tmpData = datas[i];
          if (tmpData.id == id) {
            return tmpData;
          }
          task: for (var j = 0; j < tmpData.datas.length; j++) {
            if (tmpData.datas[i].id == id) {
              return tmpData.datas[i];
            }
          }
        }
        return null;
      }
      return datas;

    },
    getdatas:function(){
      return datas;
    }
  }

  var titleDom = document.getElementById('mytitle'),
      spanDom = titleDom.getElementsByTagName('span')[0];
      goBackDom = titleDom.getElementsByTagName('i')[0];

  var Classic = (function(){
    function Classic(baseDatas){
      this.contentDom = document.getElementsByClassName('content')[0];
      this.classicDomList = document.getElementById('classic').getElementsByTagName('ul')[0];
      this.Task = new Task();
      this.baseDatas = dataService.getdatas();
    }
    Classic.prototype = {
      init:function(){
        this.initData();
        this.bindTap();
      },
      initData : function(){
        var str = '';
        for (var i = 0; i < this.baseDatas.length; i++) {
          str += '<li>';
          str += '<a href="#tasks" data-id="';
          str += this.baseDatas[i].id;
          str += '"><span>';
          str += this.baseDatas[i].title;
          str += '</span></a>';
          str += '</li>';
        }
        this.classicDomList.innerHTML = str;
      },
      bindTap:function(){
        var me = this;
        var aList = this.classicDomList.querySelectorAll('a');
        for (var i = 0; i < aList.length; i++) {
          aList[i].addEventListener('touchend',function(){
            console.log(this);
            var id = this.getAttribute('data-id');
            me.Task.init(id);
            me.move('right');
          });
          aList[i].addEventListener('click',function(){
            console.log(this);
            var id = this.getAttribute('data-id');
            me.Task.init(id);
            me.move('right');
          });
        }
      },
      move : function(direction){
        var width = direction == 'right' ? (this.contentDom.offsetLeft - this.contentDom.offsetWidth/3) : (this.contentDom.offsetLeft + this.contentDom.offsetWidth/3);
        console.log(width);
        var val = 'translate('+width+'px)';
        this.contentDom.style.transform = val;
        this.contentDom.style.webkitTransform = val;
      },
      bindGoBack:function(){
        var me = this;
        goBackDom.addEventListener('click',function () {
          me.move('left');
        })
      }
    }
    return Classic;
  })();

  var Task = (function(){
    function Task(){
      this.taskDomList = document.getElementById('task').getElementsByTagName('ul')[0];
      this.contentDom = document.getElementsByClassName('content')[0];
      this.baseDatas = null;
      this.Info = new Info();
    }
    Task.prototype = {
      init:function(id){
        this.initData(id);
        this.bindTap();
      },
      initData:function(id){
        var tmpData = dataService.getDataById(id);
        this.initTitle(tmpData.title);
        this.baseDatas = tmpData.datas;
        var str = '';
        for (var i = 0; i < this.baseDatas.length; i++) {
          str += '<li>';
          str += '<a href="#infos" data-id="';
          str += this.baseDatas[i].id;
          str += '"><span>';
          str += this.baseDatas[i].title;
          str += '</span></a>';
          str += '</li>';
        }
        this.taskDomList.innerHTML = str;
      },
      initTitle:function(title){
        spanDom.innerHTML = title;
        goBackDom.style.display = 'block';
      },
      bindTap:function(){
        var me = this;
        var aList = this.taskDomList.querySelectorAll('a');
        for (var i = 0; i < aList.length; i++) {
          aList[i].addEventListener('touchend',function(){
            var id = this.getAttribute('data-id');
            me.Info.init(id);
            me.move('right');
          });
          aList[i].addEventListener('click',function(){
            var id = this.getAttribute('data-id');
            me.Info.init(id);
            me.move('right');
          });
        }
      },
      move : function(direction){
        var width = direction == 'right' ? (this.contentDom.offsetLeft - this.contentDom.offsetWidth/3) : (this.contentDom.offsetLeft + this.contentDom.offsetWidth/3);
        console.log(this.contentDom.offsetLeft);
        console.log(width);
        var val = 'translate('+width+'px)';
        this.contentDom.style.transform = val;
        this.contentDom.style.webkitTransform = val;
      }
    }
    return Task;
  })();

  var Info = (function(){
    function Info(){
      this.infoDomList = document.getElementById('info');
      this.baseDatas = null;
    }
    Info.prototype = {
      init:function(id){
        this.initData(id);
      },
      initData:function(id){
        var tmpData = dataService.getDataById(id);
        this.initTitle(tmpData.title);
        this.baseDatas = tmpData;
        var str = '';
        str += '<div class="info-title"><span>';
        str += this.baseDatas.title;
        str += '</span>';
        str += '</div>';
        str += '<div class="info-date"><span>';
        str += this.baseDatas.date;
        str += '</span>';
        str += '</div>';
        str += '<div class="info-info"><span>';
        str += this.baseDatas.desc;
        str += '</span>';
        str += '</div>';
        this.infoDomList.innerHTML = str;
      },
      initTitle:function(title){
        spanDom.innerHTML = title;
        goBackDom.style.display = 'block';
      }
    }
    return Info;
  })();


  var classicObj = new Classic(datas);
  classicObj.init();
})()
