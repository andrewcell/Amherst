package client

import server.MapleStatEffect
import java.util.concurrent.ScheduledFuture

data class MapleBuffStatValueHolder(val effect: MapleStatEffect, val startTime: Long, var schedule: ScheduledFuture<*>, var value: Int, val localDuration: Int, val cid: Int)