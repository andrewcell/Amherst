package webapi.GMBody

import com.fasterxml.jackson.annotation.JsonCreator
import com.fasterxml.jackson.annotation.JsonProperty

data class Broadcast @JsonCreator constructor(
        @JsonProperty("token") val token: String,
        @JsonProperty("messagetype") val messageType: Int,
        @JsonProperty("message") val message: String
)