import Pagebase from './page';
export default class leke extends Pagebase {
  /**
   * 获取我的信息接口
   */
  static async getSessionFrom () {
    return await this.request( {
      url: '/mnp/custom/leke_reply'
    } );
  }
  static async getLekeInfo () {
    console.log( 'get card' );
    return await this.request( {
      url: '/mnp/card/has_card'
    } );
  }
}
