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
    cards: [          {"desc":"上午场","has_fetch":"true", "title":"上午场电影通用票", "remark":"仅3月4日至3月8日上午使用,合作影院均可使用",tips:"24h内有效"}, //只有选中的情况下 才有除desc外 其他的字段
    {"desc":"晚上场"},
    {"desc":"下午场"}]
  }

  onShareAppMessage ( res ) {
    return {
      title: '分享到群',
      path: `/pages/detail/detail?shareCode=$`,
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
    console.log(exchangeTicket)
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
    this.ticketID = options.ticketId
  }
  async onShow () {
    // track( 'my_page_screen' );
    await auth.ready();
    await this.init();
  }
}
