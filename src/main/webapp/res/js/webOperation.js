var user;

function login() {
    var sid = $('#sid').val();
    var password = $('#password').val();
    if (sid == '' || password == '')
        $('#errorShow').text('用户名或密码不可以为空');
    else{
        var parameter = 'sid='+sid+'&password='+password
        callAjax('/websiteService/login', '', 'loginCallback', '', '', parameter, '');
    }
}
function loginCallback(data){
    if (data.status == "ok") {
        if(data.callBackData.roleId != 0){
            $('#errorShow').text('无权登录');
            return;
        }
        var user = {
            "id" : data.callBackData.id,
            "sid" : data.callBackData.sid,
            "name" : data.callBackData.name,
            "roleId": data.callBackData.roleId,
        }
        Cookies.set("user", user, { expires: 1 });
        window.location = '/index.html';
    }else{
        $('#errorShow').text(data.prompt);
    }

}

function logout(){
    Cookies.remove("user");
    window.location = 'view/login.html';
}

function garbage(){
    $('#garbage').nextAll().remove();
}

function getDateString(date){
    if(!date){
        date = new Date();
    }
    var month = date.getMonth()+1;
    var day = date.getDate();
    var dateString = date.getFullYear() + "-" + (month<10?"0"+month:month) + "-" + (day<10?"0"+day:day);
    return dateString;
}

//Management Operation
function jumpToManagementPage(obj, url, callback){
    $('.divselected').removeClass('divselected');
    $(obj).addClass('divselected');
    garbage();
    $('#manageView').load(url, callback);
}

var fileUploadType;
function setFileUploadType(type){
    fileUploadType = type;
}

function kindeditorFileUploading(fileElementId, kindeditorId) {
    $.ajaxFileUpload({
        url: '/websiteService/fileUpload/' + fileElementId + '/' + fileUploadType,
        secureuri: false,
        dataType: 'json',
        fileElementId: fileElementId,
        success: function(data, status) {
            if (data.status == "ok") {
                if(kindeditorId){
                    if (data.callBackData.fileType == 'image') {
                        kindeditorId.insertHtml('<p><img src="' + data.callBackData.fileUrl + '" style="max-width:100%" /></p>');
                    } else if (data.callBackData.fileType == 'audio') {
                        kindeditorId.insertHtml('<p><audio src="' + data.callBackData.fileUrl + '" style="max-width:100%" controls="controls" style="max-width:100%;max-height:100%;">您的浏览器不支持此音频，请使用Chrome浏览观看</audio></p>');
                    } else if (data.callBackData.fileType == 'video') {
                        kindeditorId.insertHtml('<p><video src="' + data.callBackData.fileUrl + '" style="max-width:100%" controls="controls" style="max-width:100%;max-height:100%;">您的浏览器不支持此视频，请使用Chrome浏览观看</video></p>');
                    } else if (data.callBackData.fileType == 'file') {
                        kindeditorId.insertHtml('<a class="ke-insertfile" href="' + data.callBackData.fileUrl + '" target="_blank">' + data.callBackData.fileName +'</a>');
                    }

                }
            }
        },
        error: function(data, status, e) {
            alert(e);
        },
        complete: function(data) {
            $('#' + fileElementId).val('');
            $('.window-page-mask').css('display', 'none');
        }
    });
}

function fileUploading(fileElementId, imgControlId) {
    $('.window-page-mask').css('display', 'block');
    $.ajaxFileUpload({
        url: '/websiteService/fileUpload/' + fileElementId + '/image',
        secureuri: false,
        dataType: 'json',
        fileElementId: fileElementId,
        success: function(data, status) {
            if (data.status == "ok") {
                $('#'+imgControlId).attr('src', data.callBackData.fileUrl);
            }
        },
        error: function(data, status, e) {
            alert(e);
        },
        complete: function(data) {
            $('#' + fileElementId).val('');
            $('.window-page-mask').css('display', 'none');
        }
    });
}

function imgFormatter(value,row,index){
    var defaultImg = "this.src='../res/img/default_cp_bg.png'";
    return '<img id="avatarViewObj" src="'+row.img+'" onerror="'+defaultImg+'" style="width:48px;height:48px;">';
}

