import wepy from 'wepy';
import tips from '@/utils/tips';
export default class shareConnectMixin extends wepy.mixin {
  shareCallBack ( res ) {
    return async( res, isLoading ) => {
      tips.loading( '请稍后' );
      try {
        if ( res.shareTickets ) {
          var ticket = res.shareTickets[0];
          var loginRes = await wepy.login( {
            withCredentials: true
          } );
          var shareInfoRes = await wepy.getShareInfo( {
            shareTicket: ticket
          } );
          if ( loginRes.code && shareInfoRes.encryptedData && shareInfoRes.iv ) {
            var shareTicketInfo = {
              encryptedData: shareInfoRes.encryptedData, //  解密后为一个 JSON 结构（openGId    群对当前小程序的唯一 ID）
              iv: shareInfoRes.iv, // 加密算法的初始向量
              code: loginRes.code
            };

            tips.loaded();
            this.getShared( shareTicketInfo );
          } else {
            throw new Error();
          }
        } else {
          tips.loaded();
          // this.data.isNotQun = true;
          setTimeout( () => {
            tips.error( '请分享到群聊天' );
          }, 1000 );
        }
      } catch ( e ) {
        throw new Error();
      }

      tips.loaded();
    };
  }
}
