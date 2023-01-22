
var _isDebug = false;
var _isValidated = false;
var colorGridSelected = '#F5F5DC'; //'#EFEFEF';
var colorGridHover = '#E5E5E5'; //'#C0C0C0';
var colorBase = '#FFFFFF';

var BrowserDetect = {
    init: function () {
        this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
        this.version = this.searchVersion(navigator.userAgent)
            || this.searchVersion(navigator.appVersion)
            || "an unknown version";
        this.OS = this.searchString(this.dataOS) || "an unknown OS";
    },
    searchString: function (data) {
        for (var i = 0; i < data.length; i++) {
            var dataString = data[i].string;
            var dataProp = data[i].prop;
            this.versionSearchString = data[i].versionSearch || data[i].identity;
            if (dataString) {
                if (dataString.indexOf(data[i].subString) != -1)
                    return data[i].identity;
            }
            else if (dataProp)
                return data[i].identity;
        }
    },
    searchVersion: function (dataString) {
        var index = dataString.indexOf(this.versionSearchString);
        if (index == -1) return;
        return parseFloat(dataString.substring(index + this.versionSearchString.length + 1));
    },
    dataBrowser: [
        {
            string: navigator.userAgent,
            subString: "Chrome",
            identity: "Chrome"
        },
        {
            string: navigator.userAgent,
            subString: "OmniWeb",
            versionSearch: "OmniWeb/",
            identity: "OmniWeb"
        },
        {
            string: navigator.vendor,
            subString: "Apple",
            identity: "Safari",
            versionSearch: "Version"
        },
        {
            prop: window.opera,
            identity: "Opera",
            versionSearch: "Version"
        },
        {
            string: navigator.vendor,
            subString: "iCab",
            identity: "iCab"
        },
        {
            string: navigator.vendor,
            subString: "KDE",
            identity: "Konqueror"
        },
        {
            string: navigator.userAgent,
            subString: "Firefox",
            identity: "Firefox"
        },
        {
            string: navigator.vendor,
            subString: "Camino",
            identity: "Camino"
        },
        {		// for newer Netscapes (6+)
            string: navigator.userAgent,
            subString: "Netscape",
            identity: "Netscape"
        },
        {
            string: navigator.userAgent,
            subString: "MSIE",
            identity: "Explorer",
            versionSearch: "MSIE"
        },
        {
            string: navigator.userAgent,
            subString: "Gecko",
            identity: "Mozilla",
            versionSearch: "rv"
        },
        { 		// for older Netscapes (4-)
            string: navigator.userAgent,
            subString: "Mozilla",
            identity: "Netscape",
            versionSearch: "Mozilla"
        }
    ],
    dataOS: [
        {
            string: navigator.platform,
            subString: "Win",
            identity: "Windows"
        },
        {
            string: navigator.platform,
            subString: "Mac",
            identity: "Mac"
        },
        {
            string: navigator.userAgent,
            subString: "iPhone",
            identity: "iPhone/iPod"
        },
        {
            string: navigator.platform,
            subString: "Linux",
            identity: "Linux"
        }
    ]
};
BrowserDetect.init();

function RowClickList(cgv, btn, index) {
    try {
        var idx = (eval(index) + 2);
        if (idx <= 9) idx = '0' + idx;
        object = eval(cgv + '_ctl' + idx + '_' + btn);
    }
    catch (e) {
        if (eval('document.getElementById(' + cgv + '_ctl' + (eval(index) + 2) + '_' + btn + ')') != null)
            var object = eval(cgv + '_ctl' + (eval(index) + 2) + '_' + btn);
        else
            var object = null

    }
    if (object != null)
        object.click();
}

function FrameSet() {
    if (parent.hidValue == 0) document.getElementById.divMenu.style.display = 'none';
    else document.getElementById.divMenu.style.display = '';
    parent.FrameSet();
}

function FrameSetShow() {
    if (parent.hidValue == 1) parent.leftFrame.Left_Menu.document.getElementById.divMenu.style.display = 'none';
    else parent.leftFrame.Left_Menu.document.getElementById.divMenu.style.display = '';
    parent.SetShow();
}

