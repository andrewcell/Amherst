/*
 * Rooney - 루피
 * TAG FOR SEARCH :
 * Location : 209000000 (히든스트리트 - 행복한마을)
 * ScriptName : go_victoria
 */
var status = -1;
function action(mode, type, selection) {
    if (mode == 1 && type != 1) {
        status++;
    } else {
        if (mode == 0 && type == 1) {
            status++;
            selection = 0;
        } else if (mode == 1 && type == 1) {
            status++;
            selection = 1;
        } else {
            cm.dispose();
            return;
        }
    }
    if (status == 0) {
        returnmap = cm.getSavedLocation("CHRISTMAS");
        cm.sendYesNo("이전에 계셨던 #b#m" + returnmap + "##k 맵으로 돌아가고 싶으신가요?");
    } else if (status == 1) {
        if (selection == 0) {
            cm.sendOk("그래요? 마음이 바뀌면 다시 찾아오세요~");
            cm.dispose();
        } else {
            cm.clearSavedLocation("CHRISTMAS");
            cm.warp(returnmap);
            cm.dispose();
        }
    }
}