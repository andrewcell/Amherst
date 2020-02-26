
package client;
import tools.MaplePacketCreator;
import client.MapleClient;
import handling.channel.ChannelServer;
import java.sql.SQLException;
import java.util.logging.Level;
import java.util.logging.Logger;

public class EpionTOTO {

    public static void RandomResult(final MapleCharacter player) {
        int randoms = (int) (Math.floor(Math.random() * 5));
        if (randoms >= 1 && randoms <= 2) {
            player.updateTOTOresult(1, 1);
            player.updateTOTOresult(2, 0);
        } else if (randoms >= 3 && randoms <= 5) {
            player.updateTOTOresult(1, 0);
            player.updateTOTOresult(2, 1);
        } else {
            RandomResult(player);
        }
    }

    public static void StartTOTOMoney(final MapleCharacter player) {
        player.수금타임(true);
        player.getMap().broadcastMessage(MaplePacketCreator.playSound("Romio/discovery"));
        player.ServerNoticeY("[돈순이] 지금부터 홀짝 배팅을 시작합니다.");
        player.ServerNoticeY("[돈순이] 배팅에 참여하실분들은 5분안에 저에게 배팅금을 지불해주세요.");
        server.Timer.MapTimer tMan = server.Timer.MapTimer.getInstance();
        Runnable r = new Runnable() {
            @Override
            public void run() {
                StartTOTO(player);
                player.수금타임(false);
            }
        };
        tMan.schedule(r, 300 * 1000);
    }

    public static void StartTOTO(final MapleCharacter player) {
        player.getMap().broadcastMessage(MaplePacketCreator.playSound("Romio/discovery"));
        player.ServerNoticeY("[돈순이] 배팅금액 지불시간이 만료되었습니다.");
        player.ServerNoticeY("[돈순이] 홀짝 추첨을 시작합니다 결과는 1분후 공개됩니다.");
        server.Timer.MapTimer tMan = server.Timer.MapTimer.getInstance();
        Runnable r = new Runnable() {
            @Override
            public void run() {
                RandomResult(player);
                try {
                    if (player.getTOTOresult(1) == 1) {
                        player.ServerNoticeY("[돈순이] 이번 회 차 홀짝배팅 결과는 '홀' 입니다.");
                    } else {
                        player.ServerNoticeY("[돈순이] 이번 회 차 홀짝배팅 결과는 '짝' 입니다.");
                    }
                } catch (SQLException ex) {
                    Logger.getLogger(EpionTOTO.class.getName()).log(Level.SEVERE, null, ex);
                }
                player.ServerNoticeY("[돈순이] 당첨자 분들은 모두 저를통해 당첨금을 수령해주시기 바랍니다.");
                player.getMap().broadcastMessage(MaplePacketCreator.playSound("5th_Maple/gaga"));
            }
        };
        tMan.schedule(r, 60 * 1000);
    }
}
