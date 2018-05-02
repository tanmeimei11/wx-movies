import Pagebase from './page';
export default class Seat extends Pagebase {
  /**
   * 获取我的信息接口
   */
  static async getModules ( data ) {
    return await this.request( {
      url: '/stc/promo/page',
      data: data
    } );
  }
}