function alertSearch(){
    callAjax('/websiteService/getAlertWords', '', 'alertSearchCallback', '', '', '', '');
}
function alertSearchCallback(data){
    $.messager.show({
        title: '操作提示',
        msg: data.prompt,
        timeout: 5000,
    });
    if (data.status == "ok") {
        if (data.callBackData)
            $('#alertView').datagrid('loadData', data.callBackData);
    }
}
function openAlertPanel(mode){
    $('#a_contentTxt').val('');
    $('#a_id').val('');
    $('#updateAlertBtn').css('display','block');
    $('#addAlertBtn').css('display','block');
    if(mode == "add"){
        $('#alertUpdateView').dialog('open');
        $('#updateAlertBtn').css('display','none');
    }
    else if(mode == 'edit'){
        var row = $('#alertView').datagrid('getSelected');
        if(row){
            $('#alertUpdateView').dialog('open');
            $('#a_id').val(row.id);
            $('#a_contentTxt').val(row.content);
            $('#addAlertBtn').css('display','none');
        }
    }
}
function addAlertWord(){
    var postValue = {
        "content": $('#a_contentTxt').val(),
    };

    callAjax('/websiteService/addAlertWord', '', 'addAlertWordCallback', '', 'POST', postValue, '');
}
function addAlertWordCallback(data){
    $.messager.show({
        title: '操作提示',
        msg: data.prompt,
        timeout: 5000,
    });
    if(data.status == "ok"){
        $('#alertView').datagrid('insertRow', {index : 0, row : data.callBackData});
        $('#alertUpdateView').dialog('close');
    }
}
function updateAlertWord(){
    var postValue = {
        "id": $('#a_id').val(),
        "content": $('#a_contentTxt').val(),
    };

    callAjax('/websiteService/updateAlertWord', '', 'updateAlertWordCallback', '', 'POST', postValue, '');
}
function updateAlertWordCallback(data){
    $.messager.show({
        title: '操作提示',
        msg: data.prompt,
        timeout: 5000,
    });
    if(data.status == "ok"){
        var rowIndex = $('#alertView').datagrid('getRowIndex', data.callBackData.id);
        $('#alertView').datagrid('updateRow', {index : rowIndex, row : data.callBackData});
        $('#alertUpdateView').dialog('close');
    }
}
function deleteAlertWord(){
    var row = $('#alertView').datagrid('getSelected');
    if(row){
        $.messager.confirm('删除警示', '确认删除警示吗?',
            function(result) {
                if (result) {
                    callAjax('/websiteService/deleteAlertWord', '', 'deleteAlertWordCallback', '', '', 'id='+row.id, '');
                }
            }
        );
    }
}
function deleteAlertWordCallback(data){
    $.messager.show({
        title: '操作提示',
        msg: data.prompt,
        timeout: 5000,
    });
    if(data.status == "ok"){
        var rowIndex = $('#alertView').datagrid('getRowIndex', data.callBackData);
        $('#alertView').datagrid('deleteRow', rowIndex);
    }
}

var eventKindeditor;
function initEventKindeditor(){
    eventKindeditor = KindEditor.create('#e_contentTxt',{
            items: [
                    'undo', 'redo', '|', 'preview', 'cut', 'copy', 'paste',
                    'plainpaste', '|', 'justifyleft', 'justifycenter', 'justifyright',
                    'justifyfull', 'insertorderedlist', 'insertunorderedlist', 'indent', 'outdent', 'subscript',
                    'superscript', 'quickformat', 'selectall', '|',
                    'formatblock', 'fontname', 'fontsize', '|', 'forecolor', 'hilitecolor', 'bold',
                    'italic', 'underline', 'strikethrough', 'lineheight', 'removeformat', '|',
                    'table', 'hr', 'emoticons', 'pagebreak','link', 'unlink'
                    ],
            width: "100%",
            height: "400px",
            resizeType : 0,
            filterMode : false,
            }
    );
}

function eventSearch(pageNumber, pageSize){
    var title = "title=" + $('#st_tool_titleTxt').textbox('getValue');
    var pageNumber = "&pageNumber=" + pageNumber;
    var pageSize = "&pageSize=" + pageSize;
    callAjax('/websiteService/getEvents', '', 'getEventsCallback', '', '', title+pageNumber+pageSize, '');
    getEventsTotalCountByTitle(title);
}
function getEventsCallback(data){
    $.messager.show({
        title: '操作提示',
        msg: data.prompt,
        timeout: 5000,
    });
    if (data.status == "ok") {
        if (data.callBackData)
            $('#eventView').datagrid('loadData', data.callBackData);
    }
}
function getEventsTotalCountByTitle(title){
    callAjax('/websiteService/getEventsTotalCount', '', 'getEventsTotalCountByTitleCallback', '', '', title, '');
}

