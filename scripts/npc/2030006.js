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
 * NPCID : 2030006
 * ScriptName : holyStone
 * NPCNameFunc : 성스러운 돌
 * Location : 211040401 (폐광 - 설원의성지)
 * 
 * @author T-Sun
 *
 */

var status = -1;
var qChars = new Array ("다음 중 레벨1에서 2로 갈때 필요한 경험치량은 얼마인가..?#10#12#15#20#3",
    "다음 중 1차전직에 필요한 조건이 아닌것은..? #전사 힘 35#도적 럭 20#마법사 인트 20#궁수 덱스 25#2",
    "다음 중 상태이상과 약화 효과가 올바르게 짝지어 지지 않은것은..? #허약 - 이동속도가 느려짐#봉인 - 스킬을 사용할수 없게됨#암흑 - 적중률 하향#저주 - 획득 경험치량이 줄어듬#1",
    "다음 중 몬스터를 공격할때 틀린것은..?#얼음 - 불 속성 몬스터에게 강한 데미지#불 - 얼음 속성 몬스터에게 강한 데미지#성(聖) - 언데드 속성 몬스터에게 강한 데미지#독 - 보스 몬스터에게 강한 데미지#4",
    "다음 중 적중률에 가장 많이 의존하는 직업은..?#전사#궁수#마법사#도적#2");
var qItems = new Array( "다음 중 몬스터가 드롭하는 아이템으로 틀린것은..?#레이스 - 식탁보#스티지 - 스티지의 날개#슬라임 - 물컹물컹한 액체#돼지 - 리본#1",
    "다음 중 몬스터가 드롭하는 아이템으로 틀린것은..?#리본돼지 - 돼지의 리본#슬라임 - 슬라임의 방울#달팽이 - 달팽이의 껍질#엑스텀프 - 나뭇가지#4",
    "다음 중 포션의 효과로 알맞은것은..?#하얀포션 - HP 250 회복#마나엘릭서 - MP 400 회복#빨간포션 - HP 100 회복#피자 - HP 400 회복#4",
    "다음 중 HP와 MP를 50% 회복하는 아이템은..?#엘릭서#파워엘릭서#새벽의 이슬#맑은 물#1", 
    "다음 중 포션의효과로 틀린것은..?#파란포션 - MP 100 회복#마나엘릭서 - MP 300 회복#새벽의 이슬 - MP 3000 회복#빨간포션 - HP 50 회복#3");
var qMobs = new Array(  "다음 중 가장 레벨이 높은 몬스터는..?#초록 버섯#스텀프#버블링#엑스텀프#4",
    "다음 중 메이플 아일랜드에서 볼 수 없는 몬스터는..?#아이스 센티넬#달팽이#파란달팽이#주황버섯#1",
    "다음 중 엘리니아에서 오르비스로 이동하는 배에서 볼 수 있는 몬스터는?#주니어 발록#크림슨 발록#머쉬맘#웨어울프#2",
    "다음 중 빅토리아아일랜드에서 볼수없는 몬스터는..?#헥터#슬라임#다크 엑스텀프#아이언 호그#1",
    "다음 중 엘나스에서 볼 수 없는 몬스터는..?#헥터#예티#리티#리게이터#4", 					 
    "다음 중 비행하는 몬스터는?#맬러디#초록 버섯#화이트팽#페페#1",
    "다음 중 오시리아 대륙에서 볼 수 없는 몬스터는..?#주니어 라이오너#주니어 그류핀#스타픽시#리게이터#4",
    "다음 중 메이플 아일랜드에서 볼 수 없는 몬스터는..?#슬라임#파이어보어#돼지#스텀프#2");
var qQuests = new Array("다음 중 스텀프 50마리를 잡는 퀘스트는..?#스텀프가 무서워요#피오의 수집#존의 꽃 바구니#연금술사 제인#1",
    "다음 중 반복수행이 가능한 퀘스트는..?#메이플 고서를 찾아서#심심해요#밍밍부인의 고민#아르웬의 유리구두#4",
    "다음 중 2차전직이 아닌것은..?#메이지#파이터#사수#어쌔신#1",
    "다음 중 알을 모아오는 퀘스트를 주는 NPC는..?#로웬#네미#알케스터#아르웬#2",
    "다음 중 인기도를 주는 퀘스트를 가진 NPC는..?#슈미#로웬#알케스터#아르웬#1");
var qTowns = new Array( "다음 중 '하인즈'가 있는 마을은 어디인가..?#헤네시스#페리온#커닝시티#엘리니아#4",
    "다음 중 '알케스터'가 있는 마을은 어디인가..?#오르비스#슬리피우드#엘나스#루디브리엄#3",
    "다음 중 '엘나스'에서 신발을 만드는 NPC는 누구인가..?#고든#알케스터#스카두르#메이플 운영자#1",
    "다음 중 헤네시스에서 화살을 만드는 NPC는 누구인가..?#장로스탄#밍밍부인#비셔스#리나#3",
    "다음 중 '장난감공장'은 어느대륙에 있는가..?#무릉#빅토리아 아일랜드#리프레#루디브리엄#4",
    "다음 중 '네미'는 어떤 마을에 위치해있는가..?#루디브리엄#페리온#오르비스#아쿠아리움#1");

