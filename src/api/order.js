import Pagebase from './page';
import {payUrl} from '@/utils/config';
export default class Order extends Pagebase {
  static async getProductInfo ( _data ) {
    return await this.request( {
      url: '/mnp/order/info',
      method: 'POST',
      data: _data
    } );
  }
  static async getOrderInfo ( _data ) {
    return await this.request( {
      url: '/mnp/order/create_common',
      method: 'POST',
      data: _data
    } );
  }
  static async getPayNetwork ( _data ) {
    return await this.request( {
      url: payUrl,
      data: _data
    } );
  }
}
