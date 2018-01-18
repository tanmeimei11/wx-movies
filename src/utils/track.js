import wepy from 'wepy'
import base from '@/api/base'

/**
 * 埋点请求
 * @param {*} action 埋点参数
 * @param {*} params 辅助对象参数
 * @param {*} prefix 埋点前缀默认 h5_wechat_
 */
export default async function track(action, params, prefix = 'h5_wechat_') {
  await base.ready()
  const { machine_code, uid, WechatApp: platform } = wepy.$instance.globalData
  wepy.request({
    url: 'https://webclick.jiuyan.info/xixingdafa.html',
    data: Object.assign({
      uid,
      platform,
      machine_code,
      action: `${prefix}${action}`
    }, params)
  })
}
