package client.messages.commands

import client.MapleClient
import constants.ServerConstants

/*
 * Represents a command given by a user
 */
class CommandObject(
        /** what gets done when this command is used  */
        private val exe: CommandExecute,
        /** what [MapleCharacter.gm] level is required to use this command  */
        val reqGMLevel: Int) {
    /**
     * Returns the GMLevel needed to use this command.
     *
     * @return the required GM Level
     */

    /**
     * Call this to apply this command to the specified [MapleClient]
     * with the specified arguments.
     *
     * @param c the MapleClient to apply this to
     * @param splitted the arguments
     * @return See [CommandExecute.execute]
     */
    fun execute(c: MapleClient?, splitted: Array<String?>?): Int {
        return exe.execute(c, splitted)
    }

    val type: ServerConstants.CommandType
        get() = exe.type

}