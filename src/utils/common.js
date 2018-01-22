/**
 * 格式化时间戳
 * @param {*} date
 * @param {*} isShowWeek
 */
const formatTime = (_date, isShowWeek) => {
  var date = new Date(_date)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return `${year}.${formatNumber(month)}.${formatNumber(day)} `
}

/**
 * 个位参数加0
 * @param {*} n
 */
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  formatTime
}
