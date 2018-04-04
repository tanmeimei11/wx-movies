import Pagebase from './page';
export default class Result extends Pagebase {
  /**
   *
   * 拼团状态
   *
  */
  static async getUnionStatus ( data ) {
    return await this.request( {
      url: '/mnp/union/status',
      data: data
    } );
  }
  /**
   *
   * 拼团信息 图片流
   *
  */
  static async getUnionInfo ( data ) {
    return await this.request( {
      url: '/info/union/info',
      data: data
    } );
  }

   /**
   * 接口
   */
  static async interface ( url, _data ) {
    return await this.request( {
      url: url,
      data: _data
    } );
  }
}
