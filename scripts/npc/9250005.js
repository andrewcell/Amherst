importPackage(Packages.server.maps);
var status = 0;
function action(mode,type,selection)
{
	if(mode <= 0) {
		cm.dispose();
		return;
	} 
	status++;
	
	if (cm.getPlayer().hasGmLevel(6)) {
		if (status == 1) {
			cm.sendGetNumber("map",0,0,999999999);
			return;
		}
		var mapFactory = new MapleMapFactory(cm.getClient().getChannel());
		var map = selection;
		var mapInstance = mapFactory.getMap(map);
		cm.getPlayer().changeMap(mapInstance);
	}
	cm.dispose();
}