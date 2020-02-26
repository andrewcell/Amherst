

function act() {
	rm.mapMessage(6, "씨앗이 하나 심어졌습니다.");
	var em = rm.getEventManager("HenesysPQ");
	if (em != null) {
		var react = rm.getMap().getReactorByName("fullmoon");
		em.setProperty("stage", parseInt(em.getProperty("stage")) + 1);
		react.forceHitReactor(react.getState() + 1);
		if (em.getProperty("stage").equals("6")) {
			rm.mapMessage(6, "월묘를 보호하세요!");
			rm.getMap().setSpawns(true);
			rm.getMap().respawn(true);
			rm.getMap().spawnMonsterOnGroundBelow(em.getMonster(9300061), new java.awt.Point(-183, -433));
		}
	}
}