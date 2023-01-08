/* v1.0 2017.3.30 김석숭 
DataTables를 프로토타입으로 제어하는 스크립트가 추가되어 있습니다

DataTables는 표준 jQuery 형식으로 바인딩 할 수있는 여러 가지 사용자 지정 이벤트를 발생시킵니다
이러한 이벤트가 발생할 때 코드에서 사용자 지정 작업을 수행 할 수 있습니다
DataTable에 의해 발생 된 모든 커스텀 이벤트는 이벤트를 발생시키는 다른 jQuery 플러그인 과의 
충돌 을 방지하기 위해 네임 스페이스로 시작됩니다. DataTables on()메서드는 jQuery on()메서드 처럼 
사용할 수 있지만 필요할 경우 자동으로 네임 스페이스를 추가 합니다.

$(document).ready(function () {
    var eventFired = function (type) {
        alert(type + ' event - ' + new Date().getTime());
    }

    $('#example')
        .on('order.dt', function () { eventFired('Order'); })
        .on('search.dt', function () { eventFired('Search'); })
        .on('page.dt', function () { eventFired('Page'); })
       
});
*/
var gridTable = function () {
    this.rowIndex = 0;
	this.dataTable = "";
    this.url = "";
	this.jsonData = "";
}
var gridRowindex = -1;
gridTable.prototype.Execute = function (dataArray, callback) {
	var jsonEncode = "";
	if (dataArray === undefined || dataArray==="") dataArray = "";
	else jsonEncode = JSON.stringify(dataArray); 
//    var url = this.url.replace(".aspx", "");
	var url = this.url;

    $.ajax({
        type: 'POST',
        contentType: 'application/json',
		url: encodeURI(url),
        data: jsonEncode
    })
		.done(function (sendmsg) {
			try {
				var msg = sendmsg.split('º'); 
                if (callback !== undefined && callback !== null)
					callback(msg[0]);
				if (msg.length > 1 && msg[1] !== "") {
					$("#script_server").remove();
					var s = document.createElement("div");
					s.id = "script_server";
					$("body").append(s);
					var script = "<script>" + msg[1] + "</script>";
					$("#script_server").append(script);

				}

            } catch (exception) {
                popupMessage(this.url + " :" + exception);
            }
            
        });
}

function modelToData(model) {
	var _model = model;
	return JSON.parse(_model.replaceAll("&quot;", '"'));
}

function jsonParse(obj) {
	return Function('"<script>use strict";return (' + obj + ')</script>')();
}

function GridDataBind(gridData, gridSetting) {
	var div = document.createElement('script');
	div.id = 'div_script';
	document.body.appendChild(div);
	var content = $("#div_script");
	var script = $("<script>");
	script.html(gridData.replaceAll("&quot;", '"') + gridSetting.replaceAll("&quot;", '"'));
	content.append(script)
}

