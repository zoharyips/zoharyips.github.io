// Idea By: https://github.com/bxm0927 白小明
// Improved By: https://github.com/zoharyips Zohar
/**
 * 使用 requestAnimationFrame 来刷新动画
 * @type {requestAnimationFrame}
 */
window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

class Dot {
    static COLOR_SELF = 'rgba(221,221,221,1)';
    static COLOR_LINE = 'rgba(221,221,221,0.3)';
    /**
     * 创建一个 Dot 实例
     * @param x         dot 的 x 坐标
     * @param y         dot 的 y 坐标
     * @param radius    dot 的半径
     * @param velocityX dot 的 x 方向位移速度
     * @param velocityY dot 的 y 方向位移速度
     * @param distance  dot 连线的最远距离
     */
    constructor(x, y, radius, velocityX, velocityY, distance) {
        this.xIndex = x;
        this.yIndex = y;
        this.radius = radius;
        this.velocityX = velocityX;
        this.velocityY = velocityY;
        this.maxDistance = distance;
    }
    /**
     * 画自己
     * @param ctx 画布上下文
     */
    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.xIndex, this.yIndex, this.radius, 0, 360)
        ctx.closePath();
        ctx.fillStyle = Dot.COLOR_SELF;
        ctx.fill();
    }
    /**
     * 当两个点的距离在定义的最大距离内时，对二者进行连线
     * @param ctx 画布上下文
     * @param dot 另一个点
     */
    drawLine(ctx, dot) {
        let dx = this.xIndex - dot.xIndex;
        let dy = this.yIndex - dot.yIndex;
        if (Math.sqrt(dx * dx + dy * dy) < this.maxDistance) {
            ctx.beginPath();
            ctx.moveTo(this.xIndex, this.yIndex);
            ctx.lineTo(dot.xIndex, dot.yIndex);
            ctx.closePath();
            ctx.strokeStyle = Dot.COLOR_LINE;
            ctx.stroke();
        }
    }
    /**
     * 对点进行移动，其实就是跳一个位置，不同帧在不同位置使得点的跳跃变成了动画
     * @param canvas 画布
     */
    move(canvas) {
        this.velocityX = (this.xIndex < canvas.width  && this.xIndex > 0) ? this.velocityX : (-this.velocityX);
        this.velocityY = (this.yIndex < canvas.height && this.yIndex > 0) ? this.velocityY : (-this.velocityY);
        this.xIndex += this.velocityX;
        this.yIndex += this.velocityY;
    }
    /**
     * 根据屏幕宽度生成合适的位移速度
     **/
    static getAppropriateVelocity() {
        if (document.body.offsetWidth < 480)  { return 0.500 }
        if (document.body.offsetWidth < 960)  { return 0.666 }
        if (document.body.offsetWidth < 1440) { return 0.833 }
        return 1;
    }
    /**
     * 根据屏幕宽度生成合适的连线距离
     **/
    static getAppropriateDistance() {
        return document.body.offsetWidth / 10;
    }
    /**
     * 根据屏幕宽度生成合适的点大小
     **/
    static getAppropriateSize() {
        if (document.body.offsetWidth < 200)  { return 2.9; }
        if (document.body.offsetWidth < 300)  { return 3.0; }
        if (document.body.offsetWidth < 400)  { return 3.9; }
        if (document.body.offsetWidth < 500)  { return 4.7; }
        if (document.body.offsetWidth < 600)  { return 5.5; }
        if (document.body.offsetWidth < 700)  { return 6.2; }
        if (document.body.offsetWidth < 800)  { return 6.8; }
        if (document.body.offsetWidth < 900)  { return 7.3; }
        if (document.body.offsetWidth < 1000) { return 7.7; }
        if (document.body.offsetWidth < 1100) { return 8.1; }
        if (document.body.offsetWidth < 1200) { return 8.4; }
        if (document.body.offsetWidth < 1300) { return 8.7; }
        if (document.body.offsetWidth < 1400) { return 9.0; }
        if (document.body.offsetWidth < 1500) { return 9.3; }
        if (document.body.offsetWidth < 1600) { return 9.5; }
        if (document.body.offsetWidth < 1700) { return 9.7; }
        if (document.body.offsetWidth < 1800) { return 9.9; }
        return 10;
    }
    /**
     * 根据屏幕大小生成合适的点数量
     **/
    static getAppropriateCount() {
        let factor = 0.00002;
        if (document.body.offsetWidth < 1600) { factor = 0.000025; }
        if (document.body.offsetWidth < 1500) { factor = 0.000030; }
        if (document.body.offsetWidth < 1400) { factor = 0.000035; }
        if (document.body.offsetWidth < 1300) { factor = 0.000040; }
        if (document.body.offsetWidth < 1200) { factor = 0.000045; }
        if (document.body.offsetWidth < 1100) { factor = 0.000050; }
        if (document.body.offsetWidth < 1000) { factor = 0.000055; }
        if (document.body.offsetWidth < 900)  { factor = 0.000060; }
        if (document.body.offsetWidth < 800)  { factor = 0.000065; }
        if (document.body.offsetWidth < 700)  { factor = 0.000070; }
        if (document.body.offsetWidth < 600)  { factor = 0.000078; }
        if (document.body.offsetWidth < 500)  { factor = 0.000086; }
        if (document.body.offsetWidth < 400)  { factor = 0.000094; }
        if (document.body.offsetWidth < 300)  { factor = 0.000102; }
        if (document.body.offsetWidth < 200)  { factor = 0.000110; }
        return document.body.offsetHeight * document.body.offsetWidth * factor;
    }
}

