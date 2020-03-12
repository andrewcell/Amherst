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
package client;

import constants.GameConstants;
import database.DatabaseConnection;
import handling.channel.ChannelServer;
import handling.world.World;
import java.nio.charset.Charset;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.regex.Pattern;
import tools.Triple;

public class MapleCharacterUtil {

    private static final Pattern namePattern = Pattern.compile("[a-zA-Z0-9가-힣]{2,12}");
    private static final Pattern petPattern = Pattern.compile("[a-zA-Z0-9가-힣]{2,12}");

    public static final boolean canCreateChar(final String name, final boolean gm) {
        if (getIdByName(name) != -1 || !isEligibleCharName(name, gm)) {
            return false;
        }
        return true;
    }

    public static final boolean isEligibleCharName(final String name, final boolean gm) {
        if (name.getBytes(Charset.forName("MS949")).length > 12) {
            return false;
        }
        if (gm) {
            return true;
        }
        if (name.getBytes(Charset.forName("MS949")).length < 3 || !namePattern.matcher(name).matches()) {
            return false;
        }
        for (String z : GameConstants.RESERVED) {
            if (name.indexOf(z) != -1) {
                return false;
            }
        }
        return true;
    }

    public static final boolean canChangePetName(final String name) {
        if (name.getBytes(Charset.forName("MS949")).length > 12) {
            return false;
        }
        if (name.getBytes(Charset.forName("MS949")).length < 3) {
            return false;
        }
        if (petPattern.matcher(name).matches()) {
            for (String z : GameConstants.RESERVED) {
                if (name.indexOf(z) != -1) {
                    return false;
                }
            }
            return true;
        }
        return false;
    }

    public static final String makeMapleReadable(final String in) {
        String wui = in.replace('I', 'i');
        wui = wui.replace('l', 'L');
        wui = wui.replace("rn", "Rn");
        wui = wui.replace("vv", "Vv");
        wui = wui.replace("VV", "Vv");
        return wui;
    }

    public static final int getAccIdByName(final String name) {
        Connection con = null;
        PreparedStatement ps = null;
        ResultSet rs = null;
        try {
            con = DatabaseConnection.getConnection();
            ps = con.prepareStatement("SELECT accountid FROM characters WHERE name LIKE ?");
            ps.setString(1, name);
            rs = ps.executeQuery();

            if (!rs.next()) {
                return -1;
            }
            final int id = rs.getInt("accountid");
            return id;
        } catch (SQLException e) {
            System.err.println("error 'getAccIdByName' " + e);
        } finally {
            if (con != null) {
                try {
                    con.close();
                } catch (Exception e) {
                }
            }
            if (rs != null) {
                try {
                    rs.close();
                } catch (Exception e) {
                }
            }
            if (ps != null) {
                try {
                    ps.close();
                } catch (Exception e) {
                }
            }
        }
        return -1;
    }

    public static final int getIdByName(final String name) {
        Connection con = null;
        PreparedStatement ps = null;
        ResultSet rs = null;
        try {
            con = DatabaseConnection.getConnection();
            ps = con.prepareStatement("SELECT id FROM characters WHERE name = ?");
            ps.setString(1, name);
            rs = ps.executeQuery();
            if (!rs.next()) {
                return -1;
            }
            final int id = rs.getInt("id");
            return id;
        } catch (SQLException e) {
            System.err.println("error 'getIdByName' " + e);
        } finally {
            if (con != null) {
                try {
                    con.close();
                } catch (Exception e) {
                }
            }
            if (rs != null) {
                try {
                    rs.close();
                } catch (Exception e) {
                }
            }
            if (ps != null) {
                try {
                    ps.close();
                } catch (Exception e) {
                }
            }
        }
        return -1;
    }

    // -2 = An unknown error occured
    // -1 = Account not found on database
    // 0 = You do not have a second password set currently.
    // 1 = The password you have input is wrong
    // 2 = Password Changed successfully
    public static final int Change_SecondPassword(final int accid, final String password, final String newpassword) {
        Connection con = null;
        PreparedStatement ps = null;
        ResultSet rs = null;
        try {
            con = DatabaseConnection.getConnection();
            ps = con.prepareStatement("SELECT * from accounts where id = ?");
            ps.setInt(1, accid);
            rs = ps.executeQuery();
            if (!rs.next()) {
                return -1;
            }
            String secondPassword = rs.getString("2ndpassword");
            final String salt2 = rs.getString("salt2");
            if (secondPassword != null && salt2 != null) {
                secondPassword = LoginCrypto.Companion.rand_r(secondPassword);
            } else if (secondPassword == null && salt2 == null) {
                return 0;
            }
            if (!check_ifPasswordEquals(secondPassword, password, salt2)) {
                return 1;
            }

            String SHA1hashedsecond;
            try {
                SHA1hashedsecond = LoginCryptoLegacy.encodeSHA1(newpassword);
            } catch (Exception e) {
                return -2;
            }
            ps = con.prepareStatement("UPDATE accounts set 2ndpassword = ?, salt2 = ? where id = ?");
            ps.setString(1, SHA1hashedsecond);
            ps.setString(2, null);
            ps.setInt(3, accid);

            if (!ps.execute()) {
                return 2;
            }
            return -2;
        } catch (SQLException e) {
            System.err.println("error 'getIdByName' " + e);
            return -2;
        } finally {
            if (con != null) {
                try {
                    con.close();
                } catch (Exception e) {
                }
            }
            if (rs != null) {
                try {
                    rs.close();
                } catch (Exception e) {
                }
            }
            if (ps != null) {
                try {
                    ps.close();
                } catch (Exception e) {
                }
            }
        }
    }

