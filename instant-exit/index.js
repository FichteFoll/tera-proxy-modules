module.exports = function ExitInstantly(dispatch) {

    const command = require('command')(dispatch)

	dispatch.hook('S_PREPARE_EXIT', 1, () => {
		// The servers sends the S_EXIT packet with the int64 data:
		// 00000000 10000000
        // Not sure of the purpose, but client seems fine without it.
        // update: params are two int32, category and code. *shrug*
		dispatch.toClient('S_EXIT', 3, {})
	})

    command.add('exit', () => {
        dispatch.toClient('S_EXIT', 3, {})
    })
}
