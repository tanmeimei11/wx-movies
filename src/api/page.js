import { isMock, DOMAIN } from '@/utils/config'
import mockConfig from '@/mock/mockConfig'
import axios from '@/utils/axios'

export default class Pagebase {
  // 数据交互域名
  static async request (options) {
    // 域名添加
    !/^http/.test(options.url) && (options.url = DOMAIN + options.url)
    // mock
    if (isMock) {
      return require('../mock/' + mockConfig[options.url])
    }
    // 方法
    return await axios.request(options)
  }
}