    private static final boolean check_ifPasswordEquals(final String passhash, final String pwd, final String salt) {
        // Check if the passwords are correct here. :B
        if (LoginCryptoLegacy.isLegacyPassword(passhash) && LoginCryptoLegacy.checkPassword(pwd, passhash)) {
            // Check if a password upgrade is needed.
            return true;
        } else if (salt == null && LoginCrypto.Companion.checkSha1Hash(passhash, pwd)) {
            return true;
        } else if (LoginCrypto.Companion.checkSaltedSha512Hash(passhash, pwd, salt)) {
            return true;
        }
        return false;
    }

    //id accountid gender
    public static kotlin.Triple<Integer, Integer, Integer> getInfoByName(String name, int world) {
        Connection con = null;
        PreparedStatement ps = null;
        ResultSet rs = null;
        try {
            con = DatabaseConnection.getConnection();
            ps = con.prepareStatement("SELECT * FROM characters WHERE name = ? AND world = ? AND gm = 0");
            ps.setString(1, name);
            ps.setInt(2, world);
            rs = ps.executeQuery();
            if (!rs.next()) {
                return null;
            }
            kotlin.Triple<Integer, Integer, Integer> id = new kotlin.Triple<Integer, Integer, Integer>(rs.getInt("id"), rs.getInt("accountid"), rs.getInt("gender"));
            return id;
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (con != null) {
                try {
                    con.close();
                } catch (Exception e) {
                }
            }
            if (rs != null) {
                try {
                    rs.close();
                } catch (Exception e) {
                }
            }
            if (ps != null) {
                try {
                    ps.close();
                } catch (Exception e) {
                }
            }
        }
        return null;
    }

    public static void setNXCodeUsed(String name, String code) {
        Connection con = null;
        PreparedStatement ps = null;
        try {
            con = DatabaseConnection.getConnection();
            ps = con.prepareStatement("UPDATE nxcode SET `user` = ?, `valid` = 0 WHERE code = ?");
            ps.setString(1, name);
            ps.setString(2, code);
            ps.execute();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (con != null) {
                try {
                    con.close();
                } catch (Exception e) {
                }
            }
            if (ps != null) {
                try {
                    ps.close();
                } catch (Exception e) {
                }
            }
        }
    }

    public static void sendNote(String to, String name, String msg, int fame) {
        Connection con = null;
        PreparedStatement ps = null;
        try {
            con = DatabaseConnection.getConnection();
            ps = con.prepareStatement("INSERT INTO notes (`to`, `from`, `message`, `timestamp`, `gift`) VALUES (?, ?, ?, ?, ?)");
            ps.setString(1, to);
            ps.setString(2, name);
            ps.setString(3, msg);
            ps.setLong(4, System.currentTimeMillis());
            ps.setInt(5, fame);
            ps.executeUpdate();
        } catch (SQLException e) {
            System.err.println("Unable to send note" + e);
        } finally {
            if (con != null) {
                try {
                    con.close();
                } catch (Exception e) {
                }
            }
            if (ps != null) {
                try {
                    ps.close();
                } catch (Exception e) {
                }
            }
        }
        if (World.Find.findChannel(to) >= 0) {
            MapleCharacter chr = ChannelServer.getInstance(World.Find.findChannel(to)).getPlayerStorage().getCharacterByName(to);
            if (chr != null) {
                chr.showNote();
            }
        }
    }

    public static kotlin.Triple<Boolean, Integer, Integer> getNXCodeInfo(String code) {
        Triple<Boolean, Integer, Integer> ret = null;
        Connection con = null;
        PreparedStatement ps = null;
        ResultSet rs = null;
        try {
            con = DatabaseConnection.getConnection();
            ps = con.prepareStatement("SELECT `valid`, `type`, `item` FROM nxcode WHERE code LIKE ?");
            ps.setString(1, code);
            rs = ps.executeQuery();
            if (rs.next()) {
                ret = new Triple<Boolean, Integer, Integer>(rs.getInt("valid") > 0, rs.getInt("type"), rs.getInt("item"));
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (con != null) {
                try {
                    con.close();
                } catch (Exception e) {
                }
            }
            if (rs != null) {
                try {
                    rs.close();
                } catch (Exception e) {
                }
            }
            if (ps != null) {
                try {
                    ps.close();
                } catch (Exception e) {
                }
            }
        }
        return null;
    }
}
