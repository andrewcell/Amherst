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
         * PortalName : party6_stage
         * Location : 930000000 (독안개의 숲 - 들어가기 전)
         * Location : 930000010 (독안개의 숲 - 숲 입구)
         * Location : 930000100 (독안개의 숲 - 숲 초입)
         * Location : 930000200 (독안개의 숲 - 변질된 숲)
         * 
         * @author T-Sun
         *
         */

                function enter(pi) {
                    switch (pi.getMapId()) {
                        case 930000000:
                            pi.playerMessage(5, "엘린의 변신 마법이 몸 안으로 스며든다.");
                            pi.playPortalSE();
                            pi.warp(930000010, 0);
                            break;
                        case 930000010:
                            pi.playPortalSE();
                            pi.warp(930000100, 0);
                            break;
                        case 930000100:
                            if (pi.getMap().getAllMonstersThreadsafe().size() == 0) {
                                pi.playPortalSE();
                                pi.warp(930000200, 0);
                            } else {
                                pi.playerMessage(5, "모든 몬스터를 없애기 전에는 이동할 수 없습니다.");
                            }
                            break;
                        case 930000200:
                            if (pi.getMap().getReactorByName("spine") != null && pi.getMap().getReactorByName("spine").getState() < 4) {
                                pi.playerMessage(5, "가시 덤불이 길을 막고 있습니다.");
                            } else {
                                pi.playPortalSE();
                                pi.warp(930000300, 0); //assuming they cant get past reactor without it being gone
                            }
                            break;
                    }
                }