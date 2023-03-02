import SnackbarUtils from "../SnackbarUtils"

export default (url, title, text) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (navigator.share) {
                await navigator.share({title, text, url })
                resolve(true)
            }
            else {
                navigator.clipboard.writeText(window.location)
                resolve(false)
            }
        }
        catch (err) {
            reject(err)
        }
    })
}