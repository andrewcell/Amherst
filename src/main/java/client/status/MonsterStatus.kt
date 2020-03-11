package client.status

import client.MapleDisease
import handling.Buffstat
import java.io.Serializable

enum class MonsterStatus(override val value: Int, override val position: Int, val empty: Boolean = false) : Serializable, Buffstat {
    WATK(0x1, 1),
    WDEF(0x2, 1),
    MATK(0x4, 1),
    MDEF(0x8, 1),
    ACC(0x10, 1),
    AVOID(0x20, 1),
    SPEED(0x40, 1),
    STUN(0x80, 1),
    FREEZE(0x100, 1),
    POISON(0x200, 1),
    SEAL(0x400, 1),
    SHOWDOWN(0x800, 1),
    WEAPON_ATTACK_UP(0x1000, 1),
    WEAPON_DEFENSE_UP(0x2000, 1),
    MAGIC_ATTACK_UP(0x4000, 1),
    MAGIC_DEFENSE_UP(0x8000, 1),
    DOOM(0x10000, 1),
    SHADOW_WEB(0x20000, 1),
    WEAPON_IMMUNITY(0x40000, 1),
    MAGIC_IMMUNITY(0x80000, 1),


    DAMAGE_IMMUNITY(0x200000, 1),
    NINJA_AMBUSH(0x400000, 1),
    VENOM(0x1000000, 1),
    BLIND(0x2000000, 1),
    SEAL_SKILL(0x4000000, 1),
    HYPNOTIZE(0x10000000, 1),
    WEAPON_DAMAGE_REFLECT(0x20000000, 1),
    MAGIC_DAMAGE_REFLECT(0x40000000, 1);

    val serialVersionUID: Long = 0L

    companion object {
        fun getLinkedDisease(skill: MonsterStatus): MapleDisease? {
            return when (skill) {
                STUN, SHADOW_WEB -> MapleDisease.STUN
                POISON, VENOM -> MapleDisease.POISON
                SEAL -> MapleDisease.SEAL
                BLIND -> MapleDisease.DARKNESS
                SPEED -> MapleDisease.SLOW
                else -> null
            }
        }
    }
}