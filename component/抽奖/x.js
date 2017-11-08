//构造函数
// 这个程序的思想是：创建一个对象，给他加属性，加方法。点击抽奖，马上得到一个1~7的随机数作为奖品
// ID然后开始动画，动画原理：从第一个方块开始，调用_next方法，每一圈执行一次_next方法，每次_next方法
// 执行一次_setInterval方法每次_setInterval方法不断设置添加当前运动到的块的active类名，直到转完一圈，则
// 调用_next方法。最后一圈时转到奖品ID就不转了，然后圈数+1，然后跳出函数，最后alert中什么奖了。核心
// 函数是_setInterval和_next。
var prizeScroll=(function(doc){
	function _getItemsFilterCls(cls,items){
		var ret=[];
		for(var i=0,len=items.length;i<len;i++){
			if(items[i].className.indexOf(cls)>-1){				
				ret.push(items[i]);
			}	
		}
		return ret;
	}
	return function(opt){		
		this.wrap=doc.getElementById(opt.id)||doc.body;
		this.items=opt.items||_getItemsFilterCls(opt.id.replace('_wrap','')+'_cell',this.wrap.getElementsByTagName('*'));
		this.btn=doc.getElementById(opt.btn);
		this.curClass=opt.curClass||'active';		
		this.prizeNum=-1;
		this.curIdx=0;
		this.interval=null;
		this.queue=[100,50,30,50,100,150];//转速
		this.queue.gid=0;//转圈数
		this.callBack=opt.callBack||function(){};
		this.init();
	};	
})(document);

prizeScroll.prototype.init=function(){
	//初始化
	//prizeScroll.log('init');
};

prizeScroll.prototype._setInterval=function(timer,stopNum){
	//滚动动画
	var _self=this,len=stopNum||_self.items.length;
	_self._clearInterval();
	_self.interval=setInterval(function(){
		if(_self.curIdx>len-1){
			_self._clearInterval();
			_self._next();
			return;
		}
		_self._setActive(_self.curIdx);
		_self.curIdx++;
	},timer);
};
prizeScroll.prototype._setActive=function(idx){
	//设置中奖状态
	for(var i=0,len=this.items.length;i<len;i++){
		this.items[i].className='prize_cell';	
	}	
	this.items[idx].className='active';
};

prizeScroll.prototype._clearInterval=function(){
	//清除动画
	var _self=this;
	_self.interval&&clearInterval(_self.interval);
};
prizeScroll.prototype.start=function(){
	//开始
	this._next();
};
prizeScroll.prototype._next=function(){
	//动画排序
	this.curIdx=0;
	this.interval=null;
	var time=this.queue[this.queue.gid];
	if(this.queue.gid>this.queue.length-1){
		this.callBack(this.prizeNum);
		return;}
	if(this.queue.gid===this.queue.length-1){
		this._setInterval(time,this.getPrizeNum());//奖品设置
		this.queue.gid++;
		return;
	}	
	this._setInterval(time);
	this.queue.gid++;
};

prizeScroll.prototype.reset=function(){
	//重置重新开始
	this.stop();
	this.queue.gid=0;
};
prizeScroll.prototype.getPrizeNum=function(){
	//获取奖品号
	return this.prizeNum;
};
prizeScroll.prototype.setPrizeNum=function(prizeNum){
	//设置奖品号
	this.prizeNum=prizeNum;
};
prizeScroll.prototype.stop=function(){
	//停止
	//prizeScroll.log('stop');
	this._clearInterval();
};

var prizeAssembly={
	"1":"**币10枚",
	"2":"**币20枚",
	"3":"**币30枚",
	"4":"**币40枚",
	"5":"**币50枚",
	"6":"**币60枚",
	"7":"**币70枚",
	"8":"**币80枚"
};
var info = document.getElementById("info");
var m=new prizeScroll({	
	id:'prize_wrap',
	callBack:function(prizeNum){
		info.innerHTML="您中了 "+prizeAssembly[prizeNum]+" ";
	}
});
		var prizeNum;
document.getElementById('prize_start').onclick=function(){
	prizeNum=parseInt(Math.random()*7)+1;
	m.reset();
	m.setPrizeNum(prizeNum);
	m.start();
	
};
