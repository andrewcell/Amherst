package client;

import constants.ServerConstants;
import database.DatabaseConnection;
import database.DatabaseConnection_XE;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.logging.Level;
import java.util.logging.Logger;
import tools.FileoutputUtil;

public class LoginHelper {

    public static enum LoginResult {

        IS_BANNED,
        UNKNOWN_ERROR,
        NOT_REGISTERED_ACCOUNT,
        INVALID_PASSWORD,
        NOT_CONNECTED_ACCOUNT,
        SHOULD_UPDATE_PW,
        CANNOT_RENEW_PW,
        CAN_RENEW_PW,
        OK
    }

    public static LoginResult checkSiteConnection(String login) {
        LoginResult ret = LoginResult.OK;
        if (ServerConstants.Use_Localhost || ServerConstants.Use_SiteDB) {
            return ret;
        }

        PreparedStatement ps = null;
        PreparedStatement ps2 = null;
        ResultSet rs = null;
        Connection conLocal = null;
        try {
            Connection conWeb = DatabaseConnection_XE.getConnection();
            conLocal = DatabaseConnection.getConnection();
            ps = conWeb.prepareStatement("SELECT `site` from accounts WHERE name = ?");
            ps.setString(1, login);
            rs = ps.executeQuery();
            if (rs.next()) {
                if (rs.getInt(1) <= 0) {
                    ret = LoginResult.NOT_CONNECTED_ACCOUNT;
                } else {
                    ps2 = conLocal.prepareStatement("UPDATE accounts SET `site` = ? WHERE name = ?");
                    ps2.setInt(1, rs.getInt(1));
                    ps2.setString(2, login);
                    ps2.executeUpdate();
                }
            } else {
                ret = LoginResult.IS_BANNED;
            }
        } catch (Exception e) {
            if (ServerConstants.Use_Localhost) {
                Logger.getLogger(LoginHelper.class.getName()).log(Level.SEVERE, "Error on Check Site Connection", e);
            }
            FileoutputUtil.outputFileError("WebSiteCheckConnectionError.txt", e);
            ret = LoginResult.UNKNOWN_ERROR;
        } finally {
            if (ps != null) {
                try {
                    ps.close();
                } catch (Exception e) {
                }
            }
            if (ps2 != null) {
                try {
                    ps2.close();
                } catch (Exception e) {
                }
            }
            if (rs != null) {
                try {
                    rs.close();
                } catch (Exception e) {
                }
            }
            if (conLocal != null) {
                try {
                    conLocal.close();
                } catch (Exception e) {
                }
            }
        }
        return ret;
    }

    public static LoginResult checkModifiedPassword(String login, String pwd) {
        LoginResult ret = LoginResult.OK;

        if (ServerConstants.Use_Localhost || ServerConstants.Use_SiteDB) {
            return ret;
        }
        PreparedStatement ps = null;
        PreparedStatement ps2 = null;
        ResultSet rs = null;
        Connection conLocal = null;
        try {
            Connection conWeb = DatabaseConnection_XE.getConnection();
            conLocal = DatabaseConnection.getConnection();
            ps = conWeb.prepareStatement("SELECT `password` from accounts WHERE name = ?");
            ps.setString(1, login);
            rs = ps.executeQuery();
            if (rs.next()) {
                if (LoginCrypto.checkSha1Hash(rs.getString(1), pwd)) {
                    ret = LoginResult.SHOULD_UPDATE_PW;
                    ps2 = conLocal.prepareStatement("UPDATE accounts SET `password` = ?, `salt` = NULL WHERE name = ?");
                    ps2.setString(1, rs.getString(1));
                    ps2.setString(2, login);
                    ps2.executeUpdate();
                }
            }
        } catch (Exception e) {
            if (ServerConstants.Use_Localhost) {
                Logger.getLogger(LoginHelper.class.getName()).log(Level.SEVERE, "Error on Check Site Connection", e);
            }
            FileoutputUtil.outputFileError("WebSiteCheckPasswordError.txt", e);
            ret = LoginResult.UNKNOWN_ERROR;
        } finally {
            if (ps != null) {
                try {
                    ps.close();
                } catch (Exception e) {
                }
            }
            if (ps2 != null) {
                try {
                    ps2.close();
                } catch (Exception e) {
                }
            }
            if (rs != null) {
                try {
                    rs.close();
                } catch (Exception e) {
                }
            }
            if (conLocal != null) {
                try {
                    conLocal.close();
                } catch (Exception e) {
                }
            }
        }
        return ret;
    }