function getEventsTotalCountByTitleCallback(data){
    if (data.status == "ok") {
        $('#eventPagination').pagination({total:data.callBackData})
    }
}
function openEventPanel(mode){
    $('#e_titleTxt').textbox('setValue', '');
    $('#e_dateTxt').textbox('setValue', '');
    $('#e_categoryTxt').textbox('setValue', '');
    $('#e_locationTxt').textbox('setValue', '');
    $('#e_stockTxt').textbox('setValue', '');
    $('#e_tagTxt').textbox('setValue', '');
    $('#e_idTxt').val('');
    $('#e_creatorIdTxt').val('');
    $('#updateEventBtn').css('display','block');
    $('#addEventBtn').css('display','block');
    eventKindeditor.html('');

    if(mode == "add"){
        $('#eventUpdateView').dialog('open');
        $('#updateEventBtn').css('display','none');
        $('#e_dateTxt').textbox('setValue', getDateString());
    }
    else if(mode == 'edit'){
        var row = $('#eventView').datagrid('getSelected');
        if(row){
            $('#eventUpdateView').dialog('open');
            $('#e_idTxt').val(row.id);
            $('#e_creatorIdTxt').val(row.creatorId);
            $('#e_titleTxt').textbox('setValue', row.title);
            eventKindeditor.html(row.content);
            $('#e_dateTxt').textbox('setValue', row.date);
            $('#e_categoryTxt').textbox('setValue', row.category);
            $('#e_stockTxt').textbox('setValue', row.stockCode);
            $('#e_locationTxt').textbox('setValue', row.location);
            $('#e_tagTxt').textbox('setValue', row.tag);
            $('#addEventBtn').css('display','none');
        }
    }
}
function addEvent(){
    var user = jQuery.parseJSON(Cookies.get("user"));
    var postValue = {
        "title": $('#e_titleTxt').textbox('getValue'),
        "content": eventKindeditor.html(),
        "creatorId": user.id,
        "date": $('#e_dateTxt').textbox('getValue'),
        "category": $('#e_categoryTxt').textbox('getValue'),
        "location": $('#e_locationTxt').textbox('getValue'),
        "stockCode": $('#e_stockTxt').textbox('getValue'),
        "tag": $('#e_tagTxt').textbox('getValue'),
    };

    callAjax('/websiteService/addEvent', '', 'addEventCallback', '', 'POST', postValue, '');
}
function addEventCallback(data){
    $.messager.show({
        title: '操作提示',
        msg: data.prompt,
        timeout: 5000,
    });
    if(data.status == "ok"){
        $('#eventView').datagrid('insertRow', {index : 0, row : data.callBackData});
        $('#eventUpdateView').dialog('close');
    }
}
function updateEvent(){
    var postValue = {
        "id": $('#e_idTxt').val(),
        "title": $('#e_titleTxt').textbox('getValue'),
        "content": eventKindeditor.html(),
        "creatorId": $('#e_creatorIdTxt').val(),
        "date": $('#e_dateTxt').textbox('getValue'),
        "category": $('#e_categoryTxt').textbox('getValue'),
        "location": $('#e_locationTxt').textbox('getValue'),
        "stockCode": $('#e_stockTxt').textbox('getValue'),
        "tag": $('#e_tagTxt').textbox('getValue'),
    };

    callAjax('/websiteService/updateEvent', '', 'updateEventCallback', '', 'POST', postValue, '');
}
function updateEventCallback(data){
    $.messager.show({
        title: '操作提示',
        msg: data.prompt,
        timeout: 5000,
    });
    if(data.status == "ok"){
        var rowIndex = $('#eventView').datagrid('getRowIndex', data.callBackData.id);
        $('#eventView').datagrid('updateRow', {index : rowIndex, row : data.callBackData});
        $('#eventUpdateView').dialog('close');
    }
}
function deleteEvent(){
    var row = $('#eventView').datagrid('getSelected');
    if(row){
        $.messager.confirm('删除警示', '确认删除吗?',
            function(result) {
                if (result) {
                    callAjax('/websiteService/deleteEvent', '', 'deleteEventCallback', '', '', 'id='+row.id, '');
                }
            }
        );
    }
}
function deleteEventCallback(data){
    $.messager.show({
        title: '操作提示',
        msg: data.prompt,
        timeout: 5000,
    });
    if(data.status == "ok"){
        var rowIndex = $('#eventView').datagrid('getRowIndex', data.callBackData);
        $('#eventView').datagrid('deleteRow', rowIndex);
    }
}
//Management Operation