package client.character

data class Changed(
        var wishList: Boolean = false,
        var trockLocations: Boolean = false,
        var regrockLocations: Boolean = false,
        var hyperrockLocations: Boolean = false,
        var skillMacros: Boolean = false,
        var achievements: Boolean = false,
        var savedLocations: Boolean = false,
        var questInfo: Boolean = false,
        var skills: Boolean = false,
        var reports: Boolean = false
)