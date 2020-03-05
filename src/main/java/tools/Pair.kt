package tools

import java.io.Serializable

/*
 * Represents a pair of values.
 *
 * @author Frz
 * @since Revision 333
 * @version 1.0
 * @param <E> The type of the left value.
 * @param <F> The type of the right value.
 */
class Pair<E, F>(left: E, right: F) : Serializable {
    /*
     * Gets the left value.
     * @return The left value.
     */
    @JvmField
    var left: E?

    /*
     * Gets the right value.
     * @return The right value.
     */
    @JvmField
    var right: F?

    /*
     * Turns the pair into a string.
     * @return Each value of the pair as a string joined by a colon.
     */
    override fun toString(): String {
        return left.toString() + ":" + right.toString()
    }

    /*
     * Gets the hash code of this pair.
     */
    override fun hashCode(): Int {
        val prime = 31
        var result = 1
        result = prime * result + if (left == null) 0 else left.hashCode()
        result = prime * result + if (right == null) 0 else right.hashCode()
        return result
    }

    /*
     * Checks to see if two pairs are equal.
     */
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
        val other = obj as Pair<*, *>
        if (left == null) {
            if (other.left != null) {
                return false
            }
        } else if (left != other.left) {
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
        private const val serialVersionUID = 9179541993413738569L
    }

    /*
     *
     * Class constructor - pairs two objects together.
     * @param left The left object.
     * @param right The right object.
     */
    init {
        this.left = left
        this.right = right
    }
}