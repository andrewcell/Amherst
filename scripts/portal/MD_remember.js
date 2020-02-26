var baseid = 240040511;
var dungeonid = 240040800;

function enter(pi) {
    if (pi.getMapId() == baseid) {
	pi.warp(dungeonid);
	} else {
	pi.warp(baseid);
}
}