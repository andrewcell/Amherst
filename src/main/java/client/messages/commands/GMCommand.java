/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package client.messages.commands;

import client.MapleCharacter;
import client.MapleCharacterUtil;
import client.MapleClient;
import client.messages.commands.InternCommand.벤;
import client.messages.commands.InternCommand.TempBan;
import constants.ServerConstants.PlayerGMRank;
import scripting.NPCScriptManager;
import tools.MaplePacketCreator;
import handling.channel.ChannelServer;
import handling.world.World;
import server.MedalRanking;
import server.marriage.MarriageManager;
import server.shops.MinervaOwlSearchTop;

/**
 *
 * @author Emilyx3
 */
public class GMCommand {

    public static PlayerGMRank getPlayerLevelRequired() {
        return PlayerGMRank.GM;
    }

    public static class Invincible extends CommandExecute {

        @Override
        public int execute(MapleClient c, String[] splitted) {
            MapleCharacter player = c.getPlayer();
            if (player.isInvincible()) {
                player.setInvincible(false);
                player.dropMessage(6, "Invincibility deactivated.");
            } else {
                player.setInvincible(true);
                player.dropMessage(6, "Invincibility activated.");
            }
            return 1;
        }
    }
        public static class 전체저장 extends CommandExecute {
        @Override
        public int execute(MapleClient c, String[] splitted) {
            // User Data Save Start
         for (ChannelServer ch : ChannelServer.getAllInstances())
             for (MapleCharacter chr : ch.getPlayerStorage().getAllCharacters())
            chr.saveToDB(true, true);
            // User Data Save End
            // Server Data Save Start
            World.Guild.save();
            World.Alliance.save();
            World.Family.save();
            MarriageManager.getInstance().saveAll();
            MinervaOwlSearchTop.getInstance().saveToFile();
            MedalRanking.saveAll();
            // Server Data Save End
            c.getPlayer().dropMessage(6, "저장이 완료되었습니다.");
            return 1;
        }
    }
      
    public static class xy extends CommandExecute {

        @Override
        public int execute(MapleClient c, String[] splitted) {
            String pos_str = "좌표 ";
            pos_str += ", x : " + (c.getPlayer().getPosition().x);
            pos_str += ", y : " + (c.getPlayer().getPosition().y);
            pos_str += ", Cy : " + (c.getPlayer().getPosition().y);
            pos_str += ", Rx0 : " + (c.getPlayer().getPosition().x + 50);
            pos_str += ", Rx1 : " + (c.getPlayer().getPosition().x - 50);
            pos_str += ", Fh : " + (c.getPlayer().getMap().getFootholds().findBelow(c.getPlayer().getPosition()).getId());
            pos_str += ", 맵ID : " + (c.getPlayer().getMap().getId());
            c.getPlayer().dropMessage(6,pos_str);
            return 1;
        }
            }
    public static class Cmds extends 명령어 {}

    public static class 명령어 extends CommandExecute {

        @Override
        public int execute(MapleClient c, String[] splitted) {
                        c.removeClickedNPC();
            NPCScriptManager.getInstance().dispose(c);
            c.getSession().write(MaplePacketCreator.enableActions());
            MapleCharacter player = c.getPlayer();
            player.dropMessage(6, "!접속자 : 현재 채널에 접속중인 사람");
            player.dropMessage(6, "!필드정리 : 현재 맵에 떨어진 아이템 모두 삭제");
            player.dropMessage(6, "!인벤정리 : (eqp , eq , u , s , e , c");
            return 1;
        }
    }


    public static class WhosThere extends CommandExecute {

        @Override
        public int execute(MapleClient c, String[] splitted) {
            StringBuilder builder = new StringBuilder("Players on Map: ").append(c.getPlayer().getMap().getCharactersThreadsafe().size()).append(", ");
            for (MapleCharacter chr : c.getPlayer().getMap().getCharactersThreadsafe()) {
                if (builder.length() > 150) { // wild guess :o
                    builder.setLength(builder.length() - 2);
                    c.getPlayer().dropMessage(6, builder.toString());
                    builder = new StringBuilder();
                }
                builder.append(MapleCharacterUtil.makeMapleReadable(chr.getName()));
                builder.append(", ");
            }
            builder.setLength(builder.length() - 2);
            c.getPlayer().dropMessage(6, builder.toString());
            return 1;
        }
    }

    public static class TempBanIP extends TempBan {

        public TempBanIP() {
            ipBan = true;
        }
    }

    public static class BanIP extends 벤 {

        public BanIP() {
            ipBan = true;
        }
    }

}
