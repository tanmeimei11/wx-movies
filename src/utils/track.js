import wepy from 'wepy';
import {GoogleAnalytics, HitBuilders} from '@/lib/ga.js';
const trackPrefix = 'h5_tcpa_movie_';
const trackUrl = 'https://stats1.jiuyan.info/onepiece/router.html';
var GAtracker = null;

/**
 * 埋点请求
 * @param {*} action 埋点参数
 * @param {*} params 辅助对象参数
 * @param {*} prefix 埋点前缀默认 h5_wechat_
 */
export default async function track ( action, params ) {
  var _data = {
    action: `${trackPrefix}${action}`,
    token: wepy.$instance.globalData.xToken,
    from: wepy.$instance.globalData.qrcode_from,
    ...params
  };

  // in埋点
  wepy.request( {
    url: trackUrl,
    data: _data
  } );
  // ga埋点
  GAtrackReq( _data );
}

/**
 *
 */
function initGaTrack () {
  // 初始化GoogleAnalytics Tracker
  return GoogleAnalytics.getInstance( )
  .setAppName( 'in同城趴电影' )
  .newTracker( 'UA-113017547-1' ); // 用你的 Tracking ID 代替
}
GAtracker = initGaTrack();

/**
 *Google统计代码
 * @param {*} app
 * @param {*} track
 */
function GAtrackReq ( data ) {
  var _action = data.action;
  var _label = data.label || '';
  var GAtrackerAct = '';
  if ( /.*_screen/.exec( _action ) ) {  // 屏幕
    GAtracker.setScreenName( _action );
    GAtrackerAct = new HitBuilders.ScreenViewBuilder().build();
  } else { // 行为
    GAtrackerAct = new HitBuilders.EventBuilder()
        .setCategory( _action )
        .setAction( `${wepy.$instance.globalData.qrcode_from || 'none'}` )
        .setLabel( _label ); // 可选
  }
  GAtracker.send( GAtrackerAct );
};
