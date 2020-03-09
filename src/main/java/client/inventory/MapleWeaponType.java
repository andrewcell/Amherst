/*
This file is part of the OdinMS Maple Story Server
Copyright (C) 2008 ~ 2010 Patrick Huy <patrick.huy@frz.cc> 
Matthias Butz <matze@odinms.de>
Jan Christian Meyer <vimes@odinms.de>

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License version 3
as published by the Free Software Foundation. You may not use, modify
or distribute this program under any other version of the
GNU Affero General Public License.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
package client.inventory;

public enum MapleWeaponType {

    NOT_A_WEAPON(1.43f, 20),
    SWORD1H(4.0f, 20),      //30
    AXE1H(4.4f, 20),        //31
    BLUNT1H(4.4f, 20),      //32
    DAGGER(3.6f, 20),       //33
    WAND(4.0f, 25),         //37
    STAFF(4.0f, 25),        //38
    SWORD2H(4.6f, 20),      //40
    AXE2H(4.8f, 20),        //41
    BLUNT2H(4.8f, 20),      //42
    SPEAR(5.0f, 20),        //43
    POLE_ARM(5.0f, 20),     //44
    BOW(3.4f, 15),          //45
    CROSSBOW(3.6f, 15),     //46
    CLAW(3.6f, 15),         //47
    
    KNUCKLE(3.6f, 20),
    GUN(3.6f, 15),
    
    
    CANNON(1.35f, 15),
    DUAL_BOW(2.0f, 15), //beyond op
    MAGIC_ARROW(2.0f, 15),
    KATARA(1.3f, 20);
    private final float damageMultiplier;
    private final int baseMastery;

    private MapleWeaponType(final float maxDamageMultiplier, int baseMastery) {
        this.damageMultiplier = maxDamageMultiplier;
	this.baseMastery = baseMastery;
    }

    public final float getMaxDamageMultiplier() {
        return damageMultiplier;
    }

    public final int getBaseMastery() {
	return baseMastery;
    }
};
