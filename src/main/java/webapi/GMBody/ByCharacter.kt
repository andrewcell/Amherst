package webapi.GMBody

import com.fasterxml.jackson.annotation.JsonCreator
import com.fasterxml.jackson.annotation.JsonProperty

data class ByCharacter @JsonCreator constructor(
        @JsonProperty("token", required = true) val token: String,
        @JsonProperty("name", required = false) val name: String?,
        @JsonProperty("id", required = false) val characterId: Int?
)
