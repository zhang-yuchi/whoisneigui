const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
function jsonToString(obj){
  return JSON.stringify(obj)
}
function stringToJson(str){
  return JSON.parse(str)
}
function getArr(arr){
  let voteList = []
  for (let item of arr) {
    voteList.push({ 'from': item.split('|')[0], 'to': item.split('|')[1] })
  }
  return voteList
}
module.exports = {
  formatTime: formatTime,
  jsonToString: jsonToString,
  stringToJson:stringToJson,
  getArr:getArr
}
