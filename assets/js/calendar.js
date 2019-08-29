window.onload = function() {
  var today = new Date();
  generateCalendar(today);
}

document.getElementById('pre_month').onclick = function() {
  var today = new Date();
  var targetMonth = parseInt(document.getElementById('show_date').innerHTML.substr(5)) - 1;
  var year = parseInt(document.getElementById('show_date').innerHTML.substr(0, 4));
  console.log(year + "." + targetMonth + ":" + today.getFullYear() + "." + today.getMonth());
  if (targetMonth == (today.getMonth() + 1) && year == today.getFullYear()) {
    generateCalendar(today);
  } else{
    generateCalendar(new Date(year, targetMonth - 1, 1));
  }
}

document.getElementById('next_month').onclick = function() {
  var today = new Date();
  var targetMonth = parseInt(document.getElementById('show_date').innerHTML.substr(5)) + 1;
  var year = parseInt(document.getElementById('show_date').innerHTML.substr(0, 4));
  console.log(year + "." + targetMonth + ":" + today.getFullYear() + "." + today.getMonth());
  if (targetMonth == (today.getMonth() + 1) && year == today.getFullYear()) {
    generateCalendar(today);
  } else{
    generateCalendar(new Date(year, targetMonth - 1, 1));
  }
}

function generateCalendar(today) {
  var year = today.getFullYear(); // 本年
  var month = today.getMonth() + 1; // 本月
  var day = today.getDate(); // 本日
  var dayBegin = new Date(year, month - 1, 1).getDay();
  var dayCount = new Date(year, month, 0).getDate();
  if (month < 10) {
    month = "0" + "" + month;
  }
  document.getElementById('show_date').innerHTML = year + '.' + month;
  var html = '<table><tr>';
  var dayIndex = 1;
  for (var index = 0; index < 37; index++) {
    if (index > dayBegin && index <= (dayCount + dayBegin)) {
      if (dayIndex == day) {
        html += '<td class="calendar_column normal_date" onclick="onDateClick('+ dayIndex + ')">' + dayIndex;
      } else {
        html += '<td class="calendar_column active_date" onclick="onDateClick('+ dayIndex + ')">' + dayIndex;
      }
      dayIndex++;
    } else if (index > (dayCount + dayBegin)) {
      html += '<td class="calendar_column" style="opacity: 0">a</td>';
    } else {
      html += '<td class="calendar_column"></td>';
    }
    if (index % 7 == 0) {
      html += '</tr><tr>';
    }
  }
  html += '</tr></table>';
  document.getElementById("calendar_body_container").innerHTML = html;
}
function onDateClick(day) {
  alert("You have press the date: " + day);
}