module.exports = function TimeStamps (dispatch){
    // Need to track blocklist ourselves because we modify the author name
    // (to include fancy html)
    const blocked = new Set()

    function block(user) {
        blocked.add(user.name)
    }

    function processChatEvent (event) {
        if (event.channel === 26) return
        if (blocked.has(event.authorName)) return false
        var time = new Date()
        const hours = "" + time.getHours(), minutes = "" + time.getMinutes()
        var timeStr = `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`
        event.authorName = `</a>${timeStr}][<a href='asfunction:chatNameAction,${event.authorName}@0@0'>${event.authorName}</a>`
        return true
    }

    dispatch.hook('S_ADD_BLOCKED_USER', 2, block)
    dispatch.hook('S_USER_BLOCK_LIST', 2, ({blockList}) => {
        blockList.forEach(block)
    })
    dispatch.hook('C_REMOVE_BLOCKED_USER', 1, ({name}) => {
        blocked.delete(name)
    })
    dispatch.hook('S_LOGIN', 'raw', () => {
        blocked.clear()
    })
    dispatch.hook('S_CHAT', 2, processChatEvent)
    dispatch.hook('S_PRIVATE_CHAT', 1, processChatEvent)
}
