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
package provider

import java.awt.image.BufferedImage
import java.io.File
import java.io.IOException
import javax.imageio.ImageIO

class MapleCanvas(var width: Int, var height: Int, private val file: File) {
    private var image: BufferedImage? = null

    fun getImage(): BufferedImage? {
        loadImageIfNecessary()
        return image
    }

    private fun loadImageIfNecessary() {
        if (image == null) {
            try {
                image = ImageIO.read(file)
                // replace the dimensions loaded from the wz by the REAL dimensions from the image - should be equal tho
                width = image!!.getWidth()
                height = image!!.getHeight()
            } catch (e: IOException) {
                throw RuntimeException(e)
            }
        }
    }

}