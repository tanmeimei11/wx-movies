import Pagebase from './page';
import wepy from 'wepy';
import { paymentChannel, businessParty, payUrl, token } from '@/utils/config';
export default class upgrade extends Pagebase {
  /**
   * 获取我的信息接口
   */
  static async getUpgradeData ( ticketid ) {
    return await this.request( {
      url: `/mnp/ticket/upgrade_info2`,
      // url: `/mnp/ticket/upgrade_info`,
      data: {
        'ticket_id': ticketid
      }
    } );
  }
    /**
   * 创建订单接口
   */
  static async creatOrderKa ( buyNumber ) {
    // ticketId && ( _data.tikect_id = ticketId );
    console.log( wepy.$instance.globalData );
    return await this.request( {
      url: '/mnp/order/create',
      data: {
        product_id: 159,
        pay_channel: paymentChannel,
        buy_num: buyNumber,
        promotion: 'ticket',
        qrcode_from: wepy.$instance.globalData.qrcode_from || ''
      }
    } );
  }
  static async creatOrderPiao ( buyNumber, ticketid ) {
    // ticketId && ( _data.tikect_id = ticketId );
    console.log( wepy.$instance.globalData );
    return await this.request( {
      url: '/mnp/order/create_tu2',
      method: 'POST',
      data: {
        product_id: 200,
        pay_channel: paymentChannel,
        buy_num: buyNumber,
        ticket_id: ticketid,
        qrcode_from: wepy.$instance.globalData.qrcode_from || ''
      }
    } );
  }

  /**
   * 获取订单信息接口
   * @param {*} createRes  创建订单的res
   */
  static async getOrderDetail ( createRes ) {
    var _data = {
      _token: wepy.$instance.globalData.xToken || token,
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