function FrameSetHide() {
    if (parent.hidValue == 0) parent.leftFrame.Left_Menu.document.getElementById.divMenu.style.display = 'none';
    else parent.leftFrame.Left_Menu.document.getElementById.divMenu.style.display = '';
    parent.SetHide();
}
function ClientValidate(ctlID) { // ctlID를 사용해야 속도가 빠르다
    // alert("유효성 검사 시작"); return;
    var DATE_SEPARATOR = '-';						//날짜구분자에 대한 상수정의
    var formObj;
    if (ctlID == undefined) {
        formObj = document.forms[0];
    }
    else {
        _isValidated = true;

        var ctl = $("#" + ctlID + " *");
        //        alert(ctlID);
        if (ctl == undefined) {
            alert(ctlID + " 컨테이너 컨트롤을 찾을수 없습니다.");
            return false;
        }
        else {
            formObj = ctl;
            //document.forms[0].onsubmit = '';
        }
    }
    //alert(formObj.length);
    var ctlsIdx;
    for (var i = 0; i < formObj.length; i++) //
    {
        if (BrowserDetect.browser == "Explorer" && BrowserDetect.version < 10)
            ctlsIdx = formObj[i].Group;
        else ctlsIdx = formObj[i].getAttribute("Group");

        if (formObj[i].id != "" && formObj[i].id != null && ctlsIdx != null) {

            var obj = formObj[i];

            if (document.activeElement != null && IsGroup(obj)) {
                //==========================================================
                //RadioButton과 연계되어 있을 경우에는 RadioButton이 Check되어 있을 경우에만 
                //Validation처리
                //==========================================================
                if (obj.RequiredControl != null && obj.RequiredControl != "") {
                    if (document.forms[0].all(obj.RequiredControl).checked == false)
                        continue;
                }

                if (BrowserDetect.browser == "Explorer" && BrowserDetect.version < 10)
                    ctlsIdx = obj.CSRequired;
                else ctlsIdx = obj.getAttribute("CSRequired");

                var Linker = obj.LinkControls;
                //==========================================================
                //Required Handling
                //==========================================================
                if (ctlsIdx != null && ctlsIdx == "True") {
                    if (BrowserDetect.browser == "Explorer" && BrowserDetect.version < 10)
                        ctlsIdx = obj.Description;
                    else ctlsIdx = obj.getAttribute("Description");

                    var msg = "은(는) 필수항목입니다.";
                    if (!CheckRequired(obj, ctlsIdx + msg)) {
                        return false;
                    }

                    //Link Controls - Required
                    if (Linker != "" && Linker != null) {
                        var linked = Linker.split(':')
                        for (var ii = 0; ii < linked.length; ii++) {
                            var linkObj = document.forms[0].item(linked[ii]);
                            if (!CheckRequired(linkObj, Description + msg))
                                return false;
                        }
                    }

                    //2005.08.01 추가 DropDown List 필수항목 체크
                    if (obj.type == "select-one") {
                        if (obj.value == "0" || obj.value == "선택" || obj.value == "" || obj.value == null) {
                            AlertMessage(obj, msg);

                            return false;
                        }
                    }

                }

                //==========================================================
                //Specification Type Handling
                //==========================================================
                if (obj.InputType != null && obj.InputType != "None" && obj.value.trim() != "") {
                    var exp_str = "";
                    if (obj.Description == null) {
                        var exp_msg = obj.id + " 형식이 잘못되었습니다.";
                    }
                    else {
                        var exp_msg = obj.Description + " 형식이 잘못되었습니다.";
                    }
                    var objValue = obj.value.trim();

                    //Link Controls - Regular Expression
                    objValue = RegularExpLinker(obj);


                    switch (obj.InputType) {
                        //------------------------------------------------------------------------------------------------
                        //Date Type Check
                        //Ex) 2005/08/12 or 20030812
                        //------------------------------------------------------------------------------------------------
                        case "Date":
                            if (!CheckDate(obj, objValue))
                                return false;

                            if (obj.EndDateControl != "" && obj.EndDateControl != null) {
                                var EndObj = document.forms[0].all(obj.EndDateControl);
                                var EndObjLinker = EndObj.LinkControls;
                                var EndObjValue = EndObj.value.trim();

                                //Link Controls - Regular Expression 
                                EndObjValue = RegularExpLinker(EndObj);

                                if (!CheckDate(EndObj, EndObjValue))
                                    return false;

                                sd = obj.value.replace(DATE_SEPARATOR, '/')
                                ed = EndObj.value.replace(DATE_SEPARATOR, '/')
                                var StartDate = new Date(sd);
                                var EndDate = new Date(ed);

                                if ((EndDate - StartDate) < 0)
                                    return AlertMessage(EndObj, "올바른 기간을 입력하세요.");;
                            }
                            break;
                        //SocialNo Type Check
                        //Ex) 123456-1234567 or 1234561234567
                        case "SocialNo":
                            exp_str = "\\d{6}" + "-" + "?\\d{7}";
                            exp_msg += " 예)123456" + "-" + "1234567";

                            if (!CheckMatch(obj, objValue, exp_str, exp_msg))
                                return false;

                            var sum = 0;
                            var psNumber = objValue.replace("-", '');

                            // TODO: 외국인일 경우  처리
                            //	if ( psNumber != '' )
                            //{
                            //if ( psNumber.charAt(6) == "5" || psNumber.charAt(6) == "6" )
                            //{
                            //break;
                            //}
                            //else
                            //{
                            //for (idx = 0, jdx=2; jdx < 10; idx++, jdx++)
                            //{
                            //sum = sum + ( psNumber.charAt(idx) * jdx );
                            //}
                            //for (idx = 8, jdx=2; jdx < 6; idx++, jdx++)
                            //{
                            //	sum = sum + ( psNumber.charAt(idx) * jdx );
                            //}

                            //var nam = sum % 11;
                            //var checkDigit = 11 - nam ;
                            //checkDigit = (checkDigit >= 10 ) ? checkDigit-10:checkDigit;

                            //if (psNumber.charAt(12) != checkDigit)
                            //	return AlertMessage(obj, exp_msg);										
                            //} 									
                            //}	


                            break;
                        //------------------------------------------------------------------------------------------------
                        //Account Type Check					
                        case "AccountNo":
                            exp_str = "\\d+";
                            exp_msg = "숫자만 입력하셔야 합니다.";

                            if (!CheckMatch(obj, objValue, exp_str, exp_msg))
                                return false;
                            break;
                        //------------------------------------------------------------------------------------------------
                        //E-Mail Type Check		
                        case "EMail":
                            exp_str = "\\w+([-+.]\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*";
                            exp_msg += " 예)webmaster@CLEAN.ac.kr";
                            if (!CheckMatch(obj, objValue, exp_str, exp_msg))
                                return false;
                            break;
                        //------------------------------------------------------------------------------------------------
                        //StudentNo Type Check					
                        case "StudentNO":
                            exp_str = "\\d{9}";
                            exp_msg = "예)123456789";
                            if (!CheckMatch(obj, objValue, exp_str, exp_msg))
                                return false;
                            break;
                        //------------------------------------------------------------------------------------------------
                        //Employee Type Check					
                        case "StaffNO":
                            exp_str = "";
                            exp_msg = "";
                            if (!CheckMatch(obj, objValue, exp_str, exp_msg))
                                return false;
                            break;
                        //------------------------------------------------------------------------------------------------
                        //Telephone Type Check
                        case "PhoneNo":
                            exp_str = "0\\d{1,3}[-)]\\d{3,4}[-]\\d{4}";
                            exp_msg += " 예)012-123-1234 또는 052)123-1234";
                            if (!CheckMatch(obj, objValue, exp_str, exp_msg))
                                return false;
                            break;
                        //------------------------------------------------------------------------------------------------
                        //PostCode Type Check
                        case "PostNo":
                            exp_str = "\\d{3}-\\d{3}";
                            exp_msg += " 예)123-123";
                            if (!CheckMatch(obj, objValue, exp_str, exp_msg))
                                return false;
                            break;
                        //------------------------------------------------------------------------------------------------
                        //Number Type Check
                        case "Numeric":

                            exp_str = "-?\\d{1,}([.]\\d{1,4})*";
                            exp_msg = "숫자만 입력가능합니다.";

                            var tmp = objValue.split(',');
                            objValue = tmp.join("");

                            if (isNaN(objValue)) {
                                AlertMessage(obj, exp_msg);
                                return false;
                            }

                            //								if (!CheckMatch(obj, objValue, exp_str, exp_msg))								
                            //									return false;
                            break;
                        case "BusinessNo":
                            exp_str = "\\d{3}" + "-" + "\\d{2}" + "-" + "\\d{5}";
                            exp_msg += " 예)123-12" + "-" + "12345";

                            if (!CheckMatch(obj, objValue, exp_str, exp_msg))
                                return false;

                            var sum = 0;
                            var psNumber = objValue.replace("-", '');
                            break;
                        //------------------------------------------------------------------------------------------------
                        //Alpabetic Type Check
                        case "Letter":
                            exp_str = "[a-zA-Z]+";
                            exp_msg = "문자만 입력하셔야 합니다.";
                            if (!CheckMatch(obj, objValue, exp_str, exp_msg))
                                return false;
                            break;
                    }
                }


                if (obj.InputType == "Date" && obj.value.trim() == "") {
                    if (obj.EndDateControl != "" && obj.EndDateControl != null) {
                        var EndObj = document.forms[0].all(obj.EndDateControl);

                        if (EndObj.value.trim() != "") {
                            if (!CheckDate(obj, objValue))
                                return false;
                        }
                    }
                }

                if (obj.type == "text") {
                    //==========================================================
                    //Length Handling
                    //==========================================================
                    if (obj.value.trim() != "") {
                        //FixLength Check		
                        if (obj.FixLength != null && obj.FixLength != "0") {
                            if (obj.value.length != obj.FixLength) {
                                if (obj.Description == null) {
                                    var exp_msg = obj.id + "은(는) 반드시 " + obj.FixLength + "자리 이어야 합니다."
                                }
                                else {
                                    var exp_msg = obj.Description + "은(는) 반드시 " + obj.FixLength + "자리 이어야 합니다."
                                }
                                return AlertMessage(obj, exp_msg);
                            }
                        }
                        else {

                            //MinLength Check		
                            if (obj.MinLength != null && obj.MinLength != "0") {
                                if (obj.value.length < obj.MinLength) {
                                    var exp_msg = "반드시 " + obj.MinLength + "자리 이상이어야 합니다."
                                    return AlertMessage(obj, exp_msg);
                                }
                            }
                        }
                    }//if 
                    //*************************************************************************
                }

            }

            if (obj.readonly == true) {
                //alert(obj.value);
                obj.readOnly = null
            }
        }
    }
    return true;
}

function GoSiCode(inObj) {
    obj = inObj;

    var objValue = obj.value.substring(0, 1);
    exp_str = "[a-zA-Z]+";
    exp_msg = "첫자리가 영문자인 10자리로 입력해야 합니다.";
    if (!CheckMatch(obj, objValue, exp_str, exp_msg)) {
        obj.select();
        return false;
    }

    objValue = obj.value.substring(1, 9);
    if (objValue == '') return true;
    exp_str = "-?\\d{1,}([.]\\d{1,4})*";
    exp_msg = "나머지 9글자는 숫자만 입력가능합니다.";

    var tmp = objValue.split(',');
    objValue = tmp.join("");

    if (!CheckMatch(obj, objValue, exp_str, exp_msg))
        return false;
}

// 디버깅 모드일 경우에만 alert 를 띄운다.
/*******************************************/
// 디버깅 모드일 경우에만 경고창을 띄움
function DebugAlert(message) {
    if (GetIsDebug()) {
        alert(message);
    }
}
// 디버깅 모드 설정
function SetIsDebug(isDebug) {
    _isDebug = isDebug;
}
// 디버깅 모드 가져옴
function GetIsDebug() {
    return _isDebug;
}
/********************************************/

function IsGroup(obj) {
    var ctlsIdx;
    if (BrowserDetect.browser == "Explorer" && BrowserDetect.version < 10)
        ctlsIdx = obj.Group;
    else ctlsIdx = obj.getAttribute("Group");

    // 다중 그룹 허용 처리 추가 
    DebugAlert("Group : " + ctlsIdx);
    var groups = ctlsIdx.split(";");
    var isGroup = false;

    //DebugAlert(groups.length);

    for (var i = 0; i < groups.length; i++) {
        if (groups[i].toUpperCase() == document.activeElement.id.toUpperCase()) {
            DebugAlert(isGroup);
            isGroup = true;		 // 하나라도 맞으면 됨								
        }
    }
    return isGroup;
}

//Check RegularExpression
function CheckMatch(obj, objValue, exp_str, exp_msg) {
    var r = new RegExp(exp_str, "g");
    var matches = r.exec(objValue);
    //alert(matches);
    if (matches == null || objValue != matches[0]) {
        if (matches != null) {
            if (obj.Cipher != null && obj.Cipher != 0) {
                var cipherValue = objValue.split('.');
                if (obj.Cipher != cipherValue[1].length) {
                    exp_msg = "소수점 자리수는 " + obj.Cipher + "자리 이어야 합니다.";
                    return AlertMessage(obj, exp_msg);
                }
            }
        }
        return AlertMessage(obj, exp_msg);
    }
    return true;
}

