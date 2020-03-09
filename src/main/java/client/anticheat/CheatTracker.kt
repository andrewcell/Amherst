package client.anticheat

import client.MapleCharacter
import client.SkillFactory
import constants.GameConstants
import server.AutobanManager
import server.Timer
import tools.StringUtil
import java.awt.Point
import java.lang.ref.WeakReference
import java.util.*
import java.util.concurrent.ScheduledFuture
import java.util.concurrent.locks.ReentrantReadWriteLock
import kotlin.collections.LinkedHashMap

class CheatTracker(chr: MapleCharacter) {
    val lock = ReentrantReadWriteLock()
    val rL = lock.readLock()
    val wL = lock.writeLock()
    val offenses = LinkedHashMap<CheatingOffense, CheatingOffenseEntry>()
    lateinit var chr: WeakReference<MapleCharacter>
    private var lastAttackTime: Long = 0
    private var lastAttackTickCount = 0
    private var Attack_tickResetCount: Byte = 0
    private var Server_ClientAtkTickDiff: Long = 0
    private var lastDamage: Long = 0
    private var takingDamageSince: Long = 0
    private var numSequentialDamage = 0
    private var lastDamageTakenTime: Long = 0
    private var numZeroDamageTaken: Byte = 0
    private var numSequentialSummonAttack = 0
    private var summonSummonTime: Long = 0
    private var numSameDamage = 0
    private var lastMonsterMove: Point? = null
    private var monsterMoveCount = 0
    var attacksWithoutHit = 0
    private var dropsPerSecond: Byte = 0
    private var lastDropTime: Long = 0
    private var msgsPerSecond: Byte = 0
    private var lastMsgTime: Long = 0
    private var invalidationTask: ScheduledFuture<*>? = null
    private var gm_message = 0
    private var lastTickCount = 0
    private var tickSame:Int = 0
    private var lastSmegaTime: Long = 0
    private var lastBBSTime:Long = 0
    private var lastASmegaTime:Long = 0
    private var numSequentialFamiliarAttack = 0
    private var familiarSummonTime: Long = 0

    init {
        start(chr)
    }

    fun checkAttack(skillId: Int, tickCount: Int) {
        val atkDelay = GameConstants.getAttackDelay(skillId,
                if (skillId == 0) null else SkillFactory.getSkill(skillId))
        if ((tickCount - lastAttackTickCount) < atkDelay) {
            registerOffense(CheatingOffense.FASTATTACK)
        }
        lastAttackTime = System.currentTimeMillis()
        if(chr.get() != null && lastAttackTime - chr.get()!!.changeTime > 600000) {
            chr.get()!!.setChangeTime()
        }
        val STime_TC = lastAttackTime - tickCount

        if(Server_ClientAtkTickDiff - STime_TC > 1000) {
             registerOffense(CheatingOffense.FASTATTACK2)
        }

        Attack_tickResetCount++

        if (Attack_tickResetCount >= (if (atkDelay <= 200) 1 else 4)) {
            Attack_tickResetCount = 0
            Server_ClientAtkTickDiff = STime_TC
        }

        updateTick(tickCount)
        lastAttackTickCount = tickCount
    }

    fun checkTakeDamage(damage: Int) {
        numSequentialDamage++
        lastDamageTakenTime = System.currentTimeMillis()

        if (lastDamageTakenTime - takingDamageSince / 500 < numSequentialDamage) registerOffense(CheatingOffense.FAST_TAKE_DAMAGE)
        if (lastDamageTakenTime - takingDamageSince > 4500) {
            takingDamageSince = lastDamageTakenTime
            numSequentialDamage = 0
        }
        /*	(non-thieves)
             Min Miss Rate: 2%
             Max Miss Rate: 80%
            (thieves)
             Min Miss Rate: 5%
             Max Miss Rate: 95% */
        if (damage == 0) {
            numZeroDamageTaken++
            if (numZeroDamageTaken >= 35) {
                numZeroDamageTaken = 0
                registerOffense(CheatingOffense.HIGH_AVOID)
            }
        } else if (damage != -1) {
            numZeroDamageTaken = 0
        }
    }