class CurrentDot extends Dot {
    static COLORS = ['rgba(130,113,0,0.3)', 'rgba(92,134,45,0.3)', 'rgba(5,119,72,0.3)', 'rgba(6,82,121,0.3)', 'rgba(74,66,102,0.3)'];
    /**
     * 创建一个 CurrentDot 实例
     * @param x         dot 的 x 坐标
     * @param y         dot 的 y 坐标
     * @param radius    dot 的半径
     * @param velocityX dot 的 x 方向位移速度
     * @param velocityY dot 的 y 方向位移速度
     * @param distance  dot 连线的最远距离
     */
    constructor(x, y, radius, velocityX, velocityY, distance) {
        super(x, y, radius, velocityX, velocityY, distance);
        this.isActive = false;
        this.color = '';
    }
    /**
     * 画自己
     * @param ctx 画布上下文
     */
    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.xIndex, this.yIndex, this.radius, 0, 360);
        ctx.closePath();
        ctx.fillStyle = this.color = this.color === ''
            ? CurrentDot.COLORS[Math.floor(Math.random() * CurrentDot.COLORS.length)]
            : this.color;
        ctx.fill();
    }
}

/**
 * 进行渲染，一次渲染即为一帧动画
 * @param canvas      画布
 * @param ctx         画布上下文
 * @param dots        点数组
 * @param currentDot  当前点
 */
function render(canvas, ctx, dots, currentDot) {
    /* 清空画布 */
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    /* 所有点先进行移动和连线 */
    for (let i = 0; i < dots.length; i++) {
        dots[i].move(canvas);
        for (let j = i + 1; j < dots.length; j++) {
            dots[i].drawLine(ctx, dots[j])
        }
    }
    /* 如果鼠标在画布上，则将 currentDot 移到鼠标上，并和其他点进行连线，最后再把自己画出来 */
    if (currentDot.isActive) {
        for (let k = 1; k < dots.length; k++) {
            currentDot.drawLine(ctx, dots[k])
        }
        currentDot.draw(ctx);
    }
    /* 画出所有点，之所以在最后画出点自身，是为了不让线覆盖在点上面 */
    for (let i = 0; i < dots.length; i++) {
        dots[i].draw(ctx);
    }
    /* 如果点的数量超过 1 个，就渲染下一帧，如果需要停止动画，只需要将 dots.length 置为 < 1 即可 */
    if (dots.length > 1) {
        window.requestAnimationFrame(function () {
            render(canvas, ctx, dots, currentDot);
        });
    }
}

class ZhiHuBg {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');
        this.dots = [];
        this.currentDot = new CurrentDot(0, 0, Dot.getAppropriateSize() - 1, 0, 0, Dot.getAppropriateDistance() * 2);
        this.initialized = false;
    }
    init() {
        /* 将画布拉到屏幕的宽高大小 */
        this.canvas.width  = document.body.scrollWidth;
        this.canvas.height = document.body.scrollHeight;
        this.dotsNum = Dot.getAppropriateCount();
        for (let i = 0; i < this.dotsNum; i++) {
            this.dots.push(new Dot(
                Math.random() * this.canvas.width,
                Math.random() * this.canvas.height,
                Math.random() * Dot.getAppropriateSize(),
                Math.random() * Dot.getAppropriateVelocity(),
                Math.random() * Dot.getAppropriateVelocity(),
                Dot.getAppropriateDistance()
            ));
        }
        this.initialized = true;
        render(this.canvas, this.ctx, this.dots, this.currentDot);
    }
    reInit() {
        this.dots.length = 0;
        this.initialized = false;
        setTimeout(() => {
            if (!this.initialized) {
                this.initialized = true;
                this.currentDot.maxDistance = Dot.getAppropriateDistance() * 2;
                this.currentDot.radius = Dot.getAppropriateSize();
                zhiHuBg.init();
            }
        }, 1000);
    }
}

/**
 * 激活鼠标所指向的点
 * @param e 鼠标事件
 */
function activeCurrentDot(e) {
    zhiHuBg.currentDot.isActive = true;
    /* 如果没有鼠标时间，则是滑动操作 */
    if (e.clientX) {
        zhiHuBg.lasyClientX = e.clientX;
        zhiHuBg.lasyClientY = e.clientY;
    }
    let scrollTop  = document.documentElement.scrollTop || document.body.scrollTop;
    let scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
    zhiHuBg.currentDot.xIndex = zhiHuBg.lasyClientX + scrollLeft;
    zhiHuBg.currentDot.yIndex = zhiHuBg.lasyClientY + scrollTop;
}

const zhiHuBgElement = document.getElementById('zhi-hu-background');

const zhiHuBg = new ZhiHuBg(zhiHuBgElement);
window.addEventListener('load',      (e) => zhiHuBg.init());
window.addEventListener('mousemove', (e) => activeCurrentDot(e));
window.addEventListener('scroll',    (e) => activeCurrentDot(e));
window.addEventListener('resize',    (e) => zhiHuBg.reInit());