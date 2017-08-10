var time='480-525|535-580|600-645|655-700|860-905|915-960|980-1025|1035-1080|1140-1185|1195-1240|1250-1295';
var strs=new Array();
strs=time.split("|")
var range=new Array();
//高度适应。
window.onload=function(){
	var a,b,c,d,$b;
    a=window.screen.height//获取当前页面高度。
    b=document.getElementById("ALL");//获取最大的div的高度。
    $b=$(b);
    c=a-150+"px";
    $b.css("min-height",c)
};
//首次加载获取表格内容
$(document).ready(function(){
    getTable(0,0);
})
//计算申请的课
function findClass(a,b){
	var start_time,end_time;
	var i,k;
	for(i=0;i<strs.length;i++){
		range=strs[i].split("-");
		if(parseInt(a)>=parseInt(range[0]) && parseInt(a)<=parseInt(range[1])){
			start_time=i+1;
		}
		if(parseInt(b)>=parseInt(range[0]) && parseInt(b)<=parseInt(range[1])){
			end_time=i+1;
		}
	};
	if(start_time==end_time){
		k="第"+start_time+"节";
		return k;
	}else{
        k="第"+start_time+"节"+"-"+"第"+end_time+"节";
		return k;
	}
}
//点击通过后，向后台发送请求改变数据状态,并且完成一系列操作。
function show_element(e,ok,table){  //e为当前函数
	var a,b,c;
	e.src="images/loading.gif"
	var Id= $(e).parent().parent().attr('value');
		$.ajax({
			 type:"POST",
			 url:"http://bkxjjh.natappfree.cc/seeAuthority",
			 data:{
				target:'updata',
				status:ok,
				id:Id,
			 },
			 success:function(u){
			 	conflict(e,u,table);
			 }
			})
    e.onClick=null;
}
//移除特效
function first(e,table){
	e.src="images/tick.png";
	if(table==0){second(e,0);}
	if(table==1){second(e,1);}
	if(table==2){second(e,2);}
};
function second(e,can){
    b=e.parentNode.parentNode;//获取tr
	var c=$(b);
		c.find('td').animate({height:"0px"},700);
		c.find('td')
		.wrapInner('<div style="display: block;" />')
		.parent()
		.find('td > div')
		.slideUp(700, function(){
			$(this).parent().parent().remove();
		})
		setTimeout(function(){
			//获取tbody标签
			if(can==0){a=document.getElementById("tableTbody");}
            if(can==1){a=document.getElementById("tableTbody_1");}
            if(can==2){a=document.getElementById("tableTbody_2");}
            c=a.getElementsByTagName('tr');//获取所有的tr标签
            if(c.length<3&&can==0){
    	        getTable(0,0);
            }//点击完了重新获取
       },710);
    };
