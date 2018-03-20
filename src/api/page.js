import { isMock, DOMAIN } from '@/utils/config';
import mockConfig from '@/mock/mockConfig';
import axios from '@/utils/axios';

export default class Pagebase {
  // 数据交互域名
  static async request ( options ) {
    // 域名添加
    !/^http/.test( options.url ) && ( options.url = DOMAIN + options.url );
    // mock
    if ( isMock ) {
      console.log( options.url );
      var m = require( '../mock/' + mockConfig[options.url] );
      if ( !m.succ ) {
        throw new Error( 'false' );
      }
      return m.data;
    }
    // 方法
    return await axios.request( options );
  }
  static async go ( promise ) {
    return promise.then( ( res ) => {
      return !res.succ ? [new Error( '网络错误' ), res] : [null, res];
    } ).catch( err => [err] );
  }
}