//Check Required - Type 
function CheckRequired(obj, msg) {
    if (obj.tagName == "TEXTAREA") // TextArea 수정
    {
        if (obj.value.trim() == "")
            return AlertMessage(obj, msg);
    }
    else {
        switch (obj.type) {
            case "text":
                if (obj.value.trim() == "")
                    return AlertMessage(obj, msg);
                break;
            case "password":
                if (obj.value.trim() == "")
                    return AlertMessage(obj, msg);
                break;

            case "select-one":
                //if (obj.selectedIndex == 0)
                if (obj.value.trim() == "")
                    return AlertMessage(obj, msg);

                break;

            default:
                //RadioButtonList, CheckBoxList - Default. 
                //(RadioButtonList와 CheckBoxList는 type을 알수가 없음- <table>태그로 나타남)
                var result;
                //alert(obj.type + ":" + obj.id + ":" + document.forms(0).all(obj.id).length);

                var count = document.forms[0].all(obj.id).length;
                if (obj.type == "CSRadioButtonList") {
                    count--;
                }
                for (var i = 0; i < count; i++) {
                    if (document.forms[0].all(obj.id + "_" + i).checked == true)
                        return true;
                    else
                        result = false;
                }
                return AlertMessage(obj, msg);
                break;
        }
    }
    return true;
}

//Error Message
function AlertMessage(obj, Msg) {
    var addMsg;
    if (BrowserDetect.browser == "Explorer" && BrowserDetect.version < 10)
        ctlsIdx = obj.Description;
    else ctlsIdx = obj.getAttribute("Description");

    addMsg = ctlsIdx;
    if (Msg.indexOf(addMsg) == -1)
        alert(obj.Description + "은(는) " + Msg);
    //popupMessage(obj.Description + "은(는) " + Msg, "", "", true, "", "", 4000);
    else
        alert(Msg);

    try {
        obj.focus();
        //Exception------------------
        if (obj.type == "text")
            obj.select();
        //-----------------------------
    }
    catch (e) {
        // 예외처리는 아무 동작도 하지 않음.
    }
    return false;
}

function FindNext(CurrencyObj, e) {
    var next = eval(CurrencyObj.getAttribute("Index")) + 1;
    var findObj = $("input[Index][Index=" + next + "]"); //input중 index가 존재하고 index가 n번인 것
    EnterKeyPress(findObj.attr("id"), e);
}

function FindNextDrop(CurrencyObj, e) {
    e.preventDefault();
    var next = eval(CurrencyObj.getAttribute("Index")) + 1;
    var findObj = $("input[Index][Index=" + next + "]"); //input중 index가 존재하고 index가 n번인 것
    if (findObj.attr("id") === undefined) {
        findObj = $("select[Index][Index=" + next + "]");
        if (findObj.attr("id") === undefined) {
            findObj = $("a[Index][Index=" + next + "]");
        }
    }
    var ctl = document.getElementById(findObj.attr("id"));
    if (ctl === null) {
        //getElementsByName는 id와 달리 같은 name를 복수개의 객체로 가져옵니다
        var obj = document.getElementsByName(id);
        ctl = obj[0];
    }
    if (ctl === null) {
        alert(nextObj + "라는 ID를 가진 컨트롤이 존재하지 않습니다.");
    }
    else {
        ctl.focus();
        if (ctl.type === "text") ctl.select();
    }
}

//Enter Key를 눌렀을때 다음컨트롤로 포커스 이동
function EnterKeyPress(nextObj, event) {
    if (event === undefined) return;
    if (event.keyCode === 13 || event.which === 13) {
        var ctl = document.getElementById(nextObj);
        if (ctl === null) {
            //getElementsByName는 id와 달리 같은 name를 복수개의 객체로 가져옵니다
            var obj = document.getElementsByName(nextObj);
            ctl = obj[0];
        }
        if (ctl === null) {
            alert(nextObj + "라는 ID를 가진 컨트롤이 존재하지 않습니다.");
        }
        else {
            try {
                ctl.focus(); if (ctl.type === "text") ctl.select();
            }
            catch (e) {
                // 예외처리는 아무 동작도 하지 않음.
            }
        }
        //event.stopPropagation();
        return false;
    }
    return true;
}

function RegularExpLinker(Obj) {
    var objValue = Obj.value.trim();
    //연결된 컨트롤 형식인 경우 Regular Expression 처리
    if (Obj.LinkControls != "" && Obj.LinkControls != null) {
        var linked = Obj.LinkControls.split(':')
        for (var i = 0; i < linked.length; i++) {
            var linkObj = document.forms[0].item(linked[i]);
            objValue += Obj.Separator + linkObj.value.trim();
        }
    }
    return objValue;
}

//날짜 Validate Check
function CheckDate(chkObj, objValue) {
    var exp_str = "";
    if (chkObj.Description == null) {
        var exp_msg = chkObj.id + " 형식이 잘못되었습니다.";
    }
    else {
        var exp_msg = chkObj.Description + " 형식이 잘못되었습니다.";
    }
    var objValue = chkObj.value.trim();

    exp_str = "\\d{4}" + "." + "?[0-1]?[0-9]" + "." + "?[0-3]?[0-9]{1}";
    exp_msg += " 예)2003" + "." + "01" + "." + "01";
    if (!CheckMatch(chkObj, objValue, exp_str, exp_msg))
        return false;

    //잘못된 날짜 형식을 거른다.
    var iYear = null;
    var iMonth = null;
    var iDay = null;
    var iDaysInMonth = null;
    var aDaysInMonth = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);

    //if (chkObj.Separator != "") {
    var sDate = objValue.split("-")
    iYear = sDate[0];
    iMonth = sDate[1];
    iDay = sDate[2];
    //}
    //else {
    //	iYear		= objValue.substring(0, 4);
    //	iMonth	= objValue.substring(4, 6);
    //	iDay		= objValue.substring(6, 8);
    //	}

    iDaysInMonth = (iMonth != 2) ? aDaysInMonth[iMonth - 1] : ((iYear % 4 == 0 && iYear % 100 != 0 || iYear % 400 == 0) ? 29 : 28);
    if (iDay == null || iMonth == null || iYear == null || iMonth > 12 || iMonth < 1 || iDay < 1 || iDay > iDaysInMonth)
        return AlertMessage(chkObj, exp_msg);

    return true;
}

//*****************************************************
//Date Masking (YYYY.MM.DD)
//*****************************************************
function DateMask(DateObj) {
    if (event.keyCode === 13 || event.which === 13) return;
    e = window.event;
    if (((48 <= e.keyCode) && (e.keyCode <= 57)) || (e.keyCode == 8) || (e.keyCode == 9) || (e.keyCode == 189) || (e.keyCode == 190)) {
        event.returnValue = true;
    }
    else if (e.keyCode >= 96 && e.keyCode <= 105)	//넘버키
    {
        event.returnValue = true;
    }
    else {
        event.returnValue = false;
    }
    //FilterOnMask(DateObj);
    var DateValue = DateOffMask(DateObj);
    DateObj.value = DateOnMask(DateValue, DateObj);
}
function DateMask2(DateObj) {
    e = window.event;
    if (((48 <= e.keyCode) && (e.keyCode <= 57)) || (e.keyCode == 8) || (e.keyCode == 9) || (e.keyCode == 189) || (e.keyCode == 190)) {
        event.returnValue = true;
        var DateValue = DateOffMask(DateObj);
        DateObj.value = DateOnMask(DateValue, DateObj);
    }
    else if ((16 <= e.keyCode) && (e.keyCode <= 220)) {
        event.returnValue = false;
        DateObj.value = DateObj.value.substring(0, DateObj.value.length - 1);
    }
}
//-----------------------------------------------
function DateOffMask(DateObj) {
    var tmp = DateObj.value.split("-");
    tmp = tmp.join("");
    return tmp;
}
//-----------------------------------------------
function DateOnMask(DateValue, DateObj) {
    var table = new Array(3);
    table[0] = 4; table[1] = 2; table[2] = 2;

    if (DateValue.length > 3) {
        var c = 0; var k = 0;
        var myArray = new Array();
        for (var j = 0; j < table.length; j++) {
            for (var i = k; i < DateValue.length; i = i + table[j]) {
                k = k + table[j];
                myArray[c++] = DateValue.substring(i, i + table[j]);
                break;
            }
        }
        DateValue = myArray.join("-");
    }
    return DateValue;
}

function comma(str) {
    str = String(str);
    return str.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
}

