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

import server.Randomizer;
import tools.data.MaplePacketLittleEndianWriter;

public class PlayerRandomStream {

    private transient long m_s1, m_past_s1, m_s2, m_past_s2, m_s3, m_past_s3;

    public PlayerRandomStream() {
        final int v4 = 5;
        this.CRand32__Seed(Randomizer.nextLong(), 1170746341 * v4 - 755606699, 1170746341 * v4 - 755606699);
    }

    public final void CRand32__Seed(final long s1, final long s2, final long s3) {
        m_s1 = s1 | 0x100000;
        m_past_s1 = s1 | 100000;
        m_s2 = s2 | 0x1000;
        m_past_s2 = s2 | 0x1000;
        m_s3 = s3 | 0x10;
        m_past_s3 = s3 | 0x10;
    }

    public final long CRand32__Random() {
        long result;
        long v4, v5, v6, v7, v8, v9, v10;
        v4 = m_s1;
        v5 = m_s2;
        v6 = m_s3;
        v7 = m_s1;
        m_past_s1 = m_s1;
        v8 = ((v4 & 0xFFFFFFFE) << 12) ^ ((v7 & 0x7FFC0 ^ (v4 >> 13)) >> 6);
        m_past_s2 = v5;
        v9 = 16 * (v5 & 0xFFFFFFF8) ^ (((v5 >> 2) ^ v5 & 0x3F800000) >> 23);
        m_past_s3 = v6;
        v10 = ((v6 & 0xFFFFFFF0) << 17) ^ (((v6 >> 3) ^ v6 & 0x1FFFFF00) >> 8);
        m_s3 = v10;
        m_s1 = v8;
        m_s2 = v9;
        result = v8 ^ v9 ^ v10;
        return (result) & 0xFFFFFFFFL;
    }

    public final void connectData(final MaplePacketLittleEndianWriter mplew) {
        long v5 = CRand32__Random();
        long s2 = CRand32__Random();
        long v6 = CRand32__Random();

        CRand32__Seed(v5, s2, v6);

        mplew.writeInt((int) v5);
        mplew.writeInt((int) s2);
        mplew.writeInt((int) v6);
    }
}
