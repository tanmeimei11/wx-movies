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
    shareCode: ''
  }

  onShareAppMessage ( res ) {
    this.shareCode = res.target.dataset.id
    this.shareIndex = res.target.dataset.index
    this.ticketID = res.target.dataset.code
    return {
      title: '分享到群',
      path: `/pages/detail/detail?shareCode=${this.shareCode}&ticketId=${this.ticketID}`,
      imageUrl: 'http://inimg07.jiuyan.info/in/2018/01/26/20A52317-E4EB-3657-E024-F2EF040B2E86.jpg',
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
      console.log(thisTicket,thisIndex )
      var card = await Ticket.pickCard( this.ticketID, thisIndex );
      this.cards = card
      this.tickets[thisTicket].receive = true
      this.$apply()
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
