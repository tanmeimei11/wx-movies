import Pagebase from './page';
export default class upgrade extends Pagebase {
  /**
   * 获取我的信息接口
   */
  static async getUpgradeData () {
    return await this.request( {
      url: '/mnp/custom/auto_reply'
    } );
  }
}
