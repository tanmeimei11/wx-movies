var request = require('./request.js').requestPromisify
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
                this.loadingOut()
                this.toastSucc('保存成功')
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
    // compose: function () {
    //     this.loadingIn('加载中')
    //     var _images = this.data.openShareMoneyModalData.images
    //     _images.qr.src = this.getOpenShareMoneyModalData('actQrImg')
    //     _images.avatar.src = this.getOpenShareMoneyModalData('avatarUrl')
    //     util.loadImages(_images)
    //         .then(() => {
    //             var ctx = wx.createCanvasContext('firstCanvas')
    //             var _avatar = _images.avatar
    //             var _qr = _images.qr
    //             var _qrContain = _images.qrContain
    //             var _body = _images.body
    //             return util.drawImageInCenter(ctx, _avatar.local, _avatar.x, _avatar.y, _avatar.w, _avatar.h)
    //                 .then(() => {
    //                     return util.drawImageInCenter(ctx, _qr.local, _qr.x, _qr.y, _qr.w, _qr.h)
    //                 }).then(() => {
    //                     ctx.drawImage(_body.local, _body.x, _body.y, _body.w, _body.h)
    //                     return util.drawImageInCenter(ctx, _qrContain.local, _qrContain.x, _qrContain.y, _qrContain.w, _qrContain.h)
    //                 }).then(() => {
    //                     ctx.draw(true)
    //                     setTimeout(() => {
    //                         // 画文字
    //                         ctx.setTextAlign('center')
    //                         ctx.setFillStyle('white')
    //                         ctx.setFontSize(42)
    //                         ctx.fillText('扫码领取本周20个红包', 375, 315)
    //                         ctx.setFontSize(36)

    //                         ctx.setFillStyle('#FEE1DD')
    //                         ctx.fillText('红包直接抵扣现金', 375, 375)
    //                         ctx.draw(true)
    //                         return wxPromisify(wx.canvasToTempFilePath)({
    //                             canvasId: 'firstCanvas',
    //                         }).then(res => {
    //                             this.saveImage(res.tempFilePath)
    //                         }, () => {
    //                             this.getImgFromBack()
    //                         }).catch(error => {
    //                             console.error('error')
    //                             this.getImgFromBack()
    //                         })
    //                     }, 100)
    //                 })
    //         }).catch((error) => {
    //             this.loadingOut()
    //             this.toastFail('保存失败')
    //         })
    // }
}


