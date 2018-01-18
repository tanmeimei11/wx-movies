import wepy from 'wepy'
import auth from '@/api/auth'
import Detail from '@/api/detail'

export default class Index extends wepy.page {
  config = {
    navigationBarTitleText: '活动页面'
  }
  components = {
  }

  mixins = []

  data = {
  }

  computed = {}

  methods = {
    async pay () {
      await Detail.pay()
    }
  }

  events = {
  }

  async onLoad() {
    this.pay()
  }

  async pay() {
    await auth.ready()
    var createRes = await Detail.creatOrder()
    var getOrderRes = await Detail.getOrderDetail(createRes)
    var tradePayRes = await wepy.tradePay({
      orderStr: getOrderRes.sign  // 即上述服务端已经加签的orderSr参数
    })

    wepy.alert(tradePayRes.resultCode)
  }
}
