import wepy from 'wepy';
import auth from '@/api/auth';
import Ticket from '@/api/ticket';
import tips from '@/utils/tips';
import report from '@/components/report-submit';
import track from '@/utils/track';

export default class upgrade extends wepy.page {
  config = {
    navigationBarTitleText: ''
  }
  components = { report }
  mixins = []
  data = {
  }

  events = {
  }

  methods = {
  }

  async init () {
    var myInfoRes = await Ticket.getMyInfo();
    this.$apply();
  }
  async onLoad ( options ) {
    await auth.ready();
    await this.init();
  }
}