function uncomma(str) {
    str = String(str);
    return str.replace(/[^\d]+/g, '');
}
//*****************************************************
//Currency Masking (0,000,000)
//*****************************************************
function CurrencyMask(CurrencyObj) {
    // skip for arrow keys
    if (event.which >= 37 && event.which <= 40) return;

    e = window.event;
    if (e.keyCode === 190 || CurrencyObj.value.indexOf(".") > 0) return;

    CurrencyObj.value = comma(uncomma(CurrencyObj.value));
}
//-----------------------------------------------
function CurrencyOffMask(CurrencyValue) {
    var tmp = CurrencyValue.split(",");
    tmp = tmp.join("");

    return tmp;
}
//-----------------------------------------------
function CurrencyOnMask(CurrencyValue) { //( (96<=e.keyCode) && (e.keyCode<=105) ) || 
    e = window.event;
    //if (  ( (48<=e.keyCode) && (e.keyCode<=57) ) || (e.keyCode==8)(백키) || (e.keyCode==9) || (e.keyCode==46) || (e.keyCode==189) || (e.keyCode==190) || ((37<=e.keyCode) && (e.keyCode<=40)) ) 
    if (((48 <= e.keyCode) && (e.keyCode <= 57)) || (e.keyCode === 8) || (e.keyCode === 9) || (e.keyCode === 45) || (e.keyCode === 46) || (e.keyCode === 189) || (e.keyCode === 190) || ((37 <= e.keyCode) && (e.keyCode <= 40))) {
        event.returnValue = true;
    }
    else if (e.keyCode >= 96 && e.keyCode <= 105)	//넘버키
    {
        event.returnValue = true;
    }
    else {
        event.returnValue = false;
    }


    //	if (event.keyCode < 45 || event.keyCode > 57) 
    //	event.returnValue = false;

    var tmpH;
    var tmp;
    var tmp1 = ''; // 정수부분 값
    var tmp2 = ''; // 소수부분 값
    var flag = true;
    if (CurrencyValue.charAt(0) === "-") {//음수가 들어왔을때 '-'를 빼고적용되게..
        tmpH = CurrencyValue.substring(0, 1);
        CurrencyValue = CurrencyValue.substring(1, CurrencyValue.length);
    }	//me.indexOf('-')

    // . 소수점은 Mask 처리안하도록 함
    for (i = 0; i < CurrencyValue.length; i++) {
        if ('.' === CurrencyValue.charAt(i)) {
            flag = false;
            continue;
        }
        if (flag === true)
            tmp1 += CurrencyValue.charAt(i);
        else
            tmp2 += CurrencyValue.charAt(i);
    }

    CurrencyValue = tmp1;

    if (CurrencyValue.length >= 3) {
        var c = 0;
        var myArray = new Array();
        for (var i = CurrencyValue.length; i > 0; i = i - 2) {
            myArray[c++] = CurrencyValue.substring(i - 2, i);
        }
        myArray.reverse();

        CurrencyValue = myArray.join(",");
    }

    if (tmpH) {
        CurrencyValue = tmpH + CurrencyValue;
    }

    if (tmp2.length > 0 || flag === false) {
        tmp2 = "." + tmp2;
    }

    CurrencyValue = CurrencyValue + tmp2;

    return CurrencyValue
}

String.prototype.trim = function () {
    return this.replace(/(^\s*)|(\s*$)/g, "");
}

var chkIdex;
function SetInputForm(rowData, ctlID) {
    var data = rowData.split('|');
    var ctls;
    if (BrowserDetect.browser == "Explorer" && BrowserDetect.version < 10)
        ctls = document.getElementById(ctlID).all;
    else ctls = document.querySelectorAll("#" + ctlID + " *");
    var dat;
    var ctlsIdx;
    for (var i = 0; i < ctls.length; i++) {
        if (BrowserDetect.browser == "Explorer" && BrowserDetect.version < 10) {
            ctlsIdx = ctls[i].Index;
        }
        else ctlsIdx = ctls[i].getAttribute("index");

        if (ctlsIdx != undefined && ctlsIdx != null) {
            chkIdex = ctlsIdx;
            dat = data[parseInt(ctlsIdx)];

            if (dat == "null") dat = "";
            if (ctls[i].tagName != "OPTION") {
                ctls[i].value = dat;
            }

            if (ctls[i].getAttribute("pk") === "True") {
                //ctls[i].className = "input";
                ctls[i].readOnly = true;
                ctls[i].setAttribute("style", "background-color:#f0f0f0");
                if (ctls[i].type == "select-one") {
                    //ctls[i].disabled=true;
                }
            }
            else ctls[i].setAttribute("style", "");
        }
    }
}

function SetInputForm2(rowData, ctlID) {
    var data = decodeURI(rowData).split('|');
    var ctls;
    if (BrowserDetect.browser == "Explorer" && BrowserDetect.version < 10)
        ctls = document.getElementById(ctlID).all;
    else {
        ctls = document.querySelectorAll("#" + ctlID + " *");
    }
    var dat;
    var ctlsIdx;
    for (var i = 0; i < ctls.length; i++) {
        if (BrowserDetect.browser == "Explorer" && BrowserDetect.version < 10)
            ctlsIdx = ctls[i].Index;
        else ctlsIdx = ctls[i].getAttribute("Index");

        if (ctlsIdx != undefined && ctlsIdx != null) {
            dat = data[parseInt(ctlsIdx)];

            if (ctls[i].tagName != "OPTION") {
                ctls[i].value = dat;
            }
            if (ctls[i].PK == "True") {
                //ctls[i].className = "input";

                ctls[i].readOnly = true;

                if (ctls[i].type == "select-one") {
                    //ctls[i].disabled=true;
                }
            }
        }
    }
}

function BindDDL2() {
    if (document.getElementById.btnDDL2 != null) {
        document.getElementById.btnDDL2.click();
    }
}

// CheckBox 셋팅
function SetCheckBox(ctlID, data) {
    var ctl = document.getElementById(ctlID);
    if (data == "true" || data == "True" || data == "Y") {
        ctl.checked = true;
    }
    else if (data == "false" || data == "False" || data == "N") {
        ctl.checked = false;
    }
}

function SetCSDatePicker(ctlID, data) {
    var ctl = document.getElementById(ctlID + "_dateTextBox");

    ctl.value = data;

}

function SetCSDatePicker2(ctlID, data) {
    var ctl = document.getElementById(ctlID + "_dateTextBox");

    var rdata;
    rdata = data.substring(0, 4) + '-' + data.substring(4, 6) + '-' + data.substring(6, 8);
    ctl.value = rdata;

}

function SetDateDash(data) {
    var rdata;
    rdata = data.substring(0, 4) + '-' + data.substring(4, 6) + '-' + data.substring(6, 8);
    return rdata;
}

function SetTextArea(ctlID, data) {
    var ctl = document.getElementById(ctlID);

    ctl.value = data;

}

//이벤트제거, 첫 포커스 설정
function ClearEvent(ctlID, cid) {
    SetNewInputForm(ctlID);
    $("#" + cid).focus();

    //event.returnValue=false;
}

function ClearEvent2(ctlID, cid) {
    SetNewInputForm(ctlID);
    $("#" + cid).focus();
}

function ClearEvent3(ctlID) {
    SetNewInputForm(ctlID);
}

// 추가 상태로
function SetNewInputForm(ctlID) {
    ResetInputForm(ctlID, "N");

}

// 폼 리셋
function ResetInputForm(ctlID, mode) {
    var ctls;
    if (BrowserDetect.browser == "Explorer" && BrowserDetect.version < 10)
        ctls = document.getElementById(ctlID).all;
    else ctls = document.querySelectorAll("#" + ctlID + " *");

    for (var i = 0; i < ctls.length; i++) {
        //if (ctls[i].getAttribute("pk") == "True") {
        //       ctls[i].style.backgroundColor = "#FFFFFF";
        //} 
        if (ctls[i].type == "hidden") // hidden 컬럼은 지우지 않음
        {
            if (ctls[i].ABS == null || ctls[i].ABS == "False") //항상 ReadOnly 상태로 있어야하는 TextBox OR Control
            {
                //ctls[i].value='';			
            }
        }
        else if (ctls[i].disabled == true && ctls[i] != "") {
            // disabled 이고(서버에서 ctrl.Enabled = false; ) 비어 있지 않으면 지우지 않는다
        }
        else {
            if (ctls[i].type == "checkbox") {
                ctls[i].readOnly = false;
                ctls[i].disabled = false;
                ctls[i].checked = false;
                //ctls[i].className = "padding_input";		
            }
            else if (ctls[i].type == "select-one") {
                ctls[i].readOnly = false;
                ctls[i].disabled = false;
                //ctls[i].className = "padding_input";	


                if (ctls[i].ABS == null || ctls[i].ABS == "False") //항상 ReadOnly 상태로 있어야하는 TextBox OR Control
                {
                    ctls[i].selectedIndex = 0;
                }

                if (ctls[i].PK != null)// && ctls[i].ABS == null)
                {
                    //ctls[i].className = "input2L";				
                }
            }
            else {
                if (ctls[i].tagName != "OPTION") {
                    if (ctls[i].ABS == null) {
                        ctls[i].value = '';
                    }
                }
            }
            if (mode != null && mode == "N" && mode != undefined) {
                if (ctls[i].PK == null) {
                    ctls[i].readOnly = false;
                }
                if (ctls[i].type == "text") {
                    if (ctls[i].PK != null)// && ctls[i].ABS == null)
                    {
                        ctls[i].readOnly = false;
                        //ctls[i].className = "input2L";				
                    }
                    else if (ctls[i].PK == null && ctls[i].ABS != null) {
                        ctls[i].readOnly = false;
                        //ctls[i].className = "padding_input";			
                    }
                    else {
                        ctls[i].readOnly = false;
                        //ctls[i].className = "padding_input";			
                    }
                }
            }
            if (ctls[i].InputType == "Currency" && ctls[i].ABS != null) {
                ctls[i].value = '0';
            }
        }
    }
    return false;
}

