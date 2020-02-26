/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package tools.extract;

import database.DatabaseConnection;
import java.io.File;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Random;
import provider.MapleData;
import provider.MapleDataProvider;
import provider.MapleDataProviderFactory;
import provider.MapleDataTool;
import server.MapleItemInformationProvider;
import server.life.MapleLifeFactory;
import server.life.MapleMonsterStats;
import server.maps.MapleReactorFactory;
import server.quest.MapleQuest;
import server.quest.MapleQuestAction;
import server.quest.MapleQuestAction.QuestItem;

/**
 *
 * @author
 */
public class MapleDropDataParser {

    private static void addFrankenroid(List<int[]> datas) {
        // 프랑켄로이드, 화난 프랑켄로이드
        for (int i = 9300139; i <= 9300140; ++i) {
            for (int z = 0; z < 3; ++z) {
                datas.add(new int[]{i, 2000002, 1, 1, 0, 600000});
                datas.add(new int[]{i, 2000002, 1, 1, 0, 600000});
                datas.add(new int[]{i, 2000002, 1, 1, 0, 600000});
                datas.add(new int[]{i, 2000002, 1, 1, 0, 600000});
                datas.add(new int[]{i, 2000004, 1, 1, 0, 100000});
                datas.add(new int[]{i, 2000005, 1, 1, 0, 100000});
                datas.add(new int[]{i, 2000006, 1, 1, 0, 300000});
                datas.add(new int[]{i, 2000006, 1, 1, 0, 300000});
                datas.add(new int[]{i, 2000006, 1, 1, 0, 300000});
                datas.add(new int[]{i, 2000006, 1, 1, 0, 300000});

                datas.add(new int[]{i, 2001001, 1, 1, 0, 200000});
                datas.add(new int[]{i, 2020013, 1, 1, 0, 200000});
                datas.add(new int[]{i, 2020013, 1, 1, 0, 200000});
                datas.add(new int[]{i, 2001001, 1, 1, 0, 200000});
                datas.add(new int[]{i, 2020014, 1, 1, 0, 200000});
                datas.add(new int[]{i, 2020014, 1, 1, 0, 200000});
                datas.add(new int[]{i, 2001002, 1, 1, 0, 200000});
                datas.add(new int[]{i, 2001002, 1, 1, 0, 200000});
                datas.add(new int[]{i, 2020015, 1, 1, 0, 200000});
                datas.add(new int[]{i, 2020015, 1, 1, 0, 200000});
                datas.add(new int[]{i, 2022003, 1, 1, 0, 200000});
                datas.add(new int[]{i, 2022003, 1, 1, 0, 200000});
            }
            for (int iiz = 0; iiz < 8; ++iiz) {
                datas.add(new int[]{i, 0, 30, 49, 0, 999999});
            }
            //

            datas.add(new int[]{i, 2044601, 1, 1, 0, 10000});
            datas.add(new int[]{i, 2040707, 1, 1, 0, 10000});
            datas.add(new int[]{i, 2044401, 1, 1, 0, 10000});
            datas.add(new int[]{i, 2040504, 1, 1, 0, 10000});
            datas.add(new int[]{i, 2044501, 1, 1, 0, 10000});
            datas.add(new int[]{i, 2044001, 1, 1, 0, 10000});
            datas.add(new int[]{i, 2043701, 1, 1, 0, 10000});
            datas.add(new int[]{i, 2043001, 1, 1, 0, 10000});
            datas.add(new int[]{i, 2040004, 1, 1, 0, 10000});
            datas.add(new int[]{i, 2044701, 1, 1, 0, 10000});
            datas.add(new int[]{i, 2043801, 1, 1, 0, 10000});
            datas.add(new int[]{i, 2043301, 1, 1, 0, 10000});


        }
    }

    private static void add(Integer itemid, List<MobDropEntry> newMobDrops, Entry<Integer, List<Integer>> mBookChild, boolean isBoss, boolean isRaidBoss) {
        if (itemid / 10000 == 206) {
            newMobDrops.add(new MobDropEntry(mBookChild.getKey(), itemid, 8000, 20, 30, 0)); //화살
        } else if (itemid / 10000 == 200) {
            for (int i = 0; i < (isBoss ? 5 : 1); ++i) {
                newMobDrops.add(new MobDropEntry(mBookChild.getKey(), itemid, isRaidBoss ? 700000 : isBoss ? 350000 : 1000, 1, 1, 0)); //물약
            }
        } else if (itemid / 1000 == 4004) {
            newMobDrops.add(new MobDropEntry(mBookChild.getKey(), itemid, 80, 1, 1, 0)); // 크리스탈 원석
        } else if (itemid / 1000 == 4000) {
            if (itemid == 4000451 || itemid == 4000456 || itemid == 4000446 || itemid == 4000448 || itemid == 4000458 || itemid == 4000453) {
                newMobDrops.add(new MobDropEntry(mBookChild.getKey(), itemid, 80000, 1, 1, 0)); // 전리품
            } else {
                newMobDrops.add(new MobDropEntry(mBookChild.getKey(), itemid, 400000, 1, 1, 0)); // 전리품
            }
        } else if (itemid / 10000 == 401) {
            newMobDrops.add(new MobDropEntry(mBookChild.getKey(), itemid, 1000, 1, 1, 0)); //광석 원석
        } else if (itemid / 1000 == 4020) {
            if (itemid == 4020009) {
                int chance = 8;
                switch (mBookChild.getKey()) {
                    case 8200001:
                    case 8200002:
                        chance = 8;
                        break;
                    case 8200003:
                        chance = 30;
                        break;
                    case 8200004:
                        chance = 50;
                        break;
                    case 8200005:
                    case 8200006:
                        chance = 90;
                        break;
                    case 8200007:
                    case 8200008:
                        chance = 130;
                        break;
                    case 8200009:
                    case 8200010:
                        chance = 190;
                        break;
                    case 8200011:
                        chance = 250;
                        break;
                    case 8200012:
                        chance = 400;
                        break;
                        
                }
                newMobDrops.add(new MobDropEntry(mBookChild.getKey(), itemid, chance, 1, 1, 0)); //시간 조각
            } else {
                newMobDrops.add(new MobDropEntry(mBookChild.getKey(), itemid, 150, 1, 1, 0)); //보석 원석..
            }
        } else if (itemid / 10000 == 204) {
            newMobDrops.add(new MobDropEntry(mBookChild.getKey(), itemid, isRaidBoss ? 30000 : isBoss ? 9000 : 70, 1, 1, 0)); //주문서..
        } else if (itemid / 10000 == 202) {
            for (int i = 0; i < (isBoss ? 5 : 1); ++i) {
                newMobDrops.add(new MobDropEntry(mBookChild.getKey(), itemid, isRaidBoss ? 700000 : isBoss ? 350000 : 5000, 1, 1, 0)); //특수물약
            }
        } else if (itemid / 1000000 == 1) {
            int f = 20;
            MapleMonsterStats stats = MapleLifeFactory.getMonsterStats(mBookChild.getKey());
            int itemlevel = MapleItemInformationProvider.getInstance().getReqLevel(itemid);
            if (Math.abs(stats.getLevel() - itemlevel) <= 5) {
                f = 15 + (stats.getLevel() - itemlevel);
            } else if (stats.getLevel() - itemlevel < -5) {
                f = 5;
            } else if (stats.getLevel() - itemlevel < -10) {
                f = 3;
            } else if (stats.getLevel() - itemlevel > 5) {
                f = 40;
            }
            newMobDrops.add(new MobDropEntry(mBookChild.getKey(), itemid, isRaidBoss ? 100000 : isBoss ? 900 : f, 1, 1, 0)); //장비
        } else if (itemid / 1000 == 4007) {
            newMobDrops.add(new MobDropEntry(mBookChild.getKey(), itemid, 300, 1, 1, 0)); //가루
        } else if (itemid / 10000 == 400) {
            newMobDrops.add(new MobDropEntry(mBookChild.getKey(), itemid, 600, 1, 1, 0)); //기타
        } else if (itemid / 10000 == 229) {
            newMobDrops.add(new MobDropEntry(mBookChild.getKey(), itemid, isRaidBoss ? 110000 : isBoss ? 50000 : 6, 1, 1, 0)); //마북
        } else if (itemid / 10000 == 233 || itemid / 10000 == 207) {
            newMobDrops.add(new MobDropEntry(mBookChild.getKey(), itemid, isRaidBoss ? 110000 : isBoss ? 50000 : 40, 1, 1, 0)); //표창 불릿
        } else if (itemid / 10000 == 413) {
            newMobDrops.add(new MobDropEntry(mBookChild.getKey(), itemid, 100, 1, 1, 0)); //촉진제
        } else if (itemid / 10000 == 221) {
            newMobDrops.add(new MobDropEntry(mBookChild.getKey(), itemid, 999999, 1, 1, 0)); //변신물약
        } else if (itemid / 10000 == 301) {
            newMobDrops.add(new MobDropEntry(mBookChild.getKey(), itemid, isRaidBoss ? 110000 : isBoss ? 6000 : 6, 1, 1, 0)); //의자?;
        } else {
            System.err.println("Undefined code : " + itemid);
        }
    }

