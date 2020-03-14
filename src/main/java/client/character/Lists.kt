package client.character

import client.SkillMacro
import client.inventory.Pet
import server.maps.MapleDoor
import server.maps.MapleSummon
import server.maps.SavedLocationType
import server.movement.LifeMovementFragment
import java.util.*
import kotlin.collections.ArrayList

data class Lists(
        val lastres: List<LifeMovementFragment>? = null,
        val doors: List<MapleDoor> = ArrayList(),
        val pets: MutableList<Pet> = mutableListOf(),
        val finishedAchievements: MutableList<Int> = mutableListOf(),
        var wishList: IntArray = IntArray(10),
        var rocks: IntArray = IntArray(10),
        var regrocks: IntArray = IntArray(5),
        var hyperrocks: IntArray = IntArray(13),
        var savedLocations: IntArray = IntArray(SavedLocationType.values().size),
        var skillMacros: List<SkillMacro?> = listOf(null, null, null, null, null),
        var petStore: ByteArray = ByteArray(3),
        @Transient val pendingExpiration: List<Int>? = null,
        @Transient val pendingSkills: List<Int>? = null,
        @Transient val summons: List<MapleSummon> = LinkedList()
)