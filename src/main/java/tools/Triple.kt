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
package tools

import java.io.Serializable

class Triple<E, F, G>(left: E, mid: F, right: G) : Serializable {
    var left: E?
    var mid: F?
    var right: G?

    override fun toString(): String {
        return left.toString() + ":" + mid.toString() + ":" + right.toString()
    }

    override fun hashCode(): Int {
        val prime = 31
        var result = 1
        result = prime * result + if (left == null) 0 else left.hashCode()
        result = prime * result + if (mid == null) 0 else mid.hashCode()
        result = prime * result + if (right == null) 0 else right.hashCode()
        return result
    }

    override fun equals(obj: Any?): Boolean {
        if (this === obj) {
            return true
        }
        if (obj == null) {
            return false
        }
        if (javaClass != obj.javaClass) {
            return false
        }
        val other = obj as Triple<*, *, *>
        if (left == null) {
            if (other.left != null) {
                return false
            }
        } else if (left != other.left) {
            return false
        }
        if (mid == null) {
            if (other.mid != null) {
                return false
            }
        } else if (mid != other.mid) {
            return false
        }
        if (right == null) {
            if (other.right != null) {
                return false
            }
        } else if (right != other.right) {
            return false
        }
        return true
    }

    companion object {
        private const val serialVersionUID = 9179541993413739999L
    }

    init {
        this.left = left
        this.mid = mid
        this.right = right
    }
}