var _selectedItem = null;

// onclick 이벤트 핸들러
function SetSelectedItem(dataItem, selectedColor, baseColor) {
    if (_selectedItem != null) {
        _selectedItem.style.backgroundColor = colorBase;
    }
    _selectedItem = dataItem;
    dataItem.style.backgroundColor = colorGridSelected;
}

// onmouseover 이벤트 핸들러
function SetHoverItem(dataItem, hoverColor) {
    if (dataItem == _selectedItem) { return; }

    //dataItem.style.backgroundColor = hoverColor; 
    //dataItem.style.backgroundColor = '#C0C0C0'; // hoverColor
    dataItem.style.backgroundColor = colorGridHover; // hoverColor
}

// onmouseout 이벤트 핸들러
function RestoreItem(dataItem, baseColor, selectedColor) {
    if (dataItem == _selectedItem) {
        dataItem.style.backgroudColor = colorGridSelected;//selectedColor
    }
    else {
        dataItem.style.backgroundColor = colorBase//"#EFEFEF";
    }
}

//** checkBox 다중선택
function MultiCheck(chkName1, chkName2) {
    var frm = document.forms[0];
    if ($("#" + chkName1).attr("checked"))
        SelectAll(frm, chkName2, true);
    else
        SelectAll(frm, chkName2, false);
}

function SelectAll(frm, chkName, checked) {
    for (var i = 0; i < frm.elements.length; i++) {
        var e = frm.elements[i];
        if (e.type == "checkbox" && e.name.indexOf(chkName) >= 0 && !e.disabled) // 비활성화된 것 제외
        {
            e.checked = checked;
        }
    }
}

function SetDatePicker(ctlID, data, flag) {
    var ctl = document.getElementById(ctlID + "_dateTextBox");
    if (flag == true) {
        ctl.value = data;
    }
    else {
        ctl.value = DateOnMask(data, ctl);
    }
}

//DataPicker 데이타 가져오기 -  20040303 형태
function GetDatePickerData(ctlID, flag) {
    var ctl = document.getElementById(ctlID + "_dateTextBox");
    if (flag == true) {
        return ctl.value; //2004-03-12 형태
    }
    else {
        return DateOffMask(ctl); //20040312 형태
    }
}

function getGridInControlsCollection(grid, ctlid) {
    var gridcontrols = getGridInAllControlsCollection(grid);
    var retarr = new Array();
    var cnt = gridcontrols.length;
    var index = 0;
    for (i = 0; i < cnt; i++) {
        var tmpctlid = gridcontrols[i].id;
        var len = tmpctlid.length;
        if (len > grid.length
            && tmpctlid.substring(len - ctlid.length, len) == ctlid
        ) {
            retarr[index] = gridcontrols[i];
            index++;
        }
    }
    return retarr;
}

//폼컨트롤들중 그리드에 있는 컨트롤들만 가져온다.
var gridCollection = new Array();
function getGridInAllControlsCollection(grid) {
    if (gridCollection.length != 0) {
        var cnt = gridCollection.length;
        for (i = 0; i < cnt; i++) {
            if (gridCollection[i] != null
                && gridCollection[i].length > 0
                && gridCollection[i][0].id.substring(0, grid.length) == grid) {
                return gridCollection[i];
            }
        }
    }

    var retarr = new Array();
    var frmctls = document.forms[0].all;
    var cnt = frmctls.length;
    var index = 0;
    for (i = 0; i < cnt; i++) {
        var tmpctlid = frmctls[i].id;
        var len = tmpctlid.length;
        if (len > grid.length
            && tmpctlid.substring(0, grid.length) == grid
        ) {
            retarr[index] = frmctls[i];
            index++;
        }
    }
    gridCollection[gridCollection.length + 1] = retarr;
    return retarr;
}

// 숫자만입력가능하게.
function onlyNum() { // ( (96<=e.keyCode) && (e.keyCode<=105) ) || 
    e = window.event;
    if (((48 <= e.keyCode) && (e.keyCode <= 57)) || (e.keyCode == 46) || (e.keyCode == 45) || (e.keyCode == 8) || (e.keyCode == 9) || ((37 <= e.keyCode) && (e.keyCode <= 40))) {
        event.returnValue = true; return;
    }
    else if (eval(e.keyCode >= 96) && eval(e.keyCode <= 105))	//넘버키
    {
        event.returnValue = true;
    }
    else {
        event.returnValue = false;
    }
}
/*************************** 숫자만 ***********************/
// onkeydown = "onlyTel();"
// (전화번호, 사업자 등록 번호 등 숫자와 "-"까지 허용)
function onlyTel() {
    // ( (96<=e.keyCode) && (e.keyCode<=105) ) || 
    e = window.event;

    if (((48 <= e.keyCode) && (e.keyCode <= 57)) || (e.keyCode == 46) || (e.keyCode == 45) || (e.keyCode == 8) || (e.keyCode == 9) || ((37 <= e.keyCode) && (e.keyCode <= 40)) || (e.keyCode == 109) || (e.keyCode == 189)) {
        event.returnValue = true;
        return;
    }
    else if (eval(window.event.keyCode >= 96) && eval(window.event.keyCode <= 105))	//넘버키
    {
        window.event.returnValue = true;
    }

    else {
        event.returnValue = false;
    }
}

/*************************** 숫자만 ***********************/
// onkeydown = "onlyYear();"
// 오로지 숫자만 (기본 숫자키들과 오른쪽 넘버키까지)
function onlyYear() {
    // ( (96<=e.keyCode) && (e.keyCode<=105) ) || 
    e = window.event;

    if (((48 <= e.keyCode) && (e.keyCode <= 57)) || (e.keyCode == 46) || (e.keyCode == 45) || (e.keyCode == 8) || (e.keyCode == 9) || ((37 <= e.keyCode) && (e.keyCode <= 40))) {
        event.returnValue = true;
        return;
    }
    else if (eval(window.event.keyCode >= 96) && eval(window.event.keyCode <= 105))	//넘버키
    {
        window.event.returnValue = true;
    }

    else {
        event.returnValue = false;
    }
}

function Numeric(CurrencyObj, event) {

    if (event.keyCode === 13 || event.which === 13 || event.which === 9) return;

    if (window.event) // IE코드
        var code = window.event.keyCode;
    else // 타브라우저
        var code = e.which;


    if ((code >= 48 && code <= 57) || (code >= 96 && code <= 105) || code == 8 || code == 46 || code == 37 || code == 39) {
        window.event.returnValue = true;
        return;
    }

    if (window.event) {
        window.event.returnValue = false;
        window.event.preventDefault();
    }
    else {
        event.preventDefault();
    }

    $(CurrencyObj).keyup(function () {
        $(this).val($(this).val().replace(/[^0-9]/g, ""));
    });
}

//// Grid로우 선택
function grd_AutoRowFocus(cgv) {

    var odoc = eval(document.getElementById[cgv]);
    //// 조회된 자료가 없을경우.
    if (odoc == null || odoc.rows.length == 0) {
        //// 테이블안의 모든 택스트,라디오,체크,드롭다운컨트롤을 청소한다.
        //table_reset(grdGL_detail);					
        return;
    }
    var ll_rowcount = odoc.rows.length;

    //// 기존의 선택된 ROW 가 있으면 그 Row를 , 선택된 Row가 없으면 마지막(처음도)을 선택한다.
    // 기존의 tr id 얻어오고...없으면 
    //		DefaultRowIndex 가 0 이면 첫번째 로우, -1 이면 마지막 로우
    var DefaultRowIndex = 0;
    var rowid = document.getElementById.hidRowIndex.value;

    if (rowid == "" || eval(rowid) > eval(ll_rowcount - 1)) {
        if (DefaultRowIndex == -1) rowid = ll_rowcount - 1;
        else rowid = 0;
    }

    //// tr object 할당, Click + Scroll
    var otr = odoc.rows(eval(rowid));
    otr.scrollIntoView(true);
    var color = odoc.rows(eval(rowid) + 1);
    color.style.backgroundColor = '#EFEFEF';
}

