// Item IDs that have unique glows
//
// 91116   Amarun's Relic Piece
// 55658   Bahaar's Relic Piece
// 91166   Dagon's Relic Piece
// 91114   Elinu's Relic Piece
// 91118   Gidd's Relic Piece
// 91177   Ishara's Relic Piece
// 91113   Isren's Relic Piece
// 91119   Karas's Relic Piece
// 91188   Oriyn's Relic Piece
// 57000   Seren's Relic Piece
// 91115   Tithus's Relic Piece
// 91117   Zuras's Relic Piece
// 98260   Vergos's Head           // Vergo pieces all have the same effect
// 98263   Vergos's Horn
// 98262   Vergos's Scale
// 98264   Vergos's Bone
// 98261   Vergos's Fang

const ItemToSpawn = 98260
const UseJobSpecificMarkers = true

// warrior = 0, lancer = 1, slayer = 2, berserker = 3,
// sorcerer = 4, archer = 5, priest = 6, mystic = 7,
// reaper = 8, gunner = 9, brawler = 10, ninja = 11,
// valkyrie = 12

const JobSpecificMarkers = [
    {
        // tanks
        jobs: [1, 10],
        marker: 91177,
    },
    {
        // healers
        jobs: [6, 7],
        marker: 91113,
    },
]

const getSpawnItem = (jobId) => {
    if (UseJobSpecificMarkers) {
        for (const markers of JobSpecificMarkers) {
            if (markers.jobs.includes(jobId)) {
                return markers.marker
            }
        }
    }

    return ItemToSpawn
}

module.exports = function PartyDeathMarkers (dispatch) {

    const command = require('command')(dispatch)
    let enabled = true
    const deadPeople = new Map() // playerId -> {loc}
    let partyMembers = []

    const spawnMarker = (member, loc) => {
        console.log(`spawning marker for ${member.playerId}`)
        dispatch.toClient('S_SPAWN_DROPITEM', 6, {
            // just use playerId as item's gameId; unlikely to have conflicts and easy to track
            gameId: member.playerId,
            loc,
            item: getSpawnItem(member.class),
            amount: 1,
            explode: 1, // TOTEST
            source: dispatch.game.me.gameId, // TOTEST
            expiry: 999999,
            owners: [{playerId: 0}],
        })
    }

    const removeMarker = (playerId) => {
        console.log(`removing marker for ${playerId}`)
        if (deadPeople.has(playerId)) {
            dispatch.toClient('S_DESPAWN_DROPITEM', 4, {
                gameId: playerId,
            })
        }
    }

    dispatch.hook('S_LOGIN', 10, () => {
        partyMembers = []
        deadPeople.clear()
    })

    dispatch.hook('S_PARTY_MEMBER_LIST', 7, ({members}) => {
        console.log(`party_member_list ${JSON.stringify(members)}`)
        console.log(`my gameId: ${JSON.stringify(dispatch.game.me.gameId)}`)
        partyMembers = members.filter((mem) => !dispatch.game.me.is(mem.gameId))
        console.log(`in party with ${partyMembers.length} people:\n${JSON.stringify(partyMembers)}`)
    })

    dispatch.hook('S_DEAD_LOCATION', 2, ({gameId, loc}) => {
        const member = partyMembers.find((mem) => mem.gameId.equals(gameId))
        console.log(`someone died ${gameId}; ${JSON.stringify(member)}; ${loc}`)
        if (!member) return;
        if (deadPeople.has(member.playerId))
            removeMarker(member.playerId)
        if (enabled)
            spawnMarker(member, loc)
        deadPeople.set(member.playerId, loc)
    })

    dispatch.hook('S_PARTY_MEMBER_STAT_UPDATE', 3, ({playerId, curHp}) => {
        if (deadPeople.has(playerId) && curHp > 0) {
            console.log(`someone revived ${playerId}`)
            removeMarker(playerId)
            deadPeople.delete(playerId)
        }
    })

    dispatch.hook('S_LEAVE_PARTY_MEMBER', 2, ({playerId}) => {
        removeMarker(playerId)
        deadPeople.delete(playerId)
        partyMembers = partyMembers.filter((mem) => mem.playerId === playerId)
        console.log(`in party with ${partyMembers.length} people:\n${JSON.stringify(partyMembers)}`)
    })

    dispatch.hook('S_LEAVE_PARTY', 1, () => {
        partyMembers = []
        deadPeople.forEach((k) => removeMarker(k))
        deadPeople.clear()
    })

    command.add(['partydeathmarkers', 'pdm'], {
        clear () {
            deadPeople.forEach((k, v) => removeMarker(k))
            deadPeople.clear()
            command.message('Death markers cleared')
        },
        toggle () {
            enabled = !enabled
            if (enabled) {
                deadPeople.forEach((playerId, loc) => {
                    const member = partyMembers.find((mem) => mem.playerId === playerId)
                    if (member)
                        spawnMarker(member, loc)
                })
            } else {
                deadPeople.forEach((k, v) => removeMarker(k))
            }

            command.message("Death markers " + (enabled ? 'enabled' : 'disabled'))
        },
    })
}
