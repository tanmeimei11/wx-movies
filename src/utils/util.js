
/**
 * 封装wxPromisefy
 */
var wxPromisify = ( fn ) => {
  return function ( obj = {}, isNotCheck ) {
    return new Promise( ( resolve, reject ) => {
      obj.isNotCheck = isNotCheck;
      obj.success = function ( res ) {
        if ( res.data ) {
          resolve( res.data );
        }
        resolve( res );
      };
      obj.fail = function ( res ) {
        reject( res );
      };
      fn( obj );
    } );
  };
};

/**
 * 加载images
 * @param {*} images  数组 src为image的url
 */
var loadImages = ( images ) => {
  if ( !images ) {
    return Promise.reject();
  }
  var imgPromiseList = [];
  Object.keys( images ).forEach( ( idx ) => {
    var _val = images[idx];
    console.log( _val.src );
    imgPromiseList.push( wxPromisify( wx.downloadFile )( {
      url: _val.src
    } ).then( res => {
      _val.local = res.tempFilePath;
      return _val;
    } ) );
  } );
  return Promise.all( imgPromiseList );
};

/**
 * 画在中心的图片
 * @param {*} ctx
 * @param {*} url
 * @param {*} x
 * @param {*} y
 * @param {*} targetW
 * @param {*} targetH
 */
var drawImageInCenter = function ( ctx, url, x = 0, y = 0, targetW = 0, targetH = 0 ) {
  return wxPromisify( wx.getImageInfo )( {
    src: url
  } ).then( ( res ) => {
        // console.log(res)
    var _imgW = res.width;
    var _imgH = res.height;
    var clipW = _imgW;
    var clipH = _imgH;
    var scale = 1;
    var cliX = 0;
    var cliY = 0;
        // 长图
    if ( _imgW / _imgH > targetW / targetH ) {
      scale = targetH / _imgH;
      clipH = _imgH * scale;
      clipW = _imgW * scale;
      cliX = ( targetW - clipW ) / 2;
    } else {
      scale = targetW / _imgW;
      clipH = _imgH * scale;
      clipW = _imgW * scale;
      cliY = ( targetH - clipH ) / 2;
    }
        // console.log(res.path, cliX + x, cliY + y, clipW, clipH)
    ctx.drawImage( res.path, cliX + x, cliY + y, clipW, clipH );
        // ctx.drawImage(res.path, x, y, clipW, clipH)
        // ctx.draw()
    return Promise.resolve();
  } );
};

var stringLength = function ( str ) {
  if ( !str ) {
    return 0;
  }
  var strList = str.split( '' );
  var length = 0;
  Object.keys( strList ).forEach( ( idx ) => {
    if ( str.charCodeAt( idx ) > 127 || str.charCodeAt( idx ) == 94 ) {
      length += 2;
    } else {
      length++;
    }
  } );
  return length;
};

/**
 * 方法promise化
 */
var authPromisify = [
  'login', 'getUserInfo', 'authorize', 'getSetting', 'startRecord', 'stopRecord',
  'showModal', 'openSetting'
].reduce( ( acc, cur ) => {
  acc[cur] = wxPromisify( wx[cur] );

  return acc;
}, {
  wxPromisify: wxPromisify
} );

/**
 *
 * @param {*} key  授权的信息
 * @param {*} isforce 强制授权会循环弹窗
 */
function get ( key, isforce, gps ) {
  var scope = 'scope.' + key;
  return new Promise( ( authRes, authRej ) => {
    authPromisify.getSetting().then( res => {
      console.log( res );
      if ( res.authSetting[scope] ) {
        authRes( true );
      } else {
        console.log( scope );
        authPromisify.authorize( {
          scope: scope
        } ).then( suc => {
          console.log( 'suc', suc );
          authRes( suc );
        }, rej => {
          console.log( 'rej', rej );
          reGet( scope, authRes, isforce, gps );
        } );
      }
    } );
  } );
}

/**
 *
 * @param {*} scope 授权信息
 * @param {*} authRes 回调
 * @param {*} isforce 强制弹窗
 */
function reGet ( scope, authRes, isforce, gps ) {
  authPromisify.showModal( {
    title: '无法保存至相册',
    content: '未授权将无法保存二维码到相册',
    confirmText: '去设置',
    showCancel: true
  } ).then( ( a ) => {
    if ( a.confirm ) {
      authPromisify.openSetting().then( ( r ) => {
        console.log( 'r', r );
        authPromisify.getSetting().then( res => {
          console.log( 'res', res );
          if ( r.authSetting[scope] || res.authSetting[scope] ) {
            console.log( 'succ' );
            authRes();
          } else {
            if ( isforce ) {
              setTimeout( () => {
                  reGet( scope, authRes, isforce );
                }, 100 );
            }
          }
        } );
      } );
    }
  } );
}
verifyPhone(phone){
  return /^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/.test(phone)
}
module.exports = {
  wxPromisify,
  get,
  loadImages,
  drawImageInCenter,
  stringLength,
  verifyPhone
};