//Json Data를 수동으로 바인딩  Callback: json포맷으로 들어오면 포커스 아니면 콜백함수로 작동
gridSetData = function (grid, sendmsg, Callback) {
	sendmsg = sendmsg.replace(/\n/g, '');
	sendmsg = sendmsg.replace(/\//g, '&#47;');
	sendmsg = sendmsg.replace(/\r/g, ''); 
	//sendmsg = sendmsg.replace(/\'/g, '&#39;');
	var msg = sendmsg.split('º');
	
	if (msg[1] !== "" && msg[1] !== undefined) {
        var option = new popOption();
        if (msg[1].length === 3)
            option.messageCode = msg[1];
        else option.message = msg[1];

        PopupMessage(option);
	}

	if (msg[2] !== "") {
		$("#script_server").remove();
		var s = document.createElement("div");
		s.id = "script_server";
		$("body").append(s);
		var script = "<script>" + msg[2] + "</script>";
		$("#script_server").append(script);
	}

    var table = $('#' + grid).DataTable();
    if (msg[0] === "") {
        table.clear();
        table.draw(false);
        return;
	}
	var jsonDecode;
	try {
		jsonDecode = JSON.parse(msg[0]); 
	} catch (exception) {
		popupMessage(this.url + " :" + exception);
		document.write(msg[0]);
		return;
	}
	
    var jdata = new Array();

    table.clear();
    for (var i = 0; i < jsonDecode.length; i++) {
        jdata = jsonDecode[i];
        table.row.add(jdata);
    }
    //table.order([0, "asc"]).draw(false);
    table.draw(false);

    if (gridRowindex > -1) {
        table.$('tr.selected').removeClass('selected');
        $(table.row(gridRowindex).nodes()).addClass('selected');
    }

	if (Callback !== undefined && Callback !== null && Callback !== "") {
		if (typeof (Callback) === "Function")
			Callback();
		else gridTable.prototype.gridFocus(Callback, grid);
	}
}

gridTable.prototype.Update = function (dataArray, serviceUrl) {
	var grid = this.dataTable;
	var jsonEncode = JSON.stringify(dataArray);
	$.ajax({
		type: 'POST',
		contentType: 'application/json',
		url: serviceUrl,
        data: jsonEncode
	})
		.done(function (model) {
			var table = $("#" + grid).DataTable();
			var jsonDecode = JSON.parse(model.replaceAll("&quot;", '"'));
			var jdata = new Array();
			table.clear();
			for (var i = 0; i < jsonDecode.length; i++) {
				jdata = jsonDecode[i];
				table.row.add(jdata);
			}
			//table.order([0, "asc"]).draw(false);
			table.draw(true);
	});
}

gridTable.prototype.ShowData = function (dataArray, serviceUrl, Callback) {
	var grid = this.dataTable;
	var jsonEncode = JSON.stringify(dataArray);
	$.ajax({
		type: 'GET',
		contentType: 'application/json',
		url: serviceUrl,
		data: jsonEncode
	})
		.done(function (model) {
			alert(model);
			var table = $("#" + grid).DataTable();
			var jsonDecode = JSON.parse(model.replaceAll("&quot;", '"'));
			var jdata = new Array();
			table.clear();
			for (var i = 0; i < jsonDecode.length; i++) {
				jdata = jsonDecode[i];
				table.row.add(jdata);
			}
			//table.order([0, "asc"]).draw(false);
			table.draw(true);
		});
}

// arg : Querystring 파리미터 Callback: json포맷으로 들어오면 포커스 아니면 콜백함수로 작동
gridTable.prototype.ShowData2 = function (arg, Callback) {
	var grid = this.dataTable;
	grid.ext = _ext = "throw";
    if (arg === undefined) arg = "";
//  var url = this.url.replace(".aspx", "");
	var url = this.url;
	$.ajax({
		type: 'POST',
		url: encodeURI(url+arg)
	})
		.done(function (sendmsg) {
			try {
				if (sendmsg.indexOf("alert('Session") != -1) {
					//세션타임아웃으로 인해 alert 메시지가 들어오는 경우 처리
					$("#script_server").remove();
					var s = document.createElement("div");
					s.id = "script_server";
					$("body").append(s);
					$("#script_server").append(sendmsg);
					return;
				}
				var msg = sendmsg.split('º');
				if (msg.length > 1) {
					if (msg[1] !== "") {
						var option = new popOption();
						if (msg[1].length === 3)
							option.messageCode = msg[1];
						else option.message = msg[1];

						PopupMessage(option);
					}
					if (msg.length > 2) {
						if (msg[2] !== "") {
							$("#script_server").remove();
							var s = document.createElement("div");
							s.id = "script_server";
							$("body").append(s);
							var script = "<script>" + msg[2] + "</script>";
							$("#script_server").append(script);
						}
					}
				}
				$("#LoadingProgress").hide();

				var table = $('#' + grid).DataTable();
				if (msg[0] === "") {
					table.clear();
					table.draw(false);
					return;
				}

				var jsonDecode = JSON.parse(msg[0]);
				var jdata = new Array();
				this.jsonData = jsonDecode;

				table.clear();
				for (var i = 0; i < jsonDecode.length; i++) {
					jdata = jsonDecode[i];
					table.row.add(jdata);
				}
				//table.order([0, "asc"]).draw(false);
				table.draw(true);
				

				if (gridRowindex > -1) {
					table.$('tr.selected').removeClass('selected');
					$(table.row(gridRowindex).nodes()).addClass('selected');
				}

				if (Callback !== undefined && Callback !== null && Callback !== "") {
					if (typeof (Callback) === "Function")
						Callback();
					else gridTable.prototype.gridFocus(Callback, grid);
				}
				

			} catch (exception) {
				popupMessage(this.url + " :" + exception);
			}
			// table.rows.add(msg).draw(false);
		});
}
// dataArray : 배열, option:정의하면 팝업창 호출
gridTable.prototype.SaveData = function (dataArray, popup, insert) {
    if (popup === undefined) popup = true;
    var grid = this.dataTable;
//    var url = this.url.replace(".aspx", "");
	var url = this.url;
    var jsonEncode = JSON.stringify(dataArray); 
	if ($("#hidIUDGbn").val() === "I" || insert === true) {
        $.ajax({
            type: 'POST',
            contentType: 'application/json',
			url: encodeURI(url) + "&grid=" + grid,
            data: jsonEncode
        })
			.done(function (sendmsg) {
				if (sendmsg.indexOf("alert('Session") != -1) {
					//세션타임아웃으로 인해 alert 메시지가 들어오는 경우 처리
					$("#script_server").remove();
					var s = document.createElement("div");
					s.id = "script_server";
					$("body").append(s);
					$("#script_server").append(sendmsg);
					return;
				}
                var msg = sendmsg.split('º');
				if (msg.length > 1 && msg[1] !== "") {
                    var option = new popOption();
                    if (msg[1].length === 3)
                        option.messageCode = msg[1];
                    else option.message = msg[1];

                    if (popup === true)
                        PopupMessage(option);
                }
                var jsonDecode = JSON.parse(msg[0]);
                var jdata = jsonDecode[0];
                var table = $('#' + grid).DataTable();
                var rows = table.rows().data().length + 1;
                jdata[0] = rows;
                table.row.add(jdata).draw(false);
                //$('#' + grid).DataTable().order([order, "desc"]).draw(false);

                table.$('tr.selected').removeClass('selected');
                $(table.row(rows - 1).nodes()).addClass('selected');

                if (msg[2] !== "") {
                    $("#script_server").remove();
                    var s = document.createElement("div");
                    s.id = "script_server";
                    $("body").append(s);
                    var script = "<script>" + msg[2] + "</script>";
                    $("#script_server").append(script);
                }
            });
    }
    else {
        $.ajax({
            type: 'POST',
            contentType: 'application/json',
			url: encodeURI(url) + "&grid=" + grid,
            data: jsonEncode
        })
			.done(function (sendmsg) {
				if (sendmsg.indexOf("alert('Session") != -1) {
					//세션타임아웃으로 인해 alert 메시지가 들어오는 경우 처리
					$("#script_server").remove();
					var s = document.createElement("div");
					s.id = "script_server";
					$("body").append(s);
					$("#script_server").append(sendmsg);
					return;
				}
                var msg = sendmsg.split('º');
				if (msg.length > 1 && msg[1] !== "") {
                    var option = new popOption();
                    if (msg[1].length === 3)
                        option.messageCode = msg[1];
                    else option.message = msg[1];
                   
                    if (popup === true)
                        PopupMessage(option);
                }
                var jsonDecode = JSON.parse(msg[0]);
                var jdata = jsonDecode[0];
                var table = $('#' + grid).DataTable();
                jdata[0] = gridRowindex+1;
                table.row(gridRowindex).data(jdata).draw(false);

                if (msg[2] !== "") {
                    $("#script_server").remove();
                    var s = document.createElement("div");
                    s.id = "script_server";
                    $("body").append(s);
                    var script = "<script>" + msg[2] + "</script>";
                    $("#script_server").append(script);
                }
                //table.$('tr.selected').removeClass('selected');
                //$(table.row(gridRowindex).nodes()).addClass('selected'); 
            });
    }
}

gridTable.prototype.gridFocus = function (msg, grid) {
    var table = $('#' + grid).DataTable();
    //처음 조회된 순서대로 정렬
    $('#' + grid).DataTable().order([0, "asc"]).draw(false);
    var find = JSON.parse(msg);
    var col, string, arr, findCount=0;
    var dataStr="", findStr="";
    gridRowindex = 0;
    var rows = table.rows().data().length;
    var lastFind = 0;
    for (var j = 1; j < rows; j++) {
        gridRowindex++;
        findCount = 0;
       if (lastFind === 1) break;
       for (var i = 0; i < find.length; i++) {
            col = find[i][0];
            string = find[i][1];

            arr = table.row(gridRowindex).data();
            if (arr[col] === string) {
                dataStr += arr[col];
                findStr += string;
                findCount++;
			}
			
            if (findCount >= find.length) {
                table.$('tr.selected').removeClass('selected');
                $(table.row(gridRowindex).nodes()).addClass('selected');
                //var rowHeight = $(table.row(gridRowindex).nodes()).height();
				var rowHeight = table.$('tr').height();
				var scroll = rowHeight * gridRowindex;
                $("#" + grid + "_wrapper .dataTables_scrollBody").scrollTop(scroll);
                lastFind = 1; 
                break;
            }
       }
    }
}
//저장과 메시지창을 보여주고 그리드 데이터는 반환하지 않는다
gridTable.prototype.SaveData2 = function (dataArray, service, model, callback, popup, order) {
	var grid = this.dataTable;
	var jsonEncode = JSON.stringify(dataArray);
	$.ajax({
		type: 'POST',
		contentType: 'application/json',
		url: "@Url.Action('Update','/" + service + "')",
		data: jsonEncode
	})
		.done(function (sendmsg) {
			var data_set = model;
			var table = $("#" + grid).DataTable();

			var jsonDecode = data_set;
			var jdata = new Array();
			table.clear();
			for (var i = 0; i < jsonDecode.length; i++) {
				jdata = jsonDecode[i];
				table.row.add(jdata);
			}
			//table.order([0, "asc"]).draw(false);
			table.draw(true);
		});

	/*
	if (order === undefined) order = 0;
	if (popup === undefined) popup = true;
	var grid = this.dataTable;
	var url = this.url;
	var jsonEncode = JSON.stringify(dataArray);
	$.ajax({
		type: 'POST',
		contentType: 'application/json',
		url: encodeURI(url),
		data: jsonEncode
	})
		.done(function (sendmsg) {
			if (sendmsg.indexOf("alert('Session") != -1) {
				//세션타임아웃으로 인해 alert 메시지가 들어오는 경우 처리
				$("#script_server").remove();
				var s = document.createElement("div");
				s.id = "script_server";
				$("body").append(s);
				$("#script_server").append(sendmsg);
				return;
			}
			var msg = sendmsg.split('º');
			if (msg.length > 1 && msg[1] !== "") {
				var option = new popOption();
				if (msg[1].length === 3)
					option.messageCode = msg[1];
				else option.message = msg[1];

				if (popup === true)
					PopupMessage(option);
			}
			if (msg[2] !== "") {
				$("#script_server").remove();
				var s = document.createElement("div");
				s.id = "script_server";
				$("body").append(s);
				var script = "<script>" + msg[2] + "</script>";
				$("#script_server").append(script);
			}
			if (callback !== undefined && callback !== null && callback !== "") {
				if (typeof (callback) === "Function")
					callback();
				else callback(msg[0]); //focus Json 데이터를 넘겨준다
			}
		});
		*/
}

//grid prototype을 이용하지 않고 직접 ajax로 호출할 때 메시지,스크립트 처리용
function requestMessage(sendmsg, grid) {
	try {
		var msg = sendmsg.split('º');
		if (msg.length > 1) {
			if (msg[1] !== "") {
				var option = new popOption();
				if (msg[1].length === 3)
					option.messageCode = msg[1];
				else option.message = msg[1];

				PopupMessage(option);
			}
			if (msg.length > 2) {
				if (msg[2] !== "") {
					$("#script_server").remove();
					var s = document.createElement("div");
					s.id = "script_server";
					$("body").append(s);
					var script = '<script>' + msg[2] + "</script>";
					$("#script_server").append(script);
				}
			}
		}

		if (grid !== undefined) {
			var table = $('#' + grid).DataTable();
			if (msg[0] === "") {
				table.clear();
				table.draw(false);
				return;
			}

			var jsonDecode = JSON.parse(msg[0]);
			var jdata = new Array();

			table.clear();
			for (var i = 0; i < jsonDecode.length; i++) {
				jdata = jsonDecode[i];
				table.row.add(jdata);
			}
			//table.order([0, "asc"]).draw(false);
			table.draw(true);
		}

	} catch (exception) {
		popupMessage(exception);
	}
}

//confirm 창뜨고나서 액션처리(입력,수정,삭제 등)
gridTable.prototype.ConfirmSaveData = function (dataArray, cid, msg, callback, popup,title,width) {
    if (popup === undefined) popup = true;
    if (title === undefined) title = "정보";
    if (width === undefined) width = 350;
	//    var url = this.url.replace(".aspx", "");
	    var url = this.url;
    var dialog = $("#" + cid).dialog({
        resizable: false,
        autoOpen: false,
        height: "auto",
        title: title,
        width: width,
        modal: true,
        buttons: {
            "확인": function () {
                $(this).dialog("close");
                var jsonEncode; 
				if (dataArray === null || dataArray === "") jsonEncode = "";
                else {
                    if (dataArray.length > 0)
                        jsonEncode = JSON.stringify(dataArray);
                    else jsonEncode = "";
				}
                // ajax 로 데이터 보내기
                $.ajax({
                    type: 'POST',
                    contentType: 'application/json',
					url: encodeURI(url),
                    data: jsonEncode
                })
					.done(function (sendmsg) {
                      var msg = sendmsg.split('º');
					  if (msg.length > 1 && msg[1] !== "") {
						  var option = new popOption();
						  if (msg[1].length === 3)
							  option.messageCode = msg[1];
						  else option.message = msg[1];

						  if (popup === true)
							  PopupMessage(option);

						  if (msg[2] !== "") {
							  $("#script_server").remove();
							  var s = document.createElement("div");
							  s.id = "script_server";
							  $("body").append(s);
							  var script = "<script>" + msg[2] + "</script>";
							  $("#script_server").append(script);
						  }
					  }
                      //성공 1 이거나 성공메시지 코드(205)인 경우 정상 처리
                      if (msg[1] === "1" || msg[1] === "205") {
						  if (callback !== undefined && callback !== null && callback !== "")
                              callback();
                      }

                  });

                return true;
            },
            "취소": function () {
                $(this).dialog("close");
                return false;
            }
        }
    });

    dialog.dialog('open').html(msg);
}
function checkCount(grid) {
	var numberChecked = $('#' + grid + ' input:checkbox:checked').length;
	return numberChecked;
}
//cid : dialog id , 체크박스에 체크된 데이터를 리턴받고 다이얼로그 박스를 띄운다
gridTable.prototype.DeleteChecked = function (cid, popup,callback) {
    if (popup === undefined) popup = true;
    var grid = this.dataTable;
	//    var url = this.url.replace(".aspx", "");
	    var url = this.url;
	//삭제 다이얼로그가 안뜨려면 cid = "" 
	if (cid === "") {
		var table = $('#' + grid).DataTable();
		var dataArray = new Array();
		var firstKey = 0;

		$('#' + grid + ' input:checkbox[name="table_records"]:checked').each(function () {
			var data = table.row($(this).parents('tr')).data();
			dataArray.push(data);
			if (firstKey === 0) firstKey = eval(data[0]) - 1;
			//table.row($(this).parents('tr')).remove().draw(false);

		});
		if (dataArray.length === 0) {
			popupMessage("삭제할 데이터가 선택되지 않았습니다");
			return;
		}

		var jsonEncode = JSON.stringify(dataArray);
		//alert(jsonEncode);

		// ajax 로 삭제 데이터 보내기
		$.ajax({
			type: 'POST',
			contentType: 'application/json',
			url: encodeURI(url) + "&grid=" + grid,
			data: jsonEncode
		})
			.done(function (sendmsg) {
				var msg = sendmsg.split('º');
				if (msg.length > 1 && msg[1].length >= 3) {
					var option = new popOption();
					if (msg[1].length === 3)
						option.messageCode = msg[1];
					else option.message = msg[1];

					if (popup === true)
						PopupMessage(option);
				}
				//성공 1 이거나 성공메시지 코드(203)인 경우 정상 삭제
				if (msg[1] === "1" || msg[1] === "203") {
					$('#' + grid + ' input:checkbox[name="table_records"]:checked').each(function () {
						var data = table.row($(this).parents('tr')).data();
						table.row($(this).parents('tr')).remove().draw(false);
					});
					$(table.row(firstKey).nodes()).addClass('selected');
				}
				if (callback !== undefined && callback !== null && callback !== "")
					callback();

				if (msg[2] !== "") {
					$("#script_server").remove();
					var s = document.createElement("div");
					s.id = "script_server";
					$("body").append(s);
					var script = "<script>" + msg[2] + "</script>";
					$("#script_server").append(script);
				}
			});

		return true;
	}

    var dialog = $("#" + cid).dialog({
        resizable: false,
        autoOpen: false,
        height: "auto",
        width: 350,
        modal: true,
        buttons: {
            "확인": function () {
                $(this).dialog("close");
                var table = $('#' + grid).DataTable();
                var dataArray = new Array();
				var firstKey = 0;
			
                $('#' + grid + ' input:checkbox[name="table_records"]:checked').each(function () {
                    var data = table.row($(this).parents('tr')).data();
                    dataArray.push(data);
                    if (firstKey === 0) firstKey = eval(data[0]) - 1;
                    //table.row($(this).parents('tr')).remove().draw(false);

                });
				if (dataArray.length === 0) {
					popupMessage("삭제할 데이터가 선택되지 않았습니다");
					return;
				}

                var jsonEncode = JSON.stringify(dataArray);
                //alert(jsonEncode);

                // ajax 로 삭제 데이터 보내기
                $.ajax({
                    type: 'POST',
                    contentType: 'application/json',
					url: encodeURI(url) + "&grid=" + grid,
                    data: jsonEncode
                })
					.done(function (sendmsg) {

                      var msg = sendmsg.split('º');
					  if (msg.length > 1 && msg[1].length >= 3) {
                          var option = new popOption();
                          if (msg[1].length === 3)
                              option.messageCode = msg[1];
                          else option.message = msg[1];

                          if (popup === true)
                              PopupMessage(option);
					  }

					  //성공 1 이거나 성공메시지 코드(203)인 경우 정상 삭제
					  if (msg[1] === "1" || msg[1] === "203") {
                          $('#' + grid + ' input:checkbox[name="table_records"]:checked').each(function () {
                              var data = table.row($(this).parents('tr')).data();
                              table.row($(this).parents('tr')).remove().draw(false);
                          });
                          $(table.row(firstKey).nodes()).addClass('selected');
					  }
					  if (callback !== undefined && callback !== null && callback !== "")
						  callback();

                      if (msg[2] !== "") {
                          $("#script_server").remove();
                          var s = document.createElement("div");
                          s.id = "script_server";
                          $("body").append(s);
                          var script = "<script>" + msg[2] + "</script>";
                          $("#script_server").append(script);
                      }
                  });

                return true;
            },
            "취소": function () {
                $(this).dialog("close");
                return false;
            }
        }
    });

    dialog.dialog('open').html(strReplace(eval("msgList" + 102)));
}

function CommandConfirm(cid, message, command, title) {
	var dialog = $("#" + cid).dialog({
		resizable: false,
		autoOpen: false,
		height: "auto",
		width: 350,
		title: title,
		modal: true,
		buttons: {
			"확인": function () {
				$("#" + command).click();
				$(this).dialog("close");				
				return true;
			},
			"취소": function () {
				$(this).dialog("close");
				return false;
			}
		}
	});

	dialog.dialog('open').html(message);

}

function CallbackConfirm(cid, message, callback, title) {
	var dialog = $("#" + cid).dialog({
		resizable: false,
		autoOpen: false,
		height: "auto",
		width: 350,
		title: title,
		modal: true,
		buttons: {
			"확인": function () {
				callback();
				$(this).dialog("close");
				return true;
			},
			"취소": function () {
				$(this).dialog("close");
				return false;
			}
		}
	});

	dialog.dialog('open').html(message);

}
// 체크박스에 체크된 데이터를 배열로 리턴받는다
gridTable.prototype.CheckedData= function () {
    var grid = this.dataTable;
        var table = $('#' + grid).DataTable();
        var dataArray = new Array();
        $('#' + grid +' input:checkbox[name="table_records"]:checked').each(function () {
            var data = table.row($(this).parents('tr')).data();
            dataArray.push(data);
        });
    //if (dataArray.length === 0) return;

    if (dataArray.length === 0) {
        popupMessage("데이터가 선택되지 않았습니다");
        return;
    }

        //alert(jsonEncode);
        return dataArray;
}
gridTable.prototype.RowSelect = function (rowindex) {
    var grid = this.dataTable;
    var table = $('#' + grid).DataTable();
    $(table.row(rowindex).nodes()).addClass('selected');
}
//그리드의 데이터를 배열로 반환한다.
gridTable.prototype.AllRowData = function () {
    var grid = this.dataTable;
    var table = $('#' + grid).DataTable();
    var dataArray = new Array();
    var rows = table.rows().data().length;
    for (var j = 0; j < rows; j++) {
        var data = table.row(j).data();
        dataArray.push(data);
    }
    if (dataArray.length === 0) return false;

    

	return dataArray;
}


var gridRowClickEvent = function (gridTable, callback, selectCss) {
    var table = $("#" + gridTable).DataTable();
    var rows = table.rows().data().length;
	if (selectCss === undefined) selectCss = "selected";

	$("#" + gridTable + " tbody").on('click', 'td', function (e) {
		if ($(this).find("input").val() === "click") {
			var data = table.row(this).data();
			gridRowindex = table.row(this).index();
			if (gridRowindex === undefined) return;
			callback(data);

			var check = $(this).find("input");
			if (check.prop("disabled")) return;

			var chk = check.is(":checked");
			if (chk) check.prop("checked", false);
			else check.prop("checked", true);
			return;
		}
		else {
			var name = $(this).find("input").attr("name");
			if (name === "table_records") {
				e.stopPropagation();
				return;
			}
		}
	});
	
	$("#" + gridTable + " tbody").on('click', 'tr', function () {
		table.$('tr.' + selectCss).removeClass(selectCss);
		table.$(this).addClass(selectCss);

		var data = table.row(this).data();
		gridRowindex = table.row(this).index();
		if (gridRowindex === undefined) return;
		callback(data);
	});
};

var gridRowDblClickEvent = function (gridTable, callback) {
    var table = $("#" + gridTable).DataTable();
    var rows = table.rows().data().length;

    $("#" + gridTable + " tbody").on('dblclick', 'tr', function () {
        var data = table.row(this).data();
        gridRowindex = table.row(this).index();
        if (gridRowindex === undefined) return;
        callback(data);
    });
};

var gridDataError = function(settings, tn, msg){
	alert("New "+msg);
};

function Checkbox_Check(gridTable) {
    var chk = $("input:checkbox[id='" + gridTable + "_chkbox']").is(":checked");
    if (chk) $("#" + gridTable + " input:checkbox[name='table_records']").prop("checked", true);
	else $("#" + gridTable + " input:checkbox[name='table_records']").prop("checked", false);
}

var popOption = function () {
    this.popupId = "popWindow";
    this.form = "form1";
    this.title = "메시지";
    this.modal = true;
    this.messageCode = 0;
	this.message = "";
	this.resize = false;
}
function MakePopup(form, popupId, title, modal, timer) {
	var script = "<div id ='" + popupId + "' name='" + popupId + "' tabindex='0' onclick='$(\"#" + popupId + "\").focus()' onkeydown=\"if(event.keyCode===27)$('#" + popupId + "').remove();$('.ui-widget-overlay').remove();$('#popupscript').remove()\" ";
	script += " class='ui-dialog ui-widget ui-widget-content ui-corner-all ui-draggable ui-dialog-buttons' style='outline: 0px; background-color:rgba(13,16,107,0.15); z-index: 9002; height: auto; width: 350px; display: block;'>";
	script += " <div class='ui-dialog-titlebar ui-widget-header ui-corner-all ui-helper-clearfix'>";
	script += "<span id ='" + popupId + "_title' class='ui-dialog-title'>" + title + "</span>";
	script += " <div style='cursor: pointer' class='ui-dialog-titlebar-close ui-corner-all' role='button'>";
	script += "<span class='ui-button-icon ui-icon ui-icon-closethick' onclick=$('#" + popupId + "').remove();$('.ui-widget-overlay').remove() >close</span></div></div>";
	script += "<div id = '" + popupId + "_message' class='ui-dialog-content ui-widget-content' scrolltop='0' scrollleft='0' style='background-color:white;width: auto; min-height: 52px; height: auto;'></div>";
	script += "<div style='margin-top:0; padding:0.1em' class='ui-dialog-buttonpane ui-widget-content ui-helper-clearfix'>";
	script += "<div class='ui-dialog-buttonset' onclick=$('#" + popupId + "').remove();$('.ui-widget-overlay').remove();$('#popupscript').remove() >";

	if (timer > 0) {
		script += "</div></div></div>";
		script += "<script>setTimeout(\"$('#" + popupId + "').fadeOut('slow',function(){ $('#" + popupId + "').remove()});\", " + timer+");</script>";
	}
	else {
		script += " <button type = 'button' class='btn btn-primary' role='button' aria-disabled='false'><span class='ui-button-text'>Ok</span></button>";
		script += "</div></div></div>";
	}
    if (modal === true) {
        script += "<div onclick='$(\"#" + popupId + "\").focus()' class='ui-widget-overlay' style='width: 100%; height: 100%; z-index: 1001;'></div>";
	}
	var parents = form.split('.');
	if (parents.length > 1)
		parent.$('#' + parents[1]).append(script);
    else  $('#' + form).append(script);

}
function popupMessage2(messageX, timer) {
	popupMessage(messageX, "", "", false, "", "", timer);
}
function popupMessage(messageX, popupId, title, modal, parent, resize, timer) {
    var option = new popOption();
    if (messageX < 999) {
        option.message = "";
        option.messageCode = messageX;
	}
	else option.message = messageX;

	if (popupId === undefined) popupId = ""; 
	if (title === undefined) title = "";
	if (modal === undefined) modal = "";
	if (parent === undefined) parent = "";
	if (resize === undefined) resize = "";

	if (popupId !== "")
        option.popupId = popupId;
    if (title !== "")
        option.title = title;
	if (modal !== "")
		option.modal = modal;
	if (parent !== "")
		option.parent = parent;
	else option.parent = "form1";
	if (resize !== "")
		option.resize = resize;

    PopupMessage(option,timer);
}

 function PopupMessage(option, timer) {
	try {
		if (option.messageCode === 0 && option.messag === "") return;
		var messageCode = option.messageCode;
		var popupId = option.popupId;
		var title = option.title;
		var modal = option.modal;
		if (timer > 0) modal = false;
		var parent = option.parent;
		var message = option.message;
		var vMsg;
		if (parent === undefined || parent === "")
		   parent = "form1";
		if (popupId === undefined) popupId = "popWindow";
		if (message === "")
			vMsg = strReplace(eval('msgList' + messageCode));
		else vMsg = message;

		$('.ui-widget-overlay').show();
		if ($('#' + popupId).attr("name") !== popupId) {

			MakePopup(parent, popupId, title, modal, timer);

			$('#' + popupId).draggable().position({ of: $('#' + parent), my: 'center center', at: 'center center' });
		}
		if (option.resize == true) $('#' + popupId).resizable();

		$('#' + popupId).show().focus();
		$('#' + popupId + "_title").html(title);
		$('#' + popupId + '_message').html(vMsg);
	} catch (e) {}
}

function ChkBrowser() {
	// Opera 8.0+
	var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;

	// Firefox 1.0+
	var isFirefox = typeof InstallTrigger !== 'undefined';

	// Safari 3.0+ "[object HTMLElementConstructor]" 
	var isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && window['safari'].pushNotification));

	// Internet Explorer 6-11
	var isIE = /*@cc_on!@*/false || !!document.documentMode;

	// Edge 20+
	var isEdge = !isIE && !!window.StyleMedia;

	// Chrome 1 - 79
	var isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);

	// Edge (based on chromium) detection
	var isEdgeChromium = isChrome && (navigator.userAgent.indexOf("Edg") != -1);

	// Blink engine detection
	var isBlink = (isChrome || isOpera) && !!window.CSS;

   /*
	var output = 'Detecting browsers by ducktyping:<hr>';
	output += 'isFirefox: ' + isFirefox + '<br>';
	output += 'isChrome: ' + isChrome + '<br>';
	output += 'isSafari: ' + isSafari + '<br>';
	output += 'isOpera: ' + isOpera + '<br>';
	output += 'isIE: ' + isIE + '<br>';
	output += 'isEdge: ' + isEdge + '<br>';
	output += 'isEdgeChromium: ' + isEdgeChromium + '<br>';
	output += 'isBlink: ' + isBlink + '<br>';
	document.body.innerHTML = output;
	*/
}

