import wepy from 'wepy';
import auth from '@/api/auth';
import Self from '@/api/self';
import tips from '@/utils/tips';
import { request } from '@/utils/request';
import report from '@/components/report-submit';
import track from '@/utils/track';
import util from "@/utils/util";

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
      phone: ''
    },
    cardInfos: [{ // 卡片信息
      id: '',
      title: 'in同城趴·电影王卡',
      desc: '可任意次数兑换观影券',
      time: '',
      isApply: true,
      num: ''
    }],

    isShowExchange: false,
    exchangeDisabled: true,
    change_code: '',
    phone: '',
    isfirst: true,
    cdkeyError: '',
    cdkeyText: '',
    phoneError: ''
  }

  methods = {
    bindKeyInput ( e ) {
      this.num = e.detail.value;
      if ( e.detail.value.length === 11 ) {
        this.isFull = true;
      } else {
        this.isFull = false;
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
      track( 'my_card_click' );
      wepy.navigateTo( {
        url: `/pages/card/card?card_id=${e.currentTarget.dataset.id}`
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
    },

    triggerExchange () {
      this.isShowExchange = true;
    },

    /**
     * 确认兑换按钮
     */
    async exchange () {
      if ( !util.verifyPhone( this.phone.trim() ) ) {
        this.phoneError = 'error';
        return;
      }

      try {
        await Self.cardChange( {
          change_code: this.change_code,
          phone: this.phone
        } );
        // 兑换成功
        this.isShowExchange = false
        await this.init();
      } catch ( e ) {
        // 兑换失败
        this.cdkeyError = 'error';
        this.cdkeyText = e.message;
        this.$apply();
      }
    },

    cdkeyInput ( e ) {
      this.cdkeyError = '';
      this.exchangeDisabled = false;
      this.change_code = e.detail.value;

      if ( this.change_code.trim() === '' || !this.phone ) {
        this.exchangeDisabled = true;
      }
    },

    phoneInput ( e ) {
      this.phoneError = '';
      this.exchangeDisabled = false;
      this.phone = e.detail.value;

      if ( this.change_code.trim() === '' || !this.phone ) {
        this.exchangeDisabled = true;
      }
    },

    closePopup ( force = false, e ) {
      if ( e.target.id === 'exchangePopup' || force ) {
        this.isShowExchange = false;
      }
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
    // 读取手机号
    this.isfirst = !this.userInfo.phone;
    this.phone = this.userInfo.phone;
    this.$apply();
  }
  async onLoad () {
    track( 'my_page_enter' );
  }
  async onShow () {
    track( 'my_page_screen' );
    await auth.ready();
    await this.init();
  }
}
