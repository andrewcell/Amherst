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
 * NPCID : 2042002
 * ScriptName : mc_move
 * NPCNameFunc : 슈피겔만 - 몬스터 카니발
 * Location : 980000503 (몬스터 카니발 - 카니발 필드5<승리의 외침>)
 * Location : 980000504 (몬스터 카니발 - 카니발 필드5<패자의 오기>)
 * Location : 980000403 (몬스터 카니발 - 카니발 필드4<승리의 외침>)
 * Location : 980000404 (몬스터 카니발 - 카니발 필드4<패자의 오기>)
 * Location : 980000304 (몬스터 카니발 - 카니발 필드3<패자의 오기>)
 * Location : 980000303 (몬스터 카니발 - 카니발 필드3<승리의 외침>)
 * Location : 200000000 (스카이로드 - 오르비스)
 * Location : 220000000 (루디브리엄성 - 루디브리엄)
 * Location : 980000604 (몬스터 카니발 - 카니발 필드6<패자의 오기>)
 * Location : 980000603 (몬스터 카니발 - 카니발 필드6<승리의 외침>)
 * Location : 103000000 (빅토리아로드 - 커닝시티)
 * Location : 980000203 (몬스터 카니발 - 카니발 필드2<승리의 외침>)
 * Location : 980000204 (몬스터 카니발 - 카니발 필드2<패자의 오기>)
 * Location : 980000104 (몬스터 카니발 - 카니발 필드1<패자의 오기>)
 * Location : 980000103 (몬스터 카니발 - 카니발 필드1<승리의 외침>)
 * Location : 980000010 (몬스터 카니발 - 나가는 곳)
 * 
 * @author T-Sun
 *
 */

var status = -1;
var rank = "D";
var exp = 0;
var retm = 0;

function start() {
    var z = cm.getPlayer().getMapId();
    var exitmap = (java.lang.Math.floor(z / 10000000) == 98) && (z % 10 == 3 || z % 10 == 4);
    if ((cm.getCarnivalParty() != null) && exitmap) {
        status = 99;
    } else if (exitmap) {
	cm.warp(980000000, "st00" );
        cm.dispose();
        return;
    }
    action(1, 0, 0);
}

function exchangeItem(cm, itemid, quantity) {
    if (cm.haveItem(4001129, quantity) && cm.canHold(itemid)) {
        cm.gainItem(4001129,-quantity);
        cm.gainItem(itemid, 1, true);
        cm.dispose();
    } else {
        cm.sendOk("#b#t4001129##k이 부족하거나, 장비창에 빈 칸이 없는건 아닌가?");
        cm.dispose();
    }
}
 
