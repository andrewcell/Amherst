/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package tools.wztosql

import database.DatabaseConnection.getConnection
import database.DatabaseConnection.init
import provider.MapleDataProviderFactory.getDataProvider
import provider.MapleDataTool
import java.io.File
import java.sql.SQLException

/**
 *
 * @author
 */
object DumpOXQuiz {
    @Throws(SQLException::class)
    @JvmStatic
    fun main(args: Array<String>) {
        val pro = getDataProvider(File("wz/Etc.wz"))
        val oxquiz = pro.getData("OXQuiz.img")
        init()
        val ps = getConnection()!!.prepareStatement("INSERT INTO `tetrasea`.`wz_oxdata` (`questionset`, `questionid`, `question`, `display`, `answer`) VALUES (?, ?, ?, ?, ?)")
        for (set in oxquiz) {
            ps.setInt(1, set.name!!.toInt())
            for (quiz in set) {
                ps.setInt(2, quiz.name!!.toInt())
                ps.setString(3, MapleDataTool.getString("q", quiz, ""))
                ps.setString(4, MapleDataTool.getString("d", quiz, ""))
                ps.setString(5, if (MapleDataTool.getInt("a", quiz, 0) == 1) "o" else "x")
                ps.addBatch()
            }
        }
        ps.executeBatch()
        ps.close()
    }
}