import wepy from 'wepy';

export default class qrcodeFromMixin extends wepy.mixin {
  redirectH5 ( tplData ) {
    if ( wx.canIUse( 'web-view' ) ) {
      wepy.navigateTo( {
        url: `/pages/webview/webview?h5url=${encodeURIComponent( tplData.landing_path )}`
      } );
    } else {
      wx.showModal( {
        title: '提示',
        content: '您的微信暂不支持该功能，请升级您的微信客户端'
      } );
    }
  }
  redirectMiniprogram ( tplData ) {
    if ( wx.canIUse( 'navigateToMiniProgram' ) ) {
      wepy.navigateToMiniProgram( {
        appId: tplData.app_id,
        path: tplData.landing_path,
        success ( res ) {
          // 打开成功
        },
        fail: ( err ) => {
          wx.showModal( {
            title: '提示',
            content: err
          } );
        }
      } );
    } else {
      wx.showModal( {
        title: '提示',
        content: '您的微信暂不支持该功能，请升级您的微信客户端'
      } );
    }
  }
  redirectPath ( tplData ) {
    var tab = ['index', 'seat', 'self'];
    if ( tab.indexOf( tplData.landing_path.split( '/' )[2] ) > -1 ) {
      wepy.switchTab( {
        url: tplData.landing_path
      } );
    } else {
      wepy.navigateTo( {
        url: tplData.landing_path
      } );
    }
  }

  redirect ( tplData ) {
    switch ( tplData.type ) {
      case 'h5': this.redirectH5( tplData ); break;
      case 'miniprogram': this.redirectMiniprogram(); break;
      case 'path': this.redirectPath(); break;
    }
  }
}
