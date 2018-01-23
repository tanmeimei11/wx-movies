import wepy from 'wepy';
import auth from '@/api/auth';
import Self from '@/api/self';
import tips from '@/utils/tips';
import report from '@/components/report-submit';

export default class Index extends wepy.page {
  config = {
    navigationBarTitleText: '我的电影卡'
  }
  components = { report }

  data = {
    btninfo: {},
    rules: ['使用本卡可以在指定影院，通过本小程序免费选座，不限次数。',
      '使用本卡仅可以在每周一至周四使用，法定节假日除外（按影厅排片选座）。',
      '本卡有效期3个月，即从2018年3月1日起至2018年5月31日止',
      '使用本卡选座请点击小程序「选座」功能。',
      '本卡最终解释权归九言科技所有'], // 规则文案
    userInfo: { // 用户信息
      avatar: '',
      name: '',
      phone: ''
    },
    cardInfos: [{ // 卡片信息
      id: '',
      title: 'in同城趴·电影王卡',
      desc: '可任意次数兑换观影券',
      time: '',
      isApply: true,
      num: ''
    }]
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
    var myInfoRes = await Self.getMyInfo();
    this.btninfo = myInfoRes;
    this.cardInfos = Self.initCardInfo( myInfoRes.cards, myInfoRes.default_card );
    this.userInfo = Self.initUserInfo( myInfoRes );
    this.rules = Self.initRules( myInfoRes.texts );
    this.$apply();
  }

  async onShow () {
    await auth.ready();
    await this.init();
  }
}