function NodeList(ctlID) {
	// 자식 노드 목록
	var childNodes = document.getElementById(ctlID).childNodes;
	document.write('자식 노드 길이/목록 : ')
	document.write(childNodes.length + '<br>');
	for (let i = 0; i < childNodes.length; i++) {
		document.write(childNodes[i] + '<br>');
	}
	document.write('<br>');
}
var chkIdex;
function SetInputAuto(data, ctls) {
    var dat;
	var ctlsIdx;
	var idxVal;
	try {
		for (var i = 0; i < ctls.length; i++) {
			idxVal = $("#" + ctls[i]);
			ctls[i] = document.getElementById(ctls[i]);
			ctlsIdx = ctls[i].getAttribute("index");

			if (ctlsIdx !== undefined && ctlsIdx !== null) {
				chkIdex = ctlsIdx;
				dat = data[parseInt(ctlsIdx)];
				var convert = $('<textarea />').html(dat).text();
				dat = convert;
				if (dat === "null") dat = "";
				if (ctls[i].tagName === "SELECT") {
					idxVal.val(dat.trim()).prop("selected", true);
				}
				else ctls[i].value = dat;

				if (ctls[i].getAttribute("pk") === "True") {
					//ctls[i].className = "input";
					ctls[i].readOnly = true;
					ctls[i].style.backgroundColor = "#f0f0f0";
					if (ctls[i].type === "select-one") {
						//ctls[i].disabled=true;
					}
				}
				else ctls[i].style.backgroundColor = "";
			}
		}
	} catch (e) {
		alert(e.message);
	}
}

