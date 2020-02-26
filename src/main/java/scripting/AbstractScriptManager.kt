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
package scripting

import client.MapleClient
import tools.FileoutputUtil
import java.io.File
import java.io.FileReader
import java.io.IOException
import java.nio.file.Files
import java.util.stream.Collectors
import javax.script.Invocable
import javax.script.ScriptEngine
import javax.script.ScriptEngineManager
import javax.script.ScriptException

/**
 *
 * @author Matze
 */
abstract class AbstractScriptManager {
    protected fun getInvocable(path: String, c: MapleClient?): Invocable? {
        return getInvocable(path, c, false)
    }

    protected fun getInvocable(path: String, c: MapleClient?, npc: Boolean): Invocable? {
        var path = path
        var fr: FileReader? = null
        return try {
            path = "scripts/$path"
            var engine: ScriptEngine? = null
            if (c != null) {
                engine = c.getScriptEngine(path)
            }
            if (engine == null) {
                val scriptFile = File(path)
                if (!scriptFile.exists()) {
                    return null
                }
                engine = sem.getEngineByName("javascript")
                try {
                    Files.lines(scriptFile.toPath()).use { stream ->
                        var lines: String? = "load('nashorn:mozilla_compat.js');"
                        lines += stream.collect(Collectors.joining(System.lineSeparator()))
                        engine.eval(lines)
                    }
                } catch (t: ScriptException) { /*if (ServerConstants.VPS)
                    FilePrinter.printError(FilePrinter.INVOCABLE + path.substring(12, path.length()), t, path);
                else */
                    println(t)
                    //return null;
                } catch (t: IOException) {
                    println(t)
                }
                fr = FileReader(scriptFile)
                engine.eval(fr)
            } else if (c != null && npc) { //                c.getPlayer().dropMessage(-1, "You already are talking to this NPC. Use @ea if this is not intended.");
            }
            engine as Invocable?
        } catch (e: Exception) {
            System.err.println("Error executing script. Path: $path\nException $e")
            FileoutputUtil.log(FileoutputUtil.ScriptEx_Log, "Error executing script. Path: $path\nException $e")
            null
        } finally {
            try {
                fr?.close()
            } catch (ignore: IOException) {
            }
        }
    }

    companion object {
        private val sem = ScriptEngineManager()
    }
}