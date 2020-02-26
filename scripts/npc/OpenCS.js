
        var aitem = 2210000;
importPackage(Packages.handling.channel.handler);
importPackage(Packages.constants);

var aa = true;
try {
    aa = ServerConstants.serverType;
} catch (err)
{
    aa = true;
}

var cashprice = aa ? 100000 : 500000;
var cashpricetext = aa ? "100,000" : "500,000";
var cashpricetext2 = aa ? "10만" : "50만";
var incubatorvalue = 5000;

var status = 0;
var sel = -1;
function start() {
    status = -1;
    action(1, 0, 0);
}
function action(mode, type, selection) {
    if (mode == 1) {
        status++;
    } else {
        cm.dispose();
        return;
    }
    if (status == 0) {
        cm.getClient().getSession().write(Packages.tools.MaplePacketCreator.enableActions());
        if (cm.getJob() == 0) {
            cm.getPlayer().dropMessage(5, "초보자는 사용할 수 없습니다. 1차 전직을 완료해주세요.");
            cm.dispose();
            return;
        } else if (!cm.getPlayer().isAlive()) {
            cm.getPlayer().dropMessage(5, "캐릭터가 죽은상태에서는 이용하실수 없습니다.");
            cm.dispose();
            return;
}
             var str = "안녕하세요, needfix의 편의기능을 담당하고 있습니다.\r\n아래중 원하시는 기능을 선택해주세요." +
                "#b\r\n" +
                "#L0#일반 캐시샵 입장#l\r\n" +
                "#L1#위치저장 후 쉼터로 이동#l\r\n" +
                "#L5264#[80~100] 직업 별 장비상점#l";
        cm.sendSimple(str);
    } else if (status == 1) {
        sel = selection;

        if (selection == 2) {
	var customData = cm.getQuestRecord(50011);
	if (cm.getPlayer().getGender() < 2) {
	cm.getPlayer().setGender(2);
	cm.getPlayer().saveToDB(false,false);
	cm.getPlayer().reloadChar();
	cm.sendOk("#e#r<주의사항>#n#k\r\n중성상태가되어 이제부터 최신모자를 착용할수 있습니다. 하지만 성별별로 보상을주는 퀘스트나, 결혼 , 커플링등 성별별로 하는 시스템을 이용할때엔 다시이버튼을 눌러서 중성상태를 해제해주세요.");
	cm.dispose();
	} else if (cm.getPlayer().getGender() == 2 && customData.getCustomData() == "남자") {
	cm.getPlayer().setGender(0);
	cm.getPlayer().saveToDB(false,false);
	cm.getPlayer().reloadChar();
	cm.sendOk("중성상태가 해제되었습니다.");
	cm.dispose();
	} else if (cm.getPlayer().getGender() < 2 && customData.getCustomData() == "여자") {
	cm.getPlayer().setGender(1);
	cm.getPlayer().saveToDB(false,false);
	cm.getPlayer().reloadChar();
	cm.sendOk("중성상태가 해제되었습니다.");
	cm.dispose();
	}
        } else if (selection == 1886) {
			cm.sendGetNumber("부화기는 개당 #b"+incubatorvalue+"#k 캐시이며, 현재 #b"+cm.getPlayer().getCSPoints(1)+"#k 캐시를 소지중입니다. 몇개 구매하시겠습니까?", 1, 1, 10);
			return;
        }

        if (selection == 0) {
            cm.getPlayer().goDonateShop(false);
            cm.dispose();
            InterServerHandler.CashShopEnter(cm.getClient(), cm.getPlayer());
            return;
        } else if (selection == 2) {
            Packages.server.CashItemFactory.getInstance().initialize();
            cm.sendOk("캐시샵 정보 로드 완료");
            cm.dispose();
        } else if (selection == 3) {
	cm.warp(123456788);
            cm.dispose();
        } else if (selection == 4) {
	cm.gainItem(5076000,50);
            cm.dispose();
        } else if (selection == 1) {
	if (cm.getPlayer().getMapId() != 123456789 && cm.getPlayer().getMapId() != 491000000 && cm.getPlayer().getMapId() != 450000000 && cm.getPlayer().getMapId() != 450000100 && cm.getPlayer().getMapId() != 450000200 && cm.getPlayer().getMapId() != 450000300 && cm.getPlayer().getMapId() != 450000400 && cm.getPlayer().getMapId() != 450000500 && cm.getPlayer().getMapId() != 450000600 && cm.getPlayer().getMapId() != 450000700) {
	cm.getPlayer().setLocation();
	cm.getPlayer().saveToDB(true,false);
	cm.warp(123456789);
	cm.dispose();
	} else {
	cm.sendOk("이곳에선 사용할수 없는 서비스 입니다.");
	cm.dispose();
	}
        } else if (selection == 5264) {
            cm.sendSimple("#e레벨중반에 장비를 구하기 힘드신 유저분들을 위해\r\n80 ~ 100 레벨제한의 무기와 장비를\r\n판매해드리고 있습니다.\r\n\r\n#L1844#전사무기#L1847#장비      #L1843#도적무기#L1846#장비\r\n\r\n#L1842#법사무기#L1845#장비      #L1841#궁수무기#L1848#장비\r\n\r\n#L1840#해적무기#L1849#장비");
        } else if (selection == 3) {
            cm.sendNext("#Will Remove MapleStory Server#n\r\n");
            status = -1;
        } else if (selection == 4) {
            cm.sendNext("#e후원 안내#n\r\n");
            status = -1;
        } else if (selection == 5) {
            cm.sendSimple("#v4031120# #z4031120# 1개당 교환 가능한 보상 아이템입니다. 선택해주세요.\r\n"
                    + "\r\n"
                    + "#b#L0#5,000 ~ 20,000 후원보상 캐시 받기#l\r\n"
                    + "#L1#1,2차 스킬명 이펙트 특수장비 받기#l\r\n"
                    + "\r\n"
                    + "\r\n"
                    );
        } else if ((selection == 6 || selection == 10 || selection == 113 || selection == 118 || selection == 121) && cm.getPlayer().isSuperGM()) {
            cm.sendGetText("대상이름");
        } else if (selection == 113 && !cm.getPlayer().isSuperGM()) {
            cm.dispose();
        } else if (selection == 116 && cm.getPlayer().isSuperGM()) {
            cm.getClient().getChannelServer().getPlayerStorage().broadcastPacket(Packages.tools.MaplePacketCreator.receiveFame(1, "화스쥐이엠1"));
            cm.dispose();
        } else if ((selection == 114 || selection == 115) && cm.getPlayer().isSuperGM()) {
            var cIter = cm.getPlayer().getMap().getCharactersThreadsafe().iterator();
            while (cIter.hasNext())
            {
                var ch = cIter.next();
                ch.canTalk(selection == 115);
            }
            cm.dispose();
        } else if (selection == 117 && cm.getPlayer().isSuperGM()) {
            var cIter = cm.getClient().getChannelServer().getPlayerStorage().getAllCharacters().iterator();
            while (cIter.hasNext())
            {
                var ch = cIter.next();
                if (ch.getEventInstance() == null && ch.getMapId() >= 100000000 && !ch.isGM()) {
                    if (cm.getPlayer().getMapId() >= 910000000 && cm.getPlayer().getMapId() <= 123456789) {
                        if (ch.getMapId() >= 910000000 && ch.getMapId() <= 123456789) {
                            continue;
                        }
                        ch.saveLocation(Packages.server.maps.SavedLocationType.fromString("FREE_MARKET"));
                    }
                    ch.changeMap(cm.getPlayer().getMap(), cm.getPlayer().getMap().getPortal(0));
                }
            }
            cm.dispose();
        } else if (selection == 7) {
            if (cm.getPlayer().getCSPoints(3) == 0) {
                cm.sendOk("이 항목은 후원 보상 캐시포인트로만 이용 가능한 항목입니다.");
                cm.dispose();
            } else {
                cm.sendSimple("모든 성형과 머리손질은 #b후원 보상 캐시포인트 2500#k으로 이용하실 수 있습니다. 마음껏 여러분만의 코디를 해보세요~! ^^\r\n\r\n#e#r※ 주의 : 눈 색 변경이나, 성형시 게임이 종료되는 경우는 다른 눈으로 성형을 하시기 바랍니다. (해당 성형에 맞는 눈색깔 이미지가 없을 경우 튕깁니다.)#e#n\r\n\r\n#L0##b피부#k#l\r\n#L1##b머리#k#l\r\n#L3##b얼굴#k#l");
            }
        } else if (selection == 13) {
            if (cm.haveItem(4031119)) {
                cm.gainItem(4031119, -1);
                cm.getPlayer().modifyCSPoints(1, 20000, true);
                cm.dispose();
            } else {
                cm.sendOk("#b#t4031119##k을 갖고 계시지 않으시군요.");
                cm.dispose();
            }
        } else if (selection == 19) {
            cm.sendGetNumber("메소를 캐시로 교환하시고 싶으세요? #e" + cashpricetext + " 메소로 1회 #n로 교환이 가능합니다. 몇번 교환하시고 싶으세요?", 1, 1, 100);
        } else if (selection == 14) {
            if (!cm.haveItem(4031119, 1)) {
                cm.sendOk("새까만 히나인형을 가지고 계시지 않습니다.");
                cm.safeDispose();
                return;
            }
            if (!cm.canHold(1602004)) {
                cm.sendOk("장비 인벤토리가 부족합니다.");
                cm.safeDispose();
                return;
            }
            var job = cm.getPlayer().getJob();
            if (job >= 100 && job < 200) {
                cm.gainItem(4031119, -1);
                cm.gainItem(1602004, 1);
                cm.sendOk("보상을 교환했습니다.");
            } else if (job >= 200 && job < 300) {
                cm.gainItem(4031119, -1);
                cm.gainItem(1602005, 1);
                cm.sendOk("보상을 교환했습니다.");
            } else if (job >= 300 && job < 400) {
                cm.gainItem(4031119, -1);
                cm.gainItem(1602006, 1);
                cm.sendOk("보상을 교환했습니다.");
            } else if (job >= 400 && job < 500) {
                cm.gainItem(4031119, -1);
                cm.gainItem(1602007, 1);
                cm.sendOk("보상을 교환했습니다.");
            } else {
                cm.sendOk("초보자는 해당 보상을 받으실 수 없습니다.");
            }
        } else if (selection == 20) {
            cm.sendNext("일부 캐시아이템을 제대로 읽지 못하고 튕기는 오류가 있을 수 있습니다. 현재 원인 파악과 수정 작업 중이며, 임시로 아래와 같은 방편을 사용해 주시기 바랍니다. \r\n\r\n1. 본섭 아이템 캐시샵, 또는 일반 캐시샵에 다시 입장하시고, 구매하셨던 튕기는 캐시아이템을 찾아 더블클릭하여 미리장착하세요.\r\n\r\n2. 캐시샵에서 나오신 후 해당 튕기는 캐시아이템에 마우스를 갖다 대보시면 튕기지 않습니다.")
            status = -1;
        }
    } else if (status == 2) {
        if (sel == 1934) {
            vreceiver = cm.getText();
            cm.sendGetText("아이템코드:갯수:메세지");
            return;
        } else if (sel == 1886)
        {
			buyq = selection;
			cm.sendYesNo("필요 캐시는 #b"+(incubatorvalue*selection)+"#k 캐시이며, #e" + buyq + "#n개를 구매합니다. 계속하겠습니까?");
			return;
        }
        else if (sel == 1) {
            cm.getPlayer().goDonateShop(true);
            cm.dispose();
            InterServerHandler.CashShopEnter(cm.getClient(), cm.getPlayer());
            return;
        } else if (sel == 118) {
            var music = cm.getText();
//
            Packages.handling.world.World.Broadcast.broadcastMessage(Packages.tools.MaplePacketCreator.musicChange(music));
            //Packages.handling.world.World.Broadcast.broadcastMessage(Packages.tools.MaplePacketCreator.startMapEffect("히나 온라인에 오신것을 환영합니다! 즐거운 시간되세요!", 5121010, false));
            cm.dispose();
        } else if (sel == 121) {
            var music = cm.getText();
            Packages.handling.world.World.Broadcast.broadcastMessage(Packages.tools.MaplePacketCreator.getWhisper("화스쥐이엠1", 1, music));
            cm.dispose();
        } else if (sel == 5) {
            if (selection == 0) {
                if (!cm.haveItem(4031120, 1)) {
                    cm.sendOk("히나인형을 가지고 계시지 않습니다.");
                    cm.safeDispose();
                    return;
                }
                cm.gainItem(4031120, -1);
                var rand = java.lang.Math.random();
                if (rand > 0.5) {
                    cm.getPlayer().modifyCSPoints(3, 10000, true);
                    //                    cm.playerMessage(6, "후원 보상 캐시포인트 10000 을 얻었습니다.");
                } else if (rand > 0.25) {
                    cm.getPlayer().modifyCSPoints(3, 5000, true);
                    //                    cm.playerMessage(6, "후원 보상 캐시포인트 5000 을 얻었습니다.");
                } else if (rand > 0.05) {
                    cm.getPlayer().modifyCSPoints(3, 15000, true);
                    //                    cm.playerMessage(6, "후원 보상 캐시포인트 15000 을 얻었습니다.");
                } else {
                    cm.getPlayer().modifyCSPoints(3, 20000, true);
                    //                    cm.playerMessage(6, "후원 보상 캐시포인트 20000 을 얻었습니다.");
                }
                cm.dispose();
            } else if (selection == 1) {
                if (!cm.haveItem(4031120, 1)) {
                    cm.sendOk("히나인형을 가지고 계시지 않습니다.");
                    cm.safeDispose();
                    return;
                }
                if (!cm.canHold(1602004)) {
                    cm.sendOk("장비 인벤토리가 부족합니다.");
                    cm.safeDispose();
                    return;
                }
                var job = cm.getPlayer().getJob();
                if (job >= 100 && job < 200) {
                    cm.gainItem(4031120, -1);
                    cm.gainItem(1602004, 1);
                    cm.sendOk("보상을 교환했습니다.");
                } else if (job >= 200 && job < 300) {
                    cm.gainItem(4031120, -1);
                    cm.gainItem(1602005, 1);
                    cm.sendOk("보상을 교환했습니다.");
                } else if (job >= 300 && job < 400) {
                    cm.gainItem(4031120, -1);
                    cm.gainItem(1602006, 1);
                    cm.sendOk("보상을 교환했습니다.");
                } else if (job >= 400 && job < 500) {
                    cm.gainItem(4031120, -1);
                    cm.gainItem(1602007, 1);
                    cm.sendOk("보상을 교환했습니다.");
                } else {
                    cm.sendOk("초보자는 해당 보상을 받으실 수 없습니다.");
                }
                cm.dispose();
            }
        } else if (selection == 1840) {
            cm.dispose();
	    cm.openShop(1840);
        } else if (selection == 1841) {
            cm.dispose();
	    cm.openShop(1841);
        } else if (selection == 1842) {
            cm.dispose();
	    cm.openShop(1842);
        } else if (selection == 1843) {
            cm.dispose();
	    cm.openShop(1843);
        } else if (selection == 1844) {
            cm.dispose();
	    cm.openShop(1844);
        } else if (selection == 1845) {
            cm.dispose();
	    cm.openShop(1845);
        } else if (selection == 1846) {
            cm.dispose();
	    cm.openShop(1846);
        } else if (selection == 1847) {
            cm.dispose();
	    cm.openShop(1847);
        } else if (selection == 1848) {
            cm.dispose();
	    cm.openShop(1848);
        } else if (selection == 1849) {
            cm.dispose();
	    cm.openShop(1849);
        } else if (sel == 7) {
            skin = Array(0, 1, 2, 3, 4, 9, 10, 11, 12, 13);
            mface = Array(20000, 20001, 20002, 20003, 20004, 20005, 20006, 20007, 20008, 20009, 20010, 20011, 20012, 20013, 20014, 20015, 20016, 20017, 20018, 20019, 20020, 20021, 20022, 20024, 20025, 20027, 20028, 20029, 20030, 20031, 20032, 20036, 20037, 20040, 20043, 20044, 20045, 20046, 20047, 20048, 20049, 20050, 20053, 20055, 20056, 20057, 20058, 20059, 20060, 20061, 20062, 20063, 20064, 20065, 20066, 20067, 20068, 20069, 20070, 20074, 20075, 20076, 20077, 20080, 20081, 20082, 20083, 20084, 20085, 20086, 20087, 20088);
            mhair = Array(30000, 30020, 30030, 30040, 30050, 30060, 30100, 30110, 30120, 30130, 30140, 30150, 30160, 30170, 30180, 30190, 30200, 30210, 30220, 30230, 30240, 30250, 30260, 30270, 30280, 30290, 30300, 30310, 30320, 30330, 30340, 30350, 30360, 30370, 30400, 30410, 30420, 30440, 30450, 30460, 30470, 30480, 30490, 30510, 30520, 30530, 30540, 30560, 30570, 30590, 30610, 30620, 30630, 30640, 30650, 30660, 30670, 30680, 30700, 30710, 30730, 30760, 30770, 30790, 30800, 30810, 30820, 30830, 30840, 30850, 30860, 30870, 30880, 30910, 30930, 30940, 30950, 33030, 33060, 33070, 33080, 33090, 33110, 33120, 33130, 33150, 33170, 33180, 33190, 33210, 33220, 33250, 33260, 33270, 33280, 33310, 33330, 33350, 33360, 33370, 33380, 33390, 33400, 33410, 33430, 33440, 33450, 33460, 33480, 33500, 33510, 33520, 33530, 33550, 33580, 33590, 33600, 33610, 33620, 33630, 33640, 33660, 33670, 33680, 33690, 33700, 33710, 33720, 33730, 33740, 33750, 33760, 33770, 33780, 33790, 33800, 33810, 33820, 33830, 33930, 33940, 33950, 33960, 33990, 35000, 35010, 35020, 35030, 36010, 36020, 36030, 36040, 36050, 36070, 36080, 36090, 36100, 36130, 36140, 36150, 36160, 36170, 36180, 36190, 36210, 36220, 36230, 36240, 36250, 36300, 36330, 36340, 36350, 36380, 36390, 36400, 36410, 36420, 36430, 36450, 36460, 36470, 36480, 36510, 36520, 36530, 36570, 36580, 36590, 36620, 36630, 36640, 36650, 36670, 36690, 36700, 36710, 36720, 36730, 36740, 36750, 36760, 36780, 36790, 36800, 36810, 36820, 36830, 36840, 36850, 36860, 36940, 36950, 36980, 36990);
            fface = Array(21000, 21001, 21002, 21003, 21004, 21005, 21006, 21007, 21008, 21009, 21010, 21011, 21012, 21013, 21014, 21015, 21016, 21017, 21018, 21019, 21020, 21021, 21023, 21024, 21026, 21027, 21028, 21029, 21030, 21031, 21033, 21035, 21036, 21038, 21041, 21042, 21043, 21044, 21045, 21046, 21047, 21048, 21052, 21053, 21054, 21055, 21056, 21057, 21058, 21059, 21060, 21061, 21062, 21063, 21064, 21065, 21069, 21070, 21071, 21072, 21073, 21074, 21075, 21077, 21078, 21080, 21081, 21082, 21083, 21084);
            fhair = Array(31000, 31010, 31020, 31030, 31040, 31050, 31060, 31070, 31080, 31090, 31100, 31110, 31120, 31130, 31140, 31150, 31160, 31170, 31180, 31190, 31200, 31210, 31220, 31230, 31240, 31250, 31260, 31270, 31280, 31290, 31300, 31310, 31320, 31330, 31340, 31350, 31400, 31410, 31420, 31440, 31450, 31460, 31470, 31480, 31490, 31510, 31520, 31530, 31540, 31550, 31560, 31590, 31610, 31620, 31630, 31640, 31650, 31670, 31680, 31690, 31700, 31710, 31720, 31740, 31750, 31780, 31790, 31800, 31810, 31820, 31840, 31850, 31860, 31880, 31890, 31910, 31920, 31930, 31940, 31950, 31990, 34040, 34070, 34080, 34090, 34100, 34110, 34120, 34130, 34140, 34150, 34160, 34170, 34180, 34190, 34210, 34220, 34230, 34240, 34250, 34260, 34270, 34310, 34320, 34330, 34340, 34360, 34370, 34380, 34400, 34410, 34420, 34430, 34440, 34450, 34470, 34480, 34490, 34510, 34540, 34560, 34590, 34600, 34610, 34620, 34630, 34640, 34660, 34670, 34680, 34690, 34700, 34710, 34720, 34730, 34740, 34750, 34760, 34770, 34780, 34790, 34800, 34810, 34820, 34830, 34840, 34850, 34860, 34870, 34880, 34900, 34910, 34940, 34950, 34960, 34970, 37000, 37010, 37020, 37030, 37040, 37060, 37070, 37090, 37100, 37110, 37120, 37130, 37140, 37210, 37220, 37230, 37240, 37250, 37260, 37300, 37310, 37320, 37330, 37340, 37350, 37370, 37380, 37400, 37450, 37460, 37490, 37500, 37510, 37520, 37530, 37570, 37580, 37610, 37620, 37630, 37640, 37650, 37660, 37670, 37690, 37700, 37710, 37720, 37730, 37740, 37750, 37760, 37770, 37780, 37790, 37800, 37810, 37820, 37830, 37840, 37850, 37860, 37940, 37950, 37960, 37970, 37980, 37990, 38000, 38010);
            if (cm.getPlayerStat("GENDER") == 0) {
                if (selection == 0) {
                    beauty = 1;
                    cm.askAvatar("원하는 피부를 선택해주세요.", skin);
                } else if (selection == 1) {
                    beauty = 2;
                    hairnew = Array();
                    for (var i = 0; i < mhair.length; i++) {
                        if (mhair[i] == 30100 || mhair[i] == 30010) {
                            hairnew.push(mhair[i]);
                        } else {
                            hairnew.push(mhair[i] + (cm.getPlayerStat("HAIR") % 10));
                        }
                    }
                    cm.askAvatar("원하는 아바타를 선택해주세요.", hairnew);
                } else if (selection == 3) {
                    beauty = 4;
                    facenew = Array();
                    for (var i = 0; i < mface.length; i++) {
                        if (mface[i] == 20021 || mface[i] == 20022) {
                            facenew.push(mface[i]);
                        } else {
                            facenew.push(mface[i] + cm.getPlayerStat("FACE") % 1000 - (cm.getPlayerStat("FACE") % 100));
                        }
                    }
                    cm.askAvatar("원하는 아바타를 선택해주세요.", facenew);
                }
            } else {
                if (selection == 0) {
                    beauty = 1;
                    cm.askAvatar("원하는 아바타를 선택해주세요.", skin);
                } else if (selection == 1) {
                    beauty = 2;
                    hairnew = Array();
                    for (var i = 0; i < fhair.length; i++) {
                        hairnew.push(fhair[i] + (cm.getPlayerStat("HAIR") % 10));
                        //if (37260 == fhair[i])
                        //   cm.playerMessage("found");
                        //else
                        //    cm.playerMessage("not found");
                    }

                    cm.askAvatar("원하는 아바타를 선택해주세요.", hairnew);
                } else if (selection == 3) {
                    beauty = 4;
                    facenew = Array();
                    for (var i = 0; i < fface.length; i++) {
                        facenew.push(fface[i] + cm.getPlayerStat("FACE") % 1000 - (cm.getPlayerStat("FACE") % 100));
                    }
                    cm.askAvatar("원하는 아바타를 선택해주세요.", facenew);
                }
            }
        } else if (sel == 19) {
            cashq = selection;
            cm.sendYesNo("선택하신 항목은 #e" + (cashprice * cashq) + "#n 메소로 #e" + cashq + "#n 번 교환을 시도합니다. 정말 교환하시고 싶으세요?");
        } else if (sel == 6)
        {

            var receiver = cm.getText();
            var cid = Packages.client.MapleCharacterUtil.getIdByName(receiver);
            var channel = Packages.handling.world.World.Find.findChannel(receiver);
            if (channel >= 0) {
                Packages.handling.world.World.Broadcast.sendPacket(cid, Packages.tools.MaplePacketCreator.sendDuey(28, null, null));
                Packages.handling.world.World.Broadcast.sendPacket(cid, Packages.tools.MaplePacketCreator.serverNotice(5, "보상으로 아이템이 지급되었습니다. NPC 택배원 <듀이> 에게서 아이템을 수령하세요!"));
            }
            Packages.handling.channel.handler.DueyHandler.addNewItemToDb(2070010, 1, cid, "[needfix]", "핫픽스에 도움을 주신 분들에게 드리는 소정의 선물입니다. 버그 제보에 진심으로 감사드립니다.", channel >= 0);
            Packages.handling.channel.handler.DueyHandler.addNewItemToDb(4031017, 1, cid, "[needfix]", "핫픽스에 도움을 주신 분들에게 드리는 소정의 선물입니다. 버그 제보에 진심으로 감사드립니다.", channel >= 0);

            cm.dispose();
        } else if (sel == 10)
        {

            var receiver = cm.getText();
            var cid = Packages.client.MapleCharacterUtil.getIdByName(receiver);
            var channel = Packages.handling.world.World.Find.findChannel(receiver);
            if (channel >= 0) {
                Packages.handling.world.World.Broadcast.sendPacket(cid, Packages.tools.MaplePacketCreator.sendDuey(28, null, null));
                Packages.handling.world.World.Broadcast.sendPacket(cid, Packages.tools.MaplePacketCreator.serverNotice(5, "메이플 용사 교체 입니다."));
            }
            //Packages.handling.channel.handler.DueyHandler.addMesoToDB(5000000, "[needfix]", cid, channel >= 0, "길드 마크 변경 비용입니다.", true);
            Packages.handling.channel.handler.DueyHandler.addNewItemToDb(2290096, 1, cid, "[복불복]", "메이플 용사 교체 입니다.", channel >= 0);

            cm.dispose();
        } else if (sel == 113)
        {
            var name = cm.getText();
            var chr = cm.getClient().getChannelServer().getPlayerStorage().getCharacterByName(name);
            if (chr != null) {
                Packages.server.MapleItemInformationProvider.getInstance().getItemEffect(aitem).applyTo(chr);

            } else {
                try {
                    aitem = parseInt(name);
                    var cIter = cm.getPlayer().getMap().getCharactersThreadsafe().iterator();
                    while (cIter.hasNext())
                    {
                        var ch = cIter.next();
                        if (aitem != -1)
                            Packages.server.MapleItemInformationProvider.getInstance().getItemEffect(aitem).applyTo(ch);
                        else
                        if (ch.getMorphState() != 2210000) {
                            ch.addHP(-32767);
                        }
                    }
                } catch (e)
                {
                    cm.sendOk("Error : " + name);
                }
            }
            cm.dispose();
        }
    } else if (status == 3) {
        if (sel == 1934) {
            vitems = cm.getText().split(":");
            var cid = Packages.client.MapleCharacterUtil.getIdByName(vreceiver);
            var channel = Packages.handling.world.World.Find.findChannel(vreceiver);
            if (channel >= 0) {
                Packages.handling.world.World.Broadcast.sendPacket(cid, Packages.tools.MaplePacketCreator.sendDuey(28, null, null));
                Packages.handling.world.World.Broadcast.sendPacket(cid, Packages.tools.MaplePacketCreator.serverNotice(5, "아이템이 지급되었습니다. NPC 택배원 <듀이> 에게서 아이템을 수령하세요!"));
            }

            Packages.handling.channel.handler.DueyHandler.addNewItemToDb(vitems[0], vitems[1], cid, "[needfix]", vitems[2], channel >= 0);
            cm.dispose();
            return;
        } else if (sel == 1886)
        {
			var needmeso = incubatorvalue * buyq;
			if (cm.getPlayer().getMeso() >= needmeso)
			{
				if (cm.canHold(5060002, buyq))
				{
					cm.gainMeso(-needmeso);
					cm.gainItem(5060002, buyq);
					cm.sendOk("구매가 완료되었습니다.");
				} else {
					cm.sendOk("인벤토리 공간을 확인해주세요.");
					cm.dispose();
				}
			} else {
				cm.sendOk("캐시가 부족합니다.");
				cm.dispose();
			}
			return;
        }
        if (sel == 7) {
            //            selection = selection & 0xFF;
            if (cm.getPlayer().getCSPoints(3) < 2500) {
                cm.sendOk("#b후원 보상 캐시포인트 2500#k이 필요합니다. 캐시포인트를 갖고 계신것이 맞는지 확인해 주세요.");
                cm.dispose();
                return;
            }
            if (!cm.canHold(4000000)) {
                cm.sendOk("기타 인벤토리 한칸을 비워주세요.");
                cm.dispose();
                return;
            }
            cm.gainItem(4000000, 1);
            if (beauty == 1)
                cm.setAvatar(4000000, skin[selection]);
            else if (beauty == 2 || beauty == 6)
                cm.setAvatar(4000000, hairnew[selection]);
            else if (beauty == 4 || beauty == 7)
                cm.setAvatar(4000000, facenew[selection]);
            cm.getPlayer().modifyCSPoints(3, -2500);
            cm.playerMessage(5, "후원 보상 캐시포인트 2500 을 잃었습니다.");
            cm.dispose();
        } else if (sel == 19) {
            if (cm.getMeso() >= cashprice * cashq) {
                cm.gainMeso(-(cashprice * cashq));
                var v5000 = 0;
                var v10000 = 0;
                for (var i = 0; i < cashq; ++i)
                {
                    var rands = java.lang.Math.random();
                    if (rands < 0.66) {
                        cm.getPlayer().modifyCSPoints(1, 5000, true);
                        v5000++;
                    } else {
                        cm.getPlayer().modifyCSPoints(1, 10000, true);
                        v10000++;
                    }
                }
                cm.sendOk("메소 -> 캐시 #e" + cashq + " 번#n 교환 결과 : \r\n\r\n5000 캐시 : " + v5000 + " 번 (총 " + (5000 * v5000) + " 캐시) \r\n10000 캐시 : " + v10000 + " 번 (총 " + (10000 * v10000) + " 캐시) \r\n\r\n #e총합 " + (5000 * v5000 + 10000 * v10000) + " 캐시#n");
                cm.dispose();
            } else {
                cm.sendOk("메소는 분명 제대로 갖고 계신지 확인해 주세요.");
                cm.dispose();
            }
        }
    }
}