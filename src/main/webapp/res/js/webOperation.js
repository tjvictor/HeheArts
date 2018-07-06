function navSelect(obj, url){
    $('.navMenuSelected').removeClass('navMenuSelected');
    $(obj).addClass('navMenuSelected');
    $('.content').load(url);
}

function jumpToManagementPage(obj, url, callback){
    $('.divSelected').removeClass('divSelected');
    $(obj).addClass('divSelected');
    garbage();
    $('#manageView').load(url, callback);
}

function garbage(){
    $('#clearMgt').nextAll().remove();
}

var fileUploadType;
function setFileUploadType(type){
    fileUploadType = type;
}

function kindeditorFileUploading(fileElementId, kindeditorId) {
    $('.window-page-mask').css('display', 'block');
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

//notification start
var notifyKindeditor;

function notifySearch(pageNumber, pageSize){
    var title = "title=" + $('#n_tool_titleTxt').textbox('getValue');
    var pageNumber = "&pageNumber=" + pageNumber;
    var pageSize = "&pageSize=" + pageSize;
    callAjax('/websiteService/loadNotificationList', '', 'getNotifiesCallback', '', '', title+pageNumber+pageSize, '');
    getNotifyTotalCount(title);
}
function getNotifiesCallback(data){
    $.messager.show({
        title: '操作提示',
        msg: data.prompt,
        timeout: 5000,
    });
    if (data.status == "ok") {
        if (data.callBackData) $('#notifyView').datagrid('loadData', data.callBackData);
    }
}

function initNotifyKindeditor(){
    notifyKindeditor = KindEditor.create('#n_contentTxt',{
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
            height: "470px",
            resizeType : 0,
            filterMode : false,
            }
    );
}

function clearNotifyPanel(){
    $('#n_idTxt').val('');
    $('#n_titleTxt').textbox('setValue', '');
    notifyKindeditor.html('');
    $('#n_dateTxt').val();
    $('#addNotifyBtn').css('display','block');
    $('#updateNotifyBtn').css('display','block');
}

function openNotifyPanel(mode){
    clearNotifyPanel();
    if(mode == "add"){
        $('#notifyUpdateView').dialog('open');
        $('#updateNotifyBtn').css('display','none');
    }
    else if(mode == 'edit'){
        var row = $('#notifyView').datagrid('getSelected');
        if(row){
            callAjax('/websiteService/loadNotificationById', '', 'openNotifyPanelCallback', '', '', 'id='+row.id, '');
        }
    }
}
function openNotifyPanelCallback(data){
    if(data.status == "ok"){
        $('#notifyUpdateView').dialog('open');
        $('#n_idTxt').val(data.callBackData.id);
        $('#n_titleTxt').textbox('setValue', data.callBackData.title);
        notifyKindeditor.html(data.callBackData.content);
        $('#n_dateTxt').val(data.callBackData.date);
        $('#addNotifyBtn').css('display','none');
    }
}

function deleteNotify(){
    var row = $('#notifyView').datagrid('getSelected');
    if(row){
        $.messager.confirm('删除通知', '确认删除通知:'+ row.title +'吗?',
            function(result) {
                if (result) {
                    callAjax('/websiteService/deleteNotify', '', 'deleteNotifyCallback', '', '', 'id='+row.id, '');
                }
            }
        );
    }
}
function deleteNotifyCallback(data){
    $.messager.show({
        title: '操作提示',
        msg: data.prompt,
        timeout: 5000,
    });
    if(data.status == "ok"){
        var rowIndex = $('#notifyView').datagrid('getRowIndex', data.callBackData);
        $('#notifyView').datagrid('deleteRow', rowIndex);
    }
}

function addNotify(){
    var title = $('#n_titleTxt').textbox('getValue');
    var content = notifyKindeditor.html();

    var postValue = {
        "title": title,
        "content": content,
    };

    callAjax('/websiteService/addNotify', '', 'addNotifyCallback', '', 'POST', postValue, '');
}
function addNotifyCallback(data){
    $.messager.show({
        title: '操作提示',
        msg: data.prompt,
        timeout: 5000,
    });
    if(data.status == "ok"){
        $('#notifyView').datagrid('insertRow', {index : 0, row : data.callBackData});
        $('#notifyUpdateView').dialog('close');
    }
}

function updateNotify(){
    var id = $('#n_idTxt').val();
    var title = $('#n_titleTxt').textbox('getValue');
    var content = notifyKindeditor.html();
    var date = $('#n_dateTxt').val();

    var postValue = {
		"id": id,
        "title": title,
        "content": content,
        "date": date,
    };

    callAjax('/websiteService/updateNotify', '', 'updateNotifyCallback', '', 'POST', postValue, '');
}
function updateNotifyCallback(data){
    $.messager.show({
        title: '操作提示',
        msg: data.prompt,
        timeout: 5000,
    });
    if(data.status == "ok"){
        var rowIndex = $('#notifyView').datagrid('getRowIndex', data.callBackData.id);
        $('#notifyView').datagrid('updateRow', {index : rowIndex, row : data.callBackData});
        $('#notifyUpdateView').dialog('close');
    }
}

function getNotifyTotalCount(name){
    callAjax('/websiteService/loadNotificationTotalCount', '', 'getNotifyTotalCountCallback', '', '', name, '');
}
function getNotifyTotalCountCallback(data){
    if (data.status == "ok") {
        $('#notifyPagination').pagination({total:data.callBackData})
    }
}

function loadNotificationsForHomePage(){
    callAjax('/websiteService/loadNotificationList', '', 'loadNotificationsForHomePageCallback', '', '', 'pageNumber=1&pageSize=12', '');
}
function loadNotificationsForHomePageCallback(data){
    if (data.status == "ok") {
        $('#notificationHomePageUl').html('');
        var template = '';
        for(var i = 0 ; i < data.callBackData.length; i++ ){
            var item = data.callBackData[i];
            template += '<li style="padding:5px;">';
            template += '<div class="left" style="width:80%"><a href="index.html?page=notification&id='+item.id+'" target="_blank"><p style="text-overflow:ellipsis;width:100%;overflow:hidden;white-space:nowrap;">'+item.title+'</p></a></div>';
            template += '<div class="right" style="width:20%;text-align:right;">'+item.date+'</div>';
            template += '<div class="clear"></div>';
            template += '</li>';
        }
        $('#notificationHomePageUl').html(template);
    }
}

function loadNotificationById(id){
    callAjax('/websiteService/loadNotificationById', '', 'loadNotificationByIdCallback', '', '', id, '');
}
function loadNotificationByIdCallback(data){
    if (data.status == "ok") {
        var item = data.callBackData;
        var style = '<style>.notificationStyle{background-color:white;border-radius:10px;min-height:400px;} .notificationStyle h1{text-align:center;font-size: 2rem;padding:15px;} </style>';
        var wrapperPrefix = '<div class="notificationStyle">';
        var wrapperSuffix = '</div>';
        var title = '<h1>'+item.title+'</h1>';
        var author = '<p style="text-align:center;font-size: 1rem;padding:15px;">时间:'+item.date+'</p>';
        var content = item.content;
        $('.content').html(style+wrapperPrefix+title+author+content+wrapperSuffix);
    }
}
//notification end

//member start
function memberSearch(pageNumber, pageSize){
    var name = "name=" + $('#st_tool_nameTxt').textbox('getValue');
    var pageNumber = "&pageNumber=" + pageNumber;
    var pageSize = "&pageSize=" + pageSize;
    callAjax('/websiteService/getMembers', '', 'getMembersCallback', '', '', name+pageNumber+pageSize, '');
    getMemberTotalCount(name);
}
function getMembersCallback(data){
    $.messager.show({
        title: '操作提示',
        msg: data.prompt,
        timeout: 5000,
    });
    if (data.status == "ok") {
        if (data.callBackData) $('#memberView').datagrid('loadData', data.callBackData);
    }
}

function clearMemberPanel(){
    $('#st_idTxt').val('');
    $('#st_nameTxt').textbox('setValue', '');
    $('#st_passwordTxt').textbox('setValue', '');
    $('#st_telTxt').textbox('setValue', '');
    $('#st_courseTxt').textbox('setValue', '');
    $('#st_courseHourTxt').textbox('setValue', '');
    $('#st_courseFeeTxt').textbox('setValue', '');
    $('#addMemberBtn').css('display','block');
    $('#updateMemberBtn').css('display','block');
}

function openMemberPanel(mode){
    clearMemberPanel();
    if(mode == "add"){
        $('#memberUpdateView').dialog('open');
        $('#updateMemberBtn').css('display','none');
    }
    else if(mode == 'edit'){
        var row = $('#memberView').datagrid('getSelected');
        if(row){
            $('#memberUpdateView').dialog('open');
            $('#st_idTxt').val(row.id);
            $('#st_nameTxt').textbox('setValue', row.name);
            $('#st_passwordTxt').textbox('setValue', row.password);
            $('#st_telTxt').textbox('setValue', row.tel);
            $('#st_courseTxt').textbox('setValue', row.course);
            $('#st_courseHourTxt').textbox('setValue', row.courseHour);
            $('#st_courseFeeTxt').textbox('setValue', row.courseFee);
            $('#addMemberBtn').css('display','none');
        }
    }
}

function deleteMember(){
    var row = $('#memberView').datagrid('getSelected');
    if(row){
        $.messager.confirm('删除会员', '确认删除会员:'+ row.name +'吗?',
            function(result) {
                if (result) {
                    callAjax('/websiteService/deleteMember', '', 'deleteMemberCallback', '', '', 'id='+row.id, '');
                }
            }
        );
    }
}

function deleteMemberCallback(data){
    $.messager.show({
        title: '操作提示',
        msg: data.prompt,
        timeout: 5000,
    });
    if(data.status == "ok"){
        var rowIndex = $('#memberView').datagrid('getRowIndex', data.callBackData);
        $('#memberView').datagrid('deleteRow', rowIndex);
    }
}

function addMember(){
    var name = $('#st_nameTxt').textbox('getValue');
    var password = $('#st_passwordTxt').textbox('getValue');
    var tel = $('#st_telTxt').textbox('getValue');
    var course = $('#st_courseTxt').textbox('getValue');
    var courseHour = $('#st_courseHourTxt').textbox('getValue');
    var courseFee = $('#st_courseFeeTxt').textbox('getValue');

    var postValue = {
        "name": name,
        "password": password,
        "tel": tel,
        "course": course,
        "courseHour": courseHour,
        "courseFee": courseFee,
    };

    callAjax('/websiteService/addMember', '', 'addMemberCallback', '', 'POST', postValue, '');
}

function addMemberCallback(data){
    $.messager.show({
        title: '操作提示',
        msg: data.prompt,
        timeout: 5000,
    });
    if(data.status == "ok"){
        $('#memberView').datagrid('insertRow', {index : 0, row : data.callBackData});
        $('#memberUpdateView').dialog('close');
    }
}

function updateMember(){
    var id = $('#st_idTxt').val();
    var name = $('#st_nameTxt').textbox('getValue');
    var password = $('#st_passwordTxt').textbox('getValue');
    var tel = $('#st_telTxt').textbox('getValue');
    var course = $('#st_courseTxt').textbox('getValue');
    var courseHour = $('#st_courseHourTxt').textbox('getValue');
    var courseFee = $('#st_courseFeeTxt').textbox('getValue');

    var postValue = {
        "id" : id,
        "name": name,
        "password": password,
        "tel": tel,
        "course": course,
        "courseHour": courseHour,
        "courseFee": courseFee,
    };

    callAjax('/websiteService/updateMember', '', 'updateMemberCallback', '', 'POST', postValue, '');
}
function updateMemberCallback(data){
    $.messager.show({
        title: '操作提示',
        msg: data.prompt,
        timeout: 5000,
    });
    if(data.status == "ok"){
        var rowIndex = $('#memberView').datagrid('getRowIndex', data.callBackData.id);
        $('#memberView').datagrid('updateRow', {index : rowIndex, row : data.callBackData});
        $('#memberUpdateView').dialog('close');
    }
}

function getMemberTotalCount(name){
    callAjax('/websiteService/getMemberTotalCount', '', 'getMemberTotalCountCallback', '', '', name, '');
}
function getMemberTotalCountCallback(data){
    if (data.status == "ok") {
        $('#memberPagination').pagination({total:data.callBackData});
    }
}

function searchMemberExtInfoByTel(){
    var tel = $('#telTxt').val();
    var password = $('#passwordTxt').val();
    if(tel === '' || password === ''){
        return;
    }

    var param = "tel="+tel+"&password="+password;
    callAjax('/websiteService/searchMemberExtInfoByTel', '', 'searchMemberExtInfoByTelCallback', '', '', param, '');
}
function searchMemberExtInfoByTelCallback(data){
    if (data.status == "ok") {
        var items = data.callBackData;
        var template = '<div style="width:100%;min-height:400px;background-color:white;">';
        for(var i = 0 ; i < items.length ; i++){
            var member = items[i];
            if(i > 0){
                template += '<div class="splitLine"></div>';
            }
            template += '<table style="width:100%">';
            template += '<tr style="height:30px;"><td style="text-align:right">会员名称:</td><td style="text-align:left;padding-left:50px;"><span>'+member.name+'</span></td></tr>';
            template += '<tr style="height:30px;"><td style="text-align:right">报名课程:</td><td style="text-align:left;padding-left:50px;"><span>'+member.course+'</span></td> </tr>';
            template += '<tr style="height:30px;"><td style="text-align:right">报名课时:</td><td style="text-align:left;padding-left:50px;"><span>'+member.courseHour+'</span></td> </tr>';
            template += '<tr style="height:30px;"><td style="text-align:right">报名费用:</td><td style="text-align:left;padding-left:50px;"><span>'+member.courseFee+'</span></td> </tr>';
            template += '<tr style="height:30px;"><td style="text-align:right">使用课时:</td><td style="text-align:left;padding-left:50px;"><span>'+member.courseUsed+'</span></td> </tr>';
            template += '<tr style="height:30px;"><td style="text-align:right">剩余课时:</td><td style="text-align:left;padding-left:50px;"><span>'+member.courseRemain+'</span></td> </tr>';
            template += '<tr style="height:30px;"><td style="text-align:right">备注:</td><td style="text-align:left;padding-left:50px;"><span>'+member.comment+'</span></td> </tr>';
            template += '<tr style="min-height:30px;"><td style="vertical-align:top;text-align:right">课时详情('+member.courseUsed+'天):</td><td style="text-align:left;padding-left:50px;"><div style="width:200px;height:100px; overflow-y:scroll;">';
            for(var k = 0 ; k < member.courseUsed.length ; k++){
                template += '<div>'+member.courseUsed[k]+'</div>';
            }
            template += '</div></td>';
            template += '<tr style="min-height:30px;"><td style="vertical-align:top;text-align:right">请假详情('+member.courseAbsentList.length+'天):</td><td style="text-align:left;padding-left:50px;"><div style="width:200px;height:100px; overflow-y:scroll;">';
            for(var k = 0 ; k < member.courseAbsent.length ; k++){
                template += '<div>'+member.courseAbsent[k]+'</div>';
            }
            template += '</div></td>';
        }
        template += '</div>';

        $('.content').html(template);
    } else{
        $('#reminderTxt').text(data.prompt);
    }
}
//member end
