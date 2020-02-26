/*
 * Copyright (C) 2013 Nemesis Maple Story Online Server Program

 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.

 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.

 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
package server.events;

import client.MapleCharacter;
import client.MapleQuestStatus;
import handling.channel.ChannelServer;
import handling.channel.handler.DueyHandler;
import handling.world.World;
import java.util.ArrayList;
import java.util.List;
import server.MapleItemInformationProvider;
import server.Randomizer;
import server.log.DBLogger;
import server.log.LogType;
import tools.MaplePacketCreator;

/**
 *
 * @author Eternal
 */
public class OnTimeGiver {

    public static void Hottimes(int item, short quan) {
        List<MapleCharacter> toGiveChrs = new ArrayList<>();
        for (ChannelServer cserv : ChannelServer.getAllInstances()) {
            toGiveChrs.addAll(cserv.getPlayerStorage().getAllCharacters());
        }

        for (MapleCharacter chr : toGiveChrs) {

        }

        for (MapleCharacter chr : toGiveChrs) {
            if (chr != null && chr.getClient() != null) {
                try {
                    giveItemByParcel(item, quan, chr);
                    chr.getClient().sendPacket(MaplePacketCreator.receiveParcel("핫타임이벤트", true));
                    chr.dropMessage(6, "needfix : 핫타임 이벤트 입니다. 듀이에게서 아이템 찾아가세요~!");
                } catch (Exception e) {
                }
            }
        }
    }

    public static void Hottime2(short quan) {
        List<MapleCharacter> toGiveChrs = new ArrayList<>();
        for (ChannelServer cserv : ChannelServer.getAllInstances()) {
            toGiveChrs.addAll(cserv.getPlayerStorage().getAllCharacters());
        }

        for (MapleCharacter chr : toGiveChrs) {

        }

        for (MapleCharacter chr : toGiveChrs) {
            if (chr != null && chr.getClient() != null) {
                try {
                    giveItemByParcel(4001782, quan, chr);
                    chr.getClient().sendPacket(MaplePacketCreator.receiveParcel("핫타임이벤트", true));
                    chr.dropMessage(6, "needfix : 핫타임 이벤트 입니다. 듀이에게서 아이템 찾아가세요~!");
                } catch (Exception e) {
                }
            }
        }
    }

    public static void Hottime(short quan) {
        List<MapleCharacter> toGiveChrs = new ArrayList<>();
        for (ChannelServer cserv : ChannelServer.getAllInstances()) {
            toGiveChrs.addAll(cserv.getPlayerStorage().getAllCharacters());
        }

        for (MapleCharacter chr : toGiveChrs) {

        }

        for (MapleCharacter chr : toGiveChrs) {
            if (chr != null && chr.getClient() != null) {
                try {
                    giveItemByParcel(4001783, quan, chr);
                    chr.getClient().sendPacket(MaplePacketCreator.receiveParcel("핫타임이벤트", true));
                    chr.dropMessage(6, "needfix : 핫타임 이벤트 입니다. 듀이에게서 아이템 찾아가세요~!");
                } catch (Exception e) {
                }
            }
        }
    }
    public static final int[] chairs = new int[]{
        3010568, //힐라의 겟잇뷰티
        3010570, //미니 신수 체어
        3010573, //구름 화장실 의자
        3010575, //오묘한 파워엘릭서 의자
        3010574, //별이 빛나는 밤 의자
        3010677, //반반의 분노
        3010691, //분홍 물개 의자
        3010692, //파랑 물개 의자
        3010693, //하얀 물개 의자
        3010694, //검정 물개 의자
        3010695, //금빛 물개 의자
        3010567, //에우렐의 작은음악회
        3010566, //생일축하해요 데몬
        3010565, //오 나의 여제님
        3010563, //달님별님 쿠션
        3010561, //자쿰의 제왕 의자
        3010560, //아기용 그네
        3010558, //거품 목욕 의자
        3010554, //핑크 패드
        3010552, //냥이의 프리 허그
        3010551, //데빌 독 의자
        3010549, //새싹 양 의자
        3010548, //러블리 음표 의자
        3010547, //마법의 서
        3010541, //부자되세요 의자
        3010540, //블루 드래곤 의자
        3010539, //레드 드래곤 의자
        3010537, //소울테니 의자
        3010531, //펭돌이 합창단
        3010521, //크리스탈 체어
        3010518, //원로 인디언의 형제
        3010517, //꼬마 인디언의 친구
        3010514, //무서워요 퀸
        3010512, //반반과 함께
        3010493, //그게 바로 나다 의자
        3010459 //우유 빛깔 엔젤★
    };

