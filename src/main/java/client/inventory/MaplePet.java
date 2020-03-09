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
package client.inventory;

import java.awt.Point;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.io.Serializable;

import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import database.DatabaseConnection;
import java.util.ArrayList;
import java.util.Map;
import server.MapleItemInformationProvider;
import server.movement.AbsoluteLifeMovement;
import server.movement.LifeMovement;
import server.movement.LifeMovementFragment;

public class MaplePet implements Serializable {

    public static enum PetFlag {

        ITEM_PICKUP(0x01, 5190000, 5191000),
        HP_CHARGE(0x20, 5190001, 5191001),
        EXPAND_PICKUP(0x02, 5190002, 5191002), //idk
        AUTO_PICKUP(0x04, 5190003, 5191003), //idk
        LEFTOVER_PICKUP(0x10, 5190004, 5191004), //idk
        UNPICKABLE(0x08, 5190005, -1),
        MP_CHARGE(0x40, 5190006, -1),
        PET_BUFF(0x80, -1, -1), //idk
        PET_DRAW(0x100, 5190007, -1), //nfs
        PET_DIALOGUE(0x200, 5190008, -1); //nfs
        private final int i, item, remove;

        private PetFlag(int i, int item, int remove) {
            this.i = i;
            this.item = item;
            this.remove = remove;
        }

        public final int getValue() {
            return i;
        }

        public final boolean check(int flag) {
            return (flag & i) == i;
        }

        public static final PetFlag getByAddId(final int itemId) {
            for (PetFlag flag : PetFlag.values()) {
                if (flag.item == itemId) {
                    return flag;
                }
            }
            return null;
        }

        public static final PetFlag getByDelId(final int itemId) {
            for (PetFlag flag : PetFlag.values()) {
                if (flag.remove == itemId) {
                    return flag;
                }
            }
            return null;
        }
    }
    private static final long serialVersionUID = 9179541993413738569L;
    private String name;
    private int Fh = 0, stance = 0, uniqueid, petitemid, secondsLeft = 0;
    private Point pos;
    private byte fullness = 100, level = 1, summoned = 0;
    private short inventorypos = 0, closeness = 0, flags = 0;
    private boolean changed = false;
    private List<Integer> exceptionPickup = null;

    private MaplePet(final int petitemid, final int uniqueid) {
        this.petitemid = petitemid;
        this.uniqueid = uniqueid;
    }

    private MaplePet(final int petitemid, final int uniqueid, final short inventorypos) {
        this.petitemid = petitemid;
        this.uniqueid = uniqueid;
        this.inventorypos = inventorypos;
    }

    public static final MaplePet loadFromDb(final int itemid, final int petid, final short inventorypos) {
        Connection con = null;
        PreparedStatement ps = null;
        ResultSet rs = null;
        try {
            final MaplePet ret = new MaplePet(itemid, petid, inventorypos);

            con = DatabaseConnection.getConnection(); // Get a connection to the database
            ps = con.prepareStatement("SELECT * FROM pets WHERE petid = ?"); // Get pet details..
            ps.setInt(1, petid);

            rs = ps.executeQuery();
            if (!rs.next()) {
                return null;
            }

            ret.setName(rs.getString("name"));
            ret.setCloseness(rs.getShort("closeness"));
            ret.setLevel(rs.getByte("level"));
            ret.setFullness(rs.getByte("fullness"));
            ret.setSecondsLeft(rs.getInt("seconds"));
            ret.setFlags(rs.getShort("flags"));
            ret.changed = false;

            if (PetFlag.UNPICKABLE.check(ret.getFlags())) {
                rs.close();
                ps.close();
                ps = con.prepareStatement("SELECT * FROM `pets_expick` WHERE `petsn` = ?");
                ps.setInt(1, petid);
                rs = ps.executeQuery();
                while (rs.next()) {
                    ret.getPickupExceptionList().add(rs.getInt("itemid"));
                }
            }

            return ret;
        } catch (SQLException ex) {
            Logger.getLogger(MaplePet.class.getName()).log(Level.SEVERE, null, ex);
            return null;
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
            if (rs != null) {
                try {
                    rs.close();
                } catch (Exception e) {
                }
            }
        }
    }

