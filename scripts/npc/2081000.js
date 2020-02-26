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
 * NPCID : 2081000
 * ScriptName : job4_item
 * NPCNameFunc : 촌장 타타모
 * Location : 240000000 (미나르숲 - 리프레)
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
        cm.sendSimple("내가 도울 일이라도 있는가?\r\n#b#L0# 마법의 씨앗을 구매합니다.#l\r\n#L1# 리프레를 위해서 무언가 하고 싶습니다.#l");
    } else if (status == 1) {
        menu = selection;
        qr = cm.getQuestRecord(7810);
        if (qr.getCustomData() == null) {
            qr.setCustomData("000000");
        }
        feellike = parseInt(qr.getCustomData());
//        cm.playerMessage("호감도 : " + feellike);
        if (menu == 0) {
            var prompt = "";
            if (feellike < 5000) {
                prompt = "자네는 아직 우리 마을에 온지 얼마 되지 않았나 보군. 무엇을 도와 주면 좋겠는가?";
                price = 30000;
            } else if (feellike < 24000) {
                prompt = "우리 만난적 있는가..? 낯이 많이 익군. 허허.. 무엇을 도와 주면 좋겠는가?";
                price = 27000;
            } else if (feellike < 50000) {
                prompt = "날씨가 참 좋구먼~ 이렇게 좋은 날씨에는 가족과 소풍을 다녀 오는건 어떻겠는가? 흠. 내가 자네를 처음 만났을때가 생각나는군. 그땐 몰랐지만, 이렇게 우리 마을을 위해 힘써주고.. 고마운 젊은이가 될 줄 누가 알았겠는가. 허허..\r\n무엇을 도와 주면 좋겠는가?";
                price = 24000;
            } else if (feellike < 200000) {
                prompt = "무엇을 도와주면 좋겠는가?";
                price = 18000;
            } else if (feellike < 800000) {
                prompt = "무엇을 도와 주면 좋겠는가?";
                price = 12000;
            } else {
                prompt = "";
                price = 8000;
            }
            
            prompt += "\r\n#b#L0# 마법의 씨앗을 구매하고 싶습니다.#l";
            cm.sendSimple(prompt);
        } else if (menu == 1) {
            var prompt = "마을에 기부해 줄 물건이라도 있는가?";
            prompt += "\r\n#b#L0# #t4000226##l\r\n#L1# #t4000229##l\r\n#L2# #t4000236##l\r\n#L3# #t4000237##l\r\n#L4# #t4000260##l\r\n#L5# #t4000261##l\r\n#L6# #t4000231##l\r\n#L7# #t4000238##l\r\n#L8# #t4000239##l\r\n#L9# #t4000241##l\r\n#L10# #t4000242##l\r\n#L11# #t4000234##l\r\n#L12# #t4000232##l\r\n#L13# #t4000233##l\r\n#L14# #t4000235#\r\n#L15# #t4000243##l\r\n";
            cm.sendSimple(prompt);    
        }
    } else if (status == 2) {
        if (menu == 0) {
            cm.sendGetNumber("흐음. 마법의 씨앗을 구매하고 싶단건가? 귀한 물건이기 때문에 많이 줄 수 없다네. 가격은 개당 #b"+price+" 메소#k 일세. 몇개 구매하고 싶은가?", 1, 1, 100);
        } else if (menu == 1) {
            var v0 = selection;
            if ( v0 == 0 ) {
                minar_feellike( 4000226, 2 );//래쉬
            } else if( v0 == 1 ) {
                minar_feellike( 4000229, 4 );//다크래쉬
            } else if( v0 == 2 ) {
                minar_feellike( 4000236, 3 );//비틀
            } else if( v0 == 3 ) {
                minar_feellike( 4000237, 6 );//듀얼비틀
            } else if( v0 == 4 ) {
                minar_feellike( 4000260, 3 );//호브
            } else if( v0 == 5 ) {
                minar_feellike( 4000261, 6 );//핀호브
            } else if( v0 == 6 ) {
                minar_feellike( 4000231, 7 );//헹키
            } else if( v0 == 7 ) {
                minar_feellike( 4000238, 9 );//하프
            } else if( v0 == 8 ) {
                minar_feellike( 4000239, 12 );//블러드 하프
            } else if( v0 == 9 ) {
                minar_feellike( 4000241, 15 );//Birk
            } else if( v0 == 10 ) {
                minar_feellike( 4000242, 20 );//듀얼 Birk
            } else if( v0 == 11 ) {
                minar_feellike( 4000234, 20 );//켄타 뼈
            } else if( v0 == 12 ) {
                minar_feellike( 4000232, 20 );//켄타불꽃
            } else if( v0 == 13 ) {
                minar_feellike( 4000233, 20 );//켄타정수
            } else if( v0 == 14 ) {
                minar_feellike( 4000235, 100 );//마뇽
            } else if( v0 == 15 ) {
                minar_feellike( 4000243, 100 );//그리프 뿔
            } 
        }
    } else if (status == 3) {
        if (menu == 0) {
            quantity = selection;
            if (quantity == 0) {
                cm.dispose();
                return;
            }
            cm.sendYesNo("흐음. 그렇다면 #b#t4031346##k을 " + quantity + "개 구매하고 싶은 것인가? 총 가격은 " + price * quantity + " 메소라네. 정말 구매하겠는가?");
        } else if (menu == 1) {
            quantity = selection;
            cm.sendYesNo("오오. 그렇다면 #b#t" + donateItem + "##k 아이템을 " + selection + " 개 기부하고 싶다 이건가?");
        }
    } else if (status == 4) {
        if (menu == 0) {
            if (selection == 0) {
                cm.sendOk("알았네. 구매할 마음이 생기면 다시 찾아오게나.");
                cm.dispose();
            } else {
                if (cm.getMeso() >= price * quantity && cm.canHold(4031346, quantity)) {
                    cm.gainMeso(-price * quantity);
                    cm.gainItem(4031346, quantity);
                    cm.sendOk("좋은곳에 사용하기를 바라네.")
                    cm.dispose();
                } else {
                    cm.sendOk("메소는 충분히 갖고 있는지, 또는 인벤토리 공간이 부족한건 아닌지 다시 한번 확인해 해보게. 총 가격은 #b" + price * quantity + "#k 메소라네.");
                    cm.dispose();
                }
            }
        } else if (menu == 1) {
            if (selection == 0) {
                cm.sendOk("흐음. 생각 해 보고 결정해 주게나.");
                cm.dispose();
                return;
            }
            if (cm.haveItem(donateItem, quantity)) {
                cm.gainItem(donateItem, -quantity);
                feellike += (donateLike * quantity);
                if (feellike > 800000) {
                    feellike = 800000;
                }
                qr.setCustomData(feellike);
                cm.sendOk("마을을 위해 물건을 기부해 주어서 정말 고맙네!");
                cm.dispose();
            } else {
                feellike -= 10;
                if (feellike < 100) {
                    feellike = 100;
                }
                qr.setCustomData(feellike);
                cm.sendOk("자네.. 기부해 줄 물건은 제대로 갖고 있는건가?");
                cm.dispose();
            }
        }
    }
}

function minar_feellike(itemid, like) {
    cm.sendGetNumber("#b#t"+itemid+"##k 아이템을 마을에 기부하고 싶다 이건가..? 몇개나 기부하고 싶은가?", 1, 1, 1000);
    donateItem = itemid;
    donateLike = like;
}