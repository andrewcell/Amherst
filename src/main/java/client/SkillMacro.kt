package client

import java.io.Serializable

class SkillMacro(var skill1: Int, var skill2: Int, var skill3: Int, var name: String, val shout: Int, var position: Int) : Serializable {
    var macroId: Int? = null
    private val serialVersionUID = -63413738569L
}