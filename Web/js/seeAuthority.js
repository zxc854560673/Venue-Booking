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
                        //b与教师地址匹配；c,d用来计算申请第几天第几节课；f用来与申请单位匹配；g与申请人匹配；,h用来与事由匹配
                        var i,element;
                        for(i=0;i<data.length;i++){
    	                    element=document.getElementById(i).getElementsByTagName("td");
    	                    console.log(data[i]);
    	                    a=data[i].apply_time;//a与提交时间匹配
    	                    element[0].innerHTML=a;
    	                    b=data[i].building_name+" "+data[i].room_name;//b与教室地址匹配；
    	                    element[1].innerHTML=b;
    	                    c=data[i].apply_for_time+" ";
    	                    d=findClass(data[i].start_time,data[i].end_time);
    	                    element[2].innerHTML=c+d;
    	                }
                    },
			data:{
				status:'0',
			}
		});
})
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
function findClass(a,b){
	var start_time,end_time;
	var i,k;
	for(i=0;i<strs.length;i++){
		range=strs[i].split("-");
		if(range[i]<a<range[i+1]){
			start_time=i+1;
		}
		if(range[i]<b<range[i+1]){
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