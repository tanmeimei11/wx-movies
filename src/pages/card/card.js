import wepy from 'wepy';
// import auth from '@/api/auth';
import Self from '@/api/self';
// import tips from '@/utils/tips';
// import report from '@/components/report-submit';

export default class cards extends wepy.page {
  config = {
    navigationBarTitleText: '我的电影卡'
  }
  components = { }

  data = {
    cardInfos: {},
    rules: []
  }

  onShareAppMessage ( res ) {
    console.log(res.from)
    var path = `/pages/detail/detail?card_id=${this.cardInfos.id}`
    if (!this.cardInfos.can_reward) {
      path = `/pages/detail/detail`
    }
    return {
      title: '送你一张in同城趴电影王卡',
      path: path,
      imageUrl: 'http://inimg07.jiuyan.info/in/2018/01/26/20A52317-E4EB-3657-E024-F2EF040B2E86.jpg'
    };
  }

  methods = {
    toOthers () {

    },
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
    var page = getCurrentPages()[0].data
    // var myInfoRes = await Self.getMyInfo();
    // this.btninfo = myInfoRes;
    this.cardInfos = Self.initCardInfo( page.cards, page.default_card )[page.cardNum];
    // this.userInfo = Self.initUserInfo( myInfoRes );
    this.rules = page.rules
    this.$apply();
  }

  async onShow () {
    // await auth.ready();
    await this.init();
  }
}
