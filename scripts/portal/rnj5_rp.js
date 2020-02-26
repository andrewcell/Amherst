function enter(pi) {
    var em = pi.getEventManager("Romeo");
    //pi.playerMessage(5, "stage6_" + (((pi.getMapId() % 10) | 0) - 1) + "_" + (pi.getPortal().getName().substring(2, 3)) + "_" + (pi.getPortal().getName().substring(3, 4)) + "");
    //pi.playerMessage(5, em.getProperty("stage6_" + (((pi.getMapId() % 10) | 0) - 1) + "_" + (pi.getPortal().getName().substring(2, 3)) + "_" + (pi.getPortal().getName().substring(3, 4)) + ""));
    if (em != null && em.getProperty("stage6_" + (((pi.getMapId() % 10) | 0) - 1) + "_" + (pi.getPortal().getName().substring(2, 3)) + "_" + (pi.getPortal().getName().substring(3, 4)) + "").equals("1")) {
	//pi.warp(-1,(pi.getPortal().getId() >= 31 ? 13 : (pi.getPortal().getId() + 4)));
	//pi.playerMessage(-1, "Correct combination!");
	//if (pi.isGMS()) { //TODO JUMP
	//	pi.getMap().changeEnvironment("an" + pi.getPortal().getName().substring(2, 4), 2);
	//}
        pi.playPortalSE();
        pi.warp(-1, "np0"+pi.getPortal().getName().substring(2, 3))
    } else {
        pi.playPortalSE();
	pi.warp(-1, "npFail");
	//pi.warp(-1, (pi.getPortal().getId() <= 4 ? 0 : (pi.getPortal().getId() - 4)));
	//pi.playerMessage(-1, "Incorrect combination.");
    }
}