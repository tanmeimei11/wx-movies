import wepy from 'wepy';
import Pagebase from './page';
import { paymentChannel, businessParty, payUrl, token } from '@/utils/config';

export default class Last extends Pagebase {
  /**
   *  获取众筹状态接口
   */
  static async getDetailStatus ( queryObj ) {
    var _data = {
      product_id: 359,
      ...queryObj
    };
    // if ( shareCode ) {
    //   _data.share_code = shareCode;
    // }
    return await this.request( {
      url: '/info/product/detail_common_new',
    //   url: '/h5/info/detail_common',
      data: _data
    } );
  }
  /**
   * 创建订单接口
   */
  static async creatOrder ( url, _data ) {
    return await this.request( {
      url: url,
      isBackRes: true,
      method: 'POST',
      data: {
        ..._data,
        pay_channel: paymentChannel
      }
    } );
  }

  /**
   * 获取订单信息接口
   * @param {*} createRes  创建订单的res
   */
  static async getOrderDetail ( createRes ) {
    var _data = {
      _token: wepy.$instance.globalData.xToken,
      payment_channel: paymentChannel,
      business_party: businessParty,
      order_detail: createRes.order_detail,
      extend_params: JSON.stringify( {
        open_id: createRes.open_id
      } )
    };
    return await this.request( {
      url: payUrl,
      data: _data
    } );
  }
}
