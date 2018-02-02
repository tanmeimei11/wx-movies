import wepy from 'wepy';
import auth from '@/api/auth';
// import { request } from '@/utils/request';
// import tips from '@/utils/tips';
import giveGiftModal from '@/components/card/giveGiftModal';
import report from '@/components/report-submit';
import track from '@/utils/track';
import Card from '@/api/card';

export default class cards extends wepy.page {
  config = {
    navigationBarTitleText: '我的电影卡'
  }
  components = {report, giveGiftModal}

  data = {
    cardInfos: {},
    rules: [],
    cardId: '',
    cardCode: '',
    cartStatusText: '',
    giveGiftInfo: {
      show: false,
      tips: []
    }
  }

  onShareAppMessage ( res ) {
    var query = '';
    var fun = () => {};
    if ( res.from === 'button' ) {
      query = `?cardCode=${this.cardCode}`;
      var that = this;
      fun = this.shareCallBack( that );
    }
    return {
      title: '送你一张in同城趴电影王卡，杭州三个月电影无限看！',
      path: `/pages/detail/detail${query}`,
      imageUrl: 'https://inimg01.jiuyan.info/in/2018/01/25/FB5D55FB-986F-6433-18B8-BAF8C0C797E3.jpg',
      success: fun
    };
  }

  events={
    closeGiveGiftModal () {
      this.giveGiftInfo.show = false;
    }
  }

  methods = {
    async oprateCard () {
      if ( this.cardInfos.cardStatus == 0 ) {
        track( 'mycard_transfer' );
        this.giveGiftInfo.show = true;
      } else if ( this.cardInfos.cardStatus == 1 ) {
        var res = await Card.cancelCardGive( this.cardCode );
        this.cardCode = res.reward_code;
        this.changeCardInfo( res.card, res.reward_status );
      }
    }
  }

  /**
   * 初始化页面信息
   */
  async init () {
    var page = getCurrentPages()[0].data;
    this.rules = page.rules;
    await this.initCardInfo( this.cardId );
    this.$apply();
  }
  /**
   * 初始化卡信息
   * @param {*} id
   */
  async initCardInfo ( id ) {
    var res = await Card.getCardInfo( id );
    this.cardCode = res.reward_code;
    this.giveGiftInfo.tips = res.prompt_txt;
    this.cartStatusText = res.btn_txt;
    if ( res.card && res.card.reward_from_info ) {
      res.reward_status = 3;
    }
    this.changeCardInfo( res.card, res.reward_status, res.btn_txt[ res.reward_status ] );
  }
  /**
   *  改变卡的状态
   */
  changeCardInfo ( card, status, text ) {
    this.cardInfos = Card.initCardInfo( card );
    this.cardInfos.cardStatus = status;
    this.cardInfos.cardBtnText = text || this.cartStatusText[status];
    this.$apply();
  }

  async onLoad ( options ) {
    track( 'mycard_page_screen' );
    await auth.ready();
    this.cardId = options.card_id;
    await this.init();
    this.$apply();
  }

  /**
   * 转增回调
   */
  shareCallBack ( that ) {
    return async ( ) => {
      if ( that.cardInfos.cardStatus == 0 ) {
        var res = await Card.giveCard( that.cardCode );
        that.changeCardInfo( res.card, res.reward_status );
      }
    };
  }
  /**
   * 修改转赠状态
   * @param {*} status
   */
  changeCardStatus ( status ) { // 转赠状态 0：未赠送，1：已送出未领取，2：已送出已领取，3：领取了别人的
    this.cardInfos.cardStatus = status;
    this.cardInfos.cardBtnText = this.cardInfos.cartStatusText[status];
  }
}
