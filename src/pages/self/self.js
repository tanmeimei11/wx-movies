import wepy from 'wepy';
import auth from '@/api/auth';
import Self from '@/api/self';
import tips from '@/utils/tips';
import { request } from '@/utils/request';
import report from '@/components/report-submit';

export default class self extends wepy.page {
  config = {
    navigationBarTitleText: '我的电影卡'
  }
  components = { report }

  data = {
    num: '',
    type: '',
    btninfo: {},
    isShowMobile: false,
    isFull: false,
    cards: [],
    cardNum: 0,
    rules: [], // 规则文案
    userInfo: { // 用户信息
      avatar: '',
      name: '',
      phone: ' '
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
    bindKeyInput ( e ) {
      this.num = e.detail.value;
      if ( e.detail.value.length === 11 ) {
        this.isFull = true;
      }
    },
    async submit () {
      if ( this.isFull ) {
        tips.loading();
        var res = await request( {
          url: '/mnp/user/update_phone',
          method: 'POST',
          data: {
            phone: this.num
          }
        } );
        if ( res.succ ) {
          tips.loaded();
          this.userInfo.phone = this.num;
          await tips.success( this.type + '成功' );
          this.isShowMobile = false;
          this.$apply();
        } else {
          tips.loaded();
          tips.error( '网络错误' );
        }
      }
    },
    open ( e ) {
      console.log( e );
      this.isShowMobile = true;
      this.type = e.currentTarget.dataset.type;
    },
    close () {
      this.isShowMobile = false;
    },
    toCard ( e ) {
      this.cardNum = e.currentTarget.dataset.index;
      wepy.navigateTo( {
        url: `/pages/card/card`
      } );
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
    var myInfoRes = await Self.getMyInfo();
    this.btninfo = myInfoRes;
    this.cards = myInfoRes.cards;
    console.log( myInfoRes.cards );
    this.cardInfos = Self.initCardInfo( myInfoRes.cards );
    this.userInfo = Self.initUserInfo( myInfoRes );
    this.rules = Self.initRules( myInfoRes.texts );
    this.$apply();
  }

  async onShow () {
    await auth.ready();
    await this.init();
  }
}
