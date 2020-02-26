/*
 혼테일 파티퀘스트 열쇠 워프
 제작 : 티썬
*/
importPackage(Packages.tools);
function act() {
    var eim = rm.getPlayer().getEventInstance();
    var mapid = rm.getPlayer().getMapId();
    var map = eim.getMapInstance(240050100);
    var pos = new java.awt.Point(874, 5);
    if (mapid == 240050101) { //첫번째 미로방
        map.spawnAutoDrop(4001088, pos);
        map.getReactorById(2402002).forceHitReactor(1);
        rm.mapMessage(6, "열쇠가 어디론가 사라졌습니다.");
        map.broadcastMessage(MaplePacketCreator.serverNotice(6, "반짝이는 빛과 함께 어딘가에서 열쇠가 나타났습니다."));
    } else if (mapid == 240050102) { //두번째 미로방
        map.spawnAutoDrop(4001089, pos);
        map.getReactorById(2402002).forceHitReactor(0);
        rm.mapMessage(6, "열쇠가 어디론가 사라졌습니다.");
        map.broadcastMessage(MaplePacketCreator.serverNotice(6, "반짝이는 빛과 함께 어딘가에서 열쇠가 나타났습니다."));
    } else if (mapid == 240050103) { //세번째 미로방
        map.spawnAutoDrop(4001090, pos);
        map.getReactorById(2402002).forceHitReactor(1);
        rm.mapMessage(6, "열쇠가 어디론가 사라졌습니다.");
        map.broadcastMessage(MaplePacketCreator.serverNotice(6, "반짝이는 빛과 함께 어딘가에서 열쇠가 나타났습니다."));
    } else if (mapid == 240050104) { //네번째 미로방
        map.spawnAutoDrop(4001091, pos);
        map.getReactorById(2402002).forceHitReactor(0);
        rm.mapMessage(6, "열쇠가 어디론가 사라졌습니다.");
        map.broadcastMessage(MaplePacketCreator.serverNotice(6, "반짝이는 빛과 함께 어딘가에서 열쇠가 나타났습니다."));
    }
    
}
	
	