package webapi.GMBody

import com.fasterxml.jackson.annotation.JsonCreator
import com.fasterxml.jackson.annotation.JsonProperty

data class Broadcast @JsonCreator constructor(
        @JsonProperty("token", required = true) val token: String,
        @JsonProperty("message", required = true) val message: String,
        @JsonProperty("sender", required = false) val sender: String?,
        @JsonProperty("type", required = false) val type: Int
)