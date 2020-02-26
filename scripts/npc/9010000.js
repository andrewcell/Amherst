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
 * NPCID : 9010000
 * ScriptName : 4th_mapleWeapon
 * NPCNameFunc : 메이플 운영자
 * Location : 211000000 (엘나스산맥 - 엘나스)
 * Location : 251000000 (무릉도원 - 백초마을)
 * Location : 230000001 (아쿠아리움 - 중앙 홀)
 * Location : 240000000 (미나르숲 - 리프레)
 * Location : 260000000 (버닝로드 - 아리안트)
 * Location : 104000000 (빅토리아로드 - 리스항구)
 * Location : 60000 (메이플로드 - 사우스페리)
 * Location : 200000000 (스카이로드 - 오르비스)
 * Location : 250000000 (무릉도원 - 무릉)
 * Location : 220000000 (루디브리엄성 - 루디브리엄)
 * Location : 100000000 (빅토리아로드 - 헤네시스)
 * 
 * @author T-Sun
 *
 */

var status = -1;
function action(mode, type, selection) {
    if (mode == 1 && type != 1) {
        status++;
    } else {
        if (type == 1 && mode == 1) {
            status++;
            selection = 1;
        } else if (type == 1 && mode == 0) {
            status++;
            selection = 0;
        } else {
            cm.dispose();
            return;
        }
    }
    
    
    if (status == 0) {
        cm.sendSimple("안녕하세요~ 믿어지세요? #e#r메이플스토리#k#n가 벌써 #e#r4주년#k#n이 되었어요. 4년 동안 변함없는 사랑을 보내 주신 모험가 여러분을 위해서 특별히 제작한 4주년 무기를 나누어 드리고 있습니다.\r\n#b#L0#4주년 무기를 얻고 싶어요#l\r\n#L1#메이플 모자를 얻고 싶어요.#l\r\n#L2#4주년 메이플 실드를 얻고 싶어요.#l\r\n#L3#메이플 이어링을 얻고 싶어요.#l\r\n#L4#4주년 전용 주문서를 얻고 싶어요.#l#k");
    } else if (status == 1) {
        rat = selection;
        if (rat == 0) {
            cm.sendSimple("4주년 무기를 얻기 위해서는 #b메이플 무기#k와 #b단풍잎#k이 필요하답니다. 어떤 무기를 가져오셨나요?\r\n#L0##v4001126# #b2000 개#k + #v1302020##l\r\n#L1##v4001126# #b2000 개#k + #v1382009##l\r\n#L2##v4001126# #b2000 개#k + #v1452016##l\r\n#L3##v4001126# #b2000 개#k + #v1462014##l\r\n#L4##v4001126# #b2000 개#k + #v1472030##l\r\n#L5##v4001126# #b1500 개#k + #v1302030##l\r\n#L6##v4001126# #b1500 개#k + #v1332025##l\r\n#L7##v4001126# #b1500 개#k + #v1382012##l\r\n#L8##v4001126# #b1500 개#k + #v1412011##l\r\n#L9##v4001126# #b1500 개#k + #v1422014##l\r\n#L10##v4001126# #b1500 개#k + #v1432012##l\r\n#L11##v4001126# #b1500 개#k + #v1442024##l\r\n#L12##v4001126# #b1500 개#k + #v1452022##l\r\n#L13##v4001126# #b1500 개#k + #v1462019##l\r\n#L14##v4001126# #b1500 개#k + #v1472032##l");
        } else if (rat == 1) {
            cm.sendSimple("어떤 모자를 원하시나요? 원하는 메이플 모자를 선택하세요.\r\n#L0##b#v1002508:# #t1002508# 얻기#l\r\n#L1##v1002509:# 1차 업그레이드 하기#l\r\n#L2##v1002510:# 2차 업그레이드 하기#l\r\n#L3##v1002511:# 3차 업그레이드 하기#l");
        } else if (rat == 2) {
            cm.sendSimple("메이플 실드와 단풍잎만 있다면 #b4주년 메이플 실드#k로 교환하실 수 있답니다. 어떤 방패로 교환하시겠어요?\r\n#L0##v4001126# #b1000 개#k + #v1092030# = #v1092045:##l\r\n#L1##v4001126# #b1000 개#k + #v1092030# = #v1092046:##l\r\n#L2##v4001126# #b1000 개#k + #v1092030# = #v1092047:##l");
        } else if (rat == 3) {
            cm.sendOk("메이플 이어링이라... 그건 리스항구의 #b쿤#k에게 가보는 것이 좋겠군요.")
            cm.dispose();
        } else if (rat == 4) {
            scrolls = [2040315,2040912,2043013,2043108,2043208,2043308,2043708,2043808,2044008,2044108,2044208,2044308,2044408,2044508,2044608,2044708];
            var str = "#b#t4001126# 1000 장#k만 있다면 4주년 무기에 사용할 수 있는 전용 주문서를 얻을 수 있답니다. 목록에서 원하는 주문서를 선택해보세요.\r\n";
            for (var i = 0; i < scrolls.length; ++i) {
                str += "#L" + i + "# #t"+scrolls[i]+"##l\r\n";
            }
            cm.sendSimple(str);
        }
    } else if (status == 2) {
        v1 = selection;
        if (rat == 0) {
            if (v1 == 0) {
                cm.sendSimple("교환하실 무기를 선택해 주세요.\r\n#L0##v4001126# #b2000 개#k + #v1302020# = #v1302064:##l\r\n#L1##v4001126# #b2000 개#k + #v1302020# = #v1402039:##l");
            } else if (v1 == 1) {
                cm.sendSimple("교환하실 무기를 선택해 주세요.\r\n#L0##v4001126# #b2000 개#k + #v1382009# = #v1372034:##l\r\n#L1##v4001126# #b2000 개#k + #v1382009# = #v1382039:##l");
            } else if (v1 == 2) {
                cm.sendSimple("교환하실 무기를 선택해 주세요.\r\n#L0##v4001126# #b2000 개#k + #v1452016# = #v1452045:##l");
            } else if (v1 == 3) {
                cm.sendSimple("교환하실 무기를 선택해 주세요.\r\n#L0##v4001126# #b2000 개#k + #v1462014# = #v1462040:##l");
            } else if (v1 == 4) {
                cm.sendSimple("교환하실 무기를 선택해 주세요.\r\n#L0##v4001126# #b2000 개#k + #v1472030# = #v1472055:##l");
            } else if (v1 == 5) {
                cm.sendSimple("교환하실 무기를 선택해 주세요.\r\n#L0##v4001126# #b1500 개#k + #v1302030# = #v1302064:##l\r\n#L1##v4001126# #b1500 개#k + #v1302030# = #v1402039:##l");
            } else if (v1 == 6) {
                cm.sendSimple("교환하실 무기를 선택해 주세요.\r\n#L0##v4001126# #b1500 개#k + #v1332025# = #v1332055:##l\r\n#L1##v4001126# #b1500 개#k + #v1332025# = #v1332056:##l");
            } else if (v1 == 7) {
                cm.sendSimple("교환하실 무기를 선택해 주세요.\r\n#L0##v4001126# #b1500 개#k + #v1382012# = #v1372034:##l\r\n#L1##v4001126# #b1500 개#k + #v1382012# = #v1382039:##l");
            } else if (v1 == 8) {
                cm.sendSimple("교환하실 무기를 선택해 주세요.\r\n#L0##v4001126# #b1500 개#k + #v1412011# = #v1412027:##l\r\n#L1##v4001126# #b1500 개#k + #v1412011# = #v1312032:##l");
            } else if (v1 == 9) {
                cm.sendSimple("교환하실 무기를 선택해 주세요.\r\n#L0##v4001126# #b1500 개#k + #v1422014# = #v1422029:##l\r\n#L1##v4001126# #b1500 개#k + #v1422014# = #v1322054:##l");
            } else if (v1 == 10) {
                cm.sendSimple("교환하실 무기를 선택해 주세요.\r\n#L0##v4001126# #b1500 개#k + #v1432012# = #v1432040:##l");
            } else if (v1 == 11) {
                cm.sendSimple("교환하실 무기를 선택해 주세요.\r\n#L0##v4001126# #b1500 개#k + #v1442024# = #v1442051:##l");
            } else if (v1 == 12) {
                cm.sendSimple("교환하실 무기를 선택해 주세요.\r\n#L0##v4001126# #b1500 개#k + #v1452022# = #v1452045:##l");
            } else if (v1 == 13) {
                cm.sendSimple("교환하실 무기를 선택해 주세요.\r\n#L0##v4001126# #b1500 개#k + #v1462019# = #v1462040:##l");
            } else if (v1 == 14) {
                cm.sendSimple("교환하실 무기를 선택해 주세요.\r\n#L0##v4001126# #b1500 개#k + #v1472032# = #v1472055:##l");
            }
        } else if (rat == 1) {
            if (v1 == 0) {
                cm.sendYesNo("#t1002508#을 얻기 위해서는 다음과 같은 재료가 필요합니다. 아참! 주의사항이 있어요. 모자의 능력치는 랜덤하게 결정된답니다. 교환하시겠어요?\r\n\r\n#v4001126# 100 개");
            } else if (v1 == 1) {
                cm.sendYesNo("#t1002509#을 얻기 위해서는 다음과 같은 재료가 필요합니다. 아참! 주의사항이 있어요. 모자의 능력치는 랜덤하게 결정된답니다. 교환하시겠어요?\r\n\r\n#v4001126# 200 개 + #v1002508#");
            } else if (v1 == 2) {
                cm.sendYesNo("#t1002510#을 얻기 위해서는 다음과 같은 재료가 필요합니다. 아참! 주의사항이 있어요. 모자의 능력치는 랜덤하게 결정된답니다. 교환하시겠어요?\r\n\r\n#v4001126# 300 개 + #v1002509#");
            } else if (v1 == 3) {
                cm.sendYesNo("#t1002511#을 얻기 위해서는 다음과 같은 재료가 필요합니다. 아참! 주의사항이 있어요. 모자의 능력치는 랜덤하게 결정된답니다. 교환하시겠어요?\r\n\r\n#v4001126# 400 개 + #v1002510#");
            }
        } else if (rat == 2) {
            cm.sendYesNo("아참! 주의사항이 있어요. 방패의 능력치는 랜덤하게 결정된답니다.  그리고 만약 교환하실 방패를 2개 이상 가지고 계시다면 인벤토리 가장 앞쪽에 있는 방패가 교환된다는 것도 알아 두시길 바래요.정말 교환하시겠어요?");
        } else if (rat == 4) {
            cm.sendYesNo("#t4001126# 1000 장을 #b#t"+scrolls[v1]+"##k로 바꾸시겠어요?");
        }
    } else if (status == 3) {
        v2 = selection;
        if (rat == 0) {
            cm.sendYesNo("아참! 주의사항이 있어요. 무기의 능력치는 랜덤하게 결정된답니다. 그리고 만약 교환하실 무기를 2개 이상 가지고 계시다면 인벤토리 가장 앞쪽에 있는 무기가 교환된다는 것도 알아 두시길 바래요. 정말 교환하시겠어요?");
        } else if (rat == 1) {
            if (selection == 0) {
                cm.sendOk("마음이 바뀌셨나요? 천천히 잘 생각해 보시고 결정하셔도 괜찮습니다.");
                cm.dispose();
            } else {
                if (cm.haveItem(1002508, 1, true, true) || cm.haveItem(1002509, 1, true, true) || cm.haveItem(1002510, 1, true, true) || cm.haveItem(1002511, 1, true, true)) {
                    cm.sendOk("이미 메이플 모자를 가지고 계시군요? 메이플 모자는 2개 이상 소유할 수 없답니다.");
                    cm.dispose();
                }
                if (v1 == 0) {
                    if (cm.haveItem(4001126, 100) && cm.canHold(1002508)) {
                        cm.gainItem(4001126, -100);
                        cm.gainItem(1002508, 1, true);
                        cm.sendOk("즐거운 하루 되세요~");
                        cm.dispose();
                    } else {
                        cm.sendOk("재료가 부족한 것은 아닌지, 인벤토리 공간이 부족한 건 아닌지 확인해 주세요. 재료를 장비하고 있을 경우 장비를 해제하여 주시기 바랍니다.");
                        cm.dispose();
                    }
                } else if (v1 == 1) {
                    checkExchange(cm, 1, 1002508, 200, 1002509);
                } else if (v1 == 2) {
                    checkExchange(cm, 1, 1002509, 300, 1002510);
                } else if (v1 == 3) {
                    checkExchange(cm, 1, 1002510, 400, 1002511);
                }
            }
        } else if (rat == 2) {
            if (v1 == 0) {
                checkExchange(cm, selection, 1092030, 1000, 1092045);
            } else if (v1 == 1) {
                checkExchange(cm, selection, 1092030, 1000, 1092046);
            } else if (v1 == 2) {
                checkExchange(cm, selection, 1092030, 1000, 1092047);
            }
        } else if (rat == 4) {
            checkExchange(cm, selection, -1, 1000, scrolls[v1]);
        }
    } else if (status == 4) {
        if (rat == 0) {
            if (v1 == 0) {
                if (v2 == 0) {
                    checkExchange(cm, selection, 1302020, 2000, 1302064);
                } else if (v2 == 1) {
                    checkExchange(cm, selection, 1302020, 2000, 1402039);
                }
            } else if (v1 == 1) {
                if (v2 == 0) {
                    checkExchange(cm, selection, 1382009, 2000, 1372034);
                } else if (v2 == 1) {
                    checkExchange(cm, selection, 1382009, 2000, 1382039);
                }
            } else if (v1 == 2) {
                if (v2 == 0) {
                    checkExchange(cm, selection, 1452016, 2000, 1452045);
                }
            } else if (v1 == 3) {
                if (v2 == 0) {
                    checkExchange(cm, selection, 1462014, 2000, 1462040);
                }
            } else if (v1 == 4) {
                if (v2 == 0) {
                    checkExchange(cm, selection, 1472030, 2000, 1472055);
                }
            } else if (v1 == 5) {
                if (v2 == 0) {
                    checkExchange(cm, selection, 1302030, 1500, 1302064);
                } else if (v2 == 1) {
                    checkExchange(cm, selection, 1302030, 1500, 1402039);
                }
            } else if (v1 == 6) {
                if (v2 == 0) {
                    checkExchange(cm, selection, 1332025, 1500, 1332055);
                } else if (v2 == 1) {
                    checkExchange(cm, selection, 1332025, 1500, 1332056);
                }
            } else if (v1 == 7) {
                if (v2 == 0) {
                    checkExchange(cm, selection, 1382012, 1500, 1372034);
                } else if (v2 == 1) {
                    checkExchange(cm, selection, 1382012, 1500, 1382039);
                }
            } else if (v1 == 8) {
                if (v2 == 0) {
                    checkExchange(cm, selection, 1412011, 1500, 1412027);
                } else if (v2 == 1) {
                    checkExchange(cm, selection, 1412011, 1500, 1312032);
                }
            } else if (v1 == 9) {
                if (v2 == 0) {
                    checkExchange(cm, selection, 1422014, 1500, 1422029);
                } else if (v2 == 1) {
                    checkExchange(cm, selection, 1422014, 1500, 1322054);
                }
            } else if (v1 == 10) {
                if (v2 == 0) {
                    checkExchange(cm, selection, 1432012, 1500, 1432040);
                }
            } else if (v1 == 11) {
                if (v2 == 0) {
                    checkExchange(cm, selection, 1442024, 1500, 1442051);
                }
            } else if (v1 == 12) {
                if (v2 == 0) {
                    checkExchange(cm, selection, 1452022, 1500, 1452045);
                }
            } else if (v1 == 13) {
                if (v2 == 0) {
                    checkExchange(cm, selection, 1462019, 1500, 1462040);
                }
            } else if (v1 == 14) {
                if (v2 == 0) {
                    checkExchange(cm, selection, 1472032, 1500, 1472055);
                }
            }
        }
    }
}

function checkExchange(cm, selection, mat1, mat2qty, item) {
    if (selection == 0) {
        cm.sendOk("마음이 바뀌셨나요? 천천히 잘 생각해 보시고 결정하셔도 괜찮습니다.")
        cm.dispose();
    } else {
        var d = mat1 > 0 ? cm.haveItem(mat1) : true;
        if (d && cm.haveItem(4001126, mat2qty) && cm.canHold(item)) {
            if (mat1 > 0) {
                cm.gainItem(mat1, -1);
            }
            cm.gainItem(4001126, -mat2qty);
            cm.gainItem(item, 1, true);
            cm.sendOk("즐거운 하루 되세요~");
            cm.dispose();
        } else {
            cm.sendOk("재료가 부족한 것은 아닌지, 인벤토리 공간이 부족한 건 아닌지 확인해 주세요. 재료를 장비하고 있을 경우 장비를 해제하여 주시기 바랍니다.");
            cm.dispose();
        }
    }
}