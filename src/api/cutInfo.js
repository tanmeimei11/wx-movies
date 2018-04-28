import Pagebase from './page';
export default class cutinfo extends Pagebase {
  /**
   * 获取我的信息接口
   */
  static async getCutInfo () {
    return await this.request( {
      url: '/mnp/cut/rp/page_info'
    } );
  }
}
