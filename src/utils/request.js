
import wepy from 'wepy'
import mockConfig from '@/mock/mockConfig'
import {DOMAIN, isMock} from './config'

var requestBefore = (option, token) => {
  !option.data && (option.data = {})

  !/^http/.test(option.url) && (option.url = DOMAIN + option.url)
  // 添加必要的辅助字断
  // var deviceInfo = getApp().getDeviceInfo()
  var cookieObj = {
    // 'tg_auth': token
    'tg_auth': '12314'
    // '_v': config._v,
    // 'wxv': deviceInfo.version,
    // '_s': `${deviceInfo.platform.toLowerCase()}_wxminiprogram`,
    // '_sys': deviceInfo.system.toLowerCase(),
    // '_gps': deviceInfo.gps || ''
  }
  // option.data = {
  //   ...option.data,
  //   ...cookieObj
  // }
  if (!option.header) {
    option.header = {}
  }
  option.header.Cookie = Object.keys(cookieObj).map((key) => {
    return `${key}=${cookieObj[key]}`
  }).join(';')

  console.log(option)
  // 支付网关必须加上必要字段_token
  if (/payment\/signature/.test(option.url)) {
    option.data._token = token
  }
  option.data.privateKey = token
  // 请求带上来源
  // option.data.from = wx.getStorageSync('from')
}

/**
 * 请求函数
 * @param {*} option
 */

var request = async function (option) {
  // var token = wx.getStorageSync('token') || ''
  requestBefore(option, '')
  if (isMock) {
    console.log(option.url, mockConfig[option.url])
    console.log(require('../mock/' + mockConfig[option.url]))
    return require('../mock/' + mockConfig[option.url])
  }
  // LOG('start request option:', option)
  var reqRes = await wepy.request(option)
  return reqRes.data
}

module.exports = {
  request
}
