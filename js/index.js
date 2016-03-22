window.onload=function(){
	var
	canvas=document.querySelector('#canvas'),
	ctx=canvas.getContext('2d'),
	ROW=15,	
	qizi={},//防止棋子叠加  字典  所有落子数据;
	kaiguan=localStorage.x?false:true;//控制黑白  该谁落子了
	ctx.strokeStyle='#fff';
	canvas.style.cssText="backgroud:rgba(0,0,0,0.4)"
	var huaqipan=function(){
		ctx.clearRect(0,0,600,600);
		for(var i=0;i<ROW;i++){//线
			ctx.beginPath();
			ctx.moveTo(20,i*40+20.5);
			ctx.lineTo(580,i*40+20.5);
			ctx.stroke();
			ctx.moveTo(i*40+20.5,20);
			ctx.lineTo(i*40+20.5,580);
			ctx.stroke();
		}
		//五子的位置 棋盘星点位置数据
		ctx.beginPath();
		ctx.arc(300,300,5,0,Math.PI*2);
		ctx.fill();
		ctx.fillStyle='black';
		var z=[140.5,460.5];
		for(var i=0;i<z.length;i++){
			for(var j=0;j<z.length;j++){
				ctx.beginPath();
				ctx.arc(z[i],z[j],3,0,Math.PI*2);
				ctx.fill();
			}
		}
	}
	huaqipan();
	/*接口和功能
	x number 落子x坐标
	y number 落子y坐标
	color boolean true代表黑子，false代表白子    
	*/
	//绘制棋子
	var 
	canvas2=document.querySelector('#canvas2'),
	ctx2=canvas2.getContext('2d');
	var luozi=function(x,y,color){
		var zx=40*x+20.5;
		var zy=40*y+20.5;
		var black=ctx2.createRadialGradient(zx,zy,1,zx,zy,20);
		black.addColorStop(0.1,'#555');
		black.addColorStop(1,'#000');
		var white=ctx2.createRadialGradient(zx,zy,1,zx,zy,20);
		white.addColorStop(0.1,'#fff');
		white.addColorStop(1,'#ddd');
		ctx2.fillStyle=color?black:white;
		ctx2.beginPath();
		ctx2.arc(zx,zy,18,0,Math.PI*2);
		ctx2.fill();
	} 
	canvas2.onclick=function(e){
		var x=Math.round((e.offsetX-20.5)/40);
		var y=Math.round((e.offsetY-20.5)/40);
		if(qizi[x+'_'+y]){
			return;
		}
		luozi(x,y,kaiguan);
		qizi[x+'_'+y]=kaiguan?'black':'white'; 
		if(kaiguan){
			if(panduan(x,y,'black')){
				alert('黑子赢');
				if(confirm('再来一局？')){
					localStorage.clear();
					location.reload();
					qizi={};
					kaiguan=true;
					return;
				}else{
					canvas.onclick=null;
				}
			}
		}else{
			if(panduan(x,y,'white')){
				alert('白子赢');
				if(confirm('再来一局？')){
					localStorage.clear();
					location.reload();
					qizi={};
					kaiguan=true;
					return;
				}else{
					canvas.onclick=null;
				}
			}
		}
		kaiguan=!kaiguan;
		localStorage.data=JSON.stringify(qizi);
		if(!kaiguan){
			localStorage.x=1;
		}else{
			localStorage.removeItem('x');
		} 
		//悔棋   回退一步 
		var regret=document.querySelector('.regret'); 
		regret.onclick=function(){
			var newqizi={};
			for(var i in qizi){
				if(i!=(x+'_'+y)){
					newqizi[i]=qizi[i];
				}
			}
			qizi = newqizi;
			kaiguan = !kaiguan;
			ctx2.clearRect(x*40+2,y*40+2,40,40);
		}
	} 
	var xy2id=function(x,y){return x+'_'+y;}//返回当前棋子的位置 
	//判断是否成功 
	var panduan=function(x,y,color){
		var shuju=filter(color); 
		var tx,ty,hang=1;shu=1;zuoxie=1;youxie=1;//tx,ty
		tx=x;ty=y;while(shuju[xy2id(tx-1,ty)]){tx--;hang++};
		tx=x;ty=y;while(shuju[xy2id(tx+1,ty)]){tx++;hang++};
		if(hang>=5){return true;}
		tx=x;ty=y;while( shuju[ xy2id( tx,ty-1 ) ]){ty--;shu++};
		tx=x;ty=y;while( shuju[ xy2id( tx,ty+1 ) ]){ty++;shu++};
		if(shu >= 5){return true;}; 
		tx=x;ty=y;while( shuju[ xy2id( tx+1,ty-1 ) ]){tx++;ty--;zuoxie++};
		tx=x;ty=y;while( shuju[ xy2id( tx-1,ty+1 ) ]){tx--;ty++;zuoxie++};
		if(zuoxie >= 5){return true;};
		tx=x;ty=y;while( shuju[ xy2id( tx-1,ty-1 ) ]){tx--;ty--;youxie++};
		tx=x;ty=y;while( shuju[ xy2id( tx+1,ty+1 ) ]){tx++;ty++;youxie++};
		if(youxie >= 5){return true;};
	} 
	var filter=function(color){
		var r={}; 
		for(var i in qizi){
			if(qizi[i]==color){
				r[i]=qizi[i];
			}
		}
		return r;
	}
	/* 如果本地存储中有棋盘数据，读取这些数据并绘制到页面中；*/
	if(localStorage.data){
		qizi=JSON.parse(localStorage.data); 
		for(var i in qizi){	//X_Y;
			var x=i.split('_')[0];
			var y=i.split('_')[1];
			luozi(x,y,(qizi[i]=='black')?true:false);
		  			//kaiguan = (qizi[i] == 'black')?true:false;//使用图片的
		  		}
	} 
	//重置    将缓存清除  重新开始一盘 
	var reset=document.querySelector('.reset'); 
	reset.onclick=function(){
		localStorage.clear();
		location.reload();
	}
}