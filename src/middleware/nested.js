export function getGrandParentX(el, X) {
    el = el.parentElement
    X = parseInt(X) - 1
    if (parseInt(X) > 0) {
        return getGrandParentX(el, X)
    } else {
        return el
    }
}