    public enum DropType {

        Mob, Reactor;
    }

    public static void main(String[] args) throws Exception {
        DatabaseConnection.init();
        File from = new File("imgs");
        System.setProperty("wz_path", "wz");
        MapleDataProvider pro = MapleDataProviderFactory.getDataProvider(from);
        MapleData root = pro.getData("Reward.img");
        Connection con = DatabaseConnection.getConnection();
        Map<Integer, Integer> quests = new HashMap<Integer, Integer>();

        List<Integer> customMoneyMobAdd = new ArrayList<Integer>();
        List<MobDropEntry> mobdrops = new ArrayList<MobDropEntry>();
        List<ReactorDropEntry> reactordrops = new ArrayList<>();
        Map<Integer, List<Integer>> mBookRewards = new HashMap<Integer, List<Integer>>();

        MapleQuest.initQuests();
        MapleItemInformationProvider.getInstance().runItems();
        for (MapleQuest quest : MapleQuest.getAllInstances()) {
            for (MapleQuestAction act : quest.getCompleteActs()) {
                if (act.getItems() == null) {
                    continue;
                }
                for (QuestItem qitem : act.getItems()) {
                    if (qitem.count < 0 && MapleItemInformationProvider.getInstance().isQuestItem(qitem.itemid)) {
                        if (quests.containsKey(qitem.itemid)) {
                            System.err.println("Warning : Duplicate Quest Required Item. - ItemID : " + qitem.itemid + " Quest1 : " + quests.get(qitem.itemid) + ", Quest2 : " + quest.getId());
                        }
                        quests.put(qitem.itemid, quest.getId());
                    }
                }
            }
        }
        //K:QuestItems   V:QuestID
//        PreparedStatement select = con.prepareStatement("SELECT id,itemid,count FROM wz_questactitemdata");
//        ResultSet rs = select.executeQuery();
//        while (rs.next()) {
//            int itemid = rs.getInt("itemid");
//            int count = rs.getInt("count");
//            int qid = rs.getInt("id");
//            if (itemid / 10000 == 403 && count < 0) {
//                if (quests.containsKey(itemid)) {
//                    System.err.println("Warning : Duplicate Quest Required Item. - ItemID : " + itemid + " Quest1 : " + quests.get(itemid) + ", Quest2 : " + qid);
//                }
//                quests.put(itemid, qid);
//            }
//        }
//        select.close();
//        rs.close();
        System.out.println("Cached Quest Items : " + quests.size());

        long start = System.currentTimeMillis();
        System.out.println("Job Start");

        List<Integer> questdrops = new ArrayList<Integer>();

        PreparedStatement ps = con.prepareStatement("INSERT INTO `drop_data` (`dropperid`, `itemid`, `minimum_quantity`, maximum_quantity, questid, chance) VALUES (?, ?, ?, ?, ?, ?)");
        PreparedStatement ps2 = con.prepareStatement("INSERT INTO `reactordrops` (`reactorid`, `itemid`, `chance`, `questid`, `min`, `max`) VALUES (?, ?, ?, ?, ?, ?)");
        PreparedStatement del1 = con.prepareStatement("DELETE FROM drop_data");
        PreparedStatement del2 = con.prepareStatement("DELETE FROM reactordrops");
        del1.executeUpdate();
        del2.executeUpdate();
        MapleItemInformationProvider ii = MapleItemInformationProvider.getInstance();
        ii.runItems();
        ii.runEtc();
        for (MapleData reroot : root.getChildren()) {
            DropType type;
            int id = Integer.parseInt(reroot.getName().substring(1));
            if (reroot.getName().startsWith("m")) {
                if (MapleLifeFactory.getMonster(id) == null) {
                    System.out.println("Monster Id " + id + " is not exists.... Continue...");
                    continue;
                }
                type = DropType.Mob;
            } else {
                try {
                    MapleReactorFactory.getReactor(id);
                } catch (RuntimeException r) {
                    System.out.println("Reactor Id " + id + " is not exists.... Continue...");
                    continue;
                }
                type = DropType.Reactor;
            }

            for (MapleData content : reroot.getChildren()) {
                int itemid = MapleDataTool.getIntConvert("item", content, 0);

                if (!ii.itemExists(itemid) && itemid != 0) {
                    System.err.println("Item " + itemid + " does not exists.. Continue.");
                    continue;
                }

                if (itemid == 4000047) {
                    continue;
                }

                int money = MapleDataTool.getIntConvert("money", content, 0);
                int prob = (int) Math.round(Double.parseDouble(MapleDataTool.getString("prob", content).substring(4)) * 1000000);
                int min = MapleDataTool.getIntConvert("min", content, 1);
                int max = MapleDataTool.getIntConvert("max", content, 1);
                int quest = 0;
                if (quests.containsKey(itemid)) {
                    quest = quests.get(itemid);
                }
                if (type == DropType.Mob) {
                    if (!questdrops.contains(Integer.valueOf(itemid))) {
                        questdrops.add(Integer.valueOf(itemid));
                    }
                    if (itemid == 0) {
                        min = ((int) (money * 0.75));
                        max = (money);
                    } else if (itemid / 10000 == 413) {
                        continue; //촉진제는 일단 스킵
                    }
                    mobdrops.add(new MobDropEntry(id, itemid, prob, min, max, quest));
                } else {
                    if (!questdrops.contains(Integer.valueOf(itemid))) {
                        questdrops.add(Integer.valueOf(itemid));
                    }
                    if (itemid == 0) {
                        min = ((int) (money * 0.75));
                        max = (money);
                    }
                    reactordrops.add(new ReactorDropEntry(id, itemid, prob, min, max, quest));
                }
            }
        }

        //Hardcode Drop Data (WorldTrip)
        List<int[]> datas = new ArrayList<int[]>();
        //mobid, itemid, min, max, quest, prob

        datas.add(new int[]{9600003, 4000189, 1, 1, 0, 500000}); //양
        //datas.add(new int[]{9600003, 0, 32, 65, 0, 500000});
        datas.add(new int[]{9600002, 4000188, 1, 1, 0, 500000}); //오리
        //datas.add(new int[]{9600002, 0, 32, 65, 0, 500000});
        datas.add(new int[]{9600001, 4000187, 1, 1, 0, 500000}); //닭
        //datas.add(new int[]{9600001, 0, 32, 65, 0, 500000});
        datas.add(new int[]{9600004, 4000190, 1, 1, 0, 500000}); //염소
        //datas.add(new int[]{9600004, 0, 32, 65, 0, 500000});
        datas.add(new int[]{9600005, 4000191, 1, 1, 0, 500000}); //흑염소
        //datas.add(new int[]{9600005, 0, 32, 65, 0, 500000});
        datas.add(new int[]{9600006, 4000192, 1, 1, 0, 500000}); //소
        //datas.add(new int[]{9600006, 0, 32, 65, 0, 500000});
        datas.add(new int[]{9600007, 4000193, 1, 1, 0, 500000}); //쟁기소
        //datas.add(new int[]{9600007, 0, 32, 65, 0, 500000});
        datas.add(new int[]{9600008, 4000194, 1, 1, 0, 500000}); //검은 양
        //datas.add(new int[]{9600008, 0, 32, 65, 0, 500000});


        datas.add(new int[]{9410000, 4000198, 1, 1, 0, 500000}); //들개
        //datas.add(new int[]{9410000, 0, 32, 65, 0, 500000});
        datas.add(new int[]{9410001, 4000199, 1, 1, 0, 500000}); //멋쟁이 들개
        //datas.add(new int[]{9410001, 0, 32, 65, 0, 500000});
        datas.add(new int[]{9410002, 4000200, 1, 1, 0, 500000}); //험악한 들개
        //datas.add(new int[]{9410002, 0, 32, 65, 0, 500000});

        datas.add(new int[]{9410003, 4000201, 1, 1, 0, 500000}); //광대 원숭이
        //datas.add(new int[]{9410003, 0, 32, 65, 0, 500000});
        datas.add(new int[]{9410004, 4000202, 1, 1, 0, 500000}); //폭주족 원숭이
        //datas.add(new int[]{9410004, 0, 32, 65, 0, 500000});
        datas.add(new int[]{9410005, 4000254, 1, 1, 0, 500000}); //레드 버블티
        //datas.add(new int[]{9410005, 0, 32, 65, 0, 500000});
        datas.add(new int[]{9410006, 4000255, 1, 1, 0, 500000}); //옐로우 버블티
        //datas.add(new int[]{9410006, 0, 32, 65, 0, 500000});
        datas.add(new int[]{9410007, 4000256, 1, 1, 0, 500000}); //그린 버블티
        //datas.add(new int[]{9410007, 0, 32, 65, 0, 500000});
        datas.add(new int[]{9410008, 4031352, 1, 1, 0, 80000}); // 핑크 예티 인형기계?

        datas.add(new int[]{9410009, 4000257, 1, 1, 0, 500000}); //예티 인형
        //datas.add(new int[]{9410009, 0, 32, 65, 0, 500000});
        datas.add(new int[]{9410011, 4000258, 1, 1, 0, 500000}); //주니어페페 인형
        // datas.add(new int[]{9410011, 0, 32, 65, 0, 500000});
        datas.add(new int[]{9410013, 4000259, 1, 1, 0, 500000}); //인형뽑기 기계
        //datas.add(new int[]{9410013, 0, 32, 65, 0, 500000});

        datas.add(new int[]{9410015, 0, 1553, 3156, 0, 500000}); //포장마차
        datas.add(new int[]{9410015, 0, 1553, 3156, 0, 1000000}); //포장마차
        datas.add(new int[]{9410015, 0, 1553, 3156, 0, 1000000}); //포장마차
        datas.add(new int[]{9410015, 2000005, 1, 5, 0, 1000000}); //포장마차
        datas.add(new int[]{9410015, 2000004, 3, 6, 0, 1000000}); //포장마차

        datas.add(new int[]{9600009, 0, 1553, 3156, 0, 1000000}); //대왕지네

        datas.add(new int[]{9420000, 4000246, 1, 1, 0, 500000}); //두꺼비
        //datas.add(new int[]{9420000, 0, 32, 65, 0, 500000});
        datas.add(new int[]{9420001, 4000247, 1, 1, 0, 500000}); //개구리
        //datas.add(new int[]{9420001, 0, 32, 65, 0, 500000});
        datas.add(new int[]{9420002, 4000248, 1, 1, 0, 500000}); //구렁이
        datas.add(new int[]{9420002, 4000249, 1, 1, 0, 500000}); //구렁이
        //datas.add(new int[]{9420002, 0, 32, 65, 0, 500000});
        datas.add(new int[]{9420003, 4000250, 1, 1, 0, 100000}); //빨간 도마뱀
        datas.add(new int[]{9420003, 4000251, 1, 1, 0, 500000}); //빨간 도마뱀
        //datas.add(new int[]{9420003, 0, 32, 65, 0, 500000});
        datas.add(new int[]{9420004, 4000250, 1, 1, 0, 100000}); //노란 도마뱀
        datas.add(new int[]{9420004, 4000251, 1, 1, 0, 500000}); //노란 도마뱀
        //datas.add(new int[]{9420004, 0, 32, 65, 0, 500000});
        datas.add(new int[]{9420005, 4000252, 1, 1, 0, 100000}); //흰 닭
        datas.add(new int[]{9420005, 4000253, 1, 1, 0, 500000}); //흰 닭
        //datas.add(new int[]{9420005, 0, 32, 65, 0, 500000});

        datas.add(new int[]{9410015, 4031354, 1, 1, 4013, 1000000}); //포장마차
        datas.add(new int[]{9600009, 4031227, 1, 1, 4103, 1000000}); //대왕지네
        datas.add(new int[]{9410003, 4031296, 1, 1, 4010, 50000}); //광대 원숭이
        datas.add(new int[]{9410004, 4031296, 1, 1, 4010, 50000}); //폭주족 원숭이
        datas.add(new int[]{3110100, 4031405, 1, 1, 4207, 10000});

        MapleDataProvider mBookPro = MapleDataProviderFactory.getDataProvider(new File("imgs"));
        MapleData mBook = mBookPro.getData("MonsterBook.img");
        for (MapleData fle : mBook) {
            int mid = Integer.parseInt(fle.getName());
            if (mid >= 2100100 && mid <= 2110301) { //Ariant Monster
                MapleMonsterStats mobStat = MapleLifeFactory.getMonsterStats(mid);
                if (mobStat == null) {
                    continue;
                }
                datas.add(new int[]{mid, 0, 35, 55, 0, 500000});
                for (MapleData reward : fle.getChildByPath("reward")) {
                    int itemid = MapleDataTool.getInt(reward);
                    if (!ii.itemExists(itemid)) {
                        continue;
                    }
                    if (itemid / 10000 == 206) {
                        datas.add(new int[]{mid, itemid, 20, 30, 0, 8000}); //화살
                    } else if (itemid / 10000 == 200) {
                        datas.add(new int[]{mid, itemid, 1, 1, 0, 10000}); //물약
                    } else if (itemid / 1000 == 4004) {
                        datas.add(new int[]{mid, itemid, 1, 1, 0, 80}); // 크리스탈 원석
                    } else if (itemid / 1000 == 4000) {
                        datas.add(new int[]{mid, itemid, 1, 1, 0, 400000}); // 전리품
                    } else if (itemid / 10000 == 401) {
                        datas.add(new int[]{mid, itemid, 1, 1, 0, 1000}); //광석 원석
                    } else if (itemid / 10000 == 402) {
                        datas.add(new int[]{mid, itemid, 1, 1, 0, 150}); //보석 원석..
                    } else if (itemid / 10000 == 204) {
                        datas.add(new int[]{mid, itemid, 1, 1, 0, 70}); //주문서..
                    } else if (itemid / 10000 == 202) {
                        datas.add(new int[]{mid, itemid, 1, 1, 0, 6000}); //특수물약
                    } else if (itemid / 1000000 == 1) {
                        datas.add(new int[]{mid, itemid, 1, 1, 0, 40}); //장비
                    } else if (itemid / 10000 == 400) {
                        datas.add(new int[]{mid, itemid, 1, 1, 0, 600}); //특수물약
                    }
                }
            }
        }

        datas.add(new int[]{130100, 4030009, 1, 1, 0, 3000});
        datas.add(new int[]{1110101, 4030009, 1, 1, 0, 3000});
        datas.add(new int[]{1130100, 4030009, 1, 1, 0, 3000});
        datas.add(new int[]{2130100, 4030009, 1, 1, 0, 3000});
        datas.add(new int[]{1210102, 4030001, 1, 1, 0, 300});
        datas.add(new int[]{210100, 4030000, 1, 1, 0, 200});
        datas.add(new int[]{1210100, 4030011, 1, 1, 0, 600});
        datas.add(new int[]{1120100, 4030010, 1, 1, 0, 600});

        datas.add(new int[]{2100108, 4031568, 1, 1, 0, 11000});

        datas.add(new int[]{9300147, 4001132, 1, 1, 0, 350000});
        datas.add(new int[]{9300148, 4001133, 1, 1, 0, 100000});

//        addFrankenroid(datas);

        //중독된 스톤버그 - 독안개의 숲
        datas.add(new int[]{9300173, 4001161, 1, 1, 0, 999999});

        //해적의시험장 - 강력한 결정
        datas.add(new int[]{9001005, 4031857, 1, 1, 0, 400000});
        datas.add(new int[]{9001006, 4031856, 1, 1, 0, 400000});
        questdrops.add(4031857);
        questdrops.add(4031856);

        //카이린의 분신 - 검은 부적
        datas.add(new int[]{9001004, 4031059, 1, 1, 0, 999999});

        //영웅의 별, 영웅의 펜타곤 - 해적
        datas.add(new int[]{8180001, 4031861, 1, 1, 6944, 399999});
        datas.add(new int[]{8180000, 4031860, 1, 1, 6944, 399999});
        questdrops.add(4031861);
        questdrops.add(4031860);

        //루모의 잎사귀
        //3110302, 3110303 -> 4031694 (qid 3312)
        datas.add(new int[]{3110302, 4031694, 1, 1, 3312, 100000});
        datas.add(new int[]{3110303, 4031694, 1, 1, 3312, 300000});
        questdrops.add(4031694);

        //돌의 심장
        //8140701 -> 4031872
        datas.add(new int[]{8140701, 4031872, 1, 1, 6340, 200000});
        questdrops.add(4031872);

        //단단한 가죽
        //8140700 -> 4031871
        datas.add(new int[]{8140700, 4031871, 1, 1, 6350, 200000});
        questdrops.add(4031871);

        //바이킹의 깃발
        //8141000 -> 4031873
        datas.add(new int[]{8141000, 4031873, 1, 1, 6380, 200000});
        questdrops.add(4031873);

        //바이킹의 증표
        //8141100 -> 4031874
        datas.add(new int[]{8141100, 4031874, 1, 1, 6390, 200000});
        questdrops.add(4031874);

        //4031869 파풀라투스의 열쇠
        datas.add(new int[]{8500002, 4031869, 1, 1, 6360, 999999});
        questdrops.add(4031869);

        //4031773 바짝 마른 나뭇가지
        datas.add(new int[]{130100, 4031773, 1, 1, 2145, 199999});
        datas.add(new int[]{1110101, 4031773, 1, 1, 2145, 199999});
        datas.add(new int[]{1130100, 4031773, 1, 1, 2145, 199999});
        datas.add(new int[]{1140100, 4031773, 1, 1, 2145, 199999});
        datas.add(new int[]{2130100, 4031773, 1, 1, 2145, 199999});
        questdrops.add(4031773);

        datas.add(new int[]{5300100, 4031925, 1, 1, 2223, 60000});
        questdrops.add(4031925);

        //카슨의 시험 퀘스트
        datas.add(new int[]{9300141, 4031698, 1, 1, 3310, 199999});
        questdrops.add(4031698);

        //파웬의 출입증 3358 6110301 4031745
        datas.add(new int[]{6110301, 4031745, 1, 1, 3358, 50000});
        questdrops.add(4031745);

        //감춰진 진실 8110300 4031737 3343
        datas.add(new int[]{8110300, 4031737, 1, 1, 3343, 1000000});
        questdrops.add(4031737);

        //검은 마법사의 마법진 3345
        datas.add(new int[]{8110300, 4031740, 1, 1, 3345, 1000000});
        questdrops.add(4031740);
        datas.add(new int[]{7110300, 4031741, 1, 1, 3345, 1000000});
        questdrops.add(4031741);

        //시약 만들기 3366 9300154 4031780 ~ 4031784
        datas.add(new int[]{9300154, 4031780, 1, 1, 3366, 200000});
        datas.add(new int[]{9300154, 4031781, 1, 1, 3366, 200000});
        datas.add(new int[]{9300154, 4031782, 1, 1, 3366, 200000});
        datas.add(new int[]{9300154, 4031783, 1, 1, 3366, 200000});
        datas.add(new int[]{9300154, 4031784, 1, 1, 3366, 200000});

        //3454, 4031926 모든 그레이
        datas.add(new int[]{4230116, 4031926, 1, 1, 3454, 100000});
        datas.add(new int[]{4230117, 4031926, 1, 1, 3454, 120000});
        datas.add(new int[]{4230118, 4031926, 1, 1, 3454, 130000});
        datas.add(new int[]{4240000, 4031926, 1, 1, 3454, 190000});
        questdrops.add(4031926);


        datas.add(new int[]{4230113, 2022354, 1, 1, 3248, 200000});
        datas.add(new int[]{3230306, 2022355, 1, 1, 3248, 200000});
        questdrops.add(4031991);
        questdrops.add(2022354);
        questdrops.add(2022355);
        questdrops.add(4031992);

        //220040000 ~ 220080000 : 4031992 드롭
        datas.add(new int[]{4230114, 4031992, 1, 1, 0, 30000});
        datas.add(new int[]{3230306, 4031992, 1, 1, 0, 30000});
        datas.add(new int[]{3210207, 4031992, 1, 1, 0, 30000});
        datas.add(new int[]{4230113, 4031992, 1, 1, 0, 30000});
        datas.add(new int[]{4230115, 4031992, 1, 1, 0, 30000});
        datas.add(new int[]{6130200, 4031992, 1, 1, 0, 30000});
        datas.add(new int[]{6230300, 4031992, 1, 1, 0, 30000});
        datas.add(new int[]{6300100, 4031992, 1, 1, 0, 30000});
        datas.add(new int[]{6400100, 4031992, 1, 1, 0, 30000});
        datas.add(new int[]{7140000, 4031992, 1, 1, 0, 30000});
        datas.add(new int[]{7160000, 4031992, 1, 1, 0, 30000});
        datas.add(new int[]{8141000, 4031992, 1, 1, 0, 30000});
        datas.add(new int[]{8141100, 4031992, 1, 1, 0, 30000});
        datas.add(new int[]{8160000, 4031992, 1, 1, 0, 30000});
        datas.add(new int[]{6230400, 4031992, 1, 1, 0, 30000});
        datas.add(new int[]{6230500, 4031992, 1, 1, 0, 30000});
        datas.add(new int[]{8140200, 4031992, 1, 1, 0, 30000});
        datas.add(new int[]{8140300, 4031992, 1, 1, 0, 30000});
        datas.add(new int[]{7130010, 4031992, 1, 1, 0, 30000});
        datas.add(new int[]{7130300, 4031992, 1, 1, 0, 30000});
        datas.add(new int[]{8142000, 4031992, 1, 1, 0, 30000});
        datas.add(new int[]{8143000, 4031992, 1, 1, 0, 30000});
        datas.add(new int[]{8170000, 4031992, 1, 1, 0, 30000});

        //5100004 4031790 3642
        questdrops.add(4031790);
        datas.add(new int[]{5100004, 4031790, 1, 1, 3642, 660000});

        //7220001 4031793 3647
        questdrops.add(4031790);
        datas.add(new int[]{7220001, 4031793, 1, 1, 3647, 1000000});
        datas.add(new int[]{7220001, 4031793, 1, 1, 3647, 1000000});
        datas.add(new int[]{7220001, 4031793, 1, 1, 3647, 1000000});

        //4031846 130101 1210100 2173
        questdrops.add(4031846);
        datas.add(new int[]{130101, 4031846, 1, 1, 2173, 100000});
        datas.add(new int[]{1210100, 4031846, 1, 1, 2173, 100000});
        
        
        datas.add(new int[]{8220004, 4020009, 1, 1, 0, 300000});
        datas.add(new int[]{8220005, 4020009, 1, 1, 0, 500000});
        datas.add(new int[]{8220005, 4020009, 1, 1, 0, 500000});
        datas.add(new int[]{8220006, 4020009, 1, 1, 0, 1000000});
        datas.add(new int[]{8220006, 4020009, 1, 1, 0, 500000});
        datas.add(new int[]{8220006, 4020009, 1, 1, 0, 200000});
        
        datas.add(new int[]{9300169, 4001022, 1, 1, 0, 1000000});
        datas.add(new int[]{9300170, 4001022, 1, 1, 0, 1000000});
        datas.add(new int[]{9300171, 4001022, 1, 1, 0, 1000000});
        


        PreparedStatement psdd = con.prepareStatement("SELECT * FROM `drop_data_p`");
        ResultSet rsdd = psdd.executeQuery();
        while (rsdd.next()) {
            int itemid = rsdd.getInt("itemid");
            if (ii.itemExists(itemid)) {
                datas.add(new int[]{rsdd.getInt("dropperid"), itemid, 1, 1, rsdd.getInt("questid"), rsdd.getInt("chance")});
            } else {
                System.err.println("Pinkbeen item not exists : " + itemid + "(" + ii.getName(itemid) + ")");
            }
        }
        rsdd.close();
        psdd.close();
        customMoneyMobAdd.add(8820001); // 핑크빈


        /*
         //속성강화 20
         datas.add(new int[]{8510000, 2290112, 1, 1, 0, 50000});
         datas.add(new int[]{8140702, 2290112, 1, 1, 0, 6});
        
         //서포트 옥토퍼스 20
         datas.add(new int[]{8520000, 2290114, 1, 1, 0, 30000});
         datas.add(new int[]{8142100, 2290114, 1, 1, 0, 4});
        
         //어드밴스드 호밍
         datas.add(new int[]{8190005, 2290124, 1, 1, 0, 5});
         datas.add(new int[]{8510000, 2290124, 1, 1, 0, 20000});
        
         //래피드 파이어 20
         datas.add(new int[]{8810023, 2290117, 1, 1, 0, 7});
         datas.add(new int[]{8180000, 2290117, 1, 1, 0, 9000});
        
         //래피드 파이어 30
         datas.add(new int[]{8150100, 2290118, 1, 1, 0, 5});
        
         //에어스트라이크 20
         datas.add(new int[]{8800002, 2290115, 1, 1, 0, 90000});
        
         //에어스트라이크 30
         datas.add(new int[]{8810018, 2290116, 1, 1, 0, 230000});
        
         //마인드 컨트롤 20
         datas.add(new int[]{8500002, 2290123, 1, 1, 0, 11200});
        
         //배틀쉽 캐논 20
         datas.add(new int[]{8180001, 2290119, 1, 1, 0, 9000});
         datas.add(new int[]{8150302, 2290119, 1, 1, 0, 5});
        
         //배틀쉽 캐논 30
         datas.add(new int[]{8150300, 2290120, 1, 1, 0, 5});
        
         //배틀쉽 토르페도 20  2290121
         datas.add(new int[]{8500002, 2290121, 1, 1, 0, 7800});
         datas.add(new int[]{8190004, 2290121, 1, 1, 0, 6});
        
         //배틀쉽 토르페도 30  2290122
         datas.add(new int[]{8520000, 2290122, 1, 1, 0, 132000});
         datas.add(new int[]{8140701, 2290122, 1, 1, 0, 4});
         */

        for (int[] i : datas) {
            mobdrops.add(new MobDropEntry(i[0], i[1], i[5], i[2], i[3], i[4]));
        }

        List<int[]> datas_r = new ArrayList<int[]>();

        datas_r.add(new int[]{2612004, 4031703, 999999, 3302, 1, 1});

        int[] normal_scrolls = new int[]{2040001, 2040002, 2040004, 2040005, 2040025, 2040026, 2040029, 2040031, 2040301, 2040302,
            2040317, 2040318, 2040321, 2040323, 2040326, 2040328, 2040401, 2040402, 2040418, 2040419,
            2040421, 2040422, 2040425, 2040427, 2040501, 2040502, 2040504, 2040505, 2040513, 2040514,
            2040516, 2040517, 2040532, 2040534, 2040601, 2040602, 2040618, 2040619, 2040621, 2040622,
            2040625, 2040627, 2040701, 2040702, 2040704, 2040705, 2040707, 2040708, 2040801, 2040802,
            2040804, 2040805, 2040824, 2040825, 2040901, 2040902, 2040924, 2040925, 2040927, 2040928,
            2040931, 2040933, 2041001, 2041002, 2041004, 2041005, 2041007, 2041008, 2041010, 2041011,
            2041013, 2041014, 2041016, 2041017, 2041019, 2041020, 2041022, 2041023, 2043001, 2043002,
            2043017, 2043019, 2043101, 2043102, 2043112, 2043114, 2043201, 2043202, 2043212, 2043214,
            2043301, 2043302, 2043701, 2043702, 2043801, 2043802, 2044001, 2044002, 2044012, 2044014,
            2044101, 2044102, 2044112, 2044114, 2044201, 2044202, 2044212, 2044214, 2044301, 2044302,
            2044312, 2044314, 2044401, 2044402, 2044412, 2044414, 2044501, 2044502, 2044601, 2044602,
            2044701, 2044702, 2044801, 2044802, 2044807, 2044809, 2044901, 2044902, 2048001, 2048002,
            2048004, 2048005, 2049100};



        datas_r.add(new int[]{6802000, 0, 999999, 0, 10, 49});
        datas_r.add(new int[]{6802000, 0, 999999, 0, 10, 49});
        datas_r.add(new int[]{6802000, 0, 999999, 0, 10, 49});
        datas_r.add(new int[]{6802000, 0, 999999, 0, 10, 49});
        datas_r.add(new int[]{6802001, 0, 999999, 0, 10, 49});
        datas_r.add(new int[]{6802001, 0, 999999, 0, 10, 49});
        datas_r.add(new int[]{6802001, 0, 999999, 0, 10, 49});
        datas_r.add(new int[]{6802001, 0, 999999, 0, 10, 49});

        for (int zii : normal_scrolls) {
            datas_r.add(new int[]{6802001, zii, 1300, 0, 1, 1});
            datas_r.add(new int[]{6802000, zii, 1600, 0, 1, 1});
        }
        //크리스탈 원석
        for (int iii = 4004000; iii <= 4004003; ++iii) {
            datas_r.add(new int[]{6802000, iii, 20000, 0, 1, 1});
            datas_r.add(new int[]{6802001, iii, 20000, 0, 1, 1});
        }
        //광물 원석
        for (int iii = 4010000; iii <= 4010007; ++iii) {
            datas_r.add(new int[]{6802000, iii, 100000, 0, 1, 1});
            datas_r.add(new int[]{6802001, iii, 100000, 0, 1, 1});
        }
        //보석 원석
        for (int iii = 4020000; iii <= 4020008; ++iii) {
            datas_r.add(new int[]{6802000, iii, 50000, 0, 1, 1});
            datas_r.add(new int[]{6802001, iii, 50000, 0, 1, 1});
        }
        //만병 통치약
        datas_r.add(new int[]{6802000, 2050004, 250000, 0, 1, 1});
        datas_r.add(new int[]{6802001, 2050004, 250000, 0, 1, 1});
        //안약 보약 성수
        for (int iii = 2050001; iii <= 2050003; ++iii) {
            datas_r.add(new int[]{6802000, iii, 90000, 0, 1, 1});
            datas_r.add(new int[]{6802001, iii, 90000, 0, 1, 1});
        }

        //독안개의 숲 파퀘
        datas_r.add(new int[]{3002000, 4001162, 999999, 0, 1, 1});
        datas_r.add(new int[]{3002001, 4001163, 999999, 0, 1, 1});

        //속성강화 30
        datas_r.add(new int[]{9202012, 2290113, 3600, 0, 1, 1});

        //래피드 파이어 30
        datas_r.add(new int[]{9202012, 2290118, 4400, 0, 1, 1});

        //배틀쉽 캐논 30
        datas_r.add(new int[]{9202012, 2290120, 5400, 0, 1, 1});

        //커다란 진주 퀘스트
        datas_r.add(new int[]{1202002, 4031843, 999999, 2169, 1, 1});
        questdrops.add(4031843);

        //
        datas_r.add(new int[]{2612005, 4031798, 999999, 3366, 1, 1});
        questdrops.add(4031798);
        
        datas_r.add(new int[]{2502002, 2022252, 999999, 3839, 1, 1});
        questdrops.add(4031798);


        for (int[] i : datas_r) {
            //`reactorid`, `itemid`, `chance`, `questid`, `min`, `max`
            reactordrops.add(new ReactorDropEntry(i[0], i[1], i[2], i[4], i[5], i[3]));
        }

        Map<Integer, List<MobDropEntry>> mdrop_final = new HashMap<Integer, List<MobDropEntry>>();
        Map<Integer, List<ReactorDropEntry>> rdrop_final = new HashMap<Integer, List<ReactorDropEntry>>();

        for (MobDropEntry mde : mobdrops) {
            if (!mdrop_final.containsKey(mde.mobid)) {
                mdrop_final.put(mde.mobid, new ArrayList<MobDropEntry>());
            }
            List<MobDropEntry> dd = mdrop_final.get(mde.mobid);
            dd.add(mde);
        }
        for (ReactorDropEntry rde : reactordrops) {
            if (!rdrop_final.containsKey(rde.reactorid)) {
                rdrop_final.put(rde.reactorid, new ArrayList<ReactorDropEntry>());
            }
            List<ReactorDropEntry> dd = rdrop_final.get(rde.reactorid);
            dd.add(rde);
        }



        for (MapleData mD : mBook) {
            int mobid = Integer.parseInt(mD.getName());
            List<Integer> d = mBookRewards.get(mobid);
            if (d == null) {
                d = new LinkedList<Integer>();
                mBookRewards.put(mobid, d);
            }
            for (MapleData mDR : mD.getChildByPath("reward")) {
                int itemid = MapleDataTool.getInt(mDR);
                d.add(itemid);
            }
        }


        for (Entry<Integer, List<Integer>> mBookChild : mBookRewards.entrySet()) {
            if (mdrop_final.containsKey(mBookChild.getKey())) {
//                List<MobDropEntry> missingMBookDrops = new ArrayList<MobDropEntry>();
                List<MobDropEntry> mdes = mdrop_final.get(mBookChild.getKey());
                List<MobDropEntry> newMobDrops = new ArrayList<MobDropEntry>(mdes);
                List<Integer> mBookRewardIds = mBookChild.getValue();
                boolean isBoss = MapleLifeFactory.getMonsterStats(mBookChild.getKey()).isBoss();
                boolean isRaidBoss = false;

                for (Integer itemid : mBookRewardIds) {
                    boolean found = false;
                    for (MobDropEntry mde : mdes) {
                        if (mde.itemid == itemid) {
                            found = true;
                            break;
                        }
                    }
                    if (!found) {
                        switch (mBookChild.getKey()) {
                            case 8810018:
                            case 8800002:
                            case 8520000:
                            case 8510000:
                            case 8500002:
                            case 8820001:
                                isRaidBoss = true;
                                break;
                        }
                        add(itemid, newMobDrops, mBookChild, isBoss, isRaidBoss);
//                        System.out.println("드롭 테이블에 없는 아이템 - 몬스터 : " + mBookChild.getKey() + " / 아이템 : " + itemid + " (" + ii.getName(itemid) + ")");
                    }
                }


                boolean hasMoney = false;
                for (MobDropEntry mde : mdes) {
                    if (mde.itemid == 0) {
                        hasMoney = true;
                        break;
                    }
                }

                for (int i = 0; i < (isBoss ? 5 : 1) && !hasMoney; ++i) {
                    Random r = new Random();
                    MapleMonsterStats mobstat = MapleLifeFactory.getMonsterStats(mBookChild.getKey());
                    double mesoDecrease = Math.pow(0.93, mobstat.getExp() / (isBoss ? 2000.0 : 300.0));
                    if (mesoDecrease > 1.0) {
                        mesoDecrease = 1.0;
                    } else if (mesoDecrease < 0.001) {
                        mesoDecrease = 0.005;
                    }
                    int tempmeso = Math.min(30000, (int) (mesoDecrease * (mobstat.getExp() * 5.7) / 10.0));

                    final int meso = tempmeso;
                    newMobDrops.add(new MobDropEntry(mBookChild.getKey(), 0, 700000, (int) (meso * 0.75), meso, 0)); //화살
                }


                mdrop_final.put(mBookChild.getKey(), newMobDrops);
            } else {
                if (!mBookChild.getValue().isEmpty()) {
//                    System.out.println("드롭에 없는 몹 : " + mBookChild.getKey() + " (" + getMobName(mBookChild.getKey()) + ")");

                    boolean isBoss = MapleLifeFactory.getMonsterStats(mBookChild.getKey()).isBoss();
                    boolean isRaidBoss = false;
                    switch (mBookChild.getKey()) {
                        case 8810018:
                        case 8800002:
                        case 8520000:
                        case 8510000:
                        case 8500002:
                        case 8820001:
                            isRaidBoss = true;
                            break;
                    }

                    List<MobDropEntry> newMobDrops = new ArrayList<MobDropEntry>();
                    if (isRaidBoss) {
                        // ..
                    } else {
                        for (int i = 0; i < (isBoss ? 5 : 1); ++i) {
                            Random r = new Random();
                            MapleMonsterStats mobstat = MapleLifeFactory.getMonsterStats(mBookChild.getKey());
                            double mesoDecrease = Math.pow(0.93, mobstat.getExp() / (isBoss ? 2000.0 : 300.0));
                            if (mesoDecrease > 1.0) {
                                mesoDecrease = 1.0;
                            } else if (mesoDecrease < 0.001) {
                                mesoDecrease = 0.005;
                            }
                            int tempmeso = Math.min(30000, (int) (mesoDecrease * (mobstat.getExp() * 5.7) / 10.0));

                            final int meso = tempmeso;
                            newMobDrops.add(new MobDropEntry(mBookChild.getKey(), 0, 700000, (int) (meso * 0.75), meso, 0)); //화살
                        }
                    }
                    for (Integer itemid : mBookChild.getValue()) {
                        add(itemid, newMobDrops, mBookChild, isBoss, isRaidBoss);
                    }
                    mdrop_final.put(mBookChild.getKey(), newMobDrops);
                }
            }
        }


        for (int cs : customMoneyMobAdd) {

            List<MobDropEntry> mdes = mdrop_final.get(cs);
            if (mdes == null) {
                mdes = new ArrayList<MobDropEntry>();
            }
            List<MobDropEntry> newMobDrops = new ArrayList<MobDropEntry>(mdes);
            boolean hasMoney = false;
            for (MobDropEntry mde : mdes) {
                if (mde.itemid == 0) {
                    hasMoney = true;
                    break;
                }
            }

            boolean isBoss = MapleLifeFactory.getMonsterStats(cs).isBoss();
            boolean isRaidBoss = false;
            switch (cs) {
                case 8810018:
                case 8800002:
                case 8520000:
                case 8510000:
                case 8500002:
                case 8820001:
                    isRaidBoss = true;
                    break;
            }
            for (int i = 0; i < (isRaidBoss ? 15 : isBoss ? 5 : 1) && !hasMoney; ++i) {
                Random r = new Random();
                MapleMonsterStats mobstat = MapleLifeFactory.getMonsterStats(cs);
                double mesoDecrease = Math.pow(0.93, mobstat.getExp() / (isBoss ? 2000.0 : 300.0));
                if (mesoDecrease > 1.0) {
                    mesoDecrease = 1.0;
                } else if (mesoDecrease < 0.001) {
                    mesoDecrease = 0.005;
                }
                int tempmeso = Math.min(30000, (int) (mesoDecrease * (mobstat.getExp() * 5.7) / 10.0));

                final int meso = tempmeso;
                newMobDrops.add(new MobDropEntry(cs, 0, 700000, (int) (meso * 0.75), meso, 0)); //화살
            }
            mdrop_final.put(cs, newMobDrops);
        }

        getMobName(100100);

        for (int i = 2380000; i <= 2388046; ++i) {
            if (ii.itemExists(i)) {
                String name = ii.getName(i).replaceAll(" 카드", "");
                for (Entry<Integer, String> es : mobnames.entrySet()) {
                    if (es.getValue().equalsIgnoreCase(name)) {
                        List<MobDropEntry> d = mdrop_final.get(es.getKey());
                        if (d == null) {
                            System.out.println("Empty mob : " + es.getKey() + " (" + getMobName(es.getKey()) + ")");
                            continue;
                            //mdrop_final.put(es.getKey(), d);
                            //d = mdrop_final.get(es.getKey());
                        }
                        MapleMonsterStats mobstat = MapleLifeFactory.getMonsterStats(es.getKey());
                        d.add(new MobDropEntry(es.getKey(), i, 1000 * (mobstat.isBoss() ? 25 : 1), 1, 1, 0));
                        break;
                    }
                }
            }
        }

        final List<MobDropEntry> temp = mdrop_final.get(9300141);
        temp.addAll(mdrop_final.get(6110300)); //호문, 폐쇄된 연구실의 호문 Clone
        for (MobDropEntry mde : temp) {
            mde.mobid = 9300141;
        }
        mdrop_final.put(9300141, temp);


        for (List<MobDropEntry> mdes : mdrop_final.values()) {
            for (MobDropEntry mde : mdes) {
                ps.setInt(1, mde.mobid);
                ps.setInt(2, mde.itemid);
                ps.setInt(3, mde.min);
                ps.setInt(4, mde.max);
                ps.setInt(5, mde.questid);
                ps.setInt(6, mde.chance);
                ps.addBatch();
            }
        }

        for (List<ReactorDropEntry> mdes : rdrop_final.values()) {
            for (ReactorDropEntry mde : mdes) {
                ps2.setInt(1, mde.reactorid);
                ps2.setInt(2, mde.itemid);
                ps2.setInt(3, mde.chance);
                ps2.setInt(4, mde.questid);
                ps2.setInt(5, mde.min);
                ps2.setInt(6, mde.max);
                ps2.addBatch();
            }
        }

        for (MapleQuest quest : MapleQuest.getAllInstances()) {
            for (MapleQuestAction act : quest.getCompleteActs()) {
                if (act.getItems() == null) {
                    continue;
                }
                for (QuestItem qitem : act.getItems()) {
                    if (qitem.count < 0 && MapleItemInformationProvider.getInstance().isQuestItem(qitem.itemid)) {
                        if (!questdrops.contains(Integer.valueOf(qitem.itemid))) {
                            System.out.println(qitem.itemid + " : " + (ii.getName(qitem.itemid)) + " (" + quest.getId() + " - " + quest.getName() + ")");
                        }
                    }
                }
            }
        }

        ps.executeBatch();
        ps2.executeBatch();
        ps.close();
        ps2.close();
        System.out.println("Job Done. Elapsed Time : " + (System.currentTimeMillis() - start) + "ms");
    }

