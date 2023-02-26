class LoaderUtils {
    #loader = {
        s: true,
        h: () => {},
        sh: false,
        hh: () => {},
    }

    setLoader(loading, setLoading, halt, setHalt) {
        this.#loader.s = loading
        this.#loader.h = setLoading
        this.#loader.sh = halt
        this.#loader.hh = setHalt
    }

    halt() {
        return this.#loader.hh(true)
    }

    unhalt() {
        return this.#loader.hh(false)
    }

    open() {
        return this.#loader.h(false)
    }
    close() {
        return this.#loader.h(true)
    }
    toggle() {
        return this.#loader.h(!this.#loader.s)
    }
}

export default new LoaderUtils()
