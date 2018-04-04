import wepy from 'wepy';
import Pagebase from './page';
import { paymentChannel, businessParty, payUrl } from '@/utils/config';

export default class pay extends Pagebase {
  /**
   * 创建订单接口
   */
  static async creatOrder ( url, _data ) {
    console.log( wepy.$instance.globalData );
    return await this.request( {
      url: url,
      isBackRes: true,
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
