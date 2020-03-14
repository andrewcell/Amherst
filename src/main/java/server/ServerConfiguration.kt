package server

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import com.fasterxml.jackson.annotation.JsonInclude
import com.fasterxml.jackson.annotation.JsonProperty
import server.configuration.MySQL
import server.configuration.Rate

class ServerConfiguration(
        val mysql: MySQL,
        val rate: Rate,
        val world: LinkedHashMap<Any, Any>,
        @JsonProperty("channelcount") val channelcount: Int,
        @JsonProperty( "max_characters") val max_characters: Int,
        @JsonProperty( "user_limit") val user_limit: Int,
        val port: LinkedHashMap<Any, Any>,
        val admin_only: Boolean,
        @JsonProperty("wz_path") val wzPath: String,
        val ip: String,
        @JsonInclude(JsonInclude.Include.NON_NULL) val printStackTrace: Boolean?,
        @JsonInclude(JsonInclude.Include.NON_NULL) val forbiddenName: Array<String>?,
        @JsonInclude(JsonInclude.Include.NON_NULL) val events: Array<String>?
)
