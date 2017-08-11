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
			var tbody,i,buildingName,className,element;
//获取tbody,buildingName存放建筑名字,className是教室名，element是存放td元素数组
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
                if(a=="building"&&b=="NONE"){
                	newTr.innerHTML='<td class="Building" onclick="room(this)">建筑物1</td>';
                	tbody.appendChild(newTr);//增加tr
                    element=newTr.getElementsByTagName("td");
                    element[0].innerHTML=buildingName;//显示建筑名
                    authorityClick(0);//显示建筑表格
                }else if(a=="building"&&b!=="NONE"){
                	newTr.innerHTML='<td class="RoomAuthority">XXX</td>\
							<td class="authorityAcross">\
								<img src="images/frame.png">\
							</td>';
                	tbody.appendChild(newTr);//增加tr
                    element=newTr.getElementsByTagName("td");
                    element[0].innerHTML=className;//显示建筑名
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
function textClick(a){//e==0时为建筑，e==1为用户，e=-1时为教室
    authorityClick(0);
    if(e==0){getTable("building","NONE")};
//    if(e==1){}
}
