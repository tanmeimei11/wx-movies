import Pagebase from './page'
export default class Result extends Pagebase {
  /**
   * 获取我的信息接口
   */
  static async getContractID() {
    return await this.request({
      url: '/mnp/order/result'
    })
  }
}