var correctAnswer = 0;

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
        q = cm.getQuestRecord(195000);
        val = q.getCustomData();
		if (val == null)
		{
			cm.sendOk("......");
			cm.dispose();
			return;
		}
        if (cm.haveItem(4031058) || !val.startsWith("job3_trial2")) {
            if (cm.haveItem(4031058)) cm.sendOk("......");
            if (!val.startsWith("job3_trial2")) cm.sendOk("......")
            cm.dispose();
        } else {
            cm.sendNext("... ... ...\r\n지혜를 시험받고 싶다면 #b어둠의 크리스탈#k을 바쳐라...\r\n어둠의 크리스탈을 바치고 물음에 답할 준비가 되었는가...");
        }
    } else if (status == 1)
        cm.sendNext("좋다... 지금부터 너의 지혜를 시험하겠다... 모든 질문에 올바른 답을 말한다면 시험에 통과할 수 있을 것이다... 하지만 도중에 하나라도 거짓을 이야기 한다면 처음부터 다시 도전 해야만 한다... 그럼 시작이다...");
    else if (status == 2) {
        if (!cm.haveItem(4005004)) {
            cm.sendOk("...어둠의 크리스탈을 바쳐야만 한다..");
            cm.dispose();
        } else {
            cm.gainItem(4005004, -1);
            cm.sendSimple("첫번째 문제이다. \r\n\r\n" + getQuestion(qChars[Math.floor(Math.random() * qChars.length)]));
            status = 2;
        }
    } else if (status == 3) {
        if (selection == correctAnswer)
            cm.sendOk("... 진실이다. 다음 너의 대답을 기다리도록 하지.");
        else {
            cm.sendOk("...거짓을 말했다. 넌 시험을 통과하지 못했다.. 시험을 다시 보고 싶다면 어둠의 크리스탈을 다시 바쳐라.");
            cm.dispose();
        }
    } else if (status == 4)
        cm.sendSimple("두번째 문제이다. \r\n\r\n" + getQuestion(qItems[Math.floor(Math.random() * qItems.length)]));
    else if (status == 5) {
        if (selection == correctAnswer)
            cm.sendOk("... 진실이다. 다음 너의 대답을 기다리도록 하지.");
        else {
            cm.sendOk("...거짓을 말했다. 넌 시험을 통과하지 못했다.. 시험을 다시 보고 싶다면 어둠의 크리스탈을 다시 바쳐라.");
            cm.dispose();
        }
    } else if (status == 6) {
        cm.sendSimple("세번째 문제이다. \r\n\r\n" + getQuestion(qMobs[Math.floor(Math.random() * qMobs.length)]));
        status = 6;
    } else if (status == 7) {
        if (selection == correctAnswer)
            cm.sendOk("... 진실이다. 다음 너의 대답을 기다리도록 하지.");
        else {
            cm.sendOk("...거짓을 말했다. 넌 시험을 통과하지 못했다.. 시험을 다시 보고 싶다면 어둠의 크리스탈을 다시 바쳐라.");
            cm.dispose();
        }
    } else if (status == 8)
        cm.sendSimple("네번째 문제이다. \r\n\r\n" + getQuestion(qQuests[Math.floor(Math.random() * qQuests.length)]));
    else if (status == 9) {
        if (selection == correctAnswer) {
            cm.sendOk("... 진실이다. 다음 너의 대답을 기다리도록 하지.");
            status = 9;
        } else {
            cm.sendOk("...거짓을 말했다. 넌 시험을 통과하지 못했다.. 시험을 다시 보고 싶다면 어둠의 크리스탈을 다시 바쳐라.");
            cm.dispose();
        }
    } else if (status == 10) {
        cm.sendSimple("마지막 문제이다.\r\n\r\n" + getQuestion(qTowns[Math.floor(Math.random() * qTowns.length)]));
        status = 10;
    } else if (status == 11) {
        if (selection == correctAnswer) {
            cm.gainItem(4031058, 1);
            cm.sendOk("너의 대답에 거짓이 없음을 인정한다...\r\n이것으로 네가 가진 지혜도 증명되었다.\r\n이 목걸이를 가지고 돌아가라...");
            cm.dispose();
        } else {
            cm.sendOk("...거짓을 말했다. 넌 시험을 통과하지 못했다.. 시험을 다시 보고 싶다면 어둠의 크리스탈을 다시 바쳐라.");
            cm.dispose();
        }
    }
        
}
function getQuestion(qSet){
    var q = qSet.split("#");
    var qLine = q[0] + "\r\n\r\n#b#L0#" + q[1] + "#l\r\n#L1#" + q[2] + "#l\r\n#L2#" + q[3] + "#l\r\n#L3#" + q[4] + "#l";
    correctAnswer = parseInt(q[5],10);
    correctAnswer -= 1;
    return qLine;
}
