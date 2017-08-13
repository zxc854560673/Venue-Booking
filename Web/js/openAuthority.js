//高度适应。
window.onload=function(){
	var a,b,c,d,$b;
    a=window.screen.height//获取当前页面高度。
    b=document.getElementById("All");//获取最大的div的高度。
    $b=$(b);
    c=a-150+"px";
    $b.css("min-height",c)
};
//首次加载表格
$(document).ready(function(){
    getTable("building","NONE",data1);
    //高度自适应
})
//这个函数会获取表格
function getTable(a,b,c){
//a参数是向后端请求表格 a=“building”就是为获取建筑表格;b是搜索的参数，默认为NONE，表示全部显示，b="/"+id会获取单条建筑,C参数是发data的类
    var e;//e=0为表格一 e=1为表格四 -1是表格2
	$.ajax({
		type:"POST",
		url:"http://n8qfwp.natappfree.cc/openAuthority",
		success:function(all_data){
			console.log(all_data);
			var data=all_data.data;
			var num=all_data["detail"]["num"];
			var tbody,i,buildingName,className,element,canUse,$selectTwo,selectTwo,tdImg,rank,userName,tdImg1,tdImg2;
//获取tbody,buildingName存放建筑名字,className是教室名，element是存放td元素数组,canUse是判断是否能开放权限，以及权限等级 selectTwo是选择框,tdImg为新行的img，rank是表格三的等级,userName是表格三的用户名
//tdImg1是表格三的第一个图片，tdImg2是表格三的第二个图片
			if(a=="building"&&b=="NONE"){//判断建筑表格
				e=0;
				tbody=document.getElementById("tbody1");//获取你第一个表格的tbody
				tbody.innerHTML='<tr id="header">\
							<th>学校建筑</th>\
						</tr>';//重置表格一表头
			}else if(a=="building"&&b!=="NONE"){//判断是否为第二个表格
				e=-1;
                tbody=document.getElementById("tbody2");//获取第二个表格的tbody
                tbody.innerHTML='<tr id="header_2">\
							<th>教室</th>\
							<th>开放/关闭权限</th>\
							<th>权限等级</th>\
						</tr>'//重置表格2表头
			}else if(a=="person"){
				e=1;
				tbody=document.getElementById("tbody4")//获取第三个表格的tbody
				tbody.innerHTML='<tr id="header_4">\
							<th rowspan="2">姓名</th>\
							<th colspan="3">权限等级</th>\
						</tr>\
						<tr id="header_4_2">\
							<th>一级</th>\
							<th>二级</th>\
						</tr>'//重置表格三表头
			}
            for(i=0;i<data.length;i++){
            	var newTr = document.createElement("tr");
                newTr.setAttribute("value",data[i].id);
                newTr.onclick="roomParent('this')";//空白添加onclick元素
                buildingName=data[i].building;//获取建筑名称
                className=data[i].room_name;//获取空余教室的名字
                canUse=data[i].can_use;//获取是否能使用
                rank=data[i].identify;//获取表格3的等级;
                userName=data[i].name;//获取表格3的用户名
                if(a=="building"&&b=="NONE"){
                	newTr.innerHTML='<td class="Building" onclick="room(this)">建筑物1</td>';
                	tbody.appendChild(newTr);//增加tr
                    element=newTr.getElementsByTagName("td");
                    element[0].innerHTML=buildingName;//显示建筑名
                    $("#Table_1").show();
                    $("#Table_2").hide();
                    $("#Table_4").hide();//显示建筑表格
                }else if(a=="building"&&b!=="NONE"){
                	newTr.innerHTML='<td class="RoomAuthority">XXX</td>\
							<td class="authorityAcross">\
								<img src="images/tick.png" onclick="changImg(this)">\
							</td>\
							<td class="select"><select name="selectRank" onchange="openOrNot(this)">\
							<option value="one" selected = "selected">一级</option>\
							<option value="two">二级</option>\
							</select></td>';
                	tbody.appendChild(newTr);//增加tr
                    element=newTr.getElementsByTagName("td");
                    element[0].innerHTML=className;//显示建筑名
                    tdImg=element[1].getElementsByTagName("img")[0];//获取图片
                    var one,two;//1级和2级 
                    $selectTwo=$(element[2]).find("select").find("option");
                    one=$selectTwo[0];
                    two=$selectTwo[1];
                    //获得权限级别
                    if(canUse==0){
                        $(one).attr("selected","selected");  
            	        $(two).removeAttr("selected");
                    }else if(canUse==1){
                    	$(two).attr("selected","selected");
               	        $(one).removeAttr("selected");
                    }else if(canUse==-1){
                        $(one).removeAttr("selected");
                        $(two).removeAttr("selected");
                        $(tdImg).attr("src","images/frame.png");
                    }
                    $("#Table_2").show();
                    $("#Table_1").hide();
                    $("#Table_4").hide();//显示课室表格
                }else if(a=="person"){
                	newTr.innerHTML='<td class="personName">XXX</td>\
							<td class="Across">\
								<img src="images/frame.png" onclick="authorityChange(this,0)">\
							</td>\
							<td class="Across">\
								<img src="images/frame.png" onclick="authorityChange(this,1")>\
							</td>';
					tbody.appendChild(newTr);//增加tr
					element=newTr.getElementsByTagName("td");
					element[0].innerHTML=userName;
					tdImg1=element[1].getElementsByTagName("img")[0];//获取1图片
					tdImg2=element[2].getElementsByTagName("img")[0];//获取2图片
					//根据等级设置图片
					if(rank==0){tdImg1.setAttribute("src","images/tick.png");tdImg2.setAttribute("src","images/frame.png");};
					if(rank==1){tdImg2.setAttribute("src","images/tick.png");tdImg1.setAttribute("src","images/frame.png");};
				}
            }
            sumPage(num,e);
		},
		data:c,
	});
}
var data1={
			target:"building",
			parent:"NONE",
			yeshu:0,
		};//状态1，获取表格1