var dialog;
function ConfirmeMessage(cid, msgArg, cmd, command) {
	if (cid == "") {
		var s = document.createElement("div");
		s.id = "_dialog_Confirm";
		$("body").append(s);
		cid = "_dialog_Confirm";
	}
    dialog = $("#" + cid).dialog({
        resizable: false,
        autoOpen: false,
        height: "auto",
        width: 350,
        modal: true,
        buttons: {
            "확인": function () {
                $(this).dialog("close");
                var varClick = $("#" + cmd + "_" + command).attr("onclick");
                $("#" + cmd + "_" + command).attr("onclick", "return true").click();
                $("#" + cmd + "_" + command).attr("onclick", varClick);
                return true;
            },
            "취소": function () {
                $(this).dialog("close");
                return false;
            }
        }
    });

    try {
        if (msgArg.length > 4)
            dialog.dialog('open').html(msgArg);
        else dialog.dialog('open').html(strReplace(eval("msgList" + msgArg)));
    } catch (e) {
        dialog.dialog('close');
        alert("문자는 4자 이상이거나 정의된 메시지 숫자 코드여야 합니다");
    }
    return false;
}
function showAttribute(obj) { //<textarea id="attr_show" class="attr_text" cols="200" style="width: 100%"> </textarea>
    try {
        var data = '';

        for (var attr in obj) {
            if (typeof (obj[attr]) === 'string' || typeof (obj[attr]) === 'number') {
                data = data + 'Attr Name : ' + attr + ', Value : ' + obj[attr] + ', Type : ' + typeof (obj[attr]) + '\n';
            } else {
                data = data + 'Attr Name : ' + attr + ', Type : ' + typeof (obj[attr]) + '\n';
            }
        }
        document.getElementById('attr_show').value = data;
    } catch (e) {
        alert(e.message);
    }
}

