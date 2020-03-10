package client.inventory

enum class EquipAdditions(value1: String, value2: String, element: Boolean = false) {
    elemboost("elemVol", "elemVol", true),
    mobcategory("category", "damage"),
    critical("prob", "damage"),
    boss("prob", "damage"),
    mobdie("hpIncOnMobDie", "mpIncOnMobDie"),
    hpmpchange("hpChangerPerTime", "mpChangerPerTime"),
    skill("id", "level");

    companion object {
        fun fromString(str: String): EquipAdditions? {
            for (s in values()) {
                if (s.name.equals(str, true)) return s
            }
            return null
        }
    }
}