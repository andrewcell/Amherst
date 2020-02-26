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
 * NPCID : 2094001
 * ScriptName : davy_clear
 * NPCNameFunc : 우양
 * Location : 925100600 (히든스트리트 - 우양의 감사)
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
    nFieldId = cm.getPlayer().getMapId();
    if (nFieldId == 925100500) {
        eim = cm.getPlayer().getEventInstance();
        if (cm.isLeader()) {
            if (eim.getProperty("clearstage") == null) {
                var exp = 0;
                var it = eim.getPlayers().iterator();
                var over70 = 0;
                var totalLvl = 0;
                var members = eim.getPlayers().size();
                while (it.hasNext()) {
                    var chr = it.next();
                    if (chr.getLevel() >= 70) {
                        over70++;
                    }
                    totalLvl += chr.getLevel();
                }
                var averageLvl = totalLvl / members;
                if (over70 == 0) {
                    exp = 42000;
                } else {
                    if (averageLvl <= 70) {
                        exp = 35000;
                    } else if (averageLvl > 70 && averageLvl <= 80) {
                        exp = 28000;
                    } else if (averageLvl > 80 && averageLvl <= 90) {
                        exp = 20000;
                    }
                }
                if (exp < 35000) {
                    cm.partyMessage(6, "파티원 중 70 레벨을 넘는 플레이어가 있어 보상 경험치량이 하락하였습니다.");
                }
                cm.gainPartyExpPQ(exp, "davyjohn", 100);
                cm.sendNext("구해줘서 정말 고맙네. 이제까지 겪어보지 못한 위험이었지만, 도라지들을 구하고 해적의 손길에서 풀어줘서 진심으로 고맙네. 나에게 다시 한번 말을 걸면 내보내 주겠네.");
                eim.setProperty("clearstage", "1");
                
                var it = cm.getPlayer().getParty().getMembers().iterator();
                while (it.hasNext()) {
                    var cPlayer = it.next();
                    var ccPlayer = cm.getPlayer().getMap().getCharacterById(cPlayer.getId());
                    if (ccPlayer != null) {
                        ccPlayer.endPartyQuest(1204);
                    }
                }
                cm.dispose();
            } else {
                cm.warpParty(925100600);
                cm.dispose();
            }
        } else {
            cm.sendOk("당신들의 선장에게 말을 걸라고 하시게.");
            cm.dispose();
        }
    } else {
        if (status == 0) {
            qr = cm.getQuestRecord(7040); // 클리어 횟수
            qr2 = cm.getQuestRecord(7041); // 모자 받음 여부
            givehat1 = 50;
            givehat2 = 150;
            givehat3 = 300;
            givehat4 = 500;
            if (qr.getCustomData() == null) {
                qr.setCustomData("0");
            }
            if (qr2.getCustomData() == null) {
                qr2.setCustomData("0");
            }
            nTime = parseInt(qr.getCustomData()) + 1;
            given = parseInt(qr2.getCustomData());
            if (nTime >= 500) {
                nTime = 500;
            }
            if (given == 4) {
                cm.sendSimple("#b해적왕#k을 물리치고 도라지들과 저를 구해주셔서 정말 감사합니다. 무엇을 도와드릴까요?#b\r\n#L1# 해적왕을 죽인 횟수 초기화#l\r\n#L2# 이곳에서 내보내 주세요.#l");
            } else {
                cm.sendSimple("#b해적왕#k을 물리치고 도라지들과 저를 구해주셔서 정말 감사합니다. 무엇을 도와드릴까요?\r\n#b#L0# 해적왕을 물리친 횟수 확인#l\r\n#L1# 해적왕을 죽인 횟수 초기화#l\r\n#L2# 이곳에서 내보내 주세요.#l");
            }
        } else if (status == 1) {
            menu = selection;
            if (menu == 0) {
                if (given == 0) {
                    if (nTime < givehat1) {
                        cm.sendOk("#b#h0##k 님은 지금까지 해적왕을 #b"+nTime+"#k번 물리쳤습니다. 하지만 아직 저희들을 해적왕의 공포로부터 해방시켜 주시기엔 조금 모자란 듯 합니다. 만약 #b" + givehat1 + "#k 번 해적왕을 물리쳐 주신다면 저희에게 크게 도움이 될 것 같군요.");
                        cm.dispose();
                    } else if (nTime >= givehat1) {
                        if (nTime < 500) {
                            cm.sendNext("#b#h0##k 님은 지금까지 해적왕을 #b" + nTime + "#k번 물리쳤습니다. 저희 도라지들을 구해주셔서 감사하는 마음으로, #b" + givehat1 + "#k번 이상 해적왕을 물리쳐주셨으니 #b#t1002571##k을 선물로 드리도록 하겠습니다. ")
                        } else {
                            cm.sendNext("#b#h0##k 님은 지금까지 해적왕을 #b최소 500#k번 물리쳤습니다. 저희 도라지들을 구해주셔서 감사하는 마음으로, #b" + givehat1 + "#k번 이상 해적왕을 물리쳐주셨으니 #b#t1002571##k을 선물로 드리도록 하겠습니다. ")
                        }
                    }
                } else if (given == 1) {
                    if (nTime < givehat2) {
                        cm.sendOk("#b#h0##k 님은 지금까지 해적왕을 #b"+nTime+"#k번 물리쳤습니다. 하지만 아직 저희들을 해적왕의 공포로부터 해방시켜 주시기엔 조금 모자란 듯 합니다. 만약 #b" + givehat2 + "#k 번 해적왕을 물리쳐 주신다면 가지고 계신 #b#t1002571##k를 업그레이드 시켜 드리도록 하지요.");
                        cm.dispose();
                    } else if (nTime >= givehat2) {
                        if (nTime < 500) {
                            cm.sendNext("#b#h0##k 님은 지금까지 해적왕을 #b" + nTime + "#k번 물리쳤습니다. 저희 도라지들을 구해주셔서 감사하는 마음으로, #b" + givehat2 + "#k번 이상 해적왕을 물리쳐주셨으니 가지고 계신 #b#t1002571##k를 업그레이드 시켜 드리도록 하지요. ")
                        } else {
                            cm.sendNext("#b#h0##k 님은 지금까지 해적왕을 #b최소 500#k번 물리쳤습니다. 저희 도라지들을 구해주셔서 감사하는 마음으로, #b" + givehat2 + "#k번 이상 해적왕을 물리쳐주셨으니 가지고 계신 #b#t1002571##k를 업그레이드 시켜 드리도록 하지요. ")
                        }
                    }
                } else if (given == 2) {
                    if (nTime < givehat3) {
                        cm.sendOk("#b#h0##k 님은 지금까지 해적왕을 #b"+nTime+"#k번 물리쳤습니다. 하지만 아직 저희들을 해적왕의 공포로부터 해방시켜 주시기엔 조금 모자란 듯 합니다. 만약 #b" + givehat3 + "#k 번 해적왕을 물리쳐 주신다면 가지고 계신 #b#t1002572##k를 업그레이드 시켜 드리도록 하지요.");
                        cm.dispose();
                    } else if (nTime >= givehat3) {
                        if (nTime < 500) {
                            cm.sendNext("#b#h0##k 님은 지금까지 해적왕을 #b" + nTime + "#k번 물리쳤습니다. 저희 도라지들을 구해주셔서 감사하는 마음으로, #b" + givehat3 + "#k번 이상 해적왕을 물리쳐주셨으니 가지고 계신 #b#t1002572##k를 업그레이드 시켜 드리도록 하지요. ")
                        } else {
                            cm.sendNext("#b#h0##k 님은 지금까지 해적왕을 #b최소 500#k번 물리쳤습니다. 저희 도라지들을 구해주셔서 감사하는 마음으로, #b" + givehat3 + "#k번 이상 해적왕을 물리쳐주셨으니 가지고 계신 #b#t1002572##k를 업그레이드 시켜 드리도록 하지요. ")
                        }
                    }
                } else if (given == 3) {
                    if (nTime < givehat4) {
                        cm.sendOk("#b#h0##k 님은 지금까지 해적왕을 #b"+nTime+"#k번 물리쳤습니다. 하지만 아직 저희들을 해적왕의 공포로부터 해방시켜 주시기엔 조금 모자란 듯 합니다. 만약 #b" + givehat4 + "#k 번 해적왕을 물리쳐 주신다면 가지고 계신 #b#t1002572##k를 업그레이드 시켜 드리도록 하지요.");
                        cm.dispose();
                    } else if (nTime >= givehat3) {
                        if (nTime < 500) {
                            cm.sendNext("#b#h0##k 님은 지금까지 해적왕을 #b" + nTime + "#k번 물리쳤습니다. 저희 도라지들을 구해주셔서 감사하는 마음으로, #b" + givehat4 + "#k번 이상 해적왕을 물리쳐주셨으니 가지고 계신 #b#t1002572##k를 업그레이드 시켜 드리도록 하지요. ")
                        } else {
                            cm.sendNext("#b#h0##k 님은 지금까지 해적왕을 #b최소 500#k번 물리쳤습니다. 저희 도라지들을 구해주셔서 감사하는 마음으로, #b" + givehat4 + "#k번 이상 해적왕을 물리쳐주셨으니 가지고 계신 #b#t1002572##k를 업그레이드 시켜 드리도록 하지요. ")
                        }
                    }
                }
            } else if (menu == 1) {
                if (nTime < givehat1 || given == 0) {
                    cm.sendOk("최소 #b" + givehat1 + "#k번 이상 해적왕을 물리치지 못했거나, 한번도 #b#t1002571##k를 받은 적이 없기 때문에 횟수를 초기화하실 수 없습니다.");
                    cm.dispose();
                    return;
                }
                cm.sendYesNo("#b#h0##k님은 현재 #b"+nTime+"#k번 해적왕을 물리치셨습니다. 하지만 예를 들어 #b#t1002573##k를 잃어버린 경우, 다시 처음부터 도전할 수 있습니다. 정말 물리친 횟수를 초기화 하시겠습니까?");
            } else if (menu == 2) {
                qr.setCustomData(nTime);
                cm.warp(925100700);
                cm.dispose();
            }
        } else if (status == 2) {
            if (menu == 0) {
                if (given == 0) {
                    if (nTime >= givehat1) {
                        if (cm.canHold(1002571)) {
                            cm.gainItem(1002571, 1);
                            if (cm.getPlayer().getOneInfo(1204, "have0") == null) {
                                cm.getPlayer().updateOneInfo(1204, "have0", "1");
                            }
                            qr2.setCustomData("1");
                            cm.sendOk("#b#t1002571##k는 잘 받으셨나요? 잃어버리면 다시 얻으실 수 없으니 주의해 주세요. 이 물건이 도움이 되었으면 좋겠군요.")
                            cm.dispose();
                        } else {
                            cm.sendOk("장비 인벤토리 공간이 부족하신 건 아닌지 확인해 보세요.");
                            cm.dispose();
                        }
                    }
                } else if (given == 1) {
                    if (nTime >= givehat2) {
                        if (cm.canHold(1002572) && cm.haveItem(1002571)) {
                            cm.gainItem(1002571, -1);
                            cm.gainItem(1002572, 1);
                            if (cm.getPlayer().getOneInfo(1204, "have1") == null) {
                                cm.getPlayer().updateOneInfo(1204, "have1", "1");
                            }
                            qr2.setCustomData("2");
                            cm.sendOk("#b#t1002572##k는 잘 받으셨나요? 잃어버리면 다시 얻으실 수 없으니 주의해 주세요. 이 물건이 도움이 되었으면 좋겠군요.")
                            cm.dispose();
                        } else {
                            cm.sendOk("장비 인벤토리 공간이 부족하신 건 아닌지, 혹은 모자를 제대로 갖고 계신지 확인하세요. 만약 모자를 착용중이라면 착용을 해제하시고 다시 말을 걸어주세요.");
                            cm.dispose();
                        }
                    }
                } else if (given == 2) {
                    if (nTime >= givehat3) {
                        if (cm.canHold(1002573) && cm.haveItem(1002572)) {
                            cm.gainItem(1002572, -1);
                            cm.gainItem(1002573, 1);
                            if (cm.getPlayer().getOneInfo(1204, "have2") == null) {
                                cm.getPlayer().updateOneInfo(1204, "have2", "1");
                            }
                            qr2.setCustomData("3");
                            cm.sendOk("#b#t1002573##k는 잘 받으셨나요? 잃어버리면 다시 얻으실 수 없으니 주의해 주세요. 이 물건이 도움이 되었으면 좋겠군요.")
                            cm.dispose();
                        } else {
                            cm.sendOk("장비 인벤토리 공간이 부족하신 건 아닌지, 혹은 모자를 제대로 갖고 계신지 확인하세요. 만약 모자를 착용중이라면 착용을 해제하시고 다시 말을 걸어주세요.");
                            cm.dispose();
                        }
                    }
                } else if (given == 3) {
                    if (nTime >= givehat4) {
                        if (cm.canHold(1002574) && cm.haveItem(1002573)) {
                            cm.gainItem(1002573, -1);
                            cm.gainItem(1002574, 1);
                            if (cm.getPlayer().getOneInfo(1204, "have3") == null) {
                                cm.getPlayer().updateOneInfo(1204, "have3", "1");
                            }
                            qr2.setCustomData("4");
                            cm.sendOk("#b#t1002574##k는 잘 받으셨나요? 잃어버리면 다시 얻으실 수 없으니 주의해 주세요. 이 물건이 도움이 되었으면 좋겠군요.")
                            cm.dispose();
                        } else {
                            cm.sendOk("장비 인벤토리 공간이 부족하신 건 아닌지, 혹은 모자를 제대로 갖고 계신지 확인하세요. 만약 모자를 착용중이라면 착용을 해제하시고 다시 말을 걸어주세요.");
                            cm.dispose();
                        }
                    }
                }
            } else if (menu == 1) {
                if (selection == 0) {
                    cm.sendOk("신중하게 결정하세요. 정말 초기화 하고 싶으시다면 다시 제게 말을 걸어주시면 됩니다.");
                    cm.dispose();
                } else {
                    if (cm.haveItem(1002571, 1, true, true) || cm.haveItem(1002572, 1, true, true) || cm.haveItem(1002573, 1, true, true) || cm.haveItem(1002574, 1, true, true)) {
                        cm.sendOk("이미 #b#t1002571##k를 갖고 계시기 때문에 횟수를 초기화하실 수 없습니다.");
                        cm.dispose();
                        return;
                    } else {
                        qr.setCustomData("0");
                        qr2.setCustomData("0");
                        cm.sendOk("당신은 해적왕을 #b0#k번 물리치셨습니다.");
                        cm.dispose();
                    }
                }
            }
        }
    }
    
}