function getDateTime() {
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var day = now.getDate();
    var hour = now.getHours();
    var minute = now.getMinutes();
    var second = now.getSeconds();
    if (month.toString().length === 1) {
        month = '0' + month;
    }
    if (day.toString().length === 1) {
        day = '0' + day;
    }
    if (hour.toString().length === 1) {
        hour = '0' + hour;
    }
    if (minute.toString().length === 1) {
        minute = '0' + minute;
    }
    if (second.toString().length === 1) {
        second = '0' + second;
    }
    var dateTime = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
    return dateTime;
}

function PopupWindow(popupId, src, title, parent, resize, width, height, top, left) {
	$("#divBlackBack").remove();
	$("#" + popupId).remove();

	if (width === undefined) width = "75%";
	if (height === undefined) height = "80%";
	if (top === undefined) top = "7%";
	if (left === undefined) left = "10%";
    var script = "<div id='divBlackBack' style='width: 100%; height: 100%; top:0px; z-index: 998; background-color:rgba(46, 44, 44, 0.52); position:fixed'></div>";

	script += "<div id='" + popupId + "' style='width: " + width + "; height: " + height+"; top: "+top+"; left:"+left+"; background-color: white; z-index: 999; position:fixed;display:table;box-shadow: 0 2px 12px rgba(0, 0, 0, 0.34);' >";
	script += "<div style='cursor:move;padding-top:3px; padding-left: 10px !important; height: 24px; vertical-align: baseline;background-color: #DCDCDC;'>";
	script += "<div class='left'>" + title + "</div>";
	script += "<span class='ui-closable-tab ui-icon close_icon right' onclick=ClosePopup('" + popupId + "')></span>";
	script += "</div>";

    script += "<div style='padding: 10px; height:100%;box-sizing: content-box;background-color:white;'><iframe id='frmPopup' src='" + src + "' style='width: 100%; height: 100%; border:0px'></iframe></div></div>";

	if (parent == undefined || parent === "") $("form").append(script);
	else $("#" + parent).append(script);
	$("#" + popupId).show();
	$('#' + popupId).draggable().position({ my: 'center center', at: 'center center' });
	if (resize == true) $('#' + popupId).resizable();
}

