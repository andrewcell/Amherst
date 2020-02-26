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
         * NPCID : 2040044
         * ScriptName : party2_play
         * NPCNameFunc : 바이올렛 벌룬
         * Location : 922010900 (히든스트리트 - 시공의 균열)
         * 
         * @author T-Sun
         *
         */

                function clear() {
                    cm.showEffect(true, "quest/party/clear");
                    cm.playSound(true, "Party1/Clear");
                }

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
            var em = cm.getEventManager("LudiPQ");
            var eim = cm.getPlayer().getEventInstance();
            if (em == null || eim == null) {
                cm.sendOk("오류가 발생했어요.");
                cm.dispose();
                return;
            }
            if (status == 0) {
                if (eim.getProperty("stage") == null) {
                    eim.setProperty("stage", "1");
                }
                var stage = parseInt(eim.getProperty("stage"));
                if (stage > (cm.getPlayer().getMapId() % 922010000 / 100)) {
                    cm.warpParty_Instanced(922011000);
                    cm.dispose();
                    return;
                }

                var s = eim.getProperty("guideRead");
                if (s == null || !s.equals("s") || !cm.isLeader()) {
                    if (cm.isLeader()) {
                        eim.setProperty("guideRead", "s");
                    }
                    cm.sendNext("안녕하세요. 드디어 여기까지 오셨군요... 이제 이 모든 소동을 일으킨 장본인을 쓰러뜨릴 시간입니다. 오른쪽으로 가보면 몬스터가 한 마리 있는데 쓰러뜨리면 엄청난 몸집의 #b알리샤르#k가 나타날 겁니다. 녀석은 여러분들 때문에 지금 몹시 화가 나 있는 상태이니 조심하세요.\r\n파티원이 모두 함께 녀석을 쓰러뜨리고 녀석이 지니고 있던 #b차원의 열쇠#k를 저에게 가져와 주시면 됩니다. 그 열쇠만 녀석에게서 빼앗는다면 다시 차원의 문이 열리는 일은 없겠지요. 그럼 여러분들만 믿겠습니다. 힘내 주세요!");
                    cm.dispose();
                    return;
                }

                if (cm.haveItem(4001023, 1)) {
                    clear();
                    cm.removeAll(4001023);
                    eim.setProperty("stage", (stage + 1));
                    eim.setProperty("guideRead", "0");
                    cm.gainPartyExpPQ(25000, "ludipq", 70);
                    var it = cm.getPlayer().getParty().getMembers().iterator();
                    while (it.hasNext()) {
                        var cPlayer = it.next();
                        var ccPlayer = cm.getPlayer().getMap().getCharacterById(cPlayer.getId());
                        if (ccPlayer != null) {
                            ccPlayer.endPartyQuest(1202);
                        }
                    }
                    cm.sendOk("차원의 열쇠를 가져 오셨군요! 여러분들은 모든 스테이지를 훌륭히 클리어 하셨습니다. 저에게 다시 말을 걸어주시면 파티원 전원이 보너스 맵으로 이동됩니다.");
                    cm.dispose();
                } else {
                    cm.sendOk("아직 #b차원의 열쇠#k를 획득하지 못하신 모양이군요. 차원의 열쇠는 #b알리샤르#k를 쓰러뜨리면 얻으실 수 있습니다. 그럼 힘내 주세요!");
                    cm.dispose();
                }
            }
        }