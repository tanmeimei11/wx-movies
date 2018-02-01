
import wepy from 'wepy';
import mockConfig from '@/mock/mockConfig';
import {DOMAIN, isMock} from './config';
var requestBefore = ( option, token ) => {
  !option.data && ( option.data = {} );

  !/^http/.test( option.url ) && ( option.url = DOMAIN + option.url );
  // 添加必要的辅助字断
  if ( !option.header ) {
    option.header = {};
  }
  if ( /payment\/signature/.test( option.url ) ) {
    option.data._token = token;
  }
  option.data.privateKey = token;
};
/**
 * 请求函数
 * @param {*} option
 */
var request = async function ( option ) {
  requestBefore( option, '' );
  if ( isMock ) {
    return require( '../mock/' + mockConfig[option.url] );
  }
  var reqRes = await wepy.request( option );
  return reqRes.data;
};

module.exports = {
  request
};