//// Grid로우 선택
function Grid_AutoRowFocus(cgv) {

    var odoc = eval(document.getElementById[cgv]);
    //// 조회된 자료가 없을경우.
    if (odoc == null || odoc.rows.length == 0) {
        //// 테이블안의 모든 택스트,라디오,체크,드롭다운컨트롤을 청소한다.
        //table_reset(grdGL_detail);					
        return;
    }
    var ll_rowcount = odoc.rows.length;

    //// 기존의 선택된 ROW 가 있으면 그 Row를 , 선택된 Row가 없으면 마지막(처음도)을 선택한다.
    // 기존의 tr id 얻어오고...없으면 
    //		DefaultRowIndex 가 0 이면 첫번째 로우, -1 이면 마지막 로우
    var DefaultRowIndex = 0;
    var rowid = odoc.RowIndex;

    if (rowid == "" || eval(rowid) > eval(ll_rowcount - 1)) {
        if (DefaultRowIndex == -1) rowid = ll_rowcount - 1;
        else rowid = 0;
    }
    //// tr object 할당, Click + Scroll
    var otr = odoc.rows(eval(rowid));
    otr.scrollIntoView(true);
    var color = odoc.rows(eval(rowid) + 1);
    color.click();
}

//// Grid로우 선택
function Grid_AutoRowFocus(cgv, scrollTop) {

    var odoc = eval(document.getElementById[cgv]);

    if (eval('document.getElementById.' + cgv + '_div') != null) {
        //eval('document.getElementById.' + cgv + '_div').scrollTop = eval(document.getElementById.hidRowIndex.value) * eval(document.getElementById.cgv_div.scrollHeight);
        eval('document.getElementById.' + cgv + '_div').scrollTop = eval(document.getElementById.hidRowIndex.value) * eval(eval('document.getElementById.' + cgv + '_div').scrollHeight);
    }

    // 조회된 자료가 없을경우.
    if (odoc == null || odoc.rows.length == 0) {
        // 테이블안의 모든 택스트,라디오,체크,드롭다운컨트롤을 청소한다.
        //table_reset(grdGL_detail);					
        return;
    }

    var ll_rowcount = odoc.rows.length;

    // 기존의 선택된 ROW 가 있으면 그 Row를 , 선택된 Row가 없으면 마지막(처음도)을 선택한다.
    // 기존의 tr id 얻어오고...없으면 
    // DefaultRowIndex 가 0 이면 첫번째 로우, -1 이면 마지막 로우
    var DefaultRowIndex = 0;
    //var rowid = odoc.RowIndex;
    var rowid = document.getElementById.hidRowIndex.value;

    if (rowid == "" || eval(rowid) > eval(ll_rowcount - 1)) {
        if (DefaultRowIndex == -1) rowid = ll_rowcount - 1;
        else rowid = 0;
    }

    //// tr object 할당, Click + Scroll
    var otr = odoc.rows(eval(rowid));

    if (odoc.rows(eval(rowid) + 1) != null)
        var color = odoc.rows(eval(rowid) + 1);
    else
        var color = odoc.rows(eval(rowid));

    //color.style.backgroundColor = colorGridSelected;
    color.click();
}

//// Grid로우 선택
function Grid_AutoRow(cgv, scrollTop, RowIndex) {
    var odoc = eval(document.getElementById(cgv));

    if (eval("document.getElementById('" + cgv + "_div'") != null) {
        //eval('document.getElementById.' + cgv + '_div').scrollTop = eval(RowIndex) * eval(document.getElementById.cgv_div.scrollHeight);
        eval("document.getElementById('" + cgv + "_div'").scrollTop = eval(RowIndex) * eval(eval("document.getElementById('" + cgv + "_div'").scrollHeight);
    }


    // 조회된 자료가 없을경우.
    if (odoc == null || odoc.rows.length == 0) {
        // 테이블안의 모든 택스트,라디오,체크,드롭다운컨트롤을 청소한다.
        //table_reset(grdGL_detail);					
        return;
    }

    var ll_rowcount = odoc.rows.length;

    // 기존의 선택된 ROW 가 있으면 그 Row를 , 선택된 Row가 없으면 마지막(처음도)을 선택한다.
    // 기존의 tr id 얻어오고...없으면 
    // DefaultRowIndex 가 0 이면 첫번째 로우, -1 이면 마지막 로우
    var DefaultRowIndex = 0;
    //var rowid = odoc.RowIndex;
    var rowid = RowIndex;

    if (rowid == "" || eval(rowid) > eval(ll_rowcount - 1)) {
        if (DefaultRowIndex == -1) rowid = ll_rowcount - 1;
        else rowid = 0;
    }

    //// tr object 할당, Click + Scroll
    var otr = odoc.rows(eval(rowid));

    if (odoc.rows(eval(rowid) + 1) != null)
        var color = odoc.rows(eval(rowid) + 1);
    else
        var color = odoc.rows(eval(rowid));

    //color.style.backgroundColor = colorGridSelected;
    color.click();
}

function Grid_AutoRowFocus(cgv, scrollTop, IUDGbn) {

    var odoc = eval(document.getElementById[cgv]);

    if (eval('document.getElementById.' + cgv + '_div') != null) {
        if (IUDGbn == "I") {
            eval('document.getElementById.' + cgv + '_div').scrollTop = eval(document.getElementById.hidRowIndex.value) * eval(document.getElementById.cgv_div.scrollHeight);
        }
        else {
            eval('document.getElementById.' + cgv + '_div').scrollTop = scrollTop
        }
    }

    // 조회된 자료가 없을경우.
    if (odoc == null || odoc.rows.length == 0) {
        // 테이블안의 모든 택스트,라디오,체크,드롭다운컨트롤을 청소한다.
        //table_reset(grdGL_detail);					
        return;
    }

    var ll_rowcount = odoc.rows.length;

    // 기존의 선택된 ROW 가 있으면 그 Row를 , 선택된 Row가 없으면 마지막(처음도)을 선택한다.
    // 기존의 tr id 얻어오고...없으면 
    // DefaultRowIndex 가 0 이면 첫번째 로우, -1 이면 마지막 로우
    var DefaultRowIndex = 0;
    //var rowid = odoc.RowIndex;
    var rowid = document.getElementById.hidRowIndex.value;

    if (rowid == "" || eval(rowid) > eval(ll_rowcount - 1)) {
        if (DefaultRowIndex == -1) rowid = ll_rowcount - 1;
        else rowid = 0;
    }

    //// tr object 할당, Click + Scroll
    var otr = odoc.rows(eval(rowid));

    if (odoc.rows(eval(rowid) + 1) != null)
        var color = odoc.rows(eval(rowid) + 1);
    else
        var color = odoc.rows(eval(rowid));

    //color.style.backgroundColor = colorGridSelected;
    color.click();

}

function Grid_AutoRowFocus2(cgv, scrollTop, IUDGbn) {
    var odoc = eval(document.getElementById(cgv));

    if (eval("document.getElementById('" + cgv + "_div'") != null) {
        var oDiv = eval("document.getElementById('" + cgv + "_div'");

        var rowNumber = 0;
        if (document.getElementById.hidRowIndex != null && document.getElementById.hidRowIndex.value != 'undefined') {
            if (document.getElementById.hidRowIndex.value == '') {
                rowNumber = 0;
            }
            else if (eval(document.getElementById.hidRowIndex.value) > odoc.rows.length) {
                rowNumber = 0;
            }
            else {
                rowNumber = eval(document.getElementById.hidRowIndex.value);
            }
        }

        if (IUDGbn == "D") {
            rowNumber = (rowNumber - 1) <= 0 ? 0 : (rowNumber - 1);
        }

        if (odoc.clientHeight != null) {
            var scrollHeight = 0;
            for (var i = 0; i < parseInt(rowNumber); i++) {
                scrollHeight += odoc.rows[i].clientHeight;
            }
            oDiv.scrollTop = scrollHeight;
        }
    }

    // 조회된 자료가 없을경우.
    if (odoc == null || odoc.rows.length == 0) {
        return;
    }

    var ll_rowcount = odoc.rows.length;
    //--------------------------------------------------------------------------------------
    // 기존의 선택된 ROW 가 있으면 그 Row를 , 선택된 Row가 없으면 마지막(처음도)을 선택한다.
    // 기존의 tr id 얻어오고...없으면 
    // DefaultRowIndex 가 0 이면 첫번째 로우, -1 이면 마지막 로우
    //--------------------------------------------------------------------------------------
    var DefaultRowIndex = 0;
    var rowid = document.getElementById.hidRowIndex.value;

    if (rowid == "" || eval(rowid) > eval(ll_rowcount - 1)) {
        if (DefaultRowIndex == -1) rowid = ll_rowcount - 1;
        else rowid = 0;
    }

    // tr object 할당, Click + Scroll
    var otr = odoc.rows(eval(rowid));

    if (odoc.rows(eval(rowid) + 1) != null) { var color = odoc.rows(eval(rowid) + 1); }
    else { var color = odoc.rows(eval(rowid)); }

    //color.style.backgroundColor = colorGridSelected;
    color.click();
}

