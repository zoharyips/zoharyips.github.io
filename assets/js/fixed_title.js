window.onload = function(){
  titleFixed();
}
function titleFixed(){
  var originTitle = document.getElementById('origin_title');
  var _getHeight = originTitle.offsetTop + originTitle.offsetHeight;
  window.onscroll = function(){
    changePos(_getHeight);
  }
}
function changePos(height){
  var fixedTitle = document.getElementById('fixed_title');
  var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  if(scrollTop > height){
    fixedTitle.style.position = 'fixed';
    fixedTitle.hidden = false;
    $("#fixed_title").fadeIn(500, null );
  } else {
    fixedTitle.hidden = true;
    fixedTitle.style.position = 'relative';
  }
}