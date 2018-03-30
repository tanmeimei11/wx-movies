import Pagebase from './page'
export default class Result extends Pagebase {
  /**
   * 获取我的信息接口
   */
  static async getContractID( productId ) {
    return await this.request({
      url: '/mnp/order/result',
      data: {
        product_id: productId
      }
    })
  }
  /**
   * 获取我的信息接口
   */
  static async addPhone(order_no, phone) {
    return await this.request({
      url: '/mnp/card/add_phone',
      method: 'POST',
      data: {
        order_no: order_no,
        phone: phone
      }
    })
  }
}
