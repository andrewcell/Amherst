package server

import database.DatabaseConnection.getActiveConnections
import database.DatabaseConnection.getIdleConnections
import javax.swing.JFrame
import javax.swing.JLabel
import javax.swing.JPanel

class GUI : JFrame("GUI") {
    val panel1: JPanel = JPanel()
    val Label1: JLabel = JLabel()
    val Label2: JLabel = JLabel()
    val Label3: JLabel = JLabel()
    init {
        Timer.EtcTimer.getInstance().register({
            Label1.setText(getIdleConnections().toString() + "")
            Label2.setText(getActiveConnections().toString() + "")
            Label3.setText(Runtime.getRuntime().availableProcessors().toString() + " / " + Thread.activeCount())
        }, 500)
    }
}