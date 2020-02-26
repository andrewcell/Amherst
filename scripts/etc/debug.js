
function run() {
    var packet = Packages.tools.MaplePacketCreator.serverNotice(6, "디버그 스크립트 테스트");
    Packages.handling.world.World.Broadcast.broadcastMessage(packet);
}

