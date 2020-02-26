/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package tools.packet;

import client.MapleCharacter;
import handling.channel.ChannelServer;
import handling.world.World;
import java.util.ArrayList;
import java.util.List;
import tools.data.MaplePacketLittleEndianWriter;

/**
 *
 * @author
 */
public class EtcPacket {

    public static final int DONATE_SUCCESS = 0;
    public static final int DONATE_NOT_SUCH = 1;
    public static final int DONATE_UNKNOWN_ERROR = 2;

    public static byte[] getDonateResult(int status, int q) {
        MaplePacketLittleEndianWriter mplew = new MaplePacketLittleEndianWriter();
        mplew.write(0x01);
        mplew.write(status);
        if (status == 0) {
            mplew.writeInt(q);
        }
        return mplew.getPacket();
    }

    public static byte[] getServerMsgResult(int status) {
        MaplePacketLittleEndianWriter mplew = new MaplePacketLittleEndianWriter();
        mplew.write(0x02);
        mplew.write(status);
        return mplew.getPacket();
    }

    public static byte[] getServerStatus() {
        MaplePacketLittleEndianWriter mplew = new MaplePacketLittleEndianWriter();
        mplew.write(0x03);
        mplew.writeInt(ChannelServer.getInstance(1).getExpRate()); //exprate
        mplew.writeInt(ChannelServer.getInstance(1).getDropRate()); //droprate
        mplew.writeInt(ChannelServer.getInstance(1).getMesoRate()); //mesorate
        mplew.writeMapleAsciiString(ChannelServer.getInstance(1).getServerMessage());
        mplew.writeInt(ChannelServer.getChannelCount());
        List<String> gms = new ArrayList<>();
        for (ChannelServer cserv : ChannelServer.getAllInstances()) {
            mplew.writeMapleAsciiString(String.valueOf(cserv.getChannel() == 1 ? "1" : cserv.getChannel() == 2 ? "20세이상"
                    : cserv.getChannel() - 1));
            mplew.writeInt(cserv.getConnectedClients());
            for (MapleCharacter chr : cserv.getPlayerStorage().getAllCharacters()) {
                if (chr.hasGmLevel(3)) {
                    gms.add(chr.getName());
                }
            }
        }
        mplew.writeInt(World.getConnected().get(0));
        mplew.writeInt(gms.size());
        for (String gmname : gms) {
            mplew.writeMapleAsciiString(gmname);
        }
        return mplew.getPacket();
    }

    public static byte[] getChatResult(String type, String text) {
        MaplePacketLittleEndianWriter mplew = new MaplePacketLittleEndianWriter();
        mplew.write(0x04);
        mplew.writeMapleAsciiString(type);
        mplew.writeMapleAsciiString(text);
        return mplew.getPacket();
    }
}
