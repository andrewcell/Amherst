
function act() {
    var em = rm.getEventManager("OrbisPQ");
    if (em != null) {
        if (em.getProperty("status") == null) {
            em.setProperty("status", "0");
        }
        em.setProperty("status", parseInt(em.getProperty("status")) + 1);
        var r = rm.getMap().getReactorByName("minerva");
        r.forceHitReactor(r.getState() + 1);
    }
}