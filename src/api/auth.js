import wepy from 'wepy';
import base from './base';
import tips from '@/utils/tips';
import event from '@/utils/event';

export default class auth extends base {
  static _readyStatus
  static force
  static SilReadyStatus

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
      // tips.setLoading();
      tips.loading();
      const { code } = await wepy.login();
      const { encryptedData, iv } = await wepy.getUserInfo( { lang: 'zh_CN' } );
      // console.log( encryptedData )
      // const { qr } = wepy.$instance.globalData.qrcode_from
      const { tg_auth: token, _aries, cf_tg_auth, _cf_aries } = await this.post( `${this.baseUrl}/api/login`, { data: { code, encryptedData, iv, qrcode_from: wepy.$instance.globalData.qrcode_from } } );
      wepy.$instance.globalData.xToken = token;
      wepy.$instance.globalData.xAries = _aries;
      wepy.$instance.globalData.cfToken = cf_tg_auth;
      wepy.$instance.globalData.cfAries = _cf_aries;
      // this._readyStatus = true;
      console.log( `code: ${code}\ntoken: ${token}` );
      event.$emit( 'ready' );
    } catch ( e ) {
      tips.loaded()
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
  // 静默授权
  static async SilReady () {
    return !this.SilReadyStatus ? this.SilRegister() : this.SilReadyStatus;
  }

  static async SilRegister () {
    // 注册准备完毕通知
    this.SilReadyStatus = new Promise( resolve => event.$on( 'SilReady', resolve ) );
    if ( wepy.$instance.globalData.cfToken && wepy.$instance.globalData.cfAries ) {
      event.$emit( 'SilReady' );
      return;
    }
    // 授权流程
    this.SilLogin();
    return this.SilReadyStatus;
  }
  
  static async SilLogin () {
    try {
      tips.loading();
      const { code } = await wepy.login();
      const { tg_auth: token, _aries, cf_tg_auth, _cf_aries } = await this.post( `${this.baseUrl}/api/base/auth/login`, { data: { code, qrcode_from: wepy.$instance.globalData.qrcode_from } } );
      wepy.$instance.globalData.xToken = token;
      wepy.$instance.globalData.xAries = _aries;
      wepy.$instance.globalData.cfToken = cf_tg_auth;
      wepy.$instance.globalData.cfAries = _cf_aries;
      event.$emit( 'SilReady' );
    } catch ( e ) {
      this.SilReadyStatus = null;
      throw new Error( '未授权授权' );
    }
  }
}