    public static LoginResult tryNewAccount(String login, String pw) {
        LoginResult ret = LoginResult.OK;
        if (ServerConstants.Use_Localhost || ServerConstants.Use_SiteDB) {
            return ret;
        }
        PreparedStatement ps = null;
        PreparedStatement ps2 = null;
        ResultSet rs = null;
        Connection conLocal = null;
        try {
            Connection conWeb = DatabaseConnection_XE.getConnection();
            conLocal = DatabaseConnection.getConnection();
            ps = conWeb.prepareStatement("SELECT `id`, `name`, `password`, `createdat`, `gender`, `site`, `phonenum` FROM accounts WHERE `name` = ?");
            ps.setString(1, login);
            rs = ps.executeQuery();
            if (rs.next()) {
                if (LoginCrypto.checkSha1Hash(rs.getString("password"), pw)) {
                    ps2 = conLocal.prepareStatement("INSERT INTO accounts (`id`, `name`, `password`, `createdat`, `gender`, `site`, `phonenum`) VALUES (?, ?, ?, ?, ?, ?, ?)");
                    ps2.setInt(1, rs.getInt(1));
                    ps2.setString(2, rs.getString(2));
                    ps2.setString(3, rs.getString(3));
                    ps2.setTimestamp(4, rs.getTimestamp(4));
                    ps2.setInt(5, rs.getInt(5));
                    ps2.setInt(6, rs.getInt(6));
                    ps2.setString(7, rs.getString(7));
                    ps2.executeUpdate();
                } else {
                    ret = LoginResult.INVALID_PASSWORD;
                }
            } else {
                ret = LoginResult.NOT_REGISTERED_ACCOUNT;
            }
        } catch (Exception e) {
            if (ServerConstants.Use_Localhost) {
                Logger.getLogger(LoginHelper.class.getName()).log(Level.SEVERE, "Error on Check new Account", e);
            }
            FileoutputUtil.outputFileError("WebDBNewAccountError.txt", e);
            ret = LoginResult.UNKNOWN_ERROR;
        } finally {
            if (ps != null) {
                try {
                    ps.close();
                } catch (Exception e) {
                }
            }
            if (ps2 != null) {
                try {
                    ps2.close();
                } catch (Exception e) {
                }
            }
            if (rs != null) {
                try {
                    rs.close();
                } catch (Exception e) {
                }
            }
            if (conLocal != null) {
                try {
                    conLocal.close();
                } catch (Exception e) {
                }
            }
        }
        return ret;
    }

    public static LoginResult isBan(int member_srl) {
        LoginResult ret = LoginResult.OK;
        if (ServerConstants.Use_Localhost || ServerConstants.Use_SiteDB) {
            return ret;
        }
        try {
            Connection con = DatabaseConnection_XE.getConnection();
            PreparedStatement ps = con.prepareStatement("SELECT `auth` FROM `rb_s_mbrdata` WHERE memberuid = ?");
            ps.setInt(1, member_srl);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                if (rs.getInt("auth") != 1) {
                    ret = LoginResult.IS_BANNED;
                }
            } else {
                ret = LoginResult.IS_BANNED;
            }
            ps.close();
            rs.close();
        } catch (Exception e) {
            if (ServerConstants.Use_Localhost) {
                e.printStackTrace();
            }
            ret = LoginResult.UNKNOWN_ERROR;
        }
        return ret;
    }

    public static void doBan(ResultSet rsa) throws SQLException {
        if (ServerConstants.Use_SiteDB) {
            PreparedStatement pss = DatabaseConnection_XE.getConnection().prepareStatement("UPDATE rb_s_mbrdata SET `auth` = '4' WHERE memberuid = ?");
            pss.setInt(1, rsa.getInt("site"));
            pss.executeUpdate();
            pss.close();
        }
    }

    public static void unBan(int member_srl) throws SQLException {
        if (ServerConstants.Use_SiteDB) {
            PreparedStatement pss = DatabaseConnection_XE.getConnection().prepareStatement("UPDATE rb_s_mbrdata SET `auth` = '1' WHERE memberuid = ?");
            pss.setInt(1, member_srl);
            pss.executeUpdate();
            pss.close();
        }
    }

    public static int checkRenewPassword(Connection con, String login, String code) throws SQLException {
        PreparedStatement ps = con.prepareStatement("SELECT * FROM `redopassword` WHERE `email` = ?");
        ps.setString(1, login);
        ResultSet rs = ps.executeQuery();
        if (rs.next()) {
            //status

            if (rs.getString("authcode").equals(code)) {
                //0 : mail sended
                int status = rs.getInt("status");
                rs.close();
                ps.close();
                return status;
            } else {
                return -2;
            }
        }
        rs.close();
        ps.close();
        return -1;
    }
    
    public static void insertPasswordRenewDB(Connection con, String login, String code) throws SQLException {
        PreparedStatement ps = con.prepareStatement("INSERT INTO `redopassword` (`email`, `authcode`, `status`) VALUES (?, ?, ?)");
        ps.setString(1, login);
        ps.setString(2, code);
        ps.setInt(3, 0);
        ps.executeUpdate();
        ps.close();
    }
    
    public static void DeleteAndUpdatePasswordDB(Connection con, String login) throws SQLException {
        PreparedStatement ps = con.prepareStatement("DELETE FROM `redopassword` WHERE `email` = ?");
        ps.setString(1, login);
        ps.executeUpdate();
        ps.close();
    }
}
