import Pagebase from './page';
export default class cut extends Pagebase {
  static async friendDetail ( cutId ) {
    return await this.request( {
      url: '/mnp/cut/friendDetail',
      data: {
        cut_id: cutId
      }
    } );
  }
  static async action ( cutId ) {
    return await this.request( {
      url: '/mnp/cut/action',
      data: {
        cut_id: cutId
      }
    } );
  }
  /**
   *  获取弹窗数据接口
   */
  static async detail ( ) {
    return await this.request( {
      url: '/mnp/cut/detail'
    } );
  }
}
