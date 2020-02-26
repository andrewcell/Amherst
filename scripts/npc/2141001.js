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
 * NPCID : 2141001
 * ScriptName : PinkBeen_accept
 * NPCNameFunc : 잊혀진 신전관리인
 * Location : 270050000 (신전 깊은 곳 - 잊혀진 황혼)
 * 
 * @author T-Sun
 *
 */
var status = 0;

function action(mode, type, selection) {
    if (cm.getPlayer().getMapId() == 270050000) {
        switch (status) {
            case 0:
                if (cm.getPlayer().getLevel() < 140) {
                    cm.sendOk("레벨조건이 맞지 않아 원정대에 등록할 수 없습니다. 핑크빈 원정대는 레벨 140 이상 캐릭터만 참여할 수 있습니다.");
                    cm.dispose();
                    return;
                }
                var em = cm.getEventManager("PinkBeanBattle");

                if (em == null) {
                    cm.sendOk("원정대 시스템에 문제가 발생했습니다.");
                    cm.safeDispose();
                    return;
                }
                var prop = em.getProperty("state");
                var marr = cm.getQuestRecord(160101);
                var data = marr.getCustomData();
                if (data == null) {
                    marr.setCustomData("0");
                    data = "0";
                }
                var time = parseInt(data);
                if (prop == null || prop.equals("0")) {
                    var squadAvailability = cm.getSquadAvailability("pinkbean");
                    if (squadAvailability == -1) {
                        status = 1;
                        cm.sendYesNo("핑크빈 원정대장이 되시겠습니까?");

                    } else if (squadAvailability == 1) {
                        // -1 = Cancelled, 0 = not, 1 = true
                        var type = cm.isSquadLeader("pinkbean");
                        if (type == -1) {
                            cm.sendOk("지난 원정대 신청은 이미 종료되었습니다.");
                            cm.safeDispose();
                        } else if (type == 0) {
                            var memberType = cm.isSquadMember("pinkbean");
                            if (memberType == 2) {
                                cm.sendOk("원정대장이 귀하를 제재 대상에 추가하였습니다.");
                                cm.safeDispose();
                            } else if (memberType == 1) {
                                status = 5;
                                cm.sendSimple("무엇을 하시겠습니까? \r\n#b#L0# 원정대원 리스트를 본다.#l \r\n#b#L1# 핑크빈 원정대에 참가한다#l \r\n#b#L2# 핑크빈 원정대에서 탈퇴한다#l");
                            } else if (memberType == -1) {
                                cm.sendOk("지난 원정대 신청은 이미 종료되었습니다.");
                                cm.safeDispose();
                            } else {
                                status = 5;
                                cm.sendSimple("무엇을 하시겠습니까? \r\n#b#L0# 원정대원 리스트를 본다.#l \r\n#b#L1# 핑크빈 원정대에 참가한다#l \r\n#b#L2# 핑크빈 원정대에서 탈퇴한다#l");
                            }
                        } else { // Is leader
                            status = 10;
                            cm.sendSimple("핑크빈 원정대장님 무엇을 하시겠습니까? \r\n#b#L0# 원정대 리스트 보기#l \r\n#b#L1# 원정대에서 추방하기#l \r\n#b#L2# 제재 유저 허가하기#l \r\n#r#L3# 원정대 결정하고 입장하기#l");
                        // TODO viewing!
                        }
                    } else {
                        var eim = cm.getDisconnected("PinkBeanBattle");
                        if (eim == null) {
                            var squd = cm.getSquad("pinkbean");
                            if (squd != null) {
                                cm.sendYesNo("이미 먼저 구성된 핑크빈원정대가 핑크빈을 저지하고 있습니다. 여기서 기다리세요.\r\n" + squd.getNextPlayer());
                                status = 3;
                            } else {
                                cm.sendOk("이미 먼저 구성된 핑크빈원정대가 핑크빈을 저지하고 있습니다. 여기서 기다리세요.");
                                cm.safeDispose();
                            }
                        } else {
                            cm.dispose();
                        }
                    }
                } else {
                    var eim = cm.getDisconnected("PinkBeanBattle");
                    if (eim == null) {
                        var squd = cm.getSquad("pinkbean");
                        if (squd != null) {
                            cm.sendYesNo("이미 먼저 구성된 핑크빈원정대가 핑크빈에 도전하고 있습니다. 여기서 기다리세요.\r\n" + squd.getNextPlayer());
                            status = 3;
                        } else {
                            cm.sendOk("이미 먼저 구성된 핑크빈원정대가 핑크빈에 도전하고 있습니다. 여기서 기다리세요.");
                            cm.safeDispose();
                        }
                    }
                    else {
                        cm.dispose();
                    }
                }
                break;
            case 1:
                if (mode == 1) {
                    if (cm.registerSquad("pinkbean", 5, "님이 핑크빈 원정대장이 되었습니다. 원정대에 참여하실 분은 지금 신청해 주세요.")) {
                        cm.sendOk("핑크빈 원정대장이 되셨습니다. 5분 이내에 원정대 조직을 마치고, 모든 대원이 입장하여야 합니다.");
                    } else {
                        cm.sendOk("An error has occurred adding your squad.");
                    }
                } else {
                    cm.sendOk("원정대장이 되시려면 다시 말을 걸어주세요.")
                }
                cm.safeDispose();
                break;
            case 2:
                if (!cm.reAdd("PinkBeanBattle", "pinkbean")) {
                    cm.sendOk("Error... please try again.");
                }
                cm.safeDispose();
                break;
            case 3:
                if (mode == 1) {
                    var squd = cm.getSquad("pinkbean");
                    if (squd != null && !squd.getAllNextPlayer().contains(cm.getPlayer().getName())) {
                        squd.setNextPlayer(cm.getPlayer().getName());
                        cm.sendOk("대기자 명단에 등록되었습니다.");
                    }
                }
                cm.dispose();
                break;
            case 5:
                if (selection == 0) {
                    if (!cm.getSquadList("pinkbean", 0)) {
                        cm.sendOk("알 수 없는 이유로 입장할 수 없습니다. 잠시 후에 다시 시도해 주십시오.");
                        cm.safeDispose();
                    } else {
                        cm.dispose();
                    }
                } else if (selection == 1) { // join
                    var ba = cm.addMember("pinkbean", true);
                    if (ba == 2) {
                        cm.sendOk("원정대 최대 인원으로 가득 찼습니다.");
                        cm.safeDispose();
                    } else if (ba == 1) {
                        cm.sendOk("원정대에 가입했습니다.");
                        cm.safeDispose();
                    } else {
                        cm.sendOk("이미 원정대에 참여하고 있습니다");
                        cm.safeDispose();
                    }
                } else {// withdraw
                    var baa = cm.addMember("pinkbean", false);
                    if (baa == 1) {
                        cm.sendOk("원정대에서 탈퇴했습니다.");
                        cm.safeDispose();
                    } else {
                        cm.sendOk("원정대에 가입되어있지 않아 탈퇴할 수 없습니다.");
                        cm.safeDispose();
                    }
                }
                break;
            case 10:
                if (selection == 0) {
                    if (!cm.getSquadList("pinkbean", 0)) {
                        cm.sendOk("Due to an unknown error, the request for squad has been denied.");
                    }
                    cm.safeDispose();
                } else if (selection == 1) {
                    status = 11;
                    if (!cm.getSquadList("pinkbean", 1)) {
                        cm.sendOk("Due to an unknown error, the request for squad has been denied.");
                        cm.safeDispose();
                    }

                } else if (selection == 2) {
                    status = 12;
                    if (!cm.getSquadList("pinkbean", 2)) {
                        cm.sendOk("Due to an unknown error, the request for squad has been denied.");
                        cm.safeDispose();
                    }

                } else if (selection == 3) { // get insode
                    if (cm.getSquad("pinkbean") != null) {
                        var dd = cm.getEventManager("PinkBeanBattle");
                        dd.startInstance(cm.getSquad("pinkbean"), cm.getMap(), 160101);
                        cm.dispose();
                    } else {
                        cm.sendOk("Due to an unknown error, the request for squad has been denied.");
                        cm.safeDispose();
                    }
                }
                break;
            case 11:
                cm.banMember("pinkbean", selection);
                cm.dispose();
                break;
            case 12:
                if (selection != -1) {
                    cm.acceptMember("pinkbean", selection);
                }
                cm.dispose();
                break;
        }
    }
}