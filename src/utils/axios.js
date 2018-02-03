import wepy from 'wepy';
import tips from './tips';

/**
 * @define 字符串转为对象
 * @parame String
 * @return Object
 *
 * #for example:
 *  getUrlParams('https://www.domain.com?a=1&b=2&c=3')
 *  {a: "1", b: "2", c: "3"}
 */
function getQueryParams ( str ) {
  var result = {};
  var re = /([^&=]+)=([^&]*)/g;
  var m;

  while ( m = re.exec( str ) ) {
    result[decodeURIComponent( m[1] )] = decodeURIComponent( m[2] );
  }

  return result;
}

/**
 * 模仿 axios api 规范
 * https://github.com/axios/axios
 */
export default class http {
  static async request ( config ) {
    tips.loading();
    this._fixRequest( config ); // 支付宝小程序特有
    const myres = await wepy.request( config );
    tips.loaded();
    if ( this.isSuccess( myres ) ) {
      return myres.data.data;
    } else {
      console.error( Object.assign( config, myres ) );
      throw this.requestException( myres );
    }
  }

  /**
   * 判断请求是否成功
   */
  static isSuccess ( { statusCode, data } ) {
    // 微信请求错误
    if ( statusCode !== 200 ) {
      return false;
    }
    // 服务响应错误
    return !( data && parseInt( data.code ) !== 0 );
  }

  /**
   * 异常
   */
  static requestException ( { statusCode, data } ) {
    const error = {};
    error.statusCode = statusCode;
    const serverData = data.data;
    if ( serverData ) {
      error.serverCode = data.code;
      error.message = data.message;
      error.serverData = serverData;
    }
    return error;
  }

  static get ( url, config = {} ) {
    config['url'] = url;
    config['method'] = 'GET';

    return this.request( config );
  }

  static post ( url, config = {} ) {
    config['url'] = url;
    config['method'] = 'POST';

    return this.request( config );
  }

  /**
   * 请求处理
   * fix bug: IDE url 连接符
   */
  static _fixRequest ( config ) {
    var { url, data, method } = config;

    if ( method === 'GET' ) {
      var index = url.indexOf( '?' );
      var params = {};

      if ( index > 0 ) {
        url = url.substr( 0, index );
        params = getQueryParams( url.substr( index + 1 ) );
      }

      Object.assign( data, params ); // merge to data
    }

    config['url'] = url;
    config['data'] = data;
  }
}