//获取表格内容
function getTable(p,page){//第一个参数为表格，第二个参数为页数-1
	$.ajax({
			type:"POST",
			url:"http://bkxjjh.natappfree.cc/seeAuthority",
			success:function importTable_1(data){
	                    var a,b,c,d,e,f,g,reset;
                        var i,element,elementParent;
                        	if(p==0){elementParent=document.getElementById("tableTbody");elementParent.innerHTML='<tr id="header">\
							<th rowspan="2">提交时间</th>\
							<th rowspan="2">教室地址</th>\
							<th rowspan="2">申请时间</th>\
							<th rowspan="2">申请单位</th>\
							<th rowspan="2">申请人</th>\
							<th rowspan="2">事由</th>\
                            <th colspan="2">审核</th>\
						</tr>\
						<tr id="header_2">\
							<th>通过</th>\
							<th>不通过</th>\
						</tr>'}
    	                    if(p==-1){elementParent=document.getElementById("tableTbody_1");elementParent.innerHTML='<tr id="header">\
							<th rowspan="2">提交时间</th>\
							<th rowspan="2">教室地址</th>\
							<th rowspan="2">申请时间</th>\
							<th rowspan="2">申请单位</th>\
							<th rowspan="2">申请人</th>\
							<th rowspan="2">事由</th>\
                            <th colspan="2">审核</th>\
						</tr>\
						<tr id="header_2_2">\
							<th>撤销</th>\
						</tr>'}
    	                    if(p==1){elementParent=document.getElementById("tableTbody_2");elementParent.innerHTML='<tr id="header">\
							<th rowspan="2">提交时间</th>\
							<th rowspan="2">教室地址</th>\
							<th rowspan="2">申请时间</th>\
							<th rowspan="2">申请单位</th>\
							<th rowspan="2">申请人</th>\
							<th rowspan="2">事由</th>\
                            <th colspan="2">审核</th>\
						</tr>\
						<tr id="header_2_2">\
							<th>撤销</th>\
						</tr>'}
						for(i=0;i<data.length;i++){
                            var newTr = document.createElement("tr");
                            newTr.setAttribute("id",i);
                            newTr.setAttribute("value",data[i].id);
                            if(p==0){newTr.innerHTML = '<td class="sumbitTime">XXXX年XX月XX日&nbsp;XX:XX:XX</td>\
                            <td class="classPlace">教室地址1</td>\
                            <td class="applyTime">XX月XX日&nbsp;第XX节~第XX节</td>\
                            <td class="Office">真实存在的单位</td>\
                            <td class="Applicant">XXX</td>\
                            <td class="Reason">合乎情理没有毛病的理由</td>\
                            <td class="authorityAcross_0"><img src="images/frame.png" onClick="show_element(this,-1,0)"></td>\
                            <td class="authorityAcross_1"><img src="images/frame.png" onClick="show_element(this,1,0)"></td>'}
                            if(p==-1){newTr.innerHTML = '<td class="sumbitTime">XXXX年XX月XX日&nbsp;XX:XX:XX</td>\
                            <td class="classPlace">教室地址1</td>\
                            <td class="applyTime">XX月XX日&nbsp;第XX节~第XX节</td>\
                            <td class="Office">真实存在的单位</td><td class="Applicant">XXX</td>\
                            <td class="Reason">合乎情理没有毛病的理由</td><td class="authorityAcross_2">\
                            <img src="images/tick.png" onClick="show_element(this,0,1);getTable(-1,cNow-1);page(-1)"></td>'}
                            if(p==1){newTr.innerHTML = '<td class="sumbitTime">XXXX年XX月XX日&nbsp;XX:XX:XX</td>\
                            <td class="classPlace">教室地址1</td>\
                            <td class="applyTime">XX月XX日&nbsp;第XX节~第XX节</td>\
                            <td class="Office">真实存在的单位</td>\
                            <td class="Applicant">XXX</td>\
                            <td class="Reason">合乎情理没有毛病的理由</td>\
                            <td class="authorityAcross_2"><img src="images/tick.png" onClick="show_element(this,0,2);getTable(1,cNow-1);page(1)"></td>';}
                            elementParent.appendChild(newTr);
                            element=newTr.getElementsByTagName("td");
    	                    a=data[i].apply_time;//a与提交时间匹配
    	                    element[0].innerHTML=a;
    	                    b=data[i].building_name+" "+data[i].room_name;//b与教室地址匹配；
    	                    element[1].innerHTML=b;
    	                    c=data[i].apply_for_time+" ";
    	                    d=findClass(data[i].start_time,data[i].end_time);
    	                    element[2].innerHTML=c+d;//c,d用来计算申请第几天第几节课；
    	                    e=data[i].organization;
    	                    element[3].innerHTML=e;//e用来与申请单位匹配；
    	                    f=data[i].name;
    	                    element[4].innerHTML=f;//f与申请人匹配；
    	                    g=data[i].reason;
    	                    element[5].innerHTML=g;////,g用来与事由匹配
    	                }
    	                
                    },
			data:{
				target:'getdata',
				status:p,
				yeshu:page,
			}
		});
}
//点击未通过触发的行为
function pass(k){
	page(k);
	var a,b,c,d,m,f;
	cNow=1;
	a=document.getElementById("Select");
	b=a.getElementsByTagName('img');
	b[0].className="selectImg2";
	c=document.getElementById("Classroom");
	d=document.getElementById("Classroom_3");
	m=document.getElementById("Classroom_2");
	f=document.getElementById("pageTurning");
	$(c).hide();
	$(d).hide();
	$(m).show();
    $(f).show();
    getTable(-1,0);
}
function noPass(k){
	page(k);
	var a,b,c,d,m,f;
	cNow=1;
	a=document.getElementById("Select");
	b=a.getElementsByTagName('img');
	b[0].className="selectImg3";
	c=document.getElementById("Classroom");
	d=document.getElementById("Classroom_3");
	m=document.getElementById("Classroom_2");
	f=document.getElementById("pageTurning");
	$(c).hide();
	$(m).hide();
	$(d).show();
    $(f).show();
    getTable(1,0);
}
function waiting(){
	var a,b,c,d,m,f;
	cNow=1;
	a=document.getElementById("Select");
	b=a.getElementsByTagName('img');
	b[0].className="selectImg1";
	c=document.getElementById("Classroom");
	d=document.getElementById("Classroom_3");
	m=document.getElementById("Classroom_2");
	f=document.getElementById("pageTurning");
	$(d).hide();
	$(m).hide();
	$(c).show();
    $(f).hide();
    getTable(0,0);
}
//分页请求
// function page(p){
// 	$.ajax({
// 		type:"POST",
// 		url:"http://bkxjjh.natappfree.cc/seeAuthority",
// 		data:{
// 				target:'num',
// 				status:p,
// 		}
// 		success:
// 	});
// }
//获取冲突，并在弹窗显示
function conflict(shu,data,table){
	var parent,a,b,c,d,e,f,g,h,g;
	if(data.hasOwnProperty("msg")){
		if(data.more=="conflict recoder"){
			parent=shu.parentNode.parentNode;//获取所在的tr;
			a=parent.getElementsByClassName("applyTime")[0].innerHTML;//获取点击的冲突时间
			b=parent.getElementsByClassName("Office")[0].innerHTML;//获取点击的冲突单位
			c=parent.getElementsByClassName("Applicant")[0].innerHTML;//获取点击的申请人
			d=parent.getElementsByClassName("Reason")[0].innerHTML;//获取点击的原因
			g=parent.getAttribute("value");
			openNew(shu,table);
			e=document.getElementById("popupFirst");//获取悬浮窗表格
			f=e.getElementsByTagName("tr");//获取tr
			f[1].setAttribute("value",g);
			g=f[1].getElementsByTagName("td");//获取第一行的td
			g[0].innerHTML=b;
			g[1].innerHTML=c;
			g[2].innerHTML=d;
			h=document.getElementById("oTableP");
			h.innerHTML=a+"的申请有如下冲突：";
			console.log(data.data);
            addTable(data.data);
		}
		if(data.msg=="success"){
			first(shu,table);
		}
	}else{
		first(shu,table);
	}
}
// var canK,canTable;
//创建悬浮框
function openNew(k,table){
	//获取页面body！内容！的高度和宽度。
	var sHeight=document.documentElement.scrollHeight;
	var sWidth=document.documentElement.scrollWidth;
	//获取可视区域高度，宽度与页面内容的宽度一样
	var wHeight=document.documentElement.clientHeight;
	//创建遮罩层div并插入body
	var oMask=document.createElement("div");
		oMask.id="mask";
		oMask.style.height=sHeight+"px";
		//宽度直接用100%在样式里
		document.body.appendChild(oMask);
			//创建表格层div并插入body
	var oTable=document.createElement("div");
		oTable.id="onTable";
		oTable.innerHTML='<div id="Out">\
	<h1>冲突提醒</h1>\
	<p  id="oTableP">xx月xx日&nbap;第XX节-第XX节的申请有如下冲突：</p>\
	<div id="Popup">\
		<table id="popupFirst">\
			<tr id="popupHeader">\
				<th>申请单位</th>\
			    <th>申请人</th>\
			    <th>事由</th>\
			    <th>通过</th>\
			</tr>\
			<tr>\
				<td class="popup1">惹不起的单位</td>\
			    <td class="popup1">就是大佬</td>\
			    <td class="popup2">没有事由我就是来搞笑的</td>\
			    <td class="popup3">\
			    	<img src="images/tick.png" onClick="srcReset(this)">\
			    </td>\
			</tr>\
		</table>\
	</div>\
	<div id="popupBottom">\
	    <button id="Cancel">取消</button>\
	    <button id="Confirm" onClick="confirm()">确认</button>\
	</div>\
</div>';
//confirm(canK,canTable)
		document.body.appendChild(oTable);
		//获取login的宽度和高度并设置偏移值
		var dHeight=oTable.offsetHeight;
	    var dWidth=oTable.offsetWidth;
		oTable.style.left=(sWidth-dWidth)/2+"px";
		oTable.style.top=(wHeight-dHeight)/2+"px";
		//取消框事件
		var oCancel=document.getElementById("Cancel");
		var oConfirm=document.getElementById("Confirm");
		oCancel.onclick=function(){
			changeImg();
			document.body.removeChild(oMask);
			document.body.removeChild(oTable);
		}
		// canK=k;
		// canTable=table;
}
// function confirm(a,b){
// 	var oMask=document.getElementById("mask");
// 	var oTable=document.getElementById("onTable");
// 	document.body.removeChild(oMask);
// 	document.body.removeChild(oTable);
// }
function confirm(){
	var $e,e;
	$e=$("#popupFirst tr td img[src='images/tick.png']");
	e=$e[0];
	confirmData(e);
	var oMask=document.getElementById("mask");
	var oTable=document.getElementById("onTable");
	document.body.removeChild(oMask);
	document.body.removeChild(oTable);
	getTable(0,0);

}
//悬浮窗与表格对应添加
function addTable(a){
	var b,c,d,e,f,g,h,i,elementParent;
	elementParent=document.getElementById("popupFirst");
	for(i=0;i<a.length;i++){
	    b=a[i].organization;//获取单位
	    c=a[i].name;//获取人名
	    d=a[i].reason;//获取原因
	    var newTr = document.createElement("tr");
        newTr.setAttribute("id",i);
        newTr.setAttribute("value",a[i].id);
        newTr.innerHTML='<td class="popup1">惹不起的单位</td>\
		    <td class="popup1">就是大佬</td>\
			<td class="popup2">没有事由我就是来搞笑的</td>\
			<td class="popup3">\
			   <img src="images/frame.png" onClick="srcReset(this)">\
			</td>';
        elementParent.appendChild(newTr);
        element=newTr.getElementsByTagName("td");
        element[0].innerHTML=b;
        element[1].innerHTML=c;
        element[2].innerHTML=d;
    }
}
//打钩后其它图片不可重置src
function srcReset(a){
	$("#popupFirst tr td img[src='images/tick.png']").attr('src','images/frame.png'); 
	a.setAttribute("src","images/tick.png");

}
function confirmData(now){
	var Id= $(now).parent().parent().attr('value');
	$.ajax({
	type:"POST",
	url:"http://bkxjjh.natappfree.cc/seeAuthority",
	data:{
	        target:'updata',
		    status:-1,
		    id:Id,
		    confirm:1,
		},
	success:function(data){
		console.log(data);
	}
})
}
//把gif重置
function changeImg(){
	var a=$("#popupHeader").next().attr("value");
	console.log(a);
	console.log($("#tableTbody tr[value="+a+"]"));
	$("#tableTbody tr[value="+a+"] td img[src='images/loading.gif']").attr("src","images/frame.png");
}

