// 参考：https://github.com/sunshine940326/canvas-nest
// 修改：https://github.com/zoharyips/zoharyips.github.io
class Circle {
  //创建对象
  //以一个圆为对象
  //设置随机的 x，y坐标，r半径，_mx，_my移动的距离
  //this.r是创建圆的半径，参数越大半径越大
  //this._mx,this._my是移动的距离，参数越大移动
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.r = Math.random() * 10;
    this._mx = Math.random();
    this._my = Math.random();
  }

  //canvas 画圆和画直线
  //画圆就是正常的用canvas画一个圆
  //画直线是两个圆连线，为了避免直线过多，给圆圈距离设置了一个值，距离很远的圆圈，就不做连线处理
  drawCircle(ctx) {
    ctx.beginPath();
    //arc() 方法使用一个中心点和半径，为一个画布的当前子路径添加一条弧。
    ctx.arc(this.x, this.y, this.r, 0, 360)
    ctx.closePath();
    ctx.fillStyle = 'rgba(204, 204, 204, 0.3)';
    ctx.fill();
  }

  drawLine(ctx, _circle) {
    let dx = this.x - _circle.x;
    let dy = this.y - _circle.y;
    let d = Math.sqrt(dx * dx + dy * dy)
    if (d < 150) {
      ctx.beginPath();
      //开始一条路径，移动到位置 this.x,this.y。创建到达位置 _circle.x,_circle.y 的一条线：
      ctx.moveTo(this.x, this.y); //起始点
      ctx.lineTo(_circle.x, _circle.y); //终点
      ctx.closePath();
      ctx.strokeStyle = 'rgba(204, 204, 204, 0.2)';
      ctx.stroke();
    }
  }

  // 圆圈移动
  // 圆圈移动的距离必须在屏幕范围内,速度越打越快;
  move(width, height, speed) {
    this._mx = (this.x < width && this.x > 0) ? this._mx : (-this._mx);
    this._my = (this.y < height && this.y > 0) ? this._my : (-this._my);
  speed = speed / 100;
    this.x += this._mx * speed;
    this.y += this._my * speed;
  }
}

// 鼠标所在的点
class currentCirle extends Circle {
  constructor(x, y) {
    super(x, y)
  }

  drawCircle(ctx) {
    ctx.beginPath();
    //注释内容为鼠标焦点的地方圆圈半径变化
    this.r = (this.r < 14 && this.r > 1) ? this.r + (Math.random() * 2 - 1) : 2;
    this.r = 8;
    ctx.arc(this.x, this.y, this.r, 0, 360);
    ctx.closePath();
    ctx.fillStyle = 'rgba(0,0,0,' + (parseInt(Math.random() * 100) / 100) + ')';
    ctx.fillStyle = 'rgba(204, 204, 204, 0.6)'
    ctx.fill();
  }
}
//更新页面用 requestAnimationFrame 替代 setTimeout
window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;
let circles = [];
let current_circle = new currentCirle(0, 0)

let draw = function() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < circles.length; i++) {
    circles[i].move(canvas.width, canvas.height, Math.min(canvas.width, canvas.height) / 12);
    circles[i].drawCircle(ctx);
    for (j = i + 1; j < circles.length; j++) {
      circles[i].drawLine(ctx, circles[j])
    }
  }
  if (current_circle.x) {
    current_circle.drawCircle(ctx);
    for (var k = 1; k < circles.length; k++) {
      current_circle.drawLine(ctx, circles[k])
    }
  }
  requestAnimationFrame(draw)
}

let init = function(num) {
  for (var i = 0; i < num; i++) {
    circles.push(new Circle(Math.random() * canvas.width, Math.random() * canvas.height));
  }
  draw();
}

function clearCanvas() {
circles.splice(0, circles.length);
}

window.addEventListener('load', init(Math.max(canvas.width, canvas.height) / 36));

window.onmousemove = function(e) {
  e = e || window.event;
  current_circle.x = e.clientX;
  current_circle.y = e.clientY;
}

window.onmouseout = function() {
  current_circle.x = null;
  current_circle.y = null;
}

var resizeTimer;
var isStart = true;
window.addEventListener('resize', function() {
  if (isStart) {
    console.log('onResizeStart');
    $("#canvas").fadeOut(1000, clearCanvas());
    isStart = false;
  }

  clearTimeout(resizeTimer);

  resizeTimer = setTimeout(function() {
    // 此函数会在resize结束的时候执行
    console.log('onResizeCompleted');
    
    canvas.width = window.outerWidth * 0.98;
    canvas.height = window.innerHeight * 0.99;
    init(Math.max(canvas.width, canvas.height) / 36);
    $("#canvas").fadeIn(1000, function(){
      isStart = true;
    });
  }, 1000);
});

// window.onload = function(){
//   var os = function (){
//     var ua = navigator.userAgent,
//     isWindowsPhone = /(?:Windows Phone)/.test(ua),
//     isSymbian = /(?:SymbianOS)/.test(ua) || isWindowsPhone,
//     isAndroid = /(?:Android)/.test(ua),
//     isFireFox = /(?:Firefox)/.test(ua),
//     isChrome = /(?:Chrome|CriOS)/.test(ua),
//     isTablet = /(?:iPad|PlayBook)/.test(ua) || (isAndroid && !/(?:Mobile)/.test(ua)) || (isFireFox && /(?:Tablet)/.test(ua)),
//     isPhone = /(?:iPhone)/.test(ua) && !isTablet,
//     isPc = !isPhone && !isAndroid && !isSymbian;
//     return {
//       isTablet: isTablet,
//       isPhone: isPhone,
//       isAndroid: isAndroid,
//       isPc: isPc
//     };
//   }();
//   if (os.isPc || os.isTablet) {
//     canvas.hidden = false;
//     init(60);
//   } else {
//     canvas.hidden = true;
//   }
// }