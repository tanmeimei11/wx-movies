import wepy from 'wepy';
import auth from '@/api/auth';
import { request } from '@/utils/request';
import tips from '@/utils/tips';
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
    shared: false,
    giveGiftInfo: {
      show: false
    }
  }

  onShareAppMessage ( res ) {
    console.log( res.from );
    var path = '';
    if ( res.from === 'button' ) {
      path = `?card_id=${this.card_id}`;
    }
    return {
      title: '送你一张in同城趴电影王卡',
      path: `/pages/detail/detail${path}`,
      // imageUrl: 'http://inimg07.jiuyan.info/in/2018/01/26/20A52317-E4EB-3657-E024-F2EF040B2E86.jpg',
      success: () => {
        this.shared = true;
        this.$apply();
      }
    };
  }

  methods = {
    giveGift () {
      this.giveGiftInfo.show = true;
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
    this.card_id = await Card.getCardInfo( id );
  }

  async onShow () {

  }
  async onLoad ( options ) {
    await auth.ready();
    this.cardId = options.card_id;
    await this.init();
    await this.initCardInfo();
  }

  shareCallBack () {

  }
}
