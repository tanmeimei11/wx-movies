import Pagebase from './page';
export default class Card extends Pagebase {
  /**
   *  获取卡信息的数据接口
   */
  static async getCardInfo ( cardId ) {
    return await this.request( {
      url: '/mnp/card/reward',
      method: 'POST',
      data: {
        card_id: cardId
      }
    } );
  }
}
