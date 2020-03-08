package client.messages

import client.MapleClient

object GMCommand {
    fun Level(c: MapleClient, level: Short) {
        c.player.setLevel(level)
        c.player.levelUp()
        if (c.player.exp < 0) {
            c.player.gainExp(-c.player.exp, false, false, true)
        }
    }
}