/*
 * NPCID : 9000002
 * ScriptName : Event02
 * NPCNameFunc : 피에트로
 * Location : 109050000 (히든스트리트 - 이벤트상품지급소)
 * Location : 108000202 (히든스트리트 - 마법사의나무던전)
 * Location : 108000200 (히든스트리트 - 마법사의나무던전)
 * Location : 108000201 (히든스트리트 - 마법사의나무던전)
 * 
 * @author T-Sun
 *
 */

importPackage(Packages.server);
importPackage(Packages.client);
importPackage(java.util);
importPackage(java.lang);
importPackage(Packages.tools);
importPackage(Packages.tools.packet);
var status = 0;
function start() {
    status = -1;
    action(1,0,0);
}
function action(mode, type, selection) {
    if (mode == 1) {
        status++;
    } else {

        cm.dispose();
        return;
    }
    if (status == 0) {
        cm.sendNext("빰빠바빰~ 축하합니다! #b게임 이벤트#k를 완수하셨습니다.");
    } else if (status == 1) {
        cm.sendNext("이벤트 상품으로 고대문자로 작성된 비밀 정보가 들어있는 스크롤, #b#t4031019##k를 드립니다. #r이 아이템은 버리면 회수가 불가능 하니 절대 버리시면 안돼요~#k");
    } else if (status == 2) {
        cm.sendNext("#t4031019#는 #r#p9000007##k, 또는 루디브리엄 성에 있는 #r지니#k에게 가져가면 해독하실 수 있습니다. 받기 전에 인벤토리 공간이 충분한지 확인해 주세요. 그럼 행운을 빕니다~");
    } else if (status == 3) {
        if (cm.canHold(4031019)) {
            cm.warp(cm.getSavedLocation("EVENT"));
            cm.clearSavedLocation("EVENT");
            cm.gainItemPeriod(4031019, 1, 3);
            giveBuff(MapleBuffStat.HOLY_SYMBOL, 50, 9001002, 3600000);
            cm.playerMessage(5, "1시간 동안 경험치 1.5배 버프가 적용되었습니다. 게임 재접속, 혹은 홀리심볼 버프를 받게되면 해제되니 주의해주세요. (버프 창에는 15분으로 표시되지만, 실제로는 1시간 동안 적용됩니다.)");
            cm.playerMessage(1, "1시간 동안 경험치 1.5배 버프가 적용되었습니다. \r\n\r\n게임 재접속, 혹은 홀리심볼 버프를 받게되면 해제되니 주의해주세요. \r\n\r\n(버프 창에는 15분으로 표시되지만, 실제로는 1시간 동안 적용됩니다.)");
            cm.dispose();
        } else {
            cm.sendOk("인벤토리 공간이 부족하신 건 아닌가요? 다시 한번 확인해 주세요~");
            cm.dispose();
        }
    }
}


function giveBuff(a, b, buffid, time) {
    var stateff = SkillFactory.getSkill(buffid).getEffect(1);
    var localstatups = new EnumMap(MapleBuffStat);
    localstatups.put(a, Integer.valueOf(b));
    var chr = cm.getPlayer();
    chr.cancelEffect(stateff, -1, localstatups, true);
    chr.getClient().sendPacket(TemporaryStatsPacket.giveBuff(buffid, Integer.valueOf(time), localstatups, stateff));
    var starttime = System.currentTimeMillis();
    var cancelAction = new MapleStatEffect.CancelEffectAction(chr, stateff, starttime, localstatups);
    var schedule = Packages.server.Timer.BuffTimer.getInstance().schedule(cancelAction, time);
    chr.registerEffect(stateff, starttime, schedule, localstatups, false, time, chr.getId());
}