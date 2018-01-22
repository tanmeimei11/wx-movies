import wepy from 'wepy';
export default class shareConnectMixin extends wepy.mixin {
  shareCallBack ( res ) {
    return async( res, isLoading ) => {
      this.loadingIn( '请稍后' );
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

            this.loadingOut();
            this.pay( shareTicketInfo );
          } else {
            throw new Error();
          }
        } else {
          this.loadingOut();
          this.data.isNotQun = true;
          setTimeout( () => {
            this.toastFail( '请分享到群聊天', 3000 );
          }, 1000 );
        }
      } catch ( e ) {
        throw new Error();
      }

      this.loadingOut();
    };
  }
}
