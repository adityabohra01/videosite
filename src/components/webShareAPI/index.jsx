import SnackbarUtils from "../SnackbarUtils"

export default (url, title, text) => {
    return new Promise(async (resolve, reject) => {
        try {
            // if (navigator.share) {
            //     await navigator.share({title, text, url })
            //     resolve(true)
            // }
            // else {
                navigator.clipboard.writeText(url).then(() => SnackbarUtils.toast("Link copied to clipboard"))
                resolve(false)
            // }
        }
        catch (err) {
            reject(err)
        }
    })
}