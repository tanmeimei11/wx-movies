import Pagebase from './page';
import {formatTime} from '@/utils/common';
export default class Self extends Pagebase {
  /**
   * 获取我的信息接口
   */
  static async getMyInfo () {
    return await this.request( {
      url: '/mnp/user/my2'
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
  static initCardInfo ( cards, defaultCard ) {
    if ( !cards || !cards.length ) {
      return [{
        title: defaultCard.name,
        desc: defaultCard.desc,
        num: `NO.${defaultCard.card_no}`,
        isApply: true
      }];
    }
    return cards.map( ( item ) => {
      return {
        id: item.id,
        title: item.name,
        desc: item.desc,
        time: this.getCardTime( item.start_date, item.end_date ),
        num: `NO.${item.card_no}`,
        can_reward: item.can_reward,
        reward_form_info: item.reward_form_info
      };
    } );
  }

  /**
   * 初始化用户信息
   * @param {*} data
   */
  static initUserInfo ( data ) {
    return {
      avatar: data.avatar,
      name: data.nick_name,
      phone: data.phone
    };
  }
  /**
   * 初始化规则
   * @param {*} data
   */
  static initRules ( rules ) {
    if ( !rules || !rules.length ) {
      return [];
    }
    return rules;
  }
}
