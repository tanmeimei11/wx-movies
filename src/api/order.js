import Pagebase from './page';
export default class Order extends Pagebase {
  static async getProductInfo () {
    return await this.request( {
      url: '/mnp/order/info'
    } );
  }
  static async getOrderInfo () {
    var _data = {
      product_id: '',
      pay_channel: 'wechatpay',
      buy_num: 1,
      qrcode_from: '',
      tikect_id: '1',
      is_seckill: 0,
      promotion: ''
    };
    let res = await this.request( {
      url: '/mnp/order/create_common',
      data: _data
    } );

    if ( res.succ ) {
      return res.data;
    }
  }
}
