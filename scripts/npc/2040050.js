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
 * NPCID : 2040050
 * ScriptName : make_ston
 * NPCNameFunc : 떠돌이 연금술사
 * Location : 211000000 (엘나스산맥 - 엘나스)
 * Location : 105040300 (던전 - 슬리피우드)
 * Location : 240000000 (미나르숲 - 리프레)
 * Location : 220000000 (루디브리엄성 - 루디브리엄)
 * 
 * @author T-Sun
 *
 */

var status = 0;
var menu = "";
var set;
var makeitem;
var access = true;
var reqitem = new Array();
var cost = 4000;
var makeditem = new Array(4006000,4006001);
var reqset = new Array([[[4000046,20],[4000027,20],[4021001,1]],
    [[4000025,20],[4000049,20],[4021006,1]],
    [[4000129,15],[4000130,15],[4021002,1]],
    [[4000074,15],[4000057,15],[4021005,1]],
    [[4000054,7],[4000053,7],[4021003,1]]],
						
    [[[4000046,20],[4000027,20],[4011001,1]],
    [[4000014,20],[4000049,20],[4011003,1]],
    [[4000132,15],[4000128,15],[4011005,1]],
    [[4000074,15],[4000069,15],[4011002,1]],
    [[4000080,7],[4000079,7],[4011004,1]]]);

function start() {
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if(mode == 0 && (status ==1 || status == 2)) {
        cm.dispose();
        return;
    }
    if(mode == 0) {
        cm.sendNext("재료가 부족하신 모양이군요? 저는 당분간 이곳에 머물 예정이니 재료를 모으셨다면 언제든지 제게 찾아오세요.");
        cm.dispose();
        return;
    }
    if(mode == 1) {
        status++;
    }
    if(status == 0) {
        cm.sendNext("Alright, mix up the frog's tongue with the squirrel's tooth and ... oh yeah! Forgot to put in the sparkling white powder!! Man, that could have been really bad ... Whoa!! How long have you been standing there? I maaaay have been a little carried away with my work ... hehe.");
    } else if(status == 1) {
        cm.sendSimple("음.. 이걸 이렇게 섞고.. 저렇게 섞으면.. 안녕하세요? 저는 떠돌이 연금술사 입니다. 세상 최고의 연금술을 위해서 이곳 저곳을 여행하는 중이지요. 필요한 물건이라도 있으신가요?\r\n\r\n#L0##b마법의 돌 제작#k#l\r\n#L1##b소환의 돌 제작#k#l");
    } else if(status == 2) {
        set = selection;
        makeitem = makeditem[set];
        for(i=0; i < reqset[set].length; i++) {
            menu += "\r\n#L"+i+"##b#t"+reqset[set][i][0][0]+"#, #t"+reqset[set][i][1][0]+"##k#l";
        }
        cm.sendSimple("하하.. #b#t"+makeitem+"##k은 HP와 MP만 소모하는 스킬보다 훨씬 강력한 스킬을 사용할 수 있게 해주는.. 저만 만들 수 있는 특별한 아이템이죠. #t"+makeitem+"#를 만드려면 5가지 방법이 있습니다. 어떻게 만들어 보시겠어요?"+menu);
    } else if(status == 3) {
        set = reqset[set][selection];
        reqitem[0] = new Array(set[0][0],set[0][1]);
        reqitem[1] = new Array(set[1][0],set[1][1]);
        reqitem[2] = new Array(set[2][0],set[2][1]);
        menu = "";
        for(i=0; i < reqitem.length; i++) {
            menu += "\r\n#v"+reqitem[i][0]+"# #b"+reqitem[i][1]+" #t"+reqitem[i][0]+"##k";
        }
        menu += "\r\n#i4031138# #b"+cost+" 메소#k";
        cm.sendYesNo("#b5개의 #t"+makeitem+"##k을 만드려면, 다음과 같은 재료가 필요합니다. 사냥을 통해서도 구할 수 있고, 다른 플레이어에게서도 구할 수 있습니다. 정말 만들어 보시겠어요?\r\n"+menu);
    } else if(status == 4) {
        for(i=0; i < reqitem.length; i++) {
            if(!cm.haveItem(reqitem[i][0],reqitem[i][1]))
                access = false;
        }
        if(access == false || !cm.canHold(makeitem) || cm.getMeso() < cost) {
            cm.sendNext("아이템은 분명 잘 가지고 계신건지, 또는 인벤토리에 빈 공간이 있는지 확인해 주세요.");
        } else {
            cm.sendOk("여기, #b#t"+makeitem+"##k 5개가 있습니다. 제 도움이 더 필요하시면 언제든지 찾아와 주세요!");
            cm.gainItem(reqitem[0][0],-reqitem[0][1]);
            cm.gainItem(reqitem[1][0],-reqitem[1][1]);
            cm.gainItem(reqitem[2][0],-reqitem[2][1]);
            cm.gainMeso(-cost);
            cm.gainItem(makeitem,5);
        }
        cm.dispose();
    }
}