function PopupWindow2(popupId, src, title, parent, resize, width, height, top, left) {
    $("#divBlackBack").remove();
    $("#" + popupId).remove();

    if (width === undefined) width = "75%";
    if (height === undefined) height = "80%";
    if (top === undefined) top = "7%";
    if (left === undefined) left = "10%";
    var script = "<div id='divBlackBack' style='width: 100%; height: 100%; top:0px; z-index: 998; background-color:rgba(46, 44, 44, 0.52); position:fixed'></div>";

    script += "<div id='" + popupId + "' style='width: " + width + "; height: " + height + "; top: " + top + "; left:" + left + "; background-color: white; z-index: 999; position:fixed;display:table;box-shadow: 0 2px 12px rgba(0, 0, 0, 0.34);' >";
    script += "<div style='cursor:move;padding-top:3px; padding-left: 10px !important; height: 24px; vertical-align: baseline;background-color: #DCDCDC;'>";
    script += "<div class='left'>" + title + "</div>";
    //script += "<span class='ui-closable-tab ui-icon close_icon right' onclick=ClosePopup('" + popupId + "')></span>";
    script += "</div>";

    script += "<div style='padding: 10px; height:100%;box-sizing: content-box;background-color:white;'><iframe id='frmPopup' src='" + src + "' style='width: 100%; height: 100%; border:0px'></iframe></div></div>";

    if (parent == undefined || parent === "") $("form").append(script);
    else $("#" + parent).append(script);
    $("#" + popupId).show();
    $('#' + popupId).draggable().position({ my: 'center center', at: 'center center' });
    if (resize == true) $('#' + popupId).resizable();
}

