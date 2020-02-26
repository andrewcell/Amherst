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
package server.maps;

public enum FieldLimitType {

    Jump(0x1),
    MovementSkills(0x2),
    SummoningBag(0x04), //
    MysticDoor(0x08), //
    ChannelSwitch(0x10), //
    RegularExpLoss(0x20), //Portal Scroll Limit
    VipRock(0x40), //
    Minigames(0x80),
    SpecificPortalScrollLimit(0x100),
    Mount(0x200), // 
    PotionUse(0x400), //or 0x40000 //
    PartyLeaderChangeLimit(0x800),
    NoMobCapacityLimit(0x1000),
    WeddingInvitationLimit(0x2000),
    CashWeatherLimit(0x4000),
    Pet(0x8000), //needs confirmation
    AntoMacroLimit(0x10000),
    FalldownLimit(0x20000),
    SummonNpcLimit(0x40000),
    NoExpDecrease(0x80000),
    NoDamageOnFalling(0x100000),
    ParcelOpenLimit(0x200000),
    DropLimit(0x400000);
    ;
    private final int i;

    private FieldLimitType(int i) {
        this.i = i;
    }

    public final int getValue() {
        return i;
    }

    public final boolean check(int fieldlimit) {
        return (fieldlimit & i) == i;
    }
}
