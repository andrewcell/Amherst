package webapi.GMBody

import com.fasterxml.jackson.annotation.JsonCreator
import com.fasterxml.jackson.annotation.JsonProperty

data class Search @JsonCreator constructor(
    @JsonProperty("token", required = true) val token: String,
    @JsonProperty("type", required = false) val type: String?,
    @JsonProperty("query", required = true) val query: String?
)