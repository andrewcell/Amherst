package webapi.data

import com.fasterxml.jackson.annotation.JsonCreator
import com.fasterxml.jackson.annotation.JsonProperty

data class RequestJSON @JsonCreator constructor(
        @JsonProperty("token") val token: String
)