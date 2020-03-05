package client.inventory

enum class MapleWeaponType(val maxDamageMultiplier: Float, val baseMastery: Int) {
    NOT_A_WEAPON(1.43f, 20), SWORD1H(4.0f, 20),  //30
    AXE1H(4.4f, 20),  //31
    BLUNT1H(4.4f, 20),  //32
    DAGGER(3.6f, 20),  //33
    WAND(4.0f, 25),  //37
    STAFF(4.0f, 25),  //38
    SWORD2H(4.6f, 20),  //40
    AXE2H(4.8f, 20),  //41
    BLUNT2H(4.8f, 20),  //42
    SPEAR(5.0f, 20),  //43
    POLE_ARM(5.0f, 20),  //44
    BOW(3.4f, 15),  //45
    CROSSBOW(3.6f, 15),  //46
    CLAW(3.6f, 15),  //47
    KNUCKLE(3.6f, 20), GUN(3.6f, 15), CANNON(1.35f, 15), DUAL_BOW(2.0f, 15),  //beyond op
    MAGIC_ARROW(2.0f, 15), KATARA(1.3f, 20);

}