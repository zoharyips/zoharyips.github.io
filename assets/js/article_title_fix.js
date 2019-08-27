window.onload = function(){
    titleFixed('fix_title');
}
function titleFixed(id){
    var obj = document.getElementById(id);
    var _getHeight = obj.offsetTop;
    
    window.onscroll = function(){
        changePos(id,_getHeight);
    }
}
function changePos(id,height){
    var obj = document.getElementById(id);
    var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    if(scrollTop < height){
        obj.style.position = 'relative';
    }else{
        obj.style.position = 'fixed';
    }
}