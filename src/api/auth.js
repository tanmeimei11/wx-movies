import wepy from 'wepy';
import base from './base';
import tips from '@/utils/tips';

export default class auth extends base {
  static _readyStatus = false

  /**
   * 授权登录准备
   * 授权弹窗如果取消 PromiseStatus:pending
   */
  static async ready () {
    return this._readyStatus ? Promise.resolve() : await this.login();
  }

  /**
   * 授权登录
   * 授权弹窗如果取消 PromiseStatus:pending
   */
  static async login () {
    try {
      tips.setLoading();
      const { code } = await wepy.login();
      const { encryptedData, iv } = await wepy.getUserInfo({ lang: 'zh_CN' })
      const { tg_auth: token, _aries } = await this.post( `${this.baseUrl}/api/login`, { data: { code, encryptedData, iv } } );
      wepy.$instance.globalData.xToken = token;
      wepy.$instance.globalData.xAries = _aries;
      this._readyStatus = true;
      console.log( `code: ${code}\ntoken: ${token}` );
    } catch (e) {
      if (e.errMsg.indexOf('getUserInfo:fail') >= 0) {
        const rst = await wepy.showModal({ title: '授权提示', content: '请开启“用户信息”权限', showCancel: true, cancelText: '拒绝', confirmText: '授权' })
        if (rst.confirm) wepy.openSetting()
      }

      throw new Error('未授权授权')
    }
  }
}
