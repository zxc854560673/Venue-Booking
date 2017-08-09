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
    getTable(0);
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
function show_element(e,ok,table){  
	var a,b,c;
	var Id= $(e).parent().parent().attr('value');
		$.ajax({
			 type:"POST",
			 url:"http://bkxjjh.natappfree.cc/seeAuthority",
			 data:{
				target:'updata',
				status:ok,
				id:Id,
			 },
			})
    function first(e){
		e.src="images/tick.png";
		if(table==0){second(e,0);}
		if(table==1){second(e,2);}
		if(table==2){second(e,1);}
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
    	     getTable(0);
           }//点击完了重新获取
       },710);
    };
    e.onClick=null;
    first(e);
}

//获取表格内容
function getTable(p){
	$.ajax({
			type:"POST",
			url:"http://bkxjjh.natappfree.cc/seeAuthority",
			success:function importTable_1(data){
	                    var a,b,c,d,e,f,g;
                        var i,element;
                        for(i=0;i<data.length;i++){
                        	if(p==0){elementParent=document.getElementById("tableTbody");}
    	                    if(p==-1){elementParent=document.getElementById("tableTbody_1");}
    	                    if(p==1){elementParent=document.getElementById("tableTbody_2");}
                            var newTr = document.createElement("tr");
                            newTr.setAttribute("id",i);
                            newTr.setAttribute("value",data[i].id);
                            if(p==0){newTr.innerHTML = '<td class="sumbitTime">XXXX年XX月XX日&nbsp;XX:XX:XX</td><td class="classPlace">教室地址1</td><td class="applyTime">XX月XX日&nbsp;第XX节~第XX节</td><td class="Office">真实存在的单位</td><td class="Applicant">XXX</td><td class="Reason">合乎情理没有毛病的理由</td><td class="authorityAcross_0"><img src="images/frame.png" onClick="show_element(this,-1,0)"></td><td class="authorityAcross_1"><img src="images/frame.png" onClick="show_element(this,1,0)"></td>'}
                            if(p==-1){newTr.innerHTML = '<td class="sumbitTime">XXXX年XX月XX日&nbsp;XX:XX:XX</td><td class="classPlace">教室地址1</td><td class="applyTime">XX月XX日&nbsp;第XX节~第XX节</td><td class="Office">真实存在的单位</td><td class="Applicant">XXX</td><td class="Reason">合乎情理没有毛病的理由</td><td class="authorityAcross_2"><img src="images/tick.png" onClick="show_element(this,0,1);"></td>'}
                            if(p==1){newTr.innerHTML = '<td class="sumbitTime">XXXX年XX月XX日&nbsp;XX:XX:XX</td><td class="classPlace">教室地址1</td><td class="applyTime">XX月XX日&nbsp;第XX节~第XX节</td><td class="Office">真实存在的单位</td><td class="Applicant">XXX</td><td class="Reason">合乎情理没有毛病的理由</td><td class="authorityAcross_2"><img src="images/tick.png" onClick="show_element(this,0,2);"></td>'}
                            elementParent.appendChild(newTr);
                            element=document.getElementById(i).getElementsByTagName("td");
    	                    console.log(data[i]);
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
			}
		});
}
//点击未通过触发的行为
function pass(g){
	var a,b,c,d,m,f;
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
    getTable(-1);
}
function noPass(g){
	var a,b,c,d,m,f;
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
    getTable(1);
}
function waiting(){
	var a,b,c,d,m,f;
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
    getTable(0);
}
//分页请求
function page(p){
	$.ajax({
		type:"POST",
		url:"http://bkxjjh.natappfree.cc/seeAuthority",
		data:{
				target:'num',
				status:p,
		}
		success:
	});
}