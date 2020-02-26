var status = 0;

function action(mode, type, selection){

if (status == 0) {
cm.sendGetText("몬스터의 드랍정보를 알려드립니다. 아래의 확인하시고 싶은 몬스터의 코드를 입력해주세요.\r\n");
status ++;
} else if (status == 1) {
cm.sendOk(cm.checkDrop(cm.getText()));
cm.dispose();
}
} 
