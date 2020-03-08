package webapi.data

import com.fasterxml.jackson.annotation.JsonCreator
import com.fasterxml.jackson.annotation.JsonProperty

data class LoginRequestBody @JsonCreator constructor(
        @JsonProperty("email") val email: String,
        @JsonProperty("password") val password: String
)