    public static class MobDropEntry {

        public MobDropEntry(int mobid, int itemid, int chance, int min, int max, int questid) {
            this.mobid = mobid;
            this.itemid = itemid;
            this.chance = chance;
            this.min = min;
            this.max = max;
            this.questid = questid;
        }
        public int mobid;
        public int itemid;
        public int chance;
        public int min;
        public int max;
        public int questid;
    }

    public static class ReactorDropEntry {

        public ReactorDropEntry(int mobid, int itemid, int chance, int min, int max, int questid) {
            this.reactorid = mobid;
            this.itemid = itemid;
            this.chance = chance;
            this.min = min;
            this.max = max;
            this.questid = questid;
        }
        public int reactorid;
        public int itemid;
        public int chance;
        public int min;
        public int max;
        public int questid;
    }
    static final Map<Integer, String> mobnames = new HashMap<>();

    public static String getMobName(int mid) {
        if (mobnames.isEmpty()) {
            MapleDataProvider p = MapleDataProviderFactory.getDataProvider(new File("wz/String.wz"));
            MapleData d = p.getData("Mob.img");
            for (MapleData dd : d) {
                mobnames.put(Integer.parseInt(dd.getName()), MapleDataTool.getString("name", dd, "null"));
            }
        }
        return mobnames.get(mid);
    }
}
