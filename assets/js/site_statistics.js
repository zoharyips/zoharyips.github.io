/**
 * 更新网站统计次数
 * 
 * @param {Counter} Counter 一个查询实例
 * @param {string} pageTitle 页面标题，作为数据库查询主键
 */
function updateCount(Counter, pageTitle, siteTitle) {
  var url = window.location.href;
  var query = new AV.Query(Counter);            // 新建查询
  query.equalTo("post_title", pageTitle);       // 根据 title 查询记录
  query.find({
    success: function(results) {
      if (results.length > 0) {                 // 存在该记录
        var counter = results[0];               // 获取该记录
        counter.fetchWhenSave(true);
        counter.increment("visited_times");     // 将点击次数加1
        counter.save(null, {
          success: function(counter) {
            console.log('更新记录成功：' + counter.get('visited_times'));
            $('#page_statistics').text('Page access: ' + counter.get('visited_times'));
          },
          error: function(counter, error) {
            console.error('Failed to save Visitor num, with error message: ' + error.message);
          }
        });
      } else {                                  // 无此记录
        var newRecord = new Counter();
        newRecord.set("post_title", pageTitle);
        newRecord.set("post_url", url);
        newRecord.set("visited_times", 1);
        newRecord.save(null, null);
        // 若持续都是 1 则表示无法创建该记录
        $('#page_statistics').text('page: 1');
      }
    },
    error: function(error) {
      console.log('更新页统计数失败:' + error.code + " " + error.message);
    }
  });
  query.equalTo("post_title", siteTitle); // 获取站点总记录
  query.find({
    success: function(results) {
        var counter = results[0];                  // 获取总记录
        counter.fetchWhenSave(true);
        counter.increment("visited_times");        // 将点击次数加1
        counter.save(null, {
          success: function(counter) {
            console.log('更新站点总记录成功：' + counter.get('visited_times'));
            $('#site_statistics').text('Site access: ' + counter.get('visited_times'));
          },
          error: function(counter, error) {
            console.error('Failed to save Visitor num, with error message: ' + error.message);
          }
        });
    },
    error: function(error) {
      console.log('更新站点总统计数失败:' + error.code + " " + error.message);
    }
  });
}