package scripting

import client.MapleClient
import server.MaplePortal

class PortalPlayerInteraction(c: MapleClient, val portal: MaplePortal) : AbstractPlayerInteraction(c, portal.id, c.player.mapId) {

    fun inFreeMarket() {
        if (mapId != 910000000) {
            if (player.level >= 10) {
                saveLocation("FREE_MARKET")
                playPortalSE()
                warp(910000000, "st00")
            } else {
                playerMessage(5, "레벨 10 이상만 자유시장에 입장할 수 있습니다.")
            }
        }
    }

    // summon one monster on reactor location
    override fun spawnMonster(id: Int) {
        spawnMonster(id, 1, portal.position)
    }

    // summon monsters on reactor location
    override fun spawnMonster(id: Int, qty: Int) {
        spawnMonster(id, qty, portal.position)
    }

}