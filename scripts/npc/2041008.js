var status = 0;

function action(mode, type, selection){
	if(status == 0){
	cm.sendStorage();
	cm.dispose();
	}
}