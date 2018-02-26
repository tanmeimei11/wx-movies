import Pagebase from './page'
export default class Seat extends Pagebase {
  /**
   * 获取我的信息接口
   */
  static async getSessionFrom() {
    return await this.request({
      url: '/mnp/custom/auto_reply'
    })
  }
}
