function enter(pi) {
    var em = pi.getEventManager("Juliet");
    if (em !=  null && em.getProperty("stage6_" + (((pi.getMapId() % 10) | 0) - 1) + "_" + (pi.getPortal().getName().substring(2, 3)) + "_" + (pi.getPortal().getName().substring(3, 4)) + "").equals("1")) {
	//pi.warp(-1,(pi.getPortal().getId() >= 31 ? 13 : (pi.getPortal().getId() + 4)));
	//pi.playerMessage(-1, "Correct combination!");
	//if (pi.isGMS()) { //TODO JUMP
		//pi.getMap().changeEnvironment("an" + pi.getPortal().getName().substring(2, 4), 2);
	//}
        pi.playPortalSE();
        pi.warp(-1, "np0"+pi.getPortal().getName().substring(2, 3))
        //pi.playerMessage(5, "Correct / pid : " + pi.getPortal().getId() + " / pname : " + pi.getPortal().getName());
    } else {
        pi.playPortalSE();
	pi.warp(-1, "npFail");
	//pi.playerMessage(-1, "Incorrect combination.");
        //pi.playerMessage(5, "InCorrect / pid : " + pi.getPortal().getId() + " / pname : " + pi.getPortal().getName());
    }
}