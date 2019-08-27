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
  var originTitle = document.getElementById('origin_title');
  var fixedTitle = document.getElementById('fixed_title');
  var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  if(scrollTop < height){
    originTitle.hidden = false;

    $("#fixed_title").fadeOut(500, function(){
      fixedTitle.hidden = true;
      fixedTitle.style.position = 'relative';
    })
  } else {
    originTitle.hidden = true;
    fixedTitle.style.position = 'fixed';
    $("#fixed_title").fadeIn(500, null)
    fixedTitle.hidden = false;
  }
}