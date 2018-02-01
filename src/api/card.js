import Pagebase from './page';
import {formatTime} from '@/utils/common';
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
  /**
   *  赠送的卡片数据接口
   */
  static async giveCard ( cardCode ) {
    return await this.request( {
      url: '/mnp/card/cancelreward',
      method: 'POST',
      data: {
        reward_code: cardCode
      }
    } );
  }
  /**
   *  取消赠送的卡片数据接口
   */
  static async cancelCardGive ( cardCode ) {
    return await this.request( {
      url: '/mnp/card/cancelreward',
      method: 'POST',
      data: {
        reward_code: cardCode
      }
    } );
  }
   /**
   *时间转换
   * @param {*} sTime
   * @param {*} eTime
   */
  static getCardTime ( sTime, eTime ) {
    return `${formatTime( sTime )}- ${formatTime( eTime )}`;
  }

  /**
   * 初始化卡片信息
   * @param {*} cards  已经获得的卡片
   * @param {*} defaultCard  默认卡
   */
  static initCardInfo ( item ) {
    return {
      id: item.id,
      title: item.name,
      desc: item.desc,
      time: this.getCardTime( item.start_date, item.end_date ),
      num: `NO.${item.card_no}`,
      reward_from_info: item.reward_from_info,
      reward_to_info: item.reward_to_info
    };
  }
}
