importPackage(Packages.server.maps);
importPackage(Packages.server.life);
var status = 0;
function action(mode, type, selection)
{
    if (mode <= 0) {
        cm.dispose();
        return;
    }
    status++;
    
    if (cm.getPlayer().getMapId() == 200000200) {
        if (cm.getPlayer().isQuestActive(3048)) {
            cm.sendOk(".?");
            cm.dispose();
        } else {
            cm.sendOk("[엘마의 네펜데스 주스] 퀘스트를 받은 상태에서 버그 픽스를 위한 엔피시 입니다. 음.. 당신은 제가 필요하지 않을 것 같군요.");
            cm.dispose();
        }
        return;
    } else if (cm.getPlayer().getMapId() == 910000022) {
        if (cm.getPlayer().hasGmLevel(6)) {
           var map = cm.getPlayer().getMap();
           map.setCommandTimer(java.lang.System.currentTimeMillis() + 3600000);
           map.changeMusic("Bgm14/HonTale");   
        }
	cm.dispose();
        return;
    } else if (cm.getPlayer().getMapId() == 910000021) {
        if (cm.getPlayer().hasGmLevel(6)) {
           var map = cm.getClient().getChannelServer().getMapFactory().getMap(910000000);
           var chrs = map.getCharacters();
           var strz = "";
           strz += "Total : " + chrs.size() + "\r\n\r\n";
           for (var i = 0 ; i < chrs.size(); ++i)
           {
               var chr = chrs.get(i);
               if (java.lang.System.currentTimeMillis() - chr.getChangeTime() > 60000) {
                   strz += chrs.get(i).getName() + ", ";                   
               } else {
                   //strz += (chr.getChangeTime() - java.lang.System.currentTimeMillis()) + "";
               }
           }
           cm.sendOk(strz);
        } else {
           cm.sendOk("꺼지라");
        }
	cm.dispose();
        return;
    } else if (cm.getPlayer().getMapId() == 200000301) {
        if (cm.getPlayer().hasGmLevel(6)) {
            
            var t = 3;
            if (t == 0) {
                var gs = new Array("Secret", "현재접속중", "스캔들", "Galaxy", "Eclipse", "추억즐기기");
                var num = java.lang.Math.floor(java.lang.Math.random() * gs.length);
                var sels = new Array(num, -1);
                
                while (true) {
                    num = java.lang.Math.floor(java.lang.Math.random() * gs.length);
                    if (num != sels[0]) {
			sels[1] = num;
                        break;
                    }
                }
                
                cm.mapMessage(6, "(연습) 선택된 길드 : " + gs[sels[0]] + ", " + gs[sels[1]]);
                
            } else if ( t == 1) {
                cm.mapMessage(5, "데스매치 결과로 선택된 길드 : Secret, 스캔들");
                cm.mapMessage(1, "데스매치 결과로 선택된 길드 : Secret, 스캔들");
            } else if (t == 2) {
		Packages.handling.world.World.Guild.disbandGuild(48);
		Packages.handling.world.World.Guild.disbandGuild(75);
            } else if (t == 3) {
		var guild = Packages.handling.world.World.Guild.getGuild(cm.getPlayer().getGuildId());
                if (guild != null) {
                    //guild.gainGP(-2000, true);
                    //cm.playerMessage(guild.getGP()+"");
                    //var b = false;//guild.increaseCapacity(true);
                    //cm.guildMessage(b + " / gp " + guild.getGP()+" / capacity " + guild.getCapacity());
                }
            }
        } else {
            cm.sendOk("none");
        }
        cm.dispose();
        return;
    }

    if (cm.getPlayer().hasGmLevel(6)) {
        var map = cm.getPlayer().getMap();
        if (status == 1) {
            cm.sendYesNo("8510000 : " + map.countMonsterById(8510000));
            return;
        }
        if (map.countMonsterById(8510000) > 0) {
            var mob = map.getMonsterById(8510000);
            if (mob.getController() != null) {
                var chr = mob.getController();
                chr.stopControllingMonster(mob);
                mob.setController(null);
                mob.setControllerHasAggro(false);
            }
            map.updateMonsterController(mob);
        }
        /*
         if (status == 1) {
         cm.sendGetNumber("map",0,0,999999999);
         return;
         }
         var mapFactory = new MapleMapFactory(cm.getClient().getChannel());
         var map = selection;
         var mapInstance = mapFactory.getMap(map);
         cm.getPlayer().changeMap(mapInstance);
         */
    }
    cm.dispose();
}