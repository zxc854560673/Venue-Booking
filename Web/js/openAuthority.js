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
    getTable("building","NONE");
    //高度自适应
})
//这个函数会获取表格
function getTable(a,b){
//a参数是向后端请求表格 a=“building”就是为获取建筑表格;b是搜索的参数，默认为NONE，表示全部显示，b="/"+id会获取单条建筑
	$.ajax({
		type:"POST",
		url:"http://bkxjjh.natappfree.cc/openAuthority",
		success:function(data){
			console.log(data);
			var tbody,i,buildingName,className,element,canUse,$selectTwo,selectTwo,tdImg;
//获取tbody,buildingName存放建筑名字,className是教室名，element是存放td元素数组,canUse是判断是否能开放权限，以及权限等级 selectTwo是选择框,tdImg为新行的img
			if(a=="building"&&b=="NONE"){//判断建筑表格
				tbody=document.getElementById("tbody1");//获取你第一个表格的tbody
				tbody.innerHTML='<tr id="header">\
							<th>学校建筑</th>\
						</tr>';//重置表格一表头
			}else if(a=="building"&&b!=="NONE"){//判断是否为第二个表格
                tbody=document.getElementById("tbody2");//获取第二个表格的tbody
                tbody.innerHTML='<tr id="header_2">\
							<th>教室</th>\
							<th>开放/关闭权限</th>\
							<th>权限等级</th>\
						</tr>'//重置表格2表头
			}else{
				tbody=document.getElementById("tbody4")///获取第三个表格的tbody
			}
            for(i=0;i<data.length;i++){
            	var newTr = document.createElement("tr");
                newTr.setAttribute("value",data[i].id);
                newTr.onclick="roomParent('this')";//空白添加onclick元素
                buildingName=data[i].building;//获取建筑名称
                className=data[i].room_name;//获取空余教室的名字
                canUse=data[i].can_use
                if(a=="building"&&b=="NONE"){
                	newTr.innerHTML='<td class="Building" onclick="room(this)">建筑物1</td>';
                	tbody.appendChild(newTr);//增加tr
                    element=newTr.getElementsByTagName("td");
                    element[0].innerHTML=buildingName;//显示建筑名
                    authorityClick(0);//显示建筑表格
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
                    authorityClick(-1);//显示课室表格
                }
            }
		},
		data:{
			target:a,
			parent:b,
			yeshu:0,
		}
	});
}
function room(e){
    //e为被点击的td元素
    var tr,trId;// tr是点击的元素，trId是点击的tr的value
    tr=$(e).parent();
    trId=$(tr).attr("value");
    console.log(trId);
    getTable("building","/"+trId);

}
//表格显示函数函数
function authorityClick(e){//e==0时为建筑，e==1为用户，e=-1时为教室
	var a,b,c;
	a=document.getElementById("Table_1");//a为表格1
	b=document.getElementById("Table_2");//b为表格2
	c=document.getElementById("Table_4");//c为表格3
	if(e==0){$(a).show();$(b).hide();$(c).hide();};//参数为0，只显示表格1
	if(e==1){$(c).show();$(b).hide();$(a).hide();};//参数为1，只显示表格4
	if(e==-1){$(b).show();$(c).hide();$(a).hide();};//参数为-1，只显示表格2
}
function changImg(e){//触发事件的元素
	var img,$select;//存src
	img=e.getAttribute("src");//获取src
	$select=$(e).parent().parent().find("td").find("select");
	console.log(img);
	if(img=="images/tick.png"){
		e.setAttribute("src","images/frame.png");
		$select.attr("disabled","disabled");
	}else{
	    e.setAttribute("src","images/tick.png");
	    $select.removeAttr("disabled");
    };//重置
	openOrNot(e);
}
function openOrNot(e){//触发事件的元素
	var trID,imgSrc,selectValue,b;//获取点击所在tr的id,imgSrc为图片的src,selectValue是选择的级别,b为给后台的级别
	$trID=$(e).parent().parent();//获取所在的tr
	trID=$trID[0].getAttribute("value");//获取点击所在tr的id
	imgSrc=$trID.find("td").find("img").attr("src");//获取点击所在tr的src
	selectValue=$trID.find("td").find("option:selected").val();//获取下拉框的value
	if(imgSrc=="images/frame.png"){b=-1;};//开启
	if(imgSrc=="images/tick.png"&&selectValue=="one"){b=0;};//所有人
	if(imgSrc=="images/tick.png"&&selectValue=="two"){b=1;};//老师
	$.ajax({
		type:"POST",
		url:"http://bkxjjh.natappfree.cc/openAuthority",
		data:{
			target:"building_change",
			id:trID,
			status:b,
		},
		success:function(data){
			console.log(data);
			if(b=-1){
				imgSrc="images/tick.png";
			}
		},
	})
}