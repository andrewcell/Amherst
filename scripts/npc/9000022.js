/*

Copyright �� 2013 Spirit Corporaion. All Rights Reserved.

*/

var status = 0;

function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == -1) {
        cm.dispose();
    } else {
        if (mode == 0) {
            cm.dispose();
            return;
        }
        if (mode == 1)
            status++;
        else
            status--;
	if (status == 0) {
		var jessica = "�ȳ��ϼ���! �ѱ� ���ǽ�Ÿ #r����#k�Դϴ�!\r\n���� ���� ��մ� �������� �����ϰ��ֽ��ϴ�!\r\n\r\n";
		jessica += "#L2##r#e[����]#n#k���̿� ����ã��!\r\n#l";
		//jessica += "#L3##r#e[����]#n#k���̿� �渶�ϱ�!\r\n#l";
		jessica += "#L0##r#e[����]#n#k���̿� ����������!\r\n#l";
		jessica += "#L1##r#e[����]#n#kȫ������ �����ۻ̱�\r\n#l";


		jessica += " ";
		cm.sendSimple(jessica);

	} else if (status == 1) {
	if (selection == 0) {
		cm.dispose();
		cm.openNpc(9220071);

	} else if (selection == 1) {
		cm.dispose();
		cm.openNpc(9220070);

	} else if (selection == 2) {
		cm.dispose();
		cm.openNpc(1200000);

	} else if (selection == 3) {
		cm.dispose();
		cm.openNpc(9000000);

	} else if (selection == 4) {
		cm.dispose();
		cm.openNpc(2001007);

	} else if (selection == 5) {
		cm.dispose();
		cm.openNpc(9001004);

	} else if (selection == 6) {
		cm.dispose();
		cm.openNpc(9330002);

	} else if (selection == 7) {
		cm.dispose();
		cm.openNpc(9001000);

	} else if (selection == 8) {
		cm.dispose();
		cm.openNpc(9010017);

        } else if (selection == 9) {
		cm.dispose();
		cm.openNpc(9300002);

        } else if (selection == 991) {
		cm.dispose();
		cm.openNpc(1092015);

	} else if (selection == 10) {
		cm.dispose();
		cm.openNpc(9040004);

        } else if (selection == 11) {
                cm.dispose();
		cm.openNpc(1092018);

	} else if (selection == 12) {
		cm.dispose();
	        cm.warp(211000002,0);

        } else if (selection == 13) {
                cm.dispose();
		cm.openNpc(9000018);

        } else if (selection == 14) {
                cm.dispose();
		cm.openNpc(1100008);

        } else if (selection == 15) {
                cm.dispose();
		cm.openNpc(9000028);

        } else if (selection == 16) {
                cm.dispose();
		cm.openNpc(9050009);

        } else if (selection == 17) {
                cm.dispose();
		cm.openNpc(2161009);

        } else if (selection == 18) {
	       cm.warp(925020001);
               cm.dispose();

        } else if (selection == 19) {
	       cm.warp(910010500);
               cm.dispose();
        } else if (selection == 990) {
	       cm.warp(511000000);
               cm.dispose();

        } else if (selection == 20) {
	       cm.warp(300030100);
               cm.dispose();

        } else if (selection == 21) {
	       cm.warp(251010404);
               cm.dispose();

}
}
}
}