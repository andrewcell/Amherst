package client.messages.commands

import constants.ServerConstants.PlayerGMRank

class PlayerCommand {
    fun getPlayerLevelRequired(): PlayerGMRank? {
        return PlayerGMRank.NORMAL
    }
}