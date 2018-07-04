function navSelect(obj, url){
    $('.navMenuSelected').removeClass('navMenuSelected');
    $(obj).addClass('navMenuSelected');
    $('.content').load(url);
}