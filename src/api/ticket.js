import Pagebase from './page';
export default class Ticket extends Pagebase {
  /**
   * 获取我的信息接口
   */
  static async getMyInfo () {
    return await this.request( {
      url: '/mnp/ticket/my'
    } );
  }
  /**
   * 初始化卡片信息
   * @param {*} cards  已经获得的卡片
   * @param {*} defaultCard  默认卡
   */
  static initCardInfo ( cards, defaultCard ) {
    return cards.map( ( item ) => {
      return {
        id: item.id,
        title: item.name,
        desc: item.desc,
        time: this.getCardTime( item.start_date, item.end_date ),
        num: `NO.${item.card_no}`,
        reward_from_info: item.reward_from_info,
        reward_to_info: item.reward_to_info,
        reward_btn: item.reward_btn
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
   */
  static initRules ( rules ) {
    if ( !rules || !rules.length ) {
      return [];
    }
    return rules;
  }
  /**
   * 初始化三张票
   */
  static initTickets ( tickets ) {
    if ( !tickets || !tickets.length ) {
      return [];
    }
    return tickets;
  }
  /**
   * 换票
   */
  static async exchangeTicket ( tickets, oldTicket_id ) {
    var data = Object.assign(tickets, oldTicket_id)
    return await this.request( {
      url: '/mnp/ticket/share',
      data: data
    } );
  }
}