function room(e){
    //e为被点击的td元素
    var tr,trId;// tr是点击的元素，trId是点击的tr的value
    tr=$(e).parent();
    trId=$(tr).attr("value");
    getTable("building","/"+trId,{
			target:"building",
			parent:"/"+trId,
			yeshu:0,
		});
    $("#Search input[type='text']").attr("placeholder","请输入课室");
}
//表格显示函数函数
function authorityClick(e){//e==0时为建筑，e==1为用户，e=-1时为教室
	if(e==0){$("#Table_1").show();$("#Table_2").hide();$("#Table_4").hide();getTable("building","NONE",data1);$("#Select img").css("left","0px");$("#Search input[type='text']").attr("placeholder","请输入建筑");$("#Search input[type='text']").val("");};//参数为0，只显示表格1，分页请求
	if(e==1){$("#Table_4").show();$("#Table_2").hide();$("#Table_1").hide();;getTable("person","NONE",{
			target:"person",
			yeshu:0,
		});$("#Select img").css("left","126px");$("#Search input[type='text']").attr("placeholder","请输入姓名");$("#Search input[type='text']").val("");};//参数为1，只显示表格4，分页请求
	if(e==-1){$("#Table_2").show();$("#Table_4").hide();$("#Table_1").hide();$("#Search input[type='text']").val("");};//参数为-1，只显示表格2
}
function changImg(e){//触发事件的元素
	var img,$select,selectReset;//存src,selectReset重置
	img=e.getAttribute("src");//获取src
	$select=$(e).parent().parent().find("td").find("select");
	if(img=="images/tick.png"){
		e.setAttribute("src","images/wrong.png");
		$select.attr("disabled","disabled");
	    $select.find("option:selected").removeAttr("selected");
	    selectReset=$(".select select option[value='one']");
        selectReset.attr("selected","selected");
	}else{
	    e.setAttribute("src","images/tick.png");
	    $select.removeAttr("disabled");
    };//重置
	openOrNot(e);
}
function openOrNot(e){//触发事件的元素 表格2的开放权限
	var trID,imgSrc,selectValue,b;//获取点击所在tr的id,imgSrc为图片的src,selectValue是选择的级别,b为给后台的级别
	$trID=$(e).parent().parent();//获取所在的tr
	trID=$trID[0].getAttribute("value");//获取点击所在tr的id
	imgSrc=$trID.find("td").find("img").attr("src");//获取点击所在tr的src
	selectValue=$trID.find("td").find("option:selected").val();//获取下拉框的value
	if(imgSrc=="images/wrong.png"){b=-1;};//开启
	if(imgSrc=="images/tick.png"&&selectValue=="one"){b=0;};//所有人
	if(imgSrc=="images/tick.png"&&selectValue=="two"){b=1;};//老师
	$.ajax({
		type:"POST",
		url:"http://n8qfwp.natappfree.cc/openAuthority",
		data:{
			target:"building_change",
			id:trID,
			status:b,
		},
		success:function(data){
			console.log(data);
		},
	})
}
//表格3的权限调整
function authorityChange(e,b){//触发事件的元素 表格2的开放权限,e为点击元素，b为给后台的级别
	var trID,img;//获取点击所在tr的id,img是获取1和2图的img
	$trID=$(e).parent().parent();//获取所在的tr
	trID=$trID[0].getAttribute("value");//获取点击所在tr的id
    $img=$trID.find("td").find("img");
    if(b==0){$img[0].setAttribute("src","images/tick.png");$img[1].setAttribute("src","images/frame.png");};
    if(b==1){$img[1].setAttribute("src","images/tick.png");$img[0].setAttribute("src","images/frame.png");};
	$.ajax({
		type:"POST",
		url:"http://n8qfwp.natappfree.cc/openAuthority",
		data:{
			target:"building_change",
			id:trID,
			status:b,
		},
		success:function(data){
			console.log(data);
		},
	})
}
var cNow_0=1;//cNow_0为表格一的当前页数
var aALL_0;//表格一的总页数
var cNow_1=1;//cNow_1为表格四的当前页数
var aALL_1;//表格四的总页数
var cNow_2=1;//cNow_2为表格二的当前页数
var aALL_2;//表格二的总页数

