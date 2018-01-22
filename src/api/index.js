import Pagebase from './page';
export default class Index extends Pagebase {
  /**
   * 获取我的信息接口
   */
  static async getIndexInfo () {
    return await this.request( {
      url: '/index/info'
    } );
  }
}
