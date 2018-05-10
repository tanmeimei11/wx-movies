import wepy from 'wepy';
import {GoogleAnalytics, HitBuilders, Product, ProductAction, CampaignParams} from '@/lib/ga.js';
import {trackId} from './config';
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
  .newTracker( trackId ); // 用你的 Tracking ID 代替
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
  // 类型
  if ( /.*_screen/.exec( _action ) ) {  // 屏幕
    GAtracker.setScreenName( _action );
    GAtrackerAct = new HitBuilders.ScreenViewBuilder();
  } else { // 行为
    GAtrackerAct = new HitBuilders.EventBuilder()
        .setCategory( _action )
        .setAction( `${wepy.$instance.globalData.qrcode_from || 'none'}` )
        .setLabel( _label );
  }

  // 电子商务
  if ( data.gaProductInfo && data.gaProductInfo.id ) {
    let _product = data.gaProductInfo;
    !_product.quantity && ( _product.quantity = 1 );
    // let _product = {
    //   id: 123,
    //   name: '香香',
    //   price: 10,
    //   quantity: 1,
    //   type: data.gaProductInfo.type
    // };

    if ( _product.type === ACTION_DETAIL ) {
      GAtrackerAct.addImpression( getProduct( _product ), _product.name );
    }
    GAtrackerAct.setNewSession().addProduct( getProduct( _product ) )
      .setProductAction( getProductAction( _product ) );
  }
  // 场景值
  if ( wepy.$instance.globalData.gaSence ) {
    let _sence = wepy.$instance.globalData.gaSence;
    var campaignUrl = CampaignParams.buildFromWeappScene( _sence ).toUrl();
    GAtracker.setCampaignParamsOnNextHit( campaignUrl );
  }

  GAtracker.send( GAtrackerAct.build() );
};

const ACTION_CLICK = 'ACTION_CLICK'; //  1.点击商品
const ACTION_DETAIL = 'ACTION_DETAIL'; //  1.查看商品页面
const ACTION_ADD = 'ACTION_ADD'; // 2.购买按钮
const ACTION_CHECKOUT = 'ACTION_CHECKOUT'; // 3.购买成功
const ACTION_PURCHASE = 'ACTION_PURCHASE'; // 3.购买成功

// 获得商品
function getProduct ( _product ) {
  return new Product()
    .setId( _product.id )
    .setName( _product.name )
    .setPrice( _product.price )
    .setQuantity( 1 )
    .setCategory( _product.name )
    .setBrand( _product.name )
    .setVariant( _product.name )
    .setPosition( _product.id )
    .setCustomDimension( 1, _product.name ); // 产品范围的自定义维度#1
}

// 操作商品
function getProductAction ( _product ) {
  var productAction;
  var _type = _product.type;
  if ( _type === ACTION_DETAIL || _type === ACTION_CLICK ) {
    productAction = new ProductAction( ProductAction[_type] )
    .setProductActionList( _product.name );
  } else if ( _type === ACTION_ADD ) {
    productAction = new ProductAction( ProductAction[_type] )
    .setTransactionId( _product.id );
  } else if ( _type === ACTION_PURCHASE || _type === ACTION_CHECKOUT ) {
    productAction = new ProductAction( ProductAction[_type] )
    .setTransactionId( _product.id )
    .setTransactionRevenue( _product.price * _product.quantity ); // 【重要】这个是订单总价
  }

  return productAction;
}
