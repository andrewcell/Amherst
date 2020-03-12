/*
 This file is part of the ZeroFusion MapleStory Server
 Copyright (C) 2008 Patrick Huy <patrick.huy@frz.cc> 
 Matthias Butz <matze@odinms.de>
 Jan Christian Meyer <vimes@odinms.de>
 ZeroFusion organized by "RMZero213" <RMZero213@hotmail.com>

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
package client.inventory

import database.DatabaseConnection.getConnection
import java.io.Serializable
import java.sql.Connection
import java.sql.PreparedStatement
import java.sql.ResultSet
import java.util.concurrent.atomic.AtomicInteger

class MapleInventoryIdentifier : Serializable {
    private val runningUID = AtomicInteger(0)
    val nextUniqueId: Int
        get() {
            if (runningUID.get() <= 0) {
                runningUID.set(initUID())
            } else {
                runningUID.set(runningUID.get() + 1)
            }
            return runningUID.get()
        }

    fun initUID(): Int {
        var ret = 0
        var con: Connection? = null
        var ps: PreparedStatement? = null
        var rs: ResultSet? = null
        try {
            con = getConnection()
            val ids = IntArray(5)
            ps = con!!.prepareStatement("SELECT MAX(uniqueid) FROM inventoryitems WHERE uniqueid > 0")
            rs = ps.executeQuery()
            if (rs.next()) {
                ids[0] = rs.getInt(1) + 1
            }
            rs.close()
            ps.close()
            ps = con.prepareStatement("SELECT MAX(petid) FROM pets")
            rs = ps.executeQuery()
            if (rs.next()) {
                ids[1] = rs.getInt(1) + 1
            }
            rs.close()
            ps.close()
            ps = con.prepareStatement("SELECT MAX(ringid) FROM rings")
            rs = ps.executeQuery()
            if (rs.next()) {
                ids[2] = rs.getInt(1) + 1
            }
            rs.close()
            ps.close()
            ps = con.prepareStatement("SELECT MAX(partnerringid) FROM rings")
            rs = ps.executeQuery()
            if (rs.next()) {
                ids[3] = rs.getInt(1) + 1 //biggest pl0x. but if this happens -> o_O
            }
            rs.close()
            ps.close()
            ps = con.prepareStatement("SELECT MAX(uniqueid) FROM androids")
            rs = ps.executeQuery()
            if (rs.next()) {
                ids[4] = rs.getInt(1) + 1
            }
            rs.close()
            ps.close()
            for (i in ids.indices) {
                if (ids[i] > ret) {
                    ret = ids[i]
                }
            }
            con.close()
            ps?.close()
            rs.close()
        } catch (e: Exception) {
            e.printStackTrace()
        }
        return ret
    }

    companion object {
        private const val serialVersionUID = 21830921831301L
        private val instance = MapleInventoryIdentifier()
        fun getInstance(): Int {
            return instance.nextUniqueId
        }
    }
}