var status = 0;

/*

WhatDay Method How Using ?

Mon : 1
Tue : 2
Wed : 3
Thr : 4
Fri : 5
Sat : 6
Sun : 7

*/

function action(mode, type, selection) {
    	if (status == 0) {
		if (cm.getPlayer().getLevel() >= 30) {
		if (cm.WhatDay(1) && cm.haveItem(4170049,1)) {
		cm.TimeMoveMap(450000000, 123456789, 1800);
		cm.sendOk("현재 요일던전은 드랍률 , 경험치 , 몬스터벨런스가 완벽하지 않은 상태입니다. 카페에 개선됬으면 하는점 건의 부탁드립니다.");
		cm.gainItem(4170049,-1);
		cm.dispose();
		} else if (cm.WhatDay(2) && cm.haveItem(4170049,1)) {
		cm.TimeMoveMap(450000100, 123456789, 1800);
		cm.sendOk("현재 요일던전은 드랍률 , 경험치 , 몬스터벨런스가 완벽하지 않은 상태입니다. 카페에 개선됬으면 하는점 건의 부탁드립니다.");
		cm.gainItem(4170049,-1);
		cm.dispose();
		} else if (cm.WhatDay(3) && cm.haveItem(4170049,1)) {
		cm.TimeMoveMap(450000200, 123456789, 1800);
		cm.sendOk("현재 요일던전은 드랍률 , 경험치 , 몬스터벨런스가 완벽하지 않은 상태입니다. 카페에 개선됬으면 하는점 건의 부탁드립니다.");
		cm.gainItem(4170049,-1);
		cm.dispose();
		} else if (cm.WhatDay(4) && cm.haveItem(4170049,1)) {
		cm.TimeMoveMap(450000300, 123456789, 1800);
		cm.sendOk("현재 요일던전은 드랍률 , 경험치 , 몬스터벨런스가 완벽하지 않은 상태입니다. 카페에 개선됬으면 하는점 건의 부탁드립니다.");
		cm.gainItem(4170049,-1);
		cm.dispose();
		} else if (cm.WhatDay(5) && cm.haveItem(4170049,1)) {
		cm.TimeMoveMap(450000400, 123456789, 1800);
		cm.sendOk("현재 요일던전은 드랍률 , 경험치 , 몬스터벨런스가 완벽하지 않은 상태입니다. 카페에 개선됬으면 하는점 건의 부탁드립니다.");
		cm.gainItem(4170049,-1);
		cm.dispose();
		} else if (cm.WhatDay(6) && cm.haveItem(4170049,1)) {
		cm.TimeMoveMap(450000500, 123456789, 1800);
		cm.sendOk("현재 요일던전은 드랍률 , 경험치 , 몬스터벨런스가 완벽하지 않은 상태입니다. 카페에 개선됬으면 하는점 건의 부탁드립니다.");
		cm.gainItem(4170049,-1);
		cm.dispose();
		} else if (cm.WhatDay(0) && cm.haveItem(4170049,1)) {
		cm.TimeMoveMap(450000600, 123456789, 1800);
		cm.sendOk("현재 요일던전은 드랍률 , 경험치 , 몬스터벨런스가 완벽하지 않은 상태입니다. 카페에 개선됬으면 하는점 건의 부탁드립니다.");
		cm.gainItem(4170049,-1);
		cm.dispose();
		} else {
		cm.playerMessage(5,"요일 던전에 입장하기 위해서는 열쇠가 필요하다.");
		cm.dispose();
		}
		} else {
		cm.sendOk("이 거대한 책에는 각 요일과 제 8요일에 관한 전설이 적혀있다. 희미한 균열이 보이지만 위험해보인다. 다음에 다시 찾아와보도록 하자.");
		}
		} else {
		cm.sendOk("이 거대한 책에는 각 요일과 제 8요일에 관한 전설이 적혀있다. 희미한 균열이 보이지만 위험해보인다. 다음에 다시 찾아와보도록 하자.");
		}
	}
