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
package client;

import handling.Buffstat;
import java.io.Serializable;

public enum MapleBuffStat implements Serializable, Buffstat {

    WATK(0x1, 4),
    WDEF(0x2, 4),
    MATK(0x4, 4),
    MDEF(0x8, 4),
    ACC(0x10, 4),
    AVOID(0x20, 4),
    HANDS(0x40, 4),
    SPEED(0x80, 4),
    JUMP(0x100, 4),
    MAGIC_GUARD(0x200, 4),
    DARKSIGHT(0x400, 4),
    BOOSTER(0x800, 4),
    POWERGUARD(0x1000, 4),
    MAXHP(0x2000, 4),
    MAXMP(0x4000, 4),
    INVINCIBLE(0x8000, 4),
    SOULARROW(0x10000, 4),
    //2 - debuff
    //4 - debuff
    //8 - debuff
    SPARK(0x20000000, 2),
    //1 - debuff
    COMBO(0x200000, 4),
    SUMMON(0x200000, 4), //hack buffstat for summons ^.- (does/should not increase damage... hopefully <3)
    WK_CHARGE(0x400000, 4),
    DRAGONBLOOD(0x800000, 4),
    HOLY_SYMBOL(0x1000000, 4),
    MESOUP(0x2000000, 4),
    SHADOWPARTNER(0x4000000, 4),
    PICKPOCKET(0x8000000, 4),
    PUPPET(0x8000000, 4), // HACK - shares buffmask with pickpocket - odin special ^.-

    MESOGUARD(0x10000000, 4),
    HP_LOSS_GUARD(0x20000000, 4),
    //4 - debuff
    //8 - debuff

    //1 - debuff
    MORPH(0x2, 3),
    RECOVERY(0x4, 3),
    MAPLE_WARRIOR(0x8, 3),
    STANCE(0x10, 3),
    SHARP_EYES(0x20, 3),
    MANA_REFLECTION(0x40, 3),
    //8 - debuff

    SPIRIT_CLAW(0x100, 3),
    INFINITY(0x200, 3),
    HOLY_SHIELD(0x400, 3), //advanced blessing after ascension
    HAMSTRING(0x800, 3),
    BLIND(0x1000, 3),
    CONCENTRATE(0x2000, 3),
    //4 - debuff
    ECHO_OF_HERO(0x8000, 3),
    UNKNOWN3(0x10000, 3),
    GHOST_MORPH(0x20000, 3), // 유령 이벤트인가.. 유령으로 변신한다
    ARIANT_COSS_IMU(0x40000, 3), // 이게 머지... 뭔가 보호막이 쳐진다
    REVERSE_DIR(0x80000, 3),
    UNKNOWN6(0x400000, 3),
    UNKNOWN7(0x800000, 3),
    UNKNOWN8(0x1000000, 3),
    BERSERK_FURY(0x2000000, 3), // 지화천폭

    DIVINE_BODY(0x4000000, 3), // 금강불괴
    UNKNOWN9(0x8000000, 3),
    ARIANT_COSS_IMU2(0x10000000, 3), // no idea, seems the same
    FINALATTACK(0x20000000, 3),
    ENERGY_CHARGE(0x2, 2), // ok
    DASH_SPEED(0x4, 2), // ok
    DASH_JUMP(0x8, 2),
    MONSTER_RIDING(0x10, 2), // confirmed
    SPEED_INFUSION(0x20, 2), // ok
    HOMING_BEACON(0x40, 2),
    ELEMENT_RESET(0x80, 2), // wrong   

    EXPRATE(0x400, 2),
    DROP_RATE(0x800, 2),
    MESO_RATE(0x1000, 2),
    SOARING(0x40000, 2),;
    private static final long serialVersionUID = 0L;
    private final int buffstat;
    private final int first;

    private MapleBuffStat(int buffstat, int first) {
        this.buffstat = buffstat;
        this.first = first;
    }

    public final int getPosition() {
        return first;
    }

    public final int getValue() {
        return buffstat;
    }
}