//分页请求
function page(p){
	$.ajax({
		type:"POST",
		url:"http://bkxjjh.natappfree.cc/seeAuthority",
		data:{
				target:'num',
				status:p,
		},
		success:function(data){
			sumPage(data.num);
			//data.num总数
		}
	});
}
//计算页数
var cNow=1;//cNow为当前页面
var aALL;//为计算出来的页数
function sumPage(e){//e传入总条数
	var b,d;//b为now/all,d为now/all的a；
	b=document.getElementById("nowAndAll");
	d=b.getElementsByTagName("a")[0];
    (e%15>0)?aALL=Math.floor(e/15+1):aALL=e/15;
    d.innerHTML=cNow+"/"+aALL;
    if(aALL<2){
			$("#pageTurning").hide();//条数为0就隐藏
		};
}
function pageSet(e){
    var b,d,c,f,aValue;
    //0为首页，1为前一页，2为后一页，3为尾页,4为确定框
	b=document.getElementById("nowAndAll");
	d=b.getElementsByTagName("a")[0];
	if(e==0){
		    cNow=1;
        };//首页重置
	if(e==1){
        	if(cNow>1){
        		cNow=cNow-1;
        	};
    };//前页重置
	if(e==2){
		if(cNow==aALL){
       	c=document.getElementById("nextPage");
	    f=c.getElementsByTagName("a")[0];
	    $(f).attr("href","javascript:alert('到达最后一页')");
	    return;
	}else if(cNow<aALL){
        	cNow=cNow+1;
    };//后页重置
};
	if(e==3){
		cNow=aALL;
	};//尾页重置
	if(e==4){
	    aValue=document.getElementById("inputBox");
	    $aValue=$(aValue).val();
	    if(aALL<$aValue){
		    alert("您输入的页数超过总页数！");
		    return;
	        }else if($aValue>0){
		        cNow=$aValue;
		        console.log(cNow);
	        }else{return;}
	    }
	d.innerHTML=cNow+"/"+aALL;
    getTable(1,cNow-1);
}
//搜索
// function search(){
// 	var aValue=document.getElementById("inputBox");
// 	$aValue=$(aValue).val();
// 	if(aALL<$aValue){
// 		alert("您输入的页数超过总页数！");
// 	}else{

// 	}
// }