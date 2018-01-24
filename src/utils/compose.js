var request = require('./request.js').requestPromisify
var getAuth = require('../utils/util.js').get
var wxPromisify = require('../utils/util.js').wxPromisify
module.exports = {
    getOpenShareMoneyModalData: function (key) {
        return this.data.openShareMoneyModalData[key]
    },
    saveImage: function (url) {
        getAuth('writePhotosAlbum')
            .then(() => {
                var prePromise = Promise.resolve({
                    path: url
                })
                if (/^http/.test(url)) {
                    prePromise = wxPromisify(wx.getImageInfo)({
                        src: url
                    })
                }
                return prePromise.then(res => {
                    return wxPromisify(wx.saveImageToPhotosAlbum)({
                        filePath: res.path
                    })
                })
            }).then(res => {
                wx.hideLoading()
                wx.showToast({
                  title: '保存成功',
                  duration: 2000
                })
            })
    },
    getImgFromBack() {
        request({
            url: '/bounty/edpacket_img ',
        }).then(res => {
            if (res.succ && res.data) {
                this.saveImage(res.data)
            }
        }).catch(() => {
            wx.hideLoading()
            wx.showToast({
                title: '当前微信版本不支持, 请升级版本',
                image: '../../images/toast-fail.png',
                duration: 2000
            })
        })
    }
}