//한 화면에 멀티 Gridview 지원
function Grid_AutoRowFocus3(cgv, hidIndexObjNm, IUDGbn) {
    var obj = eval(document.getElementById[hidIndexObjNm]);
    var odoc = eval(document.getElementById[cgv]);

    if (eval('document.getElementById.' + cgv + '_div') != null) {
        var oDiv = eval('document.getElementById.' + cgv + '_div');

        //--------------------------------------------------------------------------------------------------------
        //        alert(eval(document.getElementById.cgv_div.style.height.repalce('px','')) + ' - ' + oDiv.scrollHeight);
        //        var divHeight = document.getElementById.cgv_div.height;
        //        var divScrollHeight = '';
        //--------------------------------------------------------------------------------------------------------
        var rowNumber = 0;
        var itemHeight = eval(oDiv.scrollHeight) / (eval(odoc.rows.length) - 1);

        if (obj != null && obj.value != 'undefined') {
            obj.value == '' ? 0 : eval(obj.value);
        }

        if (IUDGbn == "D") {
            rowNumber = (rowNumber - 1) <= 0 ? 0 : (rowNumber - 1);
        }

        oDiv.scrollTop = (rowNumber * (itemHeight - 1));
    }

    // 조회된 자료가 없을경우.	       
    if (odoc == null || odoc.rows.length == 0) {
        return;
    }

    var ll_rowcount = odoc.rows.length;
    //--------------------------------------------------------------------------------------
    // 기존의 선택된 ROW 가 있으면 그 Row를 , 선택된 Row가 없으면 마지막(처음도)을 선택한다.
    // 기존의 tr id 얻어오고...없으면 
    // DefaultRowIndex 가 0 이면 첫번째 로우, -1 이면 마지막 로우
    //--------------------------------------------------------------------------------------
    var DefaultRowIndex = 0;
    var rowid = obj.value;

    if (rowid == "" || eval(rowid) > eval(ll_rowcount - 1)) {
        if (DefaultRowIndex == -1) rowid = ll_rowcount - 1;
        else rowid = 0;
    }

    // tr object 할당, Click + Scroll
    var otr = odoc.rows(eval(rowid));

    if (odoc.rows(eval(rowid) + 1) != null) { var color = odoc.rows(eval(rowid) + 1); }
    else { var color = odoc.rows(eval(rowid)); }

    //color.style.backgroundColor = colorGridSelected;
    color.click();
}

// 정규식 사용 트림
function trim(s) {
    if (s != null) {
        var m = s.match(/^\s*(\S+(\s+\S+)*)\s*$/);
        return (m == null) ? "" : m[1];
    }
    else
        return "";
}

function cal_byte(obj, Count)// 입력 바이트 수 계산 query
{
    var tmpStr;
    var temp = 0;
    var onechar;
    var tcount;
    tcount = 0;

    if (event.keyCode == 8 || event.keyCode == 46 || event.keyCode == 37 || event.keyCode == 38 || event.keyCode == 39 || event.keyCode == 40 || event.keyCode == 17 || event.keyCode == 16 || event.keyCode == 36)
        return;

    tmpStr = new String(obj.value);
    temp = tmpStr.length;

    for (var k = 0; k < temp; k++) {
        onechar = tmpStr.charAt(k);

        if (escape(onechar).length > 4) {
            tcount += 2;
        }
        else if (onechar != '\r') {
            tcount++;
        }
    }

    if (tcount > eval(Count)) {
        onechar = tmpStr.charAt(temp - 1);
        alert(Count + "Byte까지 입니다.");
        if (escape(onechar).length > 4) obj.value = obj.value.substring(0, Count - 2);
        else obj.value = obj.value.substring(0, Count);
        return false;
    }
    return true;
}

// 컨트롤명, 문자열, 길이    
function bytelength(fe, mx) {
    bstr = fe.value;
    len = bstr.length;
    for (ii = 0; ii < bstr.length; ii++) {
        xx = bstr.substr(ii, 1).charCodeAt(0);
        if (xx > 127) { len++; }
    }
    // 클경우 메시지 뿌리기 
    if (mx < len) {
        alert('입력한 글이 길어서 잘릴수 있습니다.\n 다시 입력해 주세요(한글:' + mx / 2 + '영문:' + mx + ')');
        fe.focus();
        if (mx + 2 <= len) fe.value = fe.value.substring(0, mx - 3);
        else fe.value = fe.value.substring(0, mx);
        //fe.select(); 
    }
    return len;
}

//--------------------------------------------------------------------------------------
// 그리드 내의 텍스트박스 숫자만 입력
//--------------------------------------------------------------------------------------
var gValue;

// 숫자만 입력가능 . - 입력 불가
// onkeydown 이벤트에서 키 입력코드를 받아서 숫자만 입력 할 수 있도록 한다. 다른 이벤트에 주면 동작하지 않는다.
// onkeydown="numinput()"
function numinput() {
    //MoveNextControl();
    //alert(window.event.keyCode);
    var capString;
    capString = String.fromCharCode(window.event.keyCode);

    if (capString >= "0" && capString <= "9") {
        window.event.returnValue = true;
    }
    else if (eval(window.event.keyCode >= 96) && eval(window.event.keyCode <= 105))	//넘버키
    {
        window.event.returnValue = true;
    }
    else if (eval(window.event.keyCode >= 37) && eval(window.event.keyCode <= 40))	//넘버키
    {
        window.event.returnValue = true;
    }
    else if (window.event.keyCode == "8" || window.event.keyCode == "46" || window.event.keyCode == "9" || window.event.keyCode == "13") {
        window.event.returnValue = true;
    }
    else if (window.event.ctrlKey == true && window.event.keyCode == "67")  //복사
    {
        window.event.returnValue = true;
    }
    else if (window.event.ctrlKey && window.event.keyCode == "86")  //붙여넣기
    {
        window.event.returnValue = true;
    }
    else if (window.event.ctrlKey && window.event.keyCode == "88")  //잘라내기
    {
        window.event.returnValue = true;
    }
    else if (window.event.ctrlKey && window.event.keyCode == "90")  //뒤로
    {
        window.event.returnValue = true;
    }
    else if (window.event.shiftKey && window.event.ctrlKey && window.event.keyCode == "90")  //앞으로
    {
        window.event.returnValue = true;
    }
    else {
        window.event.returnValue = false;
        //window.event.keyCode = ""; 
        return;
    }
}

// Object "," 추가
// ex)  onkeydown="myNuminput()" onkeyup="add_comma(this);"
function add_comma(obj) {
    var capString;
    var numstr = "`abcdefghi0123456789";//%'";
    var arrow_str = "%'"; // <- ->
    capString = String.fromCharCode(window.event.keyCode);

    if (arrow_str.indexOf(capString) > -1) return;

    if (RTrim(obj.value) == "") return obj.value = "";
    re = /^\$|,/g; // original // remove "$" and "," == /^\$|,/g
    var number = obj.value.replace(re, "");
    number = '' + number;
    if (number.length > 3) {
        var mod = number.length % 3;
        var output = (mod > 0 ? (number.substring(0, mod)) : '');
        for (i = 0; i < Math.floor(number.length / 3); i++) {
            if ((mod == 0) && (i == 0))
                output += number.substring(mod + 3 * i, mod + 3 * i + 3);
            else
                output += ',' + number.substring(mod + 3 * i, mod + 3 * i + 3);
        }

        //음수값(-)뒤에 붙는 콤마(,)를 없애준다
        if (output.substring(0, 1) == "-" && output.substring(1, 2) == ",")
            output = output.substring(0, 1) + trim(output.substring(2, output.length));

        obj.value = output;
    }
    else {
        obj.value = number;
    }

    if (gValue == true) {
        obj.select();
        gValue = false;
    }
}

// 스트링의 RTrim() 을 구현한다.
function RTrim(arg_value) {
    while ('' + arg_value.charAt(arg_value.length - 1) == ' ')

        arg_value = arg_value.substring(0, arg_value.length - 1);

    return arg_value;
}


// 스트링의 LTrim() 을 구현한다.
function LTrim(arg_value) {
    while ('' + arg_value.charAt(0) == ' ')

        arg_value = arg_value.substring(1, arg_value.length);

    return arg_value;
}

// 정규식 사용 트림
function trim(s) {
    if (s != null) {
        var m = s.match(/^\s*(\S+(\s+\S+)*)\s*$/);
        return (m == null) ? "" : m[1];
    }
    else
        return "";
}

// 주민번호 체크
function check_jumin(jumin_no) {
    var IDtot = 0;
    var IDAdd = "234567892345";
    for (i = 0; i < 12; i++) {
        IDtot = IDtot + parseInt(jumin_no.substring(i, (i + 1))) * parseInt(IDAdd.substring(i, (i + 1)));
    }
    IDtot = 11 - (IDtot % 11);
    if (IDtot == 10) {
        IDtot = 0;

    }
    else if (IDtot == 11) {
        IDtot = 1;
    }
    if (parseInt(jumin_no.substring(12, 13)) != IDtot) {
        return false;
    }
    return true;
}

