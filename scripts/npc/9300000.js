

var status = 0;

function action(mode, type, selection) {

    if (status == 0) {
	if (cm.getPlayer().getLevel() == 10 && cm.getPlayer().getJob() == 000) {
		cm.sendSimple("안녕하신가... 자네 혹시 8월 11일 오후 3시경에 등장한 #r히어로즈#k들을 알고있겠지?... 난 그들의 수하 삼장법사라고하네 지금 우리는 세력을 넓히기 위하여 여러 제자들을 육성하고있지 자네도 관심이있다면 수행을 받아보는게 어떻겠나? 단, 이것도 전직이라는 것을 알아두게나.\r\n#b#L0#바람의 검사 `윈드체이서` 의 길을 걷고싶습니다. #l\r\n#L1#영혼의 불꽃 `음양사` 의 길을 걷고싶습니다. #l");
		status ++;
	} else if (cm.getPlayer().getLevel() == 30 && cm.getPlayer().getJob() == 1100) {
		cm.sendSimple("안녕하신가... 자네 혹시 8월 11일 오후 3시경에 등장한 #r히어로즈#k들을 알고있겠지?... 난 그들의 수하 삼장법사라고하네 지금 우리는 세력을 넓히기 위하여 여러 제자들을 육성하고있지 자네도 관심이있다면 수행을 받아보는게 어떻겠나? 단, 이것도 전직이라는 것을 알아두게나.\r\n#b#L1100#2차승급 시험을 치루고 싶습니다. #l");
		status ++;
	} else if (cm.getPlayer().getLevel() == 30 && cm.getPlayer().getJob() == 1200) {
		cm.sendSimple("안녕하신가... 자네 혹시 8월 11일 오후 3시경에 등장한 #r히어로즈#k들을 알고있겠지?... 난 그들의 수하 삼장법사라고하네 지금 우리는 세력을 넓히기 위하여 여러 제자들을 육성하고있지 자네도 관심이있다면 수행을 받아보는게 어떻겠나? 단, 이것도 전직이라는 것을 알아두게나.\r\n#b#L1200#2차승급 시험을 치루고 싶습니다. #l");
		status ++;
	} else if (cm.getPlayer().getLevel() == 70 && cm.getPlayer().getJob() == 1110) {
		cm.sendSimple("안녕하신가... 자네 혹시 8월 11일 오후 3시경에 등장한 #r히어로즈#k들을 알고있겠지?... 난 그들의 수하 삼장법사라고하네 지금 우리는 세력을 넓히기 위하여 여러 제자들을 육성하고있지 자네도 관심이있다면 수행을 받아보는게 어떻겠나? 단, 이것도 전직이라는 것을 알아두게나.\r\n#b#L1110#3차승급 시험을 치루고 싶습니다. #l");
		status ++;
	} else if (cm.getPlayer().getLevel() == 70 && cm.getPlayer().getJob() == 1210) {
		cm.sendSimple("안녕하신가... 자네 혹시 8월 11일 오후 3시경에 등장한 #r히어로즈#k들을 알고있겠지?... 난 그들의 수하 삼장법사라고하네 지금 우리는 세력을 넓히기 위하여 여러 제자들을 육성하고있지 자네도 관심이있다면 수행을 받아보는게 어떻겠나? 단, 이것도 전직이라는 것을 알아두게나.\r\n#b#L1210#3차승급 시험을 치루고 싶습니다. #l");
		status ++;
		} else {
		cm.sendOk("전직 레벨은 #rLv.10 , 30 , 70#k 이라는 점 명심하게나.");
		cm.dispose();
		}
	} else if (status == 1) {
		if (selection == 0) {
           	 cm.changeJob(1100);
		 cm.gainItem(1302007, 1);
		 cm.sendOk("좋네, 자네는 이제부터 바람의 검사 #r`윈드체이서`#k의 길을 걷게되었네 전직레벨이 되면 다시나를 찾아오게.");
		 cm.dispose();
		} else if (selection == 1) {
           	 cm.changeJob(1200);
		 cm.gainItem(1382000, 1);
		 cm.sendOk("좋네, 자네는 이제부터 영혼의 불꽃 #r`음양사`#k의 길을 걷게되었네 전직레벨이 되면 다시나를 찾아오게.");
		 cm.dispose();
		} else if (selection == 1100) {
		 if (cm.haveItem(2210006,1)) {
           	 cm.changeJob(1110);
		 cm.gainItem(2210006,-1)
		 cm.dispose();
		} else {
		 cm.sendOk("2차 승급의 재물로 #b`무지개 달팽이 껍질`#k을 가져오도록 하게.");
		 cm.dispose();
		}
		} else if (selection == 1110) {
		 if (cm.haveItem(4005004,1) && cm.haveItem(4005000,1)) {
           	 cm.changeJob(1111);
		 cm.gainItem(4005000,-1);
		 cm.gainItem(4005004,-1);
		 cm.dispose();
		} else {
		 cm.sendOk("3차 승급의 재물로 #b`어둠의 크리스탈`#k과 #r`힘의 크리스탈`#k을 가져오도록 하게.");
		 cm.dispose();
		}
		} else if (selection == 1200) {
		 if (cm.haveItem(2210006,1)) {
           	 cm.changeJob(1210);
		 cm.gainItem(2210006,-1)
		 cm.dispose();
		} else {
		 cm.sendOk("2차 승급의 재물로 #b`무지개 달팽이 껍질`#k을 가져오도록 하게.");
		 cm.dispose();
		}
		} else if (selection == 1210) {
		 if (cm.haveItem(4005004,1) && cm.haveItem(4005001,1)) {
           	 cm.changeJob(1211);
		 cm.gainItem(4005001,-1);
		 cm.gainItem(4005004,-1);
		 cm.dispose();
		} else {
		 cm.sendOk("3차 승급의 재물로 #b`어둠의 크리스탈`#k과 #r`지혜의 크리스탈`#k을 가져오도록 하게.");
		 cm.dispose();
		}
		}
	}
}