function action(mode, type, selection) {
    if (status == 3 && menu == 2 && selection == 12 && mode == 1 && type == 4) {
        retm = 1;
        status = 2;
    } else if (mode == 1) {
        status++;
    } else {
        status--;
    }
    //    cm.playerMessage(6, mode+ " / "+type+ " / "+selection + " / " + status + " / " + retm);
    
    if (mode == -1) {
        cm.dispose();
        return;
    }
    if (status == 0) {
        if (cm.getPlayer().getMapId() == 980000010) 
		{
			cm.warp(980000000, "st00" );
			cm.dispose();
			return;
		}
        cm.sendSimple("무얼 하겠나? 만약 몬스터 카니발을 해본적이 없다면 꼭 설명을 듣고 하는게 좋지.\r\n#b#L0# 몬스터 카니발 필드로 이동한다.#l\r\n#L1# 몬스터 카니발에 대한 설명을 듣는다.#l\r\n#L2# 메이플 코인을 교환한다.#l");
    } else if (status == 1) {
        menu = selection;
        switch (selection) {
            case 0: {
                var level = cm.getPlayerStat("LVL");
                if ((level < 30 || level > 50) && !cm.getPlayer().isGM()) {
                    cm.sendOk("미안하지만 레벨 30 이상, 50 이하의 캐릭터만 몬스터 카니발을 즐길 수 있다네.");
                } else {
                    cm.saveLocation("MONSTERCARNIVAL");
                    cm.warp(980000000, "st00" );
                }
                cm.dispose();
                break;
            }
            case 1: {
                cm.sendOk("크크. 몬스터 카니발에 대해서 궁금한건가? 직접 해보는게 가장 최고라고 말할 수 있네. 직접 그 전율을 느껴보기 전에는 이것이 무엇인지 알 수 없지.");
                cm.dispose();
            }
            case 2: {
                n1 = 50; //목걸이
                n2 = 40; //목걸이 주문서
                n3 = 7; //35
                n4 = 10; //40
                n5 = 20; //50
                cm.sendSimple("교환하고 싶은 아이템을 선택하게나. \r\n#b#L0# #t1122007#(" + n1 + " 코인)#l\r\n#L1# #t2041211#(" + n2 + " 코인)#l\r\n#d#L2# 전사용 무기#l\r\n#L3# 마법사용 무기#l\r\n#L4# 궁수용 무기#l\r\n#L5# 돚거용 무기#l");
                break;
            }
            default: {
                cm.dispose();
                break;
            }
            break;
        }
    } 
    else if (status == 2) {
        if (menu == 1) {
        //cm.sendNext("하지만 직접 무기를 맞대기에는 너무 위험하지. 나는 평화주의자니까. 크크. 자네의 파티와 상대의 파티가 #b각자 몬스터를 소환하고, 상대가 소환하는 몬스터를 물리치는 것. 그것이 몬스터카니발이라네.k")
        }
        if (menu == 2) {
            if (selection == 0) {
                if (cm.haveItem(4001129, 50) && cm.canHold(1122007)) {
                    cm.gainItem(4001129,-50);
                    cm.gainItem(1122007, 1, true);
                    cm.dispose();
                } else {
                    cm.sendOk("#b#t4001129##k이 부족하거나, 장비창에 빈 칸이 없는건 아닌가?");
                    cm.dispose();
                }
            } else if (selection == 1) {
                if (cm.haveItem(4001129, 40) && cm.canHold(2041211)) {
                    cm.gainItem(4001129,-40);
                    cm.gainItem(2041211, 1);
                    cm.dispose();
                } else {
                    cm.sendOk("#b#t4001129##k이 부족하거나, 장비창에 빈 칸이 없는건 아닌가?");
                    cm.dispose();
                }
            } 
            else if (selection >= 2) {
                cm.sendOk("미안하지만 현재 메이플 코인으로 장비 아이템을 교환할 수는 없네.");
                cm.dispose();
                return;
            }
            
            else if (selection == 2 || retm == 1) {
                retm = 1;
                cm.sendSimple("교환하고 싶은 무기를 선택해보라구. 내가 주는 무기는 기본보다 좋은 경우가 많지. \r\n#b#L0# #z1302004#(" + n3 + " 코인)#l\r\n#L1# #z1402006#(" + n3 + " 코인)#l\r\n#L2# #z1302009#(" + n4 + " 코인)#l\r\n#L3# #z1402007#(" + n4 + " 코인)#l\r\n#L4# #z1302010#(" + n5 + " 코인)#l\r\n#L5# #z1402003#(" + n5 + " 코인)#l\r\n#L6# #z1312006#(" + n3 + " 코인)#l\r\n#L7# #z1412004#(" + n3 + " 코인)#l\r\n#L8# #z1312007#(" + n4 + " 코인)#l\r\n#L9# #z1412005#(" + n4 + " 코인)#l\r\n#L10# #z1312008#(" + n5 + " 코인)#l\r\n#L11# #z1412003#(" + n5 + " 코인)#l\r\n#L12# 다음 페이지로 이동(1/2)#l");
            } else if (selection == 3) {
                retm = 2;
                cm.sendSimple("교환하고 싶은 무기를 선택해보라구. 내가 주는 무기는 기본보다 좋은 경우가 많지. \r\n#b#L0# #z1372001#(" + n3 + " 코인)#l\r\n#L1# #z1382018#(" + n3 + " 코인)#l\r\n#L2# #z1372012#(" + n4 + "코인)#l\r\n#L3# #z1382019#(" + n4 + "코인)#l\r\n#L4# #z1382001#(" + n5 + " 코인)#l\r\n#L5# #z1372007#(" + n5 + " 코인)#l");
            } else if (selection == 4) {
                retm = 3;
                cm.sendSimple("교환하고 싶은 무기를 선택해보라구. 내가 주는 무기는 기본보다 좋은 경우가 많지. \r\n#b#L0# #z1452006#(" + n3 + " 코인)#l\r\n#L1# #z1452007#(" + n4 + " 코인)#l\r\n#L2# #z1452008#(" + n5 + " 코인)#l\r\n#L3# #z1462005#(" + n3 + " 코인)#l\r\n#L4# #z1462006#(" + n4 + " 코인)#l\r\n#L5# #z1462007#(" + n5 + " 코인)#l");
            } else if (selection == 5) {
                retm = 4;
                cm.sendSimple("교환하고 싶은 무기를 선택해보라구. 내가 주는 무기는 기본보다 좋은 경우가 많지. \r\n#b#L0# #z1472013#(" + n3 + " 코인)#l\r\n#L1# #z1472017#(" + n4 + "코인)#l\r\n#L2# #z1472021#(" + n5 + " 코인)#l\r\n#L3# #z1332014#(" + n3 + " 코인)#l\r\n#L4# #z1332031#(" + n4 + "코인)#l\r\n#L5# #z1332011#(" + n4 + "코인)#l\r\n#L6# #z1332016#(" + n5 + " 코인)#l\r\n#L7# #z1332003#(" + n5 + " 코인)#l");
            }
        }
        
        
    } else if (status == 3) {
        if (menu == 2) {
            if (retm == 1) {
                if (selection == 0) {
                    exchangeItem(cm, 1302004, n3);
                }
                else if (selection == 1) {
                    exchangeItem(cm, 1402006, n3);
                }
                else if (selection == 2) {
                    exchangeItem(cm, 1302009, n4);
                }
                else if (selection == 3) {
                    exchangeItem(cm, 1402007, n4);
                }
                else if (selection == 4) {
                    exchangeItem(cm, 1302010, n5);
                }
                else if (selection == 5) {
                    exchangeItem(cm, 1402003, n5);
                }
                else if (selection == 6) {
                    exchangeItem(cm, 1312006, n3);
                }
                else if (selection == 7) {
                    exchangeItem(cm, 1412004, n3);
                }
                else if (selection == 8) {
                    exchangeItem(cm, 1312007, n4);
                }
                else if (selection == 9) {
                    exchangeItem(cm, 1412005, n4);
                }
                else if (selection == 10) {
                    exchangeItem(cm, 1312008, n5);
                }
                else if (selection == 11) {
                    exchangeItem(cm, 1412003, n5);
                }
                else if (selection == 12) {
                    cm.sendSimple("교환하고 싶은 무기를 선택해보라구. 내가 주는 무기는 기본보다 좋은 경우가 많지. \r\n#b#L0# #z1322015#(" + n3 + " 코인)#l\r\n#L1# #z1422008#(" + n3 + " 코인)#l\r\n#L2# #z1322016#(" + n4 + "코인)#l\r\n#L3# #z1422007#(" + n4 + "코인)#l\r\n#L4# #z1322017#(" + n5 + " 코인)#l\r\n#L5# #z1422005#(" + n5 + " 코인)#l\r\n#L6# #z1432003#(" + n3 + " 코인)#l\r\n#L7# #z1442003#(" + n3 + " 코인)#l\r\n#L8# #z1432005#(" + n4 + "코인)#l\r\n#L9# #z1442009#(" + n4 + "코인)#l\r\n#L10# #z1442005#(" + n5 + " 코인)#l\r\n#L11# #z1432004#(" + n5 + " 코인)#l\r\n#L12# 이전 페이지로 이동(2/2)#l")
                }
            } else if (retm == 2) {
                if (selection == 0) {
                    exchangeItem(cm, 1372001, n3);
                }
                else if (selection == 1) {
                    exchangeItem(cm, 1382018, n3);
                }
                else if (selection == 2) {
                    exchangeItem(cm, 1372012, n4);
                }
                else if (selection == 3) {
                    exchangeItem(cm, 1382019, n4);
                }
                else if (selection == 4) {
                    exchangeItem(cm, 1382001, n5);
                }
                else if (selection == 5) {
                    exchangeItem(cm, 1372007, n5);
                }
                
            } else if (retm == 3) {
                if (selection == 0) {
                    exchangeItem(cm, 1452006, n3);
                }
                else if (selection == 1) {
                    exchangeItem(cm, 1452007, n4);
                }
                else if (selection == 2) {
                    exchangeItem(cm, 1452008, n5);
                }
                else if (selection == 3) {
                    exchangeItem(cm, 1462005, n3);
                }
                else if (selection == 4) {
                    exchangeItem(cm, 1452006, n4);
                }
                else if (selection == 5) {
                    exchangeItem(cm, 1452007, n5);
                }
            } else if (retm == 4) {
                if (selection == 0) {
                    exchangeItem(cm, 1472013, n3);
                }
                else if (selection == 1) {
                    exchangeItem(cm, 1472017, n4);
                }
                else if (selection == 2) {
                    exchangeItem(cm, 1472021, n5);
                }
                else if (selection == 3) {
                    exchangeItem(cm, 1332014, n3);
                }
                else if (selection == 4) {
                    exchangeItem(cm, 1332031, n4);
                }
                else if (selection == 5) {
                    exchangeItem(cm, 1332011, n4);
                }
                else if (selection == 6) {
                    exchangeItem(cm, 1332016, n5);
                }
                else if (selection == 7) {
                    exchangeItem(cm, 1332003, n5);
                }
            }
        }
        if (menu == 1) {
        //cm.sendNext("단, 어느정도 익숙해지면, #b단축키인 TAB키와 F1 ~ F12키를 활용#k해 보라구. #bTAB키는 소환수/스킬/수호물 각각의 창을 이동하는 단축키#k이고, #bF1~ F12는 각 창의 메뉴를 바로 선택하는 키#k라네.")
        }
    } else if (status == 4) {
        if (menu == 2) {
            if (retm == 1) {
                if (selection == 0) {
                    exchangeItem(cm, 1322015, n3);
                }
                else if (selection == 1) {
                    exchangeItem(cm, 1422008, n3);
                }
                else if (selection == 2) {
                    exchangeItem(cm, 1322016, n4);
                }
                else if (selection == 3) {
                    exchangeItem(cm, 1422007, n4);
                }
                else if (selection == 4) {
                    exchangeItem(cm, 1322017, n5);
                }
                else if (selection == 5) {
                    exchangeItem(cm, 1422005, n5);
                }
                else if (selection == 6) {
                    exchangeItem(cm, 1432003, n3);
                }
                else if (selection == 7) {
                    exchangeItem(cm, 1442003, n3);
                }
                else if (selection == 8) {
                    exchangeItem(cm, 1432005, n4);
                }
                else if (selection == 9) {
                    exchangeItem(cm, 1442009, n4);
                }
                else if (selection == 10) {
                    exchangeItem(cm, 1442005, n5);
                }
                else if (selection == 11) {
                    exchangeItem(cm, 1432004, n5);
                }
            }
        }
    }
    else if (status == 100) {
        var carnivalparty = cm.getCarnivalParty();
        cm.getPlayer().endPartyQuest(1301);
        if (carnivalparty.isWinner()) {
            if (carnivalparty.getTotalCP() >= 501) {
                rank = "A";
                exp = 30000;
            } else if (carnivalparty.getTotalCP() >= 251) {
                rank = "B";
                exp = 25500;
            } else if (carnivalparty.getTotalCP() >= 50) {
                rank = "C";
                exp = 21000;
            } else if (carnivalparty.getTotalCP() >= 0) {
                rank = "D";
                exp = 3000;
            }
            cm.sendOk("축하하네. 카니발에서 승리를 거두었군. 자네들의 활약은 잘 지켜보았다네. 다음 번에도 기대하겠네! \r\n#b랭크 : " + rank);
        } else {
            if (carnivalparty.getTotalCP() >= 501) {
                rank = "A";
                exp = 10000;
            } else if (carnivalparty.getTotalCP() >= 251) {
                rank = "B";
                exp = 8500;
            } else if (carnivalparty.getTotalCP() >= 50) {
                rank = "C";
                exp = 7000;
            } else if (carnivalparty.getTotalCP() >= 0) {
                rank = "D";
                exp = 1000;
            }
            cm.sendOk("아쉽게도 비기거나 지고 말았군. 승리를 위해 좀 더 노력해주게! \r\n#b랭크 : " + rank);
        }
    } else if (status == 101) {
        var carnivalparty = cm.getCarnivalParty();
        carnivalparty.removeMember(cm.getChar());
        cm.gainExpR(exp);
        cm.warp(980000000);
        cm.dispose();
    }

}