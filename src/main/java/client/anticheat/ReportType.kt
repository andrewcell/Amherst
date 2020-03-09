package client.anticheat

enum class ReportType (val i: Int, val theId: String){
    Hacking(0, "hack"),
    Botting(1, "bot"),
    Scamming(2, "scam"),
    FakeGM(3, "fake"),
    //Harassment(4, "harass"),
    Advertising(5, "ad");

    fun getById(z: Int): ReportType? {
        for (t in values()) {
            if(t.i == z) {
                return t
            }
        }
        return null
    }

    fun getByString(z: String): ReportType? {
        for (t in values()) {
            if(z.contains(t.theId)) {
                return t
            }
        }
        return null
    }
}