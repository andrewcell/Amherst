package client

import tools.HexTool
import java.io.UnsupportedEncodingException
import java.nio.charset.Charset
import java.security.MessageDigest
import java.security.NoSuchAlgorithmException
import java.util.*

class LoginCrypto {
    companion object {
        val extraLength = 6
        val Alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".toCharArray()
        val Number = "123456789".toCharArray()
        val rand: Random = Random()

        fun generate13DigitAsiasoftPassword(): String {
            val sb = StringBuilder()
            sb.append(Alphabet[rand.nextInt(Alphabet.size)])
            for (i in 0..11) {
                sb.append(Alphabet[rand.nextInt(Number.size)])
            }
            sb.append(Alphabet[rand.nextInt(Alphabet.size)])

            return sb.toString()
        }

        fun toSimpleHexString(bytes: ByteArray): String = HexTool.toString(bytes).replace(" ", "").toLowerCase()

        fun hashWithDigest(_in: String, digest: String): String {
            try {
                val digester = MessageDigest.getInstance(digest)
                digester.update(_in.toByteArray(Charset.forName("UTF-8")), 0, _in.length)
                val sha1Hash = digester.digest()
                return toSimpleHexString(sha1Hash)
            } catch (e: NoSuchAlgorithmException) {
                throw RuntimeException("Hashing the password failed", e)
            } catch (ex: UnsupportedEncodingException) {
                throw RuntimeException("Encoding the string failed", ex)
            }
        }

        fun hexSha1(_in: String) = hashWithDigest(_in, "SHA-1")

        fun hexSha512(_in: String) = hashWithDigest(_in, "SHA-512")

        fun checkSha1Hash(hash: String, password: String) = hash == hexSha1(password)

        fun checkSaltedSha512Hash(hash: String, password: String, salt: String) = hash == makeSaltedSha512Hash(password, salt)

        fun makeSaltedSha512Hash(password: String, salt: String) = hexSha512(password + salt)

        fun makeSalt(): String {
            val salt = ByteArray(16)
            rand.nextBytes(salt)
            return toSimpleHexString(salt)
        }

        fun rand_s(_in: String): String {
            val sb = StringBuilder()
            for (i in 0..extraLength) {
                sb.append(if (rand.nextBoolean()) Alphabet[rand.nextInt(Alphabet.size)] else Number[rand.nextInt(Number.size)])
            }
            return sb.toString() + _in
        }

        fun rand_r(_in: String) = _in.substring(extraLength, extraLength + 128)
    }
}