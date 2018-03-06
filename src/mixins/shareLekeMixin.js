import wepy from 'wepy';
import tips from '@/utils/tips';
export default class shareLekeMixin extends wepy.mixin {
  shareCallBack ( res ) {
    return async( res ) => {
      // tips.loading( '请稍后' );
      if ( res.shareTickets ) {
        await this.getCardByLekePromo();
      } else {
        setTimeout( () => {
          wx.showToast( {
            title: '请分享到群聊天',
            image: '../../image/fail.png',
            mask: true
          } );
        }, 1000 );
      }
      tips.loaded();
    };
  }
}