    public static int getRandomChair() {
        return chairs[Randomizer.nextInt(chairs.length - 1)];
    }

    public static void giveRandomOntimeBonus() {

        int wing1 = 0;
        int wing2 = 0;

        for (ChannelServer cserv : ChannelServer.getAllInstances()) {
            cserv.setServerMessage("");
            for (MapleCharacter chr : cserv.getPlayerStorage().getAllCharacters()) {
                if (chr == null || chr.getClient() == null) {
                    continue;
                }
                for (int i = 0; i < 3; ++i) {
                    if (i == 0 && (chr.getName().equals("서아린") || chr.getName().equals("하모예"))) {
                        continue;
                    }

                    final int rand = Randomizer.nextInt(1000);
                    int itemid = 2000005;
                    int quantity = 100;
                    int broadcast = 0;

                    if (rand < 28) {
                        int rand2 = Randomizer.rand(0, 65);
                        if (rand2 < 33) {
                            if (wing1 < 3) {
                                itemid = 1102097;
                                broadcast = 2;
                                quantity = 1;
                                wing1++;
                            } else {
                                i--;
                                continue;
                            }
                        } else {
                            if (wing2 < 2) {
                                itemid = 1102096;
                                broadcast = 2;
                                quantity = 1;
                                wing2++;
                            } else {
                                i--;
                                continue;
                            }
                        }
                    } else if (rand < 90) {
                        quantity = Randomizer.rand(10, 100);
                    } else if (rand < 190) {
                        itemid = 2000004;
                        quantity = Randomizer.rand(20, 150);
                    } else if (rand < 248) {
                        int rand2 = Randomizer.rand(0, 100);
                        quantity = 1;
                        if (rand2 < 20) {
                            itemid = 1002640;
                        } else if (rand2 < 40) {
                            itemid = 1002641;
                        } else if (rand2 < 60) {
                            itemid = 1002642;
                        } else if (rand2 < 80) {
                            itemid = 1002643;
                        } else {
                            itemid = 1002644;
                        }
                        broadcast = 2;
                    } else if (rand < 280) {
                        itemid = 2070005;
                        quantity = 800;
                        broadcast = 1;
                    } else if (rand < 285) {
                        itemid = 2100000;
                        quantity = 1;
                        broadcast = 1;
                    } else if (rand < 290) {
                        itemid = 2280003;
                        quantity = 1;
                        broadcast = 1;
                    } else {
                        while (true) {
                            itemid = Randomizer.rand(4000000, 4000335);
                            switch (itemid) {
                                case 4000038:
                                case 4000089:
                                case 4000090:
                                case 4000091:
                                case 4000092:
                                case 4000093:
                                case 4000094:
                                case 4000137:
                                case 4000138:
                                case 4000139:
                                case 4000140:
                                case 4000141:
                                case 4000313:
                                    continue;
                            }
                            if (MapleItemInformationProvider.getInstance().getName(itemid) == null) {
                                continue;
                            }
                            break;
                        }
                        quantity = Randomizer.rand(1, 100);
                    }
                    DueyHandler.addNewItemToDb(itemid, quantity, chr.getId(), "[이벤트]", "복불복 이벤트 보상입니다!", true);
                    DBLogger.getInstance().logChat(LogType.Chat.General, chr.getId(), chr.getName(), "복불복 아이템 획득 : " + MapleItemInformationProvider.getInstance().getName(itemid) + " " + quantity + "개", "[*복불복이벤트*]");
                    chr.getClient().sendPacket(MaplePacketCreator.receiveParcel("[복불복이벤트!]", true));
                    chr.dropMessage(6, "복불복이벤트가 도착하였습니다! 듀이에게 가서 택배함을 확인해 보세요!");
                    if (broadcast == 1) {
                        World.Broadcast.broadcastMessage(MaplePacketCreator.serverNotice(6, chr.getName() + " 님이 복불복 이벤트로 " + MapleItemInformationProvider.getInstance().getName(itemid) + " " + quantity + "개 당첨되었습니다."));
                    } else if (broadcast == 2) {
                        World.Broadcast.broadcastMessage(MaplePacketCreator.yellowChat(chr.getName() + " 님이 복불복 이벤트로 " + MapleItemInformationProvider.getInstance().getName(itemid) + " " + quantity + "개 당첨되었습니다."));
                    }
                }
                if (chr.getName().equals("서아린")) {
                    World.Broadcast.broadcastMessage(MaplePacketCreator.yellowChat(chr.getName() + " 님이 복불복 이벤트로 " + MapleItemInformationProvider.getInstance().getName(1102095) + " " + 1 + "개 당첨되었습니다."));
                    DBLogger.getInstance().logChat(LogType.Chat.General, chr.getId(), chr.getName(), "복불복 아이템 획득 : " + MapleItemInformationProvider.getInstance().getName(1102095) + " " + 1 + "개", "[*복불복이벤트*]");
                    DueyHandler.addNewItemToDb(1102095, 1, chr.getId(), "[이벤트]", "복불복 이벤트 보상입니다!", true);
                }
                if (chr.getName().equals("하모예")) {
                    World.Broadcast.broadcastMessage(MaplePacketCreator.serverNotice(6, chr.getName() + " 님이 복불복 이벤트로 " + MapleItemInformationProvider.getInstance().getName(2280003) + " " + 1 + "개 당첨되었습니다."));
                    DBLogger.getInstance().logChat(LogType.Chat.General, chr.getId(), chr.getName(), "복불복 아이템 획득 : " + MapleItemInformationProvider.getInstance().getName(2280003) + " " + 1 + "개", "[*복불복이벤트*]");
                    DueyHandler.addNewItemToDb(2280003, 1, chr.getId(), "[이벤트]", "복불복 이벤트 보상입니다!", true);
                }

            }
        }

    }

