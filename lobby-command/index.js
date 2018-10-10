module.exports = function LobbyCommand (dispatch) {

	const command = require('command')(dispatch)

	command.add('lobby', () => {
		dispatch.toServer('C_RETURN_TO_LOBBY', 1, {});
	})
}