    fun checkSameDamage(damage: Int, expected: Double) {
        if (damage > 2000 && lastDamage == damage.toLong() && chr.get() != null && (chr.get()!!.level < 175 || damage > expected * 2)) {
            numSameDamage++
            if (numSameDamage > 5) {
                registerOffense(CheatingOffense.SAME_DAMAGE, "$numSameDamage.toString() times, damage $damage, expected $expected [Level: ${chr.get()!!.level}, Job: ${chr.get()!!.job}]")
                numSameDamage = 0
            }
        } else {
            lastDamage = damage.toLong()
            numSameDamage = 0
        }
    }

    fun checkMoveMonster(pos: Point) {
        if (pos == lastMonsterMove) {
            monsterMoveCount++
            if (monsterMoveCount > 10) {
                registerOffense(CheatingOffense.MOVE_MONSTERS, "Position: ${pos.x}, ${pos.y}")
                monsterMoveCount = 0
            }
        } else {
            lastMonsterMove = pos
            monsterMoveCount = 1
        }
    }

    fun resetSummonAttack() {
        summonSummonTime = System.currentTimeMillis()
        numSequentialSummonAttack = 0
    }

    fun checkSummonAttack(): Boolean {
        numSequentialSummonAttack++
        if ((System.currentTimeMillis() - summonSummonTime) / (1000 + 1) < numSequentialSummonAttack) {
            registerOffense(CheatingOffense.FAST_SUMMON_ATTACK)
            return false
        }
        return true
    }

    fun resetFamiliarAttack() {
        familiarSummonTime = System.currentTimeMillis()
        numSequentialFamiliarAttack = 0
    }

    fun checkFamiliarAttack(chr: MapleCharacter): Boolean {
        numSequentialFamiliarAttack++
        if ((System.currentTimeMillis() - familiarSummonTime) / (600 + 1) < numSequentialFamiliarAttack) {
            registerOffense(CheatingOffense.FAST_SUMMON_ATTACK)
            return false
        }
        return true
    }

    @JvmOverloads
    fun checkDrop(dc: Boolean = false) {
        if ((System.currentTimeMillis() - lastDropTime) < 1000) {
            dropsPerSecond++
            if (dropsPerSecond >= (if (dc) 32 else 16) && chr.get() != null && !chr.get()!!.isGM) {
                if (dc) {
                    chr.get()!!.client.session.close(true)
                } else {
                    chr.get()!!.client.isMonitored = true
                }
            }
        } else {
            dropsPerSecond = 0
        }
        lastDropTime = System.currentTimeMillis()
    }

    fun checkMsg() {
        if ((System.currentTimeMillis() - lastMsgTime) < 1000) {
            msgsPerSecond++
            if (msgsPerSecond > 10 && chr.get() != null && !chr.get()!!.isGM) {
                chr.get()!!.client.session.close(true)
            }
        } else {
            msgsPerSecond = 0
        }
        lastMsgTime = System.currentTimeMillis()
    }

    @JvmOverloads
    fun registerOffense(offense: CheatingOffense, parameter: String = "") {
        val character = chr.get()
        if (character == null || !offense.isEnabled() || character.isGM) {
            return
        }
        var entry: CheatingOffenseEntry?
        rL.lock()
        try {
            entry = offenses.get(offense)
        } finally {
            rL.unlock()
        }
        if (entry != null && entry.isExpired()) {
            expireEntry(entry)
            entry = null
            gm_message = 0
        }
        if (entry == null) {
            entry = CheatingOffenseEntry(offense, character.id)
        }
        if (parameter != "") {
            entry.parameter = parameter
        }
        entry.incrementCount()
        wL.lock()
        try {
            offenses.put(offense, entry)
        } finally {
            wL.unlock()
        }
        when (offense) {
            CheatingOffense.HIGH_DAMAGE_MAGIC,
            CheatingOffense.HIGH_DAMAGE_MAGIC_2,
            CheatingOffense.HIGH_DAMAGE,
            CheatingOffense.HIGH_DAMAGE_2,
            CheatingOffense.ATTACK_FARAWAY_MONSTER,
            CheatingOffense.ATTACK_FARAWAY_MONSTER_SUMMON,
            CheatingOffense.SAME_DAMAGE -> {
                gm_message++
                if (gm_message % 100 == 0) {
                    if (character.job <= 500) {
                        character.ServerNotice("Autoban: $character.name, Is banned for hacking detection on Channel ${character.map.mapName}.")
                        AutobanManager.getInstance().autoban(character.client, "Auto banned for hacking detection.")
                    }
                }
                if (gm_message >= 300 && character.level < (if(offense == CheatingOffense.SAME_DAMAGE) 175 else 150)) {
                    val created = character.client.created
                    var time = System.currentTimeMillis()
                    if (created != null) {
                        time = created.time
                    }
                }
            }
            else -> return
        }
    }

