import wepy from 'wepy';
const trackPrefix = 'h5_tcpa_movie_';
const trackUrl = '';

/**
 * 埋点请求
 * @param {*} action 埋点参数
 * @param {*} params 辅助对象参数
 * @param {*} prefix 埋点前缀默认 h5_wechat_
 */
export default async function track ( action, params ) {
  wepy.request( {
    url: trackUrl,
    data: {
      action: `${trackPrefix}${action}`,
      ...params
    }
  } );
}
