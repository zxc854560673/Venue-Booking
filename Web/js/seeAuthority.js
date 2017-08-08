var time='480-525|535-580|600-645|655-700|860-905|915-960|980-1025|1035-1080|1140-1185|1195-1240|1250-1295';
var strs=new Array();
strs=time.split("|")
var range=new Array();
$(document).ready(function(){
		$.ajax({
			type:"POST",
			url:"http://bkxjjh.natappfree.cc/seeAuthority",
			success:function importTable_1(data){
	                    var a,b,c,d,e,f,g,h;
                        var i,element;
                        for(i=0;i<data.length;i++){
    	                    elementParent=document.getElementById("tableTbody"); 
                            var newTr = document.createElement("tr");
                            newTr.setAttribute("id",i)
                            newTr.innerHTML = '<td class="sumbitTime">XXXX年XX月XX日&nbsp;XX:XX:XX</td><td class="classPlace">教室地址1</td><td class="applyTime">XX月XX日&nbsp;第XX节~第XX节</td><td class="Office">真实存在的单位</td><td class="Applicant">XXX</td><td class="Reason">合乎情理没有毛病的理由</td><td class="authorityAcross_0"><img src="images/frame.png" onClick="show_element(this)"></td><td class="authorityAcross_1"><img src="images/frame.png"></td>'
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
				status:'0',
			}
		});
})
//点击通过后，向后台发送请求改变数据状态。
// $(function(){
// 	$(".authorityAcross_0").click(function(){
// 		Id= $('this').parent().parent().attr('id');
// 		$.ajax({
// 			type:"POST",
// 			url:"http://bkxjjh.natappfree.cc/seeAuthority",
// 			data:{
// 				target:'getdata',
// 				status:'0',
// 				id:'Id',
// 			}
// 			success:show_element(this);
// 			}
// 		});
// 	});
// })
function show_element(e){  
	var a,b;
    function first(e){
		e.src="images/tick.png";
		second(e);
    	//setTimeout(function(){second(e)},1000);
    };
    function second(e){
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
    };
    e.onClick=null;
    first(e);
    
}

/*$(function(){
	$("#Waiting").click(function(){
		$.ajax({
			type:"POST",
			url:"seeAuthority",
			//success:
			data:{
				target:'0',
			}
		});
	});
})
$(function(){
	$("#Pass").click(function(){
		$.ajax({
			type:"POST",
			url:"seeAuthority",
			//success:
			data:{
				target:'1',
			}
		});
	});
})
$(function(){
	$("#unPass").click(function(){
		$.ajax({
			type:"POST",
			url:"seeAuthority",
			//success:
			data:{
				target:'2',
			}
		});
	});
})*/
//计算申请的课
function findClass(a,b){
	var start_time,end_time;
	var i,k;
	for(i=0;i<strs.length;i++){
		range=strs[i].split("-");
		if(a>=range[0] && a<=range[1]){
			start_time=i+1;
		}
		if(b>=range[0] && b<=range[1]){
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