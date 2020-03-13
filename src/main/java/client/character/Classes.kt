package client.character

import client.*
import client.anticheat.CheatTracker
import client.inventory.MapleMount
import handling.world.MapleMessenger
import handling.world.MapleParty
import handling.world.family.MapleFamilyCharacter
import handling.world.guild.MapleGuildCharacter
import scripting.AbstractPlayerInteraction
import scripting.EventInstanceManager
import server.*
import server.maps.MapleMap
import server.shops.IMaplePlayerShop
import java.sql.Connection
import java.util.concurrent.atomic.AtomicInteger
import java.util.concurrent.locks.ReentrantReadWriteLock

data class Classes(
        var buddyList: BuddyList? = null,
        val cs: CashShop? = null,
        var client: MapleClient? = null,
        val connection1: Connection? = null,
        val script: AbstractPlayerInteraction? = null,
        var monsterBook: MonsterBook? = null,
        val storage: MapleStorage? = null,
        val mount: MapleMount? = null,
        var messenger: MapleMessenger? = null,
        var mgc: MapleGuildCharacter? = null,
        var mfc: MapleFamilyCharacter? = null,
        val keyLayout: MapleKeyLayout = MapleKeyLayout(),
        @Transient val visibleMapObjectsLock: ReentrantReadWriteLock = ReentrantReadWriteLock(),
        @Transient val summonsLock: ReentrantReadWriteLock = ReentrantReadWriteLock(),
        @Transient val controlledLock: ReentrantReadWriteLock = ReentrantReadWriteLock(),
        @Transient var anticheat: CheatTracker? = null,
        @Transient val carnivalParty: MapleCarnivalParty? = null,
        @Transient var party: MapleParty? = null,
        @Transient var map: MapleMap? = null,
        @Transient val shop: MapleShop? = null,
        @Transient val rps: RockPaperScissors? = null,
        @Transient val usingStrongBuff: Boolean = false,
        @Transient val trade: MapleTrade? = null,
        @Transient val eventInstance: EventInstanceManager? = null,
        @Transient val playerShop: IMaplePlayerShop? = null,
        @Transient val random1: PlayerRandomStream = PlayerRandomStream(),
        @Transient val random2: PlayerRandomStream = PlayerRandomStream(),
        @Transient val random3: PlayerRandomStream = PlayerRandomStream(),
        @Transient val inst: AtomicInteger = AtomicInteger(0),
        @Transient val insd: AtomicInteger = AtomicInteger(-1)
)