function sumPage(length,e){//data为后台传来的数据,e是表格状态(0是表格1,-1是表格2,1是表格4)
	var pageAll,b,d;;//pageAll总页数,b为now/all,d为now/all的a；
	b=document.getElementById("nowAndAll");
	d=b.getElementsByTagName("a")[0];
	pageAll=length;
	if(e==0){
		(pageAll%15>0)?aALL_0=Math.floor(pageAll/15+1):aALL_0=pageAll/15;
		d.innerHTML=cNow_0+"/"+aALL_0;
	}
	if(e==1){
		(pageAll%15>0)?aALL_1=Math.floor(pageAll/15+1):aALL_1=pageAll/15;
		d.innerHTML=cNow_1+"/"+aALL_1;
	}
	if(e==2){
		(pageAll%15>0)?aALL_2=Math.floor(pageAll/15+1):aALL_2=pageAll/15;
		d.innerHTML=cNow_2+"/"+aALL_2;
	}
	if(aALL_1<2||aALL_2<2||aALL_0<2){
		$("#pageTurning").hide();//页数为0就隐藏
	}
}
function pageSet(page){//传入的页数操作，0是首页，1是下一页，2是上一页，3是尾页,4为确定框。
	var e,table_1,table_2,table_4,c,f,aValue,b,d;//e是显示的表格(0是表格1,-1是表格2,1是表格4)，
	b=document.getElementById("nowAndAll");
	d=b.getElementsByTagName("a")[0];
	table_1=$("#Table_1").css("display");
	table_2=$("#Table_2").css("display");
	table_4=$("#Table_4").css("display");
	if(table_2=="none"&&table_4=="none"){e=0};
	if(table_1=="none"&&table_4=="none"){e=-1};
	if(table_2=="none"&&table_1=="none"){e=1};
	//表格1
	if(e==0){
		if(page==0){
			cNow_0=1;
		};//表格一首页重置
		if(page==1){
			if(cNow_0>1){
        	cNow_0=cNow_0-1;
        	};//表格一前页重置
		}
		if(page==2){
            if(cNow_0==aALL_0){
         	c=document.getElementById("nextPage");
	        f=c.getElementsByTagName("a")[0];
	        $(f).attr("href","javascript:alert('到达最后一页')");
	        return;
		    }else if(cNow_0<aALL_0){
			cNow_0=cNow_0+1;
		    }//后页重置
	    }
	    if(page==3){
		    cNow_0=aALL_0;
	    };//尾页重置
		if(page==4){
	    aValue=document.getElementById("inputBox");
	    $aValue=$(aValue).val();
	    if(aALL_0<$aValue){
		    alert("您输入的页数超过总页数！");
		    return;
	    }else if($aValue>0){
		        cNow_0=$aValue;
	    }else{return;}
	    }
	    d.innerHTML=cNow_0+"/"+aALL_0;
	    console.log(cNow_0);
	    console.log(aALL_0);
        getTable("building","NONE",{
			target:"building",
			parent:"NONE",
			yeshu:cNow_0-1,
		});
    }
		//表格4
		if(e==-1){
		if(page_2==0){
			cNow_2=1;
		};//表格一首页重置
		if(page_2==1){
			if(cNow_2>1){
        	cNow_2=cNow_2-1;
        	};//表格一前页重置
		}
		if(page==2){
            if(cNow_2==aALL_2){
         	c=document.getElementById("nextPage");
	        f=c.getElementsByTagName("a")[0];
	        $(f).attr("href","javascript:alert('到达最后一页')");
	        return;
		    }else if(cNow_2<aALL_2){
			cNow_2=cNow_2+1;
		    }//后页重置
	    }
	    if(page==3){
		    cNow_2=aALL_2;
	    };//尾页重置
		if(page==4){
	    aValue=document.getElementById("inputBox");
	    $aValue=$(aValue).val();
	    if(aALL_2<$aValue){
		    alert("您输入的页数超过总页数！");
		    return;
	    }else if($aValue>0){
		        cNow_2=$aValue;
	    }else{return;}
	    }
	    d.innerHTML=cNow_2+"/"+aALL_2;
        getTable("person","NONE",{
			target:"person",
			yeshu:cNow_2-1,
		});
    }
        //表格2
		if(e==1){
		if(page_1==0){
			cNow_1=1;
		};//表格一首页重置
		if(page_1==1){
			if(cNow_1>1){
        	cNow_1=cNow_1-1;
        	};//表格一前页重置
		}
		if(page==2){
            if(cNow_1==aALL_1){
         	c=document.getElementById("nextPage");
	        f=c.getElementsByTagName("a")[0];
	        $(f).attr("href","javascript:alert('到达最后一页')");
	        return;
		    }else if(cNow_1<aALL_1){
			cNow_1=cNow_1+1;
		    }//后页重置
	    }
	    if(page==3){
		    cNow_1=aALL_1;
	    };//尾页重置
		if(page==4){
	    aValue=document.getElementById("inputBox");
	    $aValue=$(aValue).val();
	    if(aALL_1<$aValue){
		    alert("您输入的页数超过总页数！");
		    return;
	    }else if($aValue>0){
		        cNow_1=$aValue;
	    }else{return;}
	    }
	    d.innerHTML=cNow_1+"/"+aALL_1;
        getTable("building","NONE",{
			target:"building",
			parent:"NONE",
			yeshu:cNow_1-1,
		});
    }
}
//输入框搜索
function search(input){//输入框元素
	var a=$(input).val();//获取输入值
	table_1=$("#Table_1").css("display");
	table_2=$("#Table_2").css("display");
	table_4=$("#Table_4").css("display");
	if(table_2=="none"&&table_4=="none"){
		getTable("building","NONE",{
			target:"building_search",
			building_name:a,
			room_name:"NONE",
		})
	};//表格一搜索
	if(table_1=="none"&&table_4=="none"){
		getTable("building","kkkk",{
			target:"building_search",
			room_name:a,
		})
	};
	if(table_2=="none"&&table_1=="none"){
		getTable("person","NONE",{
			target:"person",
			name:a,
		})
	};//判断表格状态

}