    fun updateTick(newTick: Int) {
        if (newTick <= lastTickCount) {
            if (tickSame >= 5 && chr.get() != null && !chr.get()!!.isGM) {
                chr.get()!!.client.session.close(true)
            } else {
                tickSame++
            }
        } else {
            tickSame = 0
        }
        lastTickCount = newTick
    }

    fun canSmega(): Boolean {
        if (lastSmegaTime + 5000 > System.currentTimeMillis() && chr.get() != null && !chr.get()!!.isGM) {
            return false
        }
        lastSmegaTime = System.currentTimeMillis()
        return true
    }

    fun canAvatarSmega(): Boolean {
        if (lastASmegaTime + 300000 > System.currentTimeMillis() && chr.get() != null && !chr.get()!!.isGM) {
            return false
        }
        lastASmegaTime = System.currentTimeMillis()
        return true
    }

    fun canBBS(): Boolean {
        if (lastBBSTime + 60000 > System.currentTimeMillis() && chr.get() != null && !chr.get()!!.isGM) {
            return false
        }
        lastBBSTime = System.currentTimeMillis()
        return true
    }

    fun expireEntry(coe: CheatingOffenseEntry) {
        wL.lock()
        try {
            offenses.remove(coe.offense)
        } finally {
            wL.unlock()
        }
    }

    fun getPoints(): Int {
        var ret = 0
        val offenses_copy: Array<CheatingOffenseEntry>
        rL.lock()
        try {
            offenses_copy = offenses.values.toTypedArray()
        } finally {
            rL.unlock()
        }
        for (entry in offenses_copy) {
            if (entry.isExpired()) {
                expireEntry(entry)
            } else {
                ret += entry.getPoints().toInt()
            }
        }
        return ret
    }

    fun getOffenses(): Map<CheatingOffense, CheatingOffenseEntry> = Collections.unmodifiableMap(offenses)
    fun getSummary(): String {
        val ret: StringBuilder = StringBuilder()
        val offenseList = ArrayList<CheatingOffenseEntry>()
        rL.lock()
        try {
            for (entry in offenses.values) {
                if(!entry.isExpired()) offenseList.add(entry)
            }
        } finally {
            rL.unlock()
        }
        offenseList.sortWith(Comparator { o1, o2 ->
            val thisVal = o1.getPoints().toInt()
            val anotherVal = o2.getPoints().toInt()
            if (thisVal < anotherVal) 1 else if (thisVal == anotherVal) 0 else -1
        })
        val to: Int = Math.min(offenseList.size, 4)
        for (x in 0 until to) {
            ret.append(StringUtil.makeEnumHumanReadable(offenseList.get(x).offense.name))
            ret.append(": ")
            ret.append(offenseList.get(x).count)
            if (x != to -1) ret.append(" ")
        }
        return ret.toString()
    }

    fun dispose() {
        invalidationTask?.cancel(false)
        invalidationTask = null
        chr = WeakReference<MapleCharacter>(null)
    }

    fun start(character: MapleCharacter) {
        chr = WeakReference<MapleCharacter>(character)
        invalidationTask = Timer.CheatTimer.getInstance().register(InvalidationTask(), 60000)
        takingDamageSince = System.currentTimeMillis()
    }

    fun setAttacksWithoutHit(increase: Boolean) {
        if (increase) attacksWithoutHit++ else attacksWithoutHit = 0
    }

    inner class InvalidationTask : Runnable {
        override fun run() {
            val offenses_copy: Array<CheatingOffenseEntry>
            rL.lock()
            try {
                offenses_copy = offenses.values.toTypedArray()
            } finally {
                rL.unlock()
            }
            for (offense in offenses_copy) {
                if (offense.isExpired()) expireEntry(offense)
            }
            if (chr.get() == null) dispose()
        }
    }
}
