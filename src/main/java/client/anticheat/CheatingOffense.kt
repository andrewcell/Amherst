package client.anticheat

enum class CheatingOffense(val points: Byte, val validityDuration: Long, val autoBanCount: Int = -1, var banType: Byte = 0) {
    FAST_SUMMON_ATTACK(5, 6000, 50, 2),
    FASTATTACK(5, 6000, 200, 2),
    FASTATTACK2(5, 6000, 500, 2),
    MOVE_MONSTERS(5, 30000, 500, 2),
    FAST_HP_MP_REGEN(5, 20000, 100, 2),
    SAME_DAMAGE(5, 180000),
    ATTACK_WITHOUT_GETTING_HIT(1, 30000, 1200, 0),
    HIGH_DAMAGE_MAGIC(5, 30000),
    HIGH_DAMAGE_MAGIC_2(10, 180000),
    HIGH_DAMAGE(5, 30000),
    HIGH_DAMAGE_2(10, 180000),
    EXCEED_DAMAGE_CAP(5, 60000, 800, 0),
    ATTACK_FARAWAY_MONSTER(5, 180000), // NEEDS A SPECIAL FORMULAR!
    ATTACK_FARAWAY_MONSTER_SUMMON(5, 180000, 200, 2),
    REGEN_HIGH_HP(10, 30000, 1000, 2),
    REGEN_HIGH_MP(10, 30000, 1000, 2),
    ITEMVAC_CLIENT(3, 10000, 100),
    ITEMVAC_SERVER(2, 10000, 100, 2),
    PET_ITEMVAC_CLIENT(3, 10000, 100),
    PET_ITEMVAC_SERVER(2, 10000, 100, 2),
    USING_FARAWAY_PORTAL(1, 60000, 100, 0),
    FAST_TAKE_DAMAGE(1, 60000, 100),
    HIGH_AVOID(5, 180000, 100),
    //FAST_MOVE(1, 60000),
    HIGH_JUMP(1, 60000),
    MISMATCHING_BULLETCOUNT(1, 300000),
    ETC_EXPLOSION(1, 300000),
    ATTACKING_WHILE_DEAD(1, 300000),
    USING_UNAVAILABLE_ITEM(1, 300000),
    FAMING_SELF(1, 300000), // purely for marker reasons (appears in the database)
    FAMING_UNDER_15(1, 300000),
    EXPLODING_NONEXISTANT(1, 300000),
    SUMMON_HACK(1, 300000),
    SUMMON_HACK_MOBS(1, 300000),
    ARAN_COMBO_HACK(1, 600000, 50, 2),
    HEAL_ATTACKING_UNDEAD(20, 30000, 100);

    fun shouldAutoban(count: Int) = if (autoBanCount < 0) false else (count >= autoBanCount)

    fun setEnabled(enabled: Boolean) {
        banType = if (enabled) 0 else 1
    }

    fun isEnabled(): Boolean = banType >= 1
}