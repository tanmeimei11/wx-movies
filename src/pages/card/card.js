import wepy from 'wepy';
import auth from '@/api/auth';
// import { request } from '@/utils/request';
// import tips from '@/utils/tips';
import giveGiftModal from '@/components/card/giveGiftModal';
import report from '@/components/report-submit';
import Card from '@/api/card';

export default class cards extends wepy.page {
  config = {
    navigationBarTitleText: '我的电影卡'
  }
  components = {report, giveGiftModal}

  data = {
    cardInfos: {},
    rules: [],
    card_id: '',
    cardCode: '',
    shared: false,
    giveGiftInfo: {
      show: false,
      tips: []
    }
  }

  onShareAppMessage ( res ) {
    console.log( res.from );
    var query = '';
    if ( res.from === 'button' ) {
      query = `?card_id=${this.cardCode}`;
    }
    return {
      title: '送你一张in同城趴电影王卡',
      path: `/pages/detail/detail${query}`,
      // imageUrl: 'http://inimg07.jiuyan.info/in/2018/01/26/20A52317-E4EB-3657-E024-F2EF040B2E86.jpg',
      success: () => {
        this.shared = true;
        this.$apply();
      }
    };
  }

  events={
    closeGiveGiftModal () {
      this.giveGiftInfo.show = false;
    }
  }

  methods = {
    async oprateCard () {
      if ( true ) {
        this.giveGiftInfo.show = true;
      } else {
        await Card.cancelCardGive( this.cardCode );
      }
    }
  }

  async init () {
    var page = getCurrentPages()[0].data;
    this.rules = page.rules;
    // this.cardInfos = Self.initCardInfo( page.cards, page.default_card )[page.cardNum];
    await this.initCardInfo( this.cardId );
    this.$apply();
  }
  async initCardInfo ( id ) {
    var res = await Card.getCardInfo( id );
    this.cardCode = res.reward_code;
    this.giveGiftInfo.tips = res.prompt_txt;
    this.cardInfos = {
      ...Card.initCardInfo( res.card ),
      cardBtnText: res.reward_btn,
      cardStatus: res.reward_status
    };
  }
  async onLoad ( options ) {
    await auth.ready();
    this.cardId = options.card_id;
    await this.init();
    await this.initCardInfo();
    this.$apply();
  }

  shareCallBack () {

  }
}