    public final void saveToDb() {
        if (!changed) {
            return;
        }
        Connection con = null;
        PreparedStatement ps = null;
        try {
            con = DatabaseConnection.getConnection();
            ps = con.prepareStatement("UPDATE pets SET name = ?, level = ?, closeness = ?, fullness = ?, seconds = ?, flags = ? WHERE petid = ?");
            ps.setString(1, name); // Set name
            ps.setByte(2, level); // Set Level
            ps.setShort(3, closeness); // Set Closeness
            ps.setByte(4, fullness); // Set Fullness
            ps.setInt(5, secondsLeft);
            ps.setShort(6, flags);
            ps.setInt(7, uniqueid); // Set ID
            ps.executeUpdate(); // Execute statement

            if (PetFlag.UNPICKABLE.check(flags)) {
                ps.close();
                ps = con.prepareStatement("DELETE FROM `pets_expick` WHERE `petsn` = ?");
                ps.setInt(1, uniqueid);
                ps.executeUpdate();
                ps.close();
                if (exceptionPickup != null && !getPickupExceptionList().isEmpty()) {
                    ps = con.prepareStatement("INSERT INTO `pets_expick` (`petsn`, `itemid`) VALUES (?, ?)");
                    ps.setInt(1, uniqueid);
                    for (int i : getPickupExceptionList()) {
                        ps.setInt(2, i);
                        ps.addBatch();
                    }
                    ps.executeBatch();
                }
            }

            changed = false;
        } catch (final SQLException ex) {
            ex.printStackTrace();
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

    public static final MaplePet createPet(final int itemid, final int uniqueid) {
        return createPet(itemid, MapleItemInformationProvider.getInstance().getName(itemid), 1, 0, 100, uniqueid, itemid == 5000054 ? 18000 : 0, (short) 0);
    }

    public static int getPetFlag(int itemid) {
        int flag = 0;
        Map<String, Integer> stats = MapleItemInformationProvider.getInstance().getEquipStats(itemid);

        if (stats.containsKey("pickupAll") && stats.get("pickupAll") == 1) {
            if ((flag & PetFlag.AUTO_PICKUP.i) == 0) {
                flag |= PetFlag.AUTO_PICKUP.i;
            }
        }
        if (stats.containsKey("pickupItem") && stats.get("pickupItem") == 1) {
            if ((flag & PetFlag.ITEM_PICKUP.i) == 0) {
                flag |= PetFlag.ITEM_PICKUP.i;
            }
        }
        if (stats.containsKey("sweepForDrop") && stats.get("sweepForDrop") == 1) {
            if ((flag & PetFlag.LEFTOVER_PICKUP.i) == 0) {
                flag |= PetFlag.LEFTOVER_PICKUP.i;
            }
        }
        if (stats.containsKey("longRange") && stats.get("longRange") == 1) {
            if ((flag & PetFlag.EXPAND_PICKUP.i) == 0) {
                flag |= PetFlag.EXPAND_PICKUP.i;
            }
        }
        if (stats.containsKey("consumeHP") && stats.get("consumeHP") == 1) {
            if ((flag & PetFlag.HP_CHARGE.i) == 0) {
                flag |= PetFlag.HP_CHARGE.i;
            }
        }
        if (stats.containsKey("consumeMP") && stats.get("consumeMP") == 1) {
            if ((flag & PetFlag.MP_CHARGE.i) == 0) {
                flag |= PetFlag.MP_CHARGE.i;
            }
        }
        return flag;
    }

    public static final MaplePet createPet(int itemid, String name, int level, int closeness, int fullness, int uniqueid, int secondsLeft, short flag) {
        if (uniqueid <= -1) { //wah
            uniqueid = MapleInventoryIdentifier.getInstance();
        }

        flag |= getPetFlag(itemid);

        Connection con = null;
        PreparedStatement pse = null;
        try { // Commit to db first
            con = DatabaseConnection.getConnection();
            pse = con.prepareStatement("INSERT INTO pets (petid, name, level, closeness, fullness, seconds, flags) VALUES (?, ?, ?, ?, ?, ?, ?)");
            pse.setInt(1, uniqueid);
            pse.setString(2, name);
            pse.setByte(3, (byte) level);
            pse.setShort(4, (short) closeness);
            pse.setByte(5, (byte) fullness);
            pse.setInt(6, secondsLeft);
            pse.setShort(7, flag);
            pse.executeUpdate();
        } catch (final SQLException ex) {
            ex.printStackTrace();
            return null;
        } finally {
            if (con != null) {
                try {
                    con.close();
                } catch (Exception e) {
                }
            }
            if (pse != null) {
                try {
                    pse.close();
                } catch (Exception e) {
                }
            }
        }
        final MaplePet pet = new MaplePet(itemid, uniqueid);
        pet.setName(name);
        pet.setLevel(level);
        pet.setFullness(fullness);
        pet.setCloseness(closeness);
        pet.setFlags(flag);
        pet.setSecondsLeft(secondsLeft);

        return pet;
    }

    public final String getName() {
        return name;
    }

    public final void setName(final String name) {
        this.name = name;
        this.changed = true;
    }

    public final boolean getSummoned() {
        return summoned > 0;
    }

    public final byte getSummonedValue() {
        return summoned;
    }

    public final void setSummoned(final int summoned) {
        this.summoned = (byte) summoned;
    }

    public final short getInventoryPosition() {
        return inventorypos;
    }

    public final void setInventoryPosition(final short inventorypos) {
        this.inventorypos = inventorypos;
    }

    public int getUniqueId() {
        return uniqueid;
    }

    public final short getCloseness() {
        return closeness;
    }

    public final void setCloseness(final int closeness) {
        this.closeness = (short) closeness;
        this.changed = true;
    }

    public final byte getLevel() {
        return level;
    }

    public final void setLevel(final int level) {
        this.level = (byte) level;
        this.changed = true;
    }

    public final byte getFullness() {
        return fullness;
    }

    public final void setFullness(final int fullness) {
        this.fullness = (byte) fullness;
        this.changed = true;
    }

    public final short getFlags() {
        return flags;
    }

    public final void setFlags(final int fffh) {
        this.flags = (short) fffh;
        this.changed = true;
    }

    public final int getFh() {
        return Fh;
    }

    public final void setFh(final int Fh) {
        this.Fh = Fh;
    }

    public final Point getPos() {
        return pos;
    }

    public final void setPos(final Point pos) {
        this.pos = pos;
    }

    public final int getStance() {
        return stance;
    }

    public final void setStance(final int stance) {
        this.stance = stance;
    }

    public final int getPetItemId() {
        return petitemid;
    }

    public final boolean canConsume(final int itemId) {
        final MapleItemInformationProvider mii = MapleItemInformationProvider.getInstance();
        for (final int petId : mii.getItemEffect(itemId).getPetsCanConsume()) {
            if (petId == petitemid) {
                return true;
            }
        }
        return false;
    }

    public final void updatePosition(final List<LifeMovementFragment> movement) {
        for (final LifeMovementFragment move : movement) {
            if (move instanceof LifeMovement) {
                if (move instanceof AbsoluteLifeMovement) {
                    setPos(((LifeMovement) move).getPosition());
                }
                setStance(((LifeMovement) move).getNewstate());
            }
        }
    }

    public final int getSecondsLeft() {
        return secondsLeft;
    }

    public final void setSecondsLeft(int sl) {
        this.secondsLeft = sl;
        this.changed = true;
    }

    public List<Integer> getPickupExceptionList() {
        if (exceptionPickup == null) {
            exceptionPickup = new ArrayList<>();
        }
        return exceptionPickup;
    }
    
    public void changeException() {
        changed = true;
    }
}
