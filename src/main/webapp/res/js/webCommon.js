function callAjax(url, iTarget, iCallBack, iCallBackParam, iPost, iParams, iLoading) {
    callAjax(url, iTarget, iCallBack, iCallBackParam, iPost, iParams, iLoading, true);
}

function callAjax(url, iTarget, iCallBack, iCallBackParam, iPost, iParams, iLoading, async) {
    var aPost = iPost ? 'POST' : 'GET';
    var aTarget = iTarget ? '#' + iTarget: iTarget;
    $(iLoading).css('display', 'block');
    $.ajax({
        async: async,
        type: aPost,
        url: url,
        data: iParams,
        contentType: "application/x-www-form-urlencoded; charset=utf-8",
        success: function(data, textStatus, jqXHR) {
            if (aTarget) {
                $(aTarget).html(data);
            }
            if (iCallBack) {
                if (iCallBackParam) {
                    eval(iCallBack)(iCallBackParam, data);
                } else {
                    eval(iCallBack)(data);
                }
            }
        },
        error: function(xhr, textStatus) {
            alert(xhr.responseText);
        },
        complete: function(data) {
            $(iLoading).css('display', 'none');
        }
    });
}

