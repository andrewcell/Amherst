package webapi.GMBody

import com.fasterxml.jackson.annotation.JsonCreator
import com.fasterxml.jackson.annotation.JsonProperty

data class Lists @JsonCreator constructor(
        @JsonProperty("token", required = true) val token: String
)