export const Localstorage = {
    set(key, value) {
        if (typeof window == "undefined") return
        localStorage.setItem(key, JSON.stringify(value))
    },
    get(key) {
        if (typeof window == "undefined") return

        const valueRaw = localStorage.getItem(key)
        if (!valueRaw) return

        const value = JSON.parse(valueRaw)
        return value
    },
    remove(key) {
        if (typeof window == "undefined") return
        localStorage.removeItem(key)
    },
}
