import wepy from 'wepy';
import auth from '@/api/auth';
import Ticket from '@/api/ticket';
import tips from '@/utils/tips';
import report from '@/components/report-submit';
import shareConnectMixin from '@/mixins/shareConnectMixin';
import receiveFaildModal from '@/components/detail/receiveFaildModal';
import track from '@/utils/track';

export default class ticket extends wepy.page {
  config = {
    navigationBarTitleText: '电影票'
  }
  components = { report, receiveFaildModal }
  mixins = [shareConnectMixin]
  data = {
    rulesShow: false,
    type: '',
    btninfo: {},
    isShowMobile: false,
    isFull: false,
    rules: [], // 规则文案
    tickets: [],
    phone: '',

    shareIndex: '',
    cardsbg: ['', '', ''],
    cards: [],
    cardInfo: {},
    ticketID: '',
    share_img: '',
    share_code: '',
    qrcode_from: '',
    ticket_switch: '',

    receiveFaildInfo: {
      msg: '',
      show: false
    }
  }

  onShareAppMessage ( res ) {
    var query = `?shareCode=${this.share_code}&qrcode_from=${this.qrcode_from}`
    if ( res.target ) {
      this.shareIndex = res.target.dataset.index;
      this.ticketID = res.target.dataset.code;
    }
    var fun = () => {};
    if ( res.from === 'button' ) {
      var that = this;
      fun = this.shareCallBack( that );
    }
    return {
      title: '送你们每人3张电影票，杭州好多家影院都能看，快来领取吧！',
      path: `/pages/detail/detail${query}`,
      imageUrl: this.share_img,
      // 'http://inimg07.jiuyan.info/in/2018/01/26/20A52317-E4EB-3657-E024-F2EF040B2E86.jpg'
      success: fun
    };
  }

  events = {
    closeRecevieFaild () {
      this.receiveFaildInfo.show = false
    }
  }

  methods = {
    alert () {
      if (this.ticket_switch) {
        this.receiveFaildInfo.show = true
      }
    },
    bindKeyInput ( e ) {
      this.phone = e.detail.value;
      if ( e.detail.value.length === 11 ) {
        this.isFull = true;
      } else {
        this.isFull = false
      }
    },
    async submit () {
      if ( this.isFull ) {
        this.openCard()
        this.isShowMobile = false
        tips.success( '绑定成功' )
      }
    },
    openRules () {
      this.rulesShow = true;
    },
    close () {
      this.rulesShow = false;
    },
    closePhone () {
      this.isShowMobile = false
    },
    havePhone (e) {
      this.cardInfo = e.currentTarget.dataset
      if (this.phone) {
        this.openCard()
      } else {
        this.isShowMobile = true
      }
    },
    async receive ( e ) {
      await this.init();
    },
    toDetail (e) {
      var thisTicket = e.currentTarget.dataset.ticket
      track( 'fission_upgrade' );
      wepy.reLaunch( {
        url: `/pages/detail/detail?ticketId=${thisTicket}`
      } );
    },
    toSelf () {
      wepy.switchTab( {
        url: `/pages/self/self`
      } );
    }
  }
  /**
   * 设置分享的shareticket
   */
  setShare () {
    wepy.showShareMenu( {
      withShareTicket: true // 要求小程序返回分享目标信息
    } );
  }

  async openCard () {
    var thisTicket = this.cardInfo.ticket
    var thisIndex = this.cardInfo.index
    var ticketid = this.cardInfo.ticketid
    var card = await Ticket.pickCard( ticketid, thisIndex, this.phone );
    // await this.init()
    this.cards[thisTicket] = card
    this.tickets[thisTicket].receive = true
    this.$apply()
  }

  async getShared ( data ) {
    try {
      track( 'fission_share_to_group' );
      var exchangeTicket = await Ticket.exchangeTicket( data, {ticket_id: this.ticketID} );

      this.tickets[this.shareIndex].ticket_status = '1';
      this.$apply();
    } catch ( e ) {
      wx.showToast( {
        title: e.message,
        image: '../../image/fail.png',
        mask: true
      } );
      // setTimeout( () => {
      //   tips.error( e.message );
      // }, 1000 );
    }
  }

  async init () {
    var myInfoRes = await Ticket.getMyInfo();
    this.rules = Ticket.initRules( myInfoRes.act_rules );
    this.tickets = Ticket.initTickets( myInfoRes.tickets );
    this.share_img = myInfoRes.share_img
    this.share_code = myInfoRes.share_code
    this.qrcode_from = myInfoRes.qrcode_from
    this.phone = myInfoRes.phone || ''
    this.ticket_switch = myInfoRes.ticket_switch
    this.receiveFaildInfo.msg = myInfoRes.ticket_desc
    this.$apply();
  }
  async onLoad ( options ) {
    // track( 'my_page_enter' );
    this.setShare();
    if ( options.qrcode_from ) {
      this.$parent.globalData.qrcode_from = options.qrcode_from;
    }
    await auth.ready();
    await this.init();
  }
}
