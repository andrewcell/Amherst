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
package tools.data.input

import java.io.IOException

/*
 * Provides an abstract accessor to a generic Little Endian byte stream. This
 * accessor is seekable.
 *
 * Class constructor
 * Provide a seekable input stream to wrap this object around.
 * @param bs The byte stream to wrap this around.
 */
class GenericSeekableLittleEndianAccessor (private val bs: SeekableInputStreamBytestream) : GenericLittleEndianAccessor(bs), SeekableLittleEndianAccessor {
    /*
     * Seek the pointer to `offset`
     * @param offset The offset to seek to.
     * @see net.sf.odinms.tools.data.input.SeekableInputStreamBytestream.seek
     */
    override fun seek(offset: Long) {
        try {
            bs.seek(offset)
        } catch (e: IOException) {
            System.err.println("Seek failed$e")
        }
    }

    /*
     * Get the current position of the pointer.
     * @return The current position of the pointer as a long integer.
     */
    override val position: Long
        get() = try {
            bs.position
        } catch (e: IOException) {
            System.err.println("getPosition failed$e")
            -1
        }

    /*
     * Skip `num` number of bytes in the stream.
     * @param num The number of bytes to skip.
     */
    override fun skip(num: Int) {
        seek(position + num)
    }
}