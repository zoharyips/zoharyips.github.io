/**
 * 判断同一个 IP 上一次访问的网页是否是当前网页，如果页面访问统计数可增加则返回 true。
 * 
 * @param {string} title 页面标题
 * @param {Counter} Counter 数据库连接，若需要更新该表数据，请勿修改此参数名
 * @param {Counter} dataCounter 数据库连接
 * @param {string} fingerprintHash 浏览器指纹
  IP 地址
 */
function onWork(pageTitle, siteTitle, Counter, dataCounter, fingerprintHash) {
  var query = new AV.Query(Counter);
  query.equalTo("fingerprint_hash", fingerprintHash);
  query.find ({
    success: function(results) {
      if (results.length > 0) {                 // 存在该 IP 记录
        var result = results[0];                // 获取该记录
        var updatedTime = new Date(result.updatedAt).getTime();
        var accessTime = new Date().getTime();
        console.log('updatedTime: ' + updatedTime + "\taccessTime: " + accessTime + "\tgap: " + (accessTime - updatedTime));
        // 如果不是同一个页面的，通过
        if (result.get('post_title') == pageTitle && accessTime - updatedTime < 60000) {
          console.log('指纹相同，上次访问页面标题与当前标题相同，且时间间隔小于 1 分钟');
          queryCount(dataCounter, pageTitle, siteTitle);
        } else {
          if (result.get('post_title') != pageTitle) {
            console.log('指纹相同，上次访问页面标题与当前标题不同');
            result.set("post_title", pageTitle);
          }
          console.log('指纹相同，上次访问页面标题与当前标题相同，时间间隔合法');
          result.increment("counter");
          result.save(null, null);
          updateCount(dataCounter, pageTitle, siteTitle);
        }
      } else {
        console.log('无此指纹记录');
        var newRecord = new Counter();
        newRecord.set("fingerprint_hash", fingerprintHash);
        newRecord.set("post_title", pageTitle);
        newRecord.save(null, null);
        updateCount(dataCounter, pageTitle, siteTitle);
      }
    },
    error: function(error) {
      console.log('查询 visitin_ip 表失败: ' + error.code + " " + error.message);
    }
  });
}

/**
 * 更新网站访问统计数据
 * 
 * @param {Counter} Counter 数据库连接
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
        $('#page_statistics').text('Page access: 1');
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

/**
 * 查询页面、站点访问数据
 * 
 * @param {Counter} Counter 数据库连接
 * @param {string} pageTitle 页面标题
 * @param {string} siteTitle 站点标题
 */
function queryCount(Counter, pageTitle, siteTitle) {
  var query = new AV.Query(Counter);
  query.equalTo("post_title", pageTitle);
  query.find({
    success: function(results) {
      var counter = results[0];
      $('#page_statistics').text('Page access: ' + counter.get('visited_times'));
    },
    error: function(error) {
      console.log('页面访问数据查询失败:' + error.code + " " + error.message);
    }
  });
  query.equalTo("post_title", siteTitle);
  query.find({
    success: function(results) {
      var counter = results[0];
      $('#site_statistics').text('Site access: ' + counter.get('visited_times'));
    },
    error: function(error) {
      console.log('站点总访问数据查询失败:' + error.code + " " + error.message);
    }
  });
}