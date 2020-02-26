function act() {
        var actor = rm.getMap(rm.getMapId() + 2).getReactorByName(rm.getMapId() == 926100200 ? "rnj32_out" : "jnr32_out");
	actor.forceHitReactor(1);
	actor.scheduleSetState(1, 0, 2000);
}