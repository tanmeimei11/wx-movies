import axios from './axios'

export default class Pagination {
  constructor (url, processFunc) {
    // 数据访问地址
    this.url = url
    // 数据集合
    this.list = []
    // 起始数据页码
    this.start = 1
    // 加载数据条数
    this.count = 20
    // 数据处理函数
    this.processFunc = processFunc
    // 正在加载中
    this.loading = false
    // 是否底部
    this.reachBottom = false
    // 是否为空
    this.empty = true
    // 是否需要清除
    this.toClear = false
  }

  /**
   * 加载下一页数据
   */
  async next (args) {
    const param = {
      page: this.start
    }

    if (this.loading) {
      console.warn('page loading!')
      return this
    }

    // 附加参数
    this.loading = true

    try {
      Object.assign(param, args)
      /**
       * 分页数据结构规范
       * current_page   当前页码
       * data           数据集合
       * from           起始数据索引
       * to             结束数据索引
       * last_page      最后页码
       * next_page_url
       * per_page       每页项目数量
       * prev_page_url
       * total          总项目数量
       */
      const { current_page, last_page, data } = await axios.get(this.url, { data: param })

      // 底部判断
      if (data === null || data.length < 1) {
        if (this.toClear) {
          this.clear()
        } else {
          this.reachBottom = true
        }
        return this
      }

      this.empty = false

      // 处理数据
      this._processData(data)

      // 设置数据
      if (this.toClear) {
        this.list = data
        this.toClear = false
      } else {
        this.list = this.list.concat(data)
      }

      this.start ++
      if (current_page === last_page) {
        this.reachBottom = true
      }

      return this
    } finally {
      this.loading = false
    }
  }

  /**
   * 恢复到第一页
   */
  reset () {
    this.empty = true;
    this.toClear = true;
    this.start = 1;
    this.reachBottom = false;
  }

  clear () {
    this.toClear = false;
    this.start = 1;
    this.list = [];
  }

  /**
   * 处理数据（私有）
   */
  _processData (data) {
    if (this.processFunc) {
      for (let i in data) {
        const result = this.processFunc(data[i])
        if (result) {
          data[i] = result
        }
      }
    }
  }
}
