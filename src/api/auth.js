import wepy from 'wepy';
import base from './base';
import tips from '@/utils/tips';
import event from '@/utils/event';

export default class auth extends base {
  static _readyStatus
  static force

  /**
   * 授权登录准备
   * 授权弹窗如果取消 PromiseStatus:pending
   */
  static async ready ( force ) {
    this.force = force || false;
    return !this._readyStatus ? this._register() : this._readyStatus;
  }

  static async _register () {
    // 注册准备完毕通知
    this._readyStatus = new Promise( resolve => event.$on( 'ready', resolve ) );
    console.log( '------', wepy.$instance.globalData.xToken );
    if ( wepy.$instance.globalData.xToken && wepy.$instance.globalData.xAries ) {
      event.$emit( 'ready' );
      return;
    }
    // 授权流程
    this.login();
    return this._readyStatus;
  }

  /**
   * 授权登录
   * 授权弹窗如果取消 PromiseStatus:pending
   */
  static async login () {
    try {
      tips.setLoading();
      const { code } = await wepy.login();
      const { encryptedData, iv } = await wepy.getUserInfo( { lang: 'zh_CN' } );
      // console.log( encryptedData )
      // const { qr } = wepy.$instance.globalData.qrcode_from
      const { tg_auth: token, _aries } = await this.post( `${this.baseUrl}/api/login`, { data: { code, encryptedData, iv, qrcode_from: wepy.$instance.globalData.qrcode_from } } );
      wepy.$instance.globalData.xToken = token;
      wepy.$instance.globalData.xAries = _aries;
      // this._readyStatus = true;
      console.log( `code: ${code}\ntoken: ${token}` );
      event.$emit( 'ready' );
    } catch ( e ) {
      if ( e.errMsg.indexOf( 'getUserInfo:fail' ) >= 0 ) {
        var modalJson = {
          title: '授权提示',
          content: '请开启“用户信息”权限',
          confirmText: '授权'
        };
        var _json = !this.force ? {
          showCancel: true,
          cancelText: '拒绝'
        } : {
          showCancel: false
        };
        const rst = await wepy.showModal( {
          ...modalJson,
          ..._json} );
        if ( rst.confirm ) {
          return wepy.openSetting().then( res => {
            if ( res.authSetting['scope.userInfo'] ) {
              this.login();
              return;
            }

            if ( this.force ) {
              this.login();
            }
          } );
        };
      }
      this._readyStatus = null;
      throw new Error( '未授权授权' );
    }
  }
}
