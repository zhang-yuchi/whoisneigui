let timer = {}
//计时函数
timer.countTime = (that, time, callback) => {
  that.setData({
    countTime: time
  })
  let countTime = that.data.countTime;
  let interval = setInterval(function () {
    that.setData({
      countTime: countTime--
    })
    if (that.data.countTime <= 0) {
      clearInterval(that.data.interval);
      callback(that);
    }
  }, 1000)
  that.setData({
    interval: interval
  })
}

module.exports = timer