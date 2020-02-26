function act() {
        var actor = rm.getMap(rm.getMapId() + 1).getReactorByName(rm.getMapId() == 926100200 ? "rnj31_out" : "jnr31_out")
	actor.forceHitReactor(1);
	actor.scheduleSetState(1, 0, 2000);
}