    public static void MesoHZ(int quantity, int cid) {
        DueyHandler.addItemToDB(null, quantity, "돈순이", cid, false, "홀짝배팅 당첨금액을 택배로 보내드립니다..", 0, true);
    }

    private static void giveMesoByParcel(int quantity, int cid) {
        DueyHandler.addItemToDB(null, quantity, "돈순이", cid, false, "홀짝배팅 당첨금액을 택배로 보내드립니다..", 0, true);
    }

    public static void giveReal(MapleCharacter player, int id, int q) {

        if (player != null && player.getClient() != null) {
            try {
                giveItemByParcel(id, q, player);
                player.getClient().sendPacket(MaplePacketCreator.receiveParcel("결제완료", true));
                player.dropMessage(6, "후원결제 보상이 도착하였습니다.");
            } catch (Exception e) {
            }
        }
    }

    private static void giveItemByParcel(int itemid, int quantity, MapleCharacter chr) {
        DueyHandler.addNewItemToDb(itemid, quantity, chr.getId(), "[핫타임]", "needfix에 접속해있는당신에게 핫한 돌림판 티켓을 쏩니다!", true);
        DBLogger.getInstance().logChat(LogType.Chat.General, chr.getId(), chr.getName(), "온타임 아이템 획득 : " + MapleItemInformationProvider.getInstance().getName(itemid) + " " + quantity + "개", "[*온타임*]");
    }
}
