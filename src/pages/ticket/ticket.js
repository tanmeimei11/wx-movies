import wepy from 'wepy';
import auth from '@/api/auth';
import Ticket from '@/api/ticket';
import tips from '@/utils/tips';
import report from '@/components/report-submit';
import shareConnectMixin from '@/mixins/shareConnectMixin';
import track from '@/utils/track';

export default class ticket extends wepy.page {
  config = {
    navigationBarTitleText: '电影票'
  }
  components = { report }
  mixins = [shareConnectMixin]
  data = {
    rulesShow: false,
    num: '',
    type: '',
    btninfo: {},
    isShowMobile: false,
    isFull: false,
    rules: [], // 规则文案
    tickets: [],

    shareIndex: '',
    cardsbg: ['', '', ''],
    cards: [],
    ticketID: '',
    share_img: '',
    share_code: ''
  }

  onShareAppMessage ( res ) {
    if (res.target) {
      this.shareIndex = res.target.dataset.index
      this.ticketID = res.target.dataset.code
    }
    return {
      title: '送你们每人3张电影票，杭州好多家影院都能看，快来领取吧！',
      path: `/pages/detail/detail?shareCode=${this.share_code}`,
      imageUrl: this.share_img,
      // 'http://inimg07.jiuyan.info/in/2018/01/26/20A52317-E4EB-3657-E024-F2EF040B2E86.jpg'
      success: this.shareCallBack( res )
    };
  }
  
  methods = {
    openRules () {
      this.rulesShow = true
    },
    close () {
      this.rulesShow = false
    },
    async openCard (e) {
      var thisTicket = e.currentTarget.dataset.ticket
      var thisIndex = e.currentTarget.dataset.index
      var ticketid = e.currentTarget.dataset.ticketid
      var card = await Ticket.pickCard( ticketid, thisIndex );
      // await this.init()
      this.cards[thisTicket] = card
      this.tickets[thisTicket].receive = true
      this.$apply()
      console.log(this.cards)
    },
    async receive (e) {
      await this.init()
    },
    toDetail (e) {
      var thisTicket = e.currentTarget.dataset.ticket
      wepy.navigateTo( {
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

  async getShared (data) {
    var exchangeTicket = await Ticket.exchangeTicket(data, {ticket_id: this.ticketID})

    this.tickets[this.shareIndex].ticket_status = '1'
    this.$apply()
  }

  async init () {
    var myInfoRes = await Ticket.getMyInfo();
    this.rules = Ticket.initRules( myInfoRes.act_rules );
    this.tickets = Ticket.initTickets( myInfoRes.tickets );
    this.share_img = myInfoRes.share_img
    this.share_code = myInfoRes.share_code
    this.$apply();
  }
  async onLoad (options) {
    // track( 'my_page_enter' );
    this.setShare();
  }
  async onShow () {
    // track( 'my_page_screen' );
    await auth.ready();
    await this.init();
  }
}