function PopupWindow3(popupId, src, title, parent, resize, width, height, top, left) {
    $("#divBlackBack").remove();
    $("#" + popupId).remove();

    if (width === undefined) width = "75%";
    if (height === undefined) height = "80%";
    if (top === undefined) top = "7%";
    if (left === undefined) left = "10%";
    var script = "<div id='divBlackBack' style='width: 100%; height: 100%; top:0px; z-index: 998; background-color:rgba(46, 44, 44, 0.52); position:fixed'></div>";

    script += "<div id='" + popupId + "' style='width: " + width + "; height: " + height + "; top: " + top + "; left:" + left + "; background-color: white; z-index: 999; position:fixed;display:table;box-shadow: 0 2px 12px rgba(0, 0, 0, 0.34);' >";
    script += "<div style='cursor:move;padding-top:7px; padding-left: 10px !important; height: 30px; vertical-align: baseline;background-color: #DCDCDC;'>";
    script += "<div class='left'>" + title + "</div>";
    script += "<span class='ui-closable-tab ui-icon close_icon right' style='padding-right:10px;' onclick=ClosePopup('" + popupId + "');></span>";
    script += "</div>";

    script += "<div style='padding: 10px; height:100%;box-sizing: content-box;background-color:white;'><iframe id='frmPopup' src='" + src + "' style='width: 100%; height: 100%; border:0px'></iframe></div></div>";

    if (parent == undefined || parent === "") $("form").append(script);
    else $("#" + parent).append(script);
    $("#" + popupId).show();
    //$('#' + popupId).draggable().position({ my: 'center center', at: 'center center' });
    //if (resize == true) $('#' + popupId).resizable();
}

