import Pagebase from './page';
import tips from '@/utils/tips';
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
  static async interface ( url, _data, method ) {
    return await this.request( {
      url: url,
      method: method || 'GET',
      data: _data
    } );
  }

  /**
   * 接口
   */
  static async cancelUnion ( _data ) {
    return await this.request( {
      isBackRes: true,
      url: '/mnp/union/cancel',
      method: 'POST',
      data: _data
    } );
  }
  // 获取气泡接口
  static async getBulleInfo ( data ) {
    tips.setLoading();
    return await this.request( {
      url: '/info/union/others',
      data: data
    } );
  }
}
