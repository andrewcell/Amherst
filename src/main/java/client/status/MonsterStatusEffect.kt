package client.status

import client.MapleCharacter
import org.eclipse.sisu.inject.Weak
import server.life.MapleMonster
import server.life.MobSkill
import java.lang.ref.WeakReference

class MonsterStatusEffect(var stat: MonsterStatus, var x: Int, val skillId: Int, val mobSkill: MobSkill, val monsterSkill: Boolean) {
    var venomCount = 0
    var cancelTime = 0L
    var poisonSchedule = 0
    var weakCharacter: WeakReference<MapleCharacter>? = null
    fun setValue(status: MonsterStatus, newValue: Int) {
        stat = status
        x = newValue
    }

    fun setCancelTask(cancelTask: Long) {
        cancelTime = System.currentTimeMillis() + cancelTask
    }

    fun shouldCancel(now: Long): Boolean = cancelTime in 1..now
    fun cancelPoisonSchedule(mm: MapleMonster) {
        mm.doPoison(this, weakCharacter)
        poisonSchedule = 0
        weakCharacter = null
    }
    fun setPoisonSchedule(_posionSchedule: Int, chr: MapleCharacter) {
        poisonSchedule = _posionSchedule
        weakCharacter = WeakReference(chr)
    }
    fun genericSkill(stat: MonsterStatus): Int {
        return when (stat) {
            MonsterStatus.STUN -> 3101005
            MonsterStatus.SPEED -> 2101003
            MonsterStatus.MDEF -> 12101001
            MonsterStatus.POISON -> 2101005
            MonsterStatus.BLIND -> 3221006
            MonsterStatus.SEAL -> 2111004
            MonsterStatus.FREEZE -> 2201004
            MonsterStatus.SHOWDOWN -> 4121003
            MonsterStatus.SHADOW_WEB -> 4111003
            MonsterStatus.VENOM -> 4120005
            MonsterStatus.DOOM -> 2311005
            MonsterStatus.NINJA_AMBUSH -> 4121004
            else -> 0
        }
    }



}