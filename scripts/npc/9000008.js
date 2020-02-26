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
/*
 * NPCID : 9000008
 * ScriptName : Event05
 * NPCNameFunc : 몽땅따 - 자물쇠 따기 달인
 * Location : 103000000 (빅토리아로드 - 커닝시티)
 * 
 * @author T-Sun
 *
 */
importPackage(Packages.server);
var status = 0;
var sel = 0;
function start() {
    status = -1;
    action(1,0,0);
}
function action(mode, type, selection) {
    if (mode == 1) {
        status++;
    } else {
        cm.dispose();
        return;
    }
    if (status == 0) {
        if (cm.haveItem(4031017, 1)) {
            cm.sendNext("어흠! 내가 딸 수 없는 자물쇠는 없다해~");
        } else {
            cm.sendOk("어흠! 내가 딸 수 없는 자물쇠는 없다해~");
            cm.dispose();
        }
    } else if (status == 1) {
        cm.sendSimple("#t4021005# 1개와 #t4000010# 5개를 준다면 특별히 요금은 받지 않겠다해! 요금은 10000메소다 해! 어떻게 하겠나해? \r\n#L0##e1. #n#b재료를 준다.#k#l\r\n#L1##e2. #n#b재료를 주지 않는다.#k#l");
    } else if (status == 2) {
        sel = selection;
        var nNewItemSort = 0; 
        var nNewItemID = 0; 
        var nNewItemNum = 1;
        var rn1 = Randomizer.rand( 1, 100 ); 
        var rn2 = 0;
        if ( rn1 < 6 ) nNewItemSort = 1; 
        else if ( rn1 > 5 && rn1 < 11 ) nNewItemSort = 2; 
        else if ( rn1 > 10 && rn1 < 16 )  nNewItemSort = 3; 
        else if ( rn1 > 15 && rn1 < 21 ) nNewItemSort = 4; 
        else if ( rn1 > 20 && rn1 < 26 ) nNewItemSort = 5; 
        else if ( rn1 > 25 && rn1 < 31 ) nNewItemSort = 6; 
        else if ( rn1 > 30 && rn1 < 36 ) nNewItemSort = 7; 
        else if ( rn1 > 35 && rn1 < 40 ) nNewItemSort = 8; 
        else if ( rn1 > 40 && rn1 < 71 ) nNewItemSort = 9; 
        else if ( rn1 > 70 && rn1 < 101 ) nNewItemSort = 10; 
        if ( nNewItemSort == 1 ) {
            nNewItemNum = 1; 
            rn2 = Randomizer.rand( 1, 13 ); 
            if ( rn2 == 1 )  nNewItemID = 1002086; 
            else if ( rn2 == 2 )  nNewItemID = 1002218; 
            else if ( rn2 == 3 )  nNewItemID = 1002214; 
            else if ( rn2 == 4 )  nNewItemID = 1002210; 
            else if ( rn2 == 5 )  nNewItemID = 1032013; 
            else if ( rn2 == 6 )  nNewItemID = 1072135; 
            else if ( rn2 == 7 )  nNewItemID = 1072143; 
            else if ( rn2 == 8 )  nNewItemID = 1072125; 
            else if ( rn2 == 9 )  nNewItemID = 1072130; 
            else if ( rn2 == 10 )  nNewItemID = 1082009; 
            else if ( rn2 == 11 )  nNewItemID = 1082081; 
            else if ( rn2 == 12 )  nNewItemID = 1082084; 
            else if ( rn2 == 13 )  nNewItemID = 1082065; 
				
        } else if ( nNewItemSort == 2 ) {
            nNewItemNum = 1; 
            rn2 = Randomizer.rand( 1, 18 ); 
            if ( rn2 == 1 )  nNewItemID = 1032015; 
            else if ( rn2 == 2 )  nNewItemID = 1092009; 
            else if ( rn2 == 3 )  nNewItemID = 1302011; 
            else if ( rn2 == 4 )  nNewItemID = 1312009; 
            else if ( rn2 == 5 )  nNewItemID = 1322018; 
            else if ( rn2 == 6 )  nNewItemID = 1332015; 
            else if ( rn2 == 7 )  nNewItemID = 1332017; 
            else if ( rn2 == 8 )  nNewItemID = 1372007; 
            else if ( rn2 == 9 )  nNewItemID = 1382006; 
            else if ( rn2 == 10 )  nNewItemID = 1402011; 
            else if ( rn2 == 11 )  nNewItemID = 1412007; 
            else if ( rn2 == 12 )  nNewItemID = 1422009; 
            else if ( rn2 == 13 )  nNewItemID = 1432006; 
            else if ( rn2 == 14 )  nNewItemID = 1442010; 
            else if ( rn2 == 15 )  nNewItemID = 1452004; 
            else if ( rn2 == 16 )  nNewItemID = 1462008; 
            else if ( rn2 == 17 )  nNewItemID = 1472022; 
            else if ( rn2 == 18 )  nNewItemID = 2070005; 
        } else if ( nNewItemSort == 3 ) {
            rn2 = Randomizer.rand( 1, 4 ); 
            if ( rn2 >= 1 && rn2 <=3 ) {
                nNewItemNum = 5; 
                nNewItemID = 4003000; 
            } else if ( rn2 == 4 ) {
                nNewItemNum = 1; 
                nNewItemID = 2100000; 
            }
        } else if ( nNewItemSort == 4 ) {
            nNewItemNum = 1; 
            rn2 = Randomizer.rand( 1, 52 ); 
            if ( rn2 == 1 )  nNewItemID = 2040704; 
            else if ( rn2 == 2 )  nNewItemID = 2040501; 
            else if ( rn2 == 3 )  nNewItemID = 2040401; 
            else if ( rn2 == 4 )  nNewItemID = 2040601; 
            else if ( rn2 == 5 )  nNewItemID = 2040705; 
            else if ( rn2 == 6 )  nNewItemID = 2040502; 
            else if ( rn2 == 7 )  nNewItemID = 2040402; 
            else if ( rn2 == 8 )  nNewItemID = 2040602; 
            else if ( rn2 == 9 )  nNewItemID = 2040301; 
            else if ( rn2 == 10 )  nNewItemID = 2040302; 
            else if ( rn2 == 11 )  nNewItemID = 2040707; 
            else if ( rn2 == 12 )  nNewItemID = 2040708; 
            else if ( rn2 == 13 )  nNewItemID = 2040804; 
            else if ( rn2 == 14 )  nNewItemID = 2040805; 
            else if ( rn2 == 15 )  nNewItemID = 2040901; 
            else if ( rn2 == 16 )  nNewItemID = 2040902; 
            else if ( rn2 == 17 )  nNewItemID = 2041001; 
            else if ( rn2 == 18 )  nNewItemID = 2041002; 
            else if ( rn2 == 19 )  nNewItemID = 2041004; 
            else if ( rn2 == 20 )  nNewItemID = 2041005; 
            else if ( rn2 == 21 )  nNewItemID = 2041007; 
            else if ( rn2 == 22 )  nNewItemID = 2041008; 
            else if ( rn2 == 23 )  nNewItemID = 2041010; 
            else if ( rn2 == 24 )  nNewItemID = 2041011; 
            else if ( rn2 == 25 )  nNewItemID = 2043001; 
            else if ( rn2 == 26 )  nNewItemID = 2043002; 
            else if ( rn2 == 27 )  nNewItemID = 2043101; 
            else if ( rn2 == 28 )  nNewItemID = 2043102; 
            else if ( rn2 == 29 )  nNewItemID = 2043201; 
            else if ( rn2 == 30 )  nNewItemID = 2043202; 
            else if ( rn2 == 31 )  nNewItemID = 2043301; 
            else if ( rn2 == 32 )  nNewItemID = 2043302; 
            else if ( rn2 == 33 )  nNewItemID = 2043701; 
            else if ( rn2 == 34 )  nNewItemID = 2043702; 
            else if ( rn2 == 35 )  nNewItemID = 2043801; 
            else if ( rn2 == 36 )  nNewItemID = 2043802; 
            else if ( rn2 == 37 )  nNewItemID = 2044001; 
            else if ( rn2 == 38 )  nNewItemID = 2044002; 
            else if ( rn2 == 39 )  nNewItemID = 2044101; 
            else if ( rn2 == 40 )  nNewItemID = 2044102; 
            else if ( rn2 == 41 )  nNewItemID = 2044201; 
            else if ( rn2 == 42 )  nNewItemID = 2044202; 
            else if ( rn2 == 43 )  nNewItemID = 2044301; 
            else if ( rn2 == 44 )  nNewItemID = 2044302; 
            else if ( rn2 == 45 )  nNewItemID = 2044401; 
            else if ( rn2 == 46 )  nNewItemID = 2044402; 
            else if ( rn2 == 47 )  nNewItemID = 2044501; 
            else if ( rn2 == 48 )  nNewItemID = 2044502; 
            else if ( rn2 == 49 )  nNewItemID = 2044601; 
            else if ( rn2 == 50 )  nNewItemID = 2044602; 
            else if ( rn2 == 51 )  nNewItemID = 2044701; 
            else if ( rn2 == 52 )  nNewItemID = 2044702; 
        }else if ( nNewItemSort == 5 ) {
            nNewItemNum = 10; 
            rn2 = Randomizer.rand( 1, 3 ); 
            if ( rn2 == 1 ) nNewItemID = 4010006; 
            else if ( rn2 == 2 ) nNewItemID = 4020007; 
            else if ( rn2 == 3 ) nNewItemID = 4020008; 
        } else if ( nNewItemSort == 6 ) {
            nNewItemNum = 4; 
            rn2 = Randomizer.rand( 1, 3 ); 
            if ( rn2 == 1 ) nNewItemID = 4004000; 
            else if ( rn2 == 2 ) nNewItemID = 4004001; 
            else if ( rn2 == 3 ) nNewItemID = 4004002; 
            else if ( rn2 == 4 ) nNewItemID = 4004003; 
        } else if ( nNewItemSort == 7 ) {
            rn2 = Randomizer.rand( 1, 4 ); 
            if ( rn2 == 1) {
                nNewItemNum = 30; 
                nNewItemID = 2000004; 
            } else if ( rn2 >= 2 && rn2 <= 4) {
                nNewItemNum = 100; 
                nNewItemID = 2022000;
            }	
        }
        else if ( nNewItemSort == 8 ) {
            nNewItemNum = 50; 
            rn2 = Randomizer.rand( 1, 4 ); 
            if ( rn2 == 1 ) nNewItemID = 2020012; 
            else if ( rn2 == 2 ) nNewItemID = 2020013; 
            else if ( rn2 == 3 ) nNewItemID = 2020014; 
            else if ( rn2 == 4 ) nNewItemID = 2020015; 
        }
        else if ( nNewItemSort == 9 ) {
            nNewItemNum = 15; 
            rn2 = Randomizer.rand( 1, 13 ); 
            if ( rn2 == 1 ) nNewItemID = 4010000; 
            else if ( rn2 == 2 ) nNewItemID = 4010001; 
            else if ( rn2 == 3 ) nNewItemID = 4010002; 
            else if ( rn2 == 4 ) nNewItemID = 4010003; 
            else if ( rn2 == 5 ) nNewItemID = 4010004; 
            else if ( rn2 == 6 ) nNewItemID = 4010005; 
            else if ( rn2 == 7 ) nNewItemID = 4020000; 
            else if ( rn2 == 8 ) nNewItemID = 4020001; 
            else if ( rn2 == 9 ) nNewItemID = 4020002; 
            else if ( rn2 == 10 ) nNewItemID = 4020003; 
            else if ( rn2 == 11 ) nNewItemID = 4020004; 
            else if ( rn2 == 12 ) nNewItemID = 4020005; 
            else if ( rn2 == 13 ) nNewItemID = 4020006; 
        }
        else if ( nNewItemSort == 10 ) {
            nNewItemNum = 100; 
            rn2 = Randomizer.rand( 1, 3 ); 
            if ( rn2 == 1 ) nNewItemID = 2001000; 
            else if ( rn2 == 2 ) nNewItemID = 2001002; 
            else if ( rn2 == 3 ) nNewItemID = 2001001; 
        }
        
        if (!cm.canHoldSlots(2)) {
            cm.sendOk("인벤토리 공간이 부족한거 아니냐해? 인벤토리 공간을 충분히 비운 후 다시 찾아오라해~")
            cm.dispose();
            return;
        }
        
        if (sel == 0) {
            if (cm.haveItem(4021005, 1) && cm.haveItem(4000010, 5)) {
                cm.gainItem(4021005, -1);
                cm.gainItem(4000010, -5);
            } else {
                cm.sendOk("재료는 제대로 갖고 있는거냐해?!");
                cm.dispose();
                return;
            }
        } else {
            if (cm.getMeso() >= 10000) {
                cm.gainMeso(-10000);
            } else {
                cm.sendOk("요금은 제대로 갖고 있는거냐해!");
                cm.dispose();
                return;
            }
        }
        cm.gainItem(4031017, -1);
        cm.gainItem(nNewItemID, nNewItemNum);
        cm.sendOk("어흠! 어떤가해! 또 필요한게 있으면 찾아오라해!");
        cm.dispose();
    }
}