if (!('remove' in Element.prototype)) {
	Element.prototype.remove = function () {
		if (this.parentNode) {
			this.parentNode.removeChild(this);
		}
	};
}

function ClosePopup(popupId) {
	//var item = document.getElementById(popupId);
	//item.parentNode.removeChild(item);
	$("#divBlackBack").remove();
    $("#" + popupId).remove();
    $("#LoadingProgress").hide();
}

/*
$(function () {
	if ($.datepicker != undefined) {
		$.datepicker.setDefaults({
			dateFormat: 'yy-mm-dd',
			prevText: '이전 달',
			nextText: '다음 달',
			monthNames: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
			monthNamesShort: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
			dayNames: ['일', '월', '화', '수', '목', '금', '토'],
			dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
			dayNamesMin: ['일', '월', '화', '수', '목', '금', '토'],
			showMonthAfterYear: true,
			yearSuffix: ''
		});
	}

	if ($('._DatePicker').length > 0) {
		$('._DatePicker').datepicker({
			changeMonth: true,
			changeYear: true,
			yearRange: 'c-30:c+5'
		});
		//$("._DatePicker").inputmask("yyyy-mm-dd");
	}

});
*/
function SetDatePicker() {
	
		$('._DatePicker').datepicker({
			changeMonth: true,
			changeYear: true,
			yearRange: 'c-30:c+5'
		});
		$("._DatePicker").inputmask("yyyy-mm-dd");
	
}
function htmlEncode(value) {
  //create a in-memory div, set it's inner text(which jQuery automatically encodes)
  //then grab the encoded contents back out.  The div never exists on the page.
	return $('<div/>').text(value).html();
}

function htmlDecode(value) {
	return $('<div/>').html(value).text();
}

//localStorage에 json저장 2018.2.26 추가
function SetLocalStorage(jsonName, json) {
	localStorage.setItem(jsonName, JSON.stringify(json));
}

function GetLocalStorage(jsonName, itemName) {
	var retrievedObject = localStorage.getItem(jsonName);
	if (retrievedObject == null) return null;
	var items = JSON.parse(retrievedObject);
	return items[itemName];

}

/****************************************************
tbl      : 병합할 대상 table object
startRow : 병합 시작 row, title 한 줄일 경우 1
cNum     : 병합 실시할 컬럼번호, 0부터 시작
length   : 병합할 row의 길이, 보통 1
add      : 비교할 기준에 추가할 컬럼번호
          A | 1
          B | 1
         을 서로 구분하고 싶다면, add에 0번째
         컬럼을 추가
*****************************************************/
function mergeCell(tbl, startRow, cNum, length, add) {
    var isAdd = false;
    if (tbl == null) return;
    if (startRow == null || startRow.length == 0) startRow = 1;
    if (cNum == null || cNum.length == 0) return;

    if (add == null || add.length == 0) {
        isAdd = false;
    } else {
        isAdd = true;
        add = parseInt(add);
    }
    cNum = parseInt(cNum);
    length = parseInt(length);

    rows = tbl.rows;
    rowNum = rows.length;

    tempVal = '';
    cnt = 0;
    startRow = parseInt(startRow);

    for (i = startRow; i < rowNum; i++) {
        curVal = rows[i].cells[cNum].innerHTML;
        if (isAdd) curVal += rows[i].cells[add].innerHTML;
        if (curVal == tempVal) {
            if (cnt == 0) {
                cnt++;
                startRow = i - 1;
            }
            cnt++;
        } else if (cnt > 0) {
            merge(tbl, startRow, cnt, cNum, length);
            startRow = endRow = 0;
            cnt = 0;
        }

        tempVal = curVal;
    }

    if (cnt > 0) {
        merge(tbl, startRow, cnt, cNum, length);
    }
}

/*******************************************
mergeCell에서 사용하는 함수
********************************************/
function merge(tbl, startRow, cnt, cellNum, length) {
    rows = tbl.rows;
    row = rows[startRow];

    for (i = startRow + 1; i < startRow + cnt; i++) {
        for (j = 0; j < length; j++) {
            rows[i].deleteCell(cellNum);
        }
    }

    for (j = 0; j < length; j++) {
        row.cells[cellNum + j].rowSpan = cnt;
    }
}

var gridTabulator = function (model) {
	return eval(model.replaceAll("&quot;", '"'));
}
