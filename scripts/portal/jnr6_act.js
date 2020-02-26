function enter(pi) {
    var em = pi.getEventManager("Juliet");
    if (em != null && em.getProperty("stage5").equals("0")) {

        var eim = pi.getPlayer().getEventInstance();
        for (var iz = 9300142; iz <= 9300146; ++iz) {
            for (var ii = 0; ii < 10; ++ii) {
                var mob = Packages.server.life.MapleLifeFactory.getMonster(iz);
                if (eim != null) {
                    eim.registerMonster(mob);
                }
                pi.getPlayer().getMap().spawnMonsterOnGroundBelow(mob, pi.getPlayer().getPosition());
            }
        }

        pi.removeNpc(2112010);
        pi.mapMessage(6, "정체를 알 수 없는 과학자가 몬스터를 불러내고 황급히 사라졌다.");
        em.setProperty("stage5", "1");
    }
}