window.onload = function(){
  var os = function (){
    var ua = navigator.userAgent,
    isWindowsPhone = /(?:Windows Phone)/.test(ua),
    isSymbian = /(?:SymbianOS)/.test(ua) || isWindowsPhone,
    isAndroid = /(?:Android)/.test(ua),
    isFireFox = /(?:Firefox)/.test(ua),
    isChrome = /(?:Chrome|CriOS)/.test(ua),
    isTablet = /(?:iPad|PlayBook)/.test(ua) || (isAndroid && !/(?:Mobile)/.test(ua)) || (isFireFox && /(?:Tablet)/.test(ua)),
    isPhone = /(?:iPhone)/.test(ua) && !isTablet,
    isPc = !isPhone && !isAndroid && !isSymbian;
    return {
      isTablet: isTablet,
      isPhone: isPhone,
      isAndroid: isAndroid,
      isPc: isPc
    };
  }();
  if (os.isAndroid || os.isPhone) {
    //alert("手机" );
    titleFixed();
  }
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
    fixedTitle.style.position = 'none';
  }
}