// 재외국인 번호 체크
function check_fgnno(fgnno) {

    var sum = 0;
    var odd = 0;
    buf = new Array(13);
    for (i = 0; i < 13; i++) { buf[i] = parseInt(fgnno.charAt[i]); }

    odd = buf[7] * 10 + buf[8];
    if (odd % 2 != 0) { return false; }

    if ((buf[11] != 6) && (buf[11] != 7) && (buf[11] != 8) && (buf[11] != 9)) {
        return false;
    }

    multipliers = [2, 3, 4, 5, 6, 7, 8, 9, 2, 3, 4, 5];
    for (i = 0, sum = 0; i < 12; i++) { sum += (buf[i] *= multipliers[i]); }
    sum = 11 - (sum % 11);
    if (sum >= 10) { sum -= 10; }
    sum += 2;
    if (sum >= 10) { sum -= 10; }
    if (sum != buf[12]) { return false }

    return true;
}

/*----------------------------------------------------------------------- 
 설명 : ReadOnly, Disabled 설정된 TextBox의 배경색 변경
 
 Page : Form객체의 INPUT컨트롤중 type= TEXT readonly, disabled가 true 속성이면 배경색을 변경
        검색영역의 버튼의 경우 배경색변경에서 제외 
        검색영역은 class에 'search-input-txt ...' 가 적용되므로 이것을 이용하여 제외 시킴
 
 인수 : 없음
-----------------------------------------------------------------------*/
function SetReadOnlyBackgroundColor2() {
    var oItem;

    try {
        for (var i = 0; i < document.getElementById.length; i++) {
            oItem = document.getElementById[i];

            if (oItem.tagName.toUpperCase() == "INPUT") {
                if (oItem.getAttribute("type").toUpperCase() == "TEXT") {
                    // class="search-input-txt ?? " 검색컨트롤은 제외
                    if (oItem.getAttribute("className").lastIndexOf("search") == -1) {
                        if (oItem.getAttribute("readonly") || oItem.getAttribute("disabled")) {
                            oItem.style.backgroundColor = "#EFEFEF";
                        }
                        else {
                            // RreadOnly, Disabled가 해제된 컨트롤인데 배경색이 "#efefef"라면 기존색으로 변경해 준다.
                            if (oItem.style.backgroundColor.toUpperCase() == "#EFEFEF") {
                                oItem.style.backgroundColor = "";
                            }

                        }
                    }
                }
            }
        }
    }
    catch (exception) {
        alert('SetReadOnlyBackgroundColor2' + exception.description);
    }
}

/* 새롭게 변경 */
function SetReadOnlyBackgroundColor(tblNm) {
    tblNm = (tblNm == undefined) ? "txtInput" : tblNm;

    var oItem;

    try {
        var tblObj;

        if (BrowserDetect.browser == "Explorer" && BrowserDetect.version < 10)
            var tblObj = document.getElementById(tblNm);
        else tblObj = document.querySelectorAll("#" + tblNm + " input");

        //readOnly TextBox --> Background 처리
        for (var i = 0; i < tblObj.length; i++) {
            oItem = tblObj[i];

            if (oItem.getAttribute("type").toUpperCase() == "TEXT") {
                if (oItem.getAttribute("className") != null) {
                    // class="search-input-txt ?? " 검색컨트롤은 제외
                    if (oItem.getAttribute("className").lastIndexOf("search") == -1) {
                        if (oItem.getAttribute("readonly")) {
                            oItem.style.backgroundColor = "#EFEFEF";
                        }
                        else {
                            // RreadOnly, Disabled가 해제된 컨트롤인데 배경색이 "#efefef"라면 기존색으로 변경해 준다.
                            if (oItem.style.backgroundColor.toUpperCase() == "#EFEFEF") {
                                oItem.style.backgroundColor = "";
                            }
                        }
                    }
                }
            }
        }

        if (BrowserDetect.browser == "Explorer" && BrowserDetect.version < 10)
            var tblObj = document.getElementById(tblNm);
        else tblObj = document.querySelectorAll("#" + tblNm + " select");

        //disabled ComboBox --> Backgroud 처리
        for (var i = 0; i < tblObj.length; i++) {
            oItem = tblObj[i];
            if (oItem.getAttribute("className") != null) {
                // class="search-input-txt ?? " 검색컨트롤은 제외
                if (oItem.getAttribute("className").lastIndexOf("search") == -1) {
                    if (oItem.getAttribute("disabled")) {
                        oItem.style.backgroundColor = "#EFEFEF";
                    }
                    else {
                        // RreadOnly, Disabled가 해제된 컨트롤인데 배경색이 "#efefef"라면 기존색으로 변경해 준다.
                        if (oItem.style.backgroundColor.toUpperCase() == "#EFEFEF") {
                            oItem.style.backgroundColor = "";
                        }
                    }
                }
            }
        }
    }
    catch (exception) {
        alert('SetReadOnlyBackgroundColor :' + exception.description);
    }
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function execDaumPostcode(ZipCode, Address1, Address2) {
    new daum.Postcode({
        oncomplete: function (data) {
            // 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.

            // 각 주소의 노출 규칙에 따라 주소를 조합한다.
            // 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
            var fullAddr = ''; // 최종 주소 변수
            var extraAddr = ''; // 조합형 주소 변수

            // 사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
            /*
            if (data.userSelectedType === 'R') { // 사용자가 도로명 주소를 선택했을 경우
                fullAddr = data.roadAddress;

            } else { // 사용자가 지번 주소를 선택했을 경우(J)
                fullAddr = data.jibunAddress;
            }
            */
            //무조건 도로명 주소를 가져온다. (지번을 선택시 법정동명, 건물명등은 가져오지 않음
            fullAddr = data.roadAddress;
            // 사용자가 선택한 주소가 도로명 타입일때 조합한다.
            if (data.userSelectedType === 'R') {
                //법정동명이 있을 경우 추가한다.
                if (data.bname !== '') {
                    extraAddr += data.bname;
                }
                // 건물명이 있을 경우 추가한다.
                if (data.buildingName !== '') {
                    extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName);
                }
                // 조합형주소의 유무에 따라 양쪽에 괄호를 추가하여 최종 주소를 만든다.
                fullAddr += (extraAddr !== '' ? ' (' + extraAddr + ')' : '');
            }

            // 우편번호와 주소 정보를 해당 필드에 넣는다.
            //window.document.all[ZipCode].value = '';
            document.getElementById(ZipCode).value = data.zonecode; //5자리 새우편번호 사용
            document.getElementById(Address1).value = fullAddr;
            //document.getElementById(Address2).value = data.bname;

            // 커서를 상세주소 필드로 이동한다.
            document.getElementById(Address2).focus();
        }
    }).open();
}

function setCookie(cookieName, value, exdays) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + exdays);
    var cookieValue = escape(value) + ((exdays == null) ? "" : "; expires=" + exdate.toGMTString());
    document.cookie = cookieName + "=" + cookieValue;
}

function deleteCookie(cookieName) {
    var expireDate = new Date();
    expireDate.setDate(expireDate.getDate() - 1);
    document.cookie = cookieName + "= " + "; expires=" + expireDate.toGMTString();
}

function getCookie(cookieName) {
    cookieName = cookieName + '=';
    var cookieData = document.cookie;
    var start = cookieData.indexOf(cookieName);
    var cookieValue = '';
    if (start != -1) {
        start += cookieName.length;
        var end = cookieData.indexOf(';', start);
        if (end == -1) end = cookieData.length;
        cookieValue = cookieData.substring(start, end);
    }
    return unescape(cookieValue);
}

/*
// 사용법 : strSsang = "txtHagbeon,txtNm:"; // "a1,a2:b1,b2:"  쌍구분은 :(세미콜론), 쌍별요소는 ,(콤마)로 구분함. 위와 같이 컬럼명을 추가만 해주면 됨.
*/

var strSsang = "";                  // "a1,a2:b1,b2:"  쌍구분은 :(세미콜론), 쌍별요소는 ,(콤마)로 구분함.
var arrSsang = new Array();
var findSsang = new Array();
var prevKeyDown = "";                // 키가 눌리기 전의 값.
$(function () {
    if (strSsang != "") {
        document.onkeydown = keyDownToo;
        document.onkeyup = keyUpToo;
    }
});

function keyDownToo(e) {
    if (event.srcElement.tagName.toUpperCase() == 'INPUT') prevKeyDown = event.srcElement.value;
}

function keyUpToo(e) {
    if (event.srcElement.tagName.toUpperCase() == 'INPUT'
        && prevKeyDown != event.srcElement.value) {
        arrSsang = strSsang.split(':');
        for (var i = 0; i < arrSsang.length; i++) {
            var intFind = arrSsang[i].indexOf(event.srcElement.id);
            if (intFind >= 0) {
                findSsang = arrSsang[i].split(',');

                if (event.srcElement.id == findSsang[0]) {
                    document.getElementById(findSsang[1]).value = '';
                }
                else {
                    document.getElementById(findSsang[0]).value = '';
                }
            }
        }
        prevKeyDown = "";
    }
}
