//实现日历
window.onload = function() {
    var today = new Date();
    generateCalendar(today);
}

document.getElementById('pre_month').onclick = function() {
    var month = document.getElementById('showDate').innerHTML.substr(5) - 1;
    var year = document.getElementById('showDate').innerHTML.substr(0, 4);
    var preMonth = new Date(year, month - 1, 1);
    generateCalendar(preMonth);
}

document.getElementById('next_month').onclick = function() {
    var month = document.getElementById('showDate').innerHTML.substr(5) - 1;
    var year = document.getElementById('showDate').innerHTML.substr(0, 4);
    var preMonth = new Date(year, month + 1, 1);
    generateCalendar(preMonth);
}


function generateCalendar(today) {
    var year = today.getFullYear(); //本年
    var month = today.getMonth() + 1; //本月
    var day = today.getDate(); //本日
    //本月第一天是星期几（距星期日离开的天数）
    var startDay = new Date(year, month - 1, 1).getDay();
    //本月有多少天(即最后一天的getDate()，但是最后一天不知道，我们可以用“上个月的0来表示本月的最后一天”)
    var nDays = new Date(year, month, 0).getDate();
    //开始画日历
    document.getElementById('showDate').innerHTML = year + '.' + month;
    var numRow = 0; //记录行的个数，到达7的时候创建tr
    var i; //日期
    var html = '';
    html += '<table id="Body" width="212"><tbody>';
    //第一行
    html += '<tr>';
    for (i = 0; i < startDay; i++) {
        html += '<td></td>';
        numRow++;
    }
    for (var j = 1; j <= nDays; j++) {
        //如果是今天则显示红色
        if (j == day) {
            html += '<td style="background-color: #86b0ed;" onclick="' + "alert('今天是" + j + "号');" + '">';
            html += j; //开始加日期
        } else {
            html += '<td onclick="' + "alert('你点的是" + j + "号');" + '">';
            html += j; //开始加日期
        }
        html += '</td>';
        numRow++;
        if (numRow == 7) { //如果已经到一行（一周）了，重新创建tr
            numRow = 0;
            html += '</tr><tr>';
        }
    }
    html += '</tbody></table>';
    document.getElementById("Container").innerHTML = html;
}