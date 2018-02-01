import wepy from 'wepy';
// import auth from '@/api/auth';
import Self from '@/api/self';
import { request } from '@/utils/request';
import tips from '@/utils/tips';
// import report from '@/components/report-submit';

export default class cards extends wepy.page {
  config = {
    navigationBarTitleText: '我的电影卡'
  }
  components = { }

  data = {
    cardInfos: {},
    rules: [],
    card_id: '',
    shared: false
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
    apply () {
      if ( this.btninfo.cf_start === 'false' ) {
        tips.error( this.btninfo.cf_start_desc );
        return;
      }
      wepy.navigateTo( {
        url: '/pages/detail/detail'
      } );
    }
  }

  async init () {
    var page = getCurrentPages()[0].data;
    this.cardInfos = Self.initCardInfo( page.cards, page.default_card )[page.cardNum];
    this.rules = page.rules;

    var res = await request( {
      url: '/mnp/card/reward',
      method: 'POST',
      data: {
        card_id: this.cardInfos.id
      }
    } );
    if ( res.succ ) {
      this.card_id = res.data;
    } else {
      // tips.error( res.msg );
    }
    this.$apply();
  }

  async onShow () {
    // await auth.ready();
    await this.init();
  }
}
