var status = 0;

function action(mode, type, selection) {
    var 홀 = cm.getQuestRecord(55555);
    var 짝 = cm.getQuestRecord(55556);

    if (홀.getCustomData() == null) {
        홀.setCustomData("0");
        짝.setCustomData("0");
    }
    if (status == 0) {
        cm.sendSimple("안녕하세요, 도박은 인생의 꽃이라는 말도 존재한답니다. 지루하고 가난한 일상을 벋어나 새로운 인생을 살고 싶으시다면 지금바로 #b홀#k#r짝#k 배팅에 참여하세요!\r\n현재 배당 금액 : #r1.5x#k\r\n\r\n#r#e[주의사항]#k#n\r\n추첨결과를 바로확인하지 않으신다면, 다음배팅참여불가능하며 당첨금이증발됩니다.\r\n\r\n#b#L0# 홀#k#r짝#k#b 배팅을 하고 싶습니다. #l\r\n#L1# 결과를 확인하고 싶습니다. (당첨금받기) #l\r\n");
       status++;
    } else if (status == 1) {
        if (selection == 0) {
            if (cm.getClient().getChannelServer().수금() == true) {
                if (홀.getCustomData() == 0 && 짝.getCustomData() == 0) {
                    cm.sendSimple("탁월한 선택입니다. 홀과 짝중 어디에 배팅하시겠습니까?\r\n#r(!)#k 확률은 공정하게 진행됩니다.\r\n#b#L0#홀#l#k\r\n#r#L1#짝#l");
                    status++;
                } else {
                    cm.sendOk("이미 배팅금액을 지불하셨거나, 지난 회 당첨금을 수령하지 않으셨습니다.");
                    cm.dispose();
                }
            } else {
                cm.sendOk("배팅금액은 추첨시작 #r5분전#k에 신청할수있습니다.");
                cm.dispose();
            }
        } else if (selection == 1) {
            if (홀.getCustomData() >= 1) {
		if (cm.getPlayer().getTOTOresult(1) == 0 && cm.getPlayer().getTOTOresult(2) == 0) {
		cm.sendOk("아직 홀짝결과가 발표되지 않았습니다.");
		cm.dispose();
                } else if (cm.getPlayer().getTOTOresult(1) == 1) {
                    cm.playerMessage(1, "●홀짝 당첨금●\r\n축하합니다. " + 홀.getCustomData() * 1.5  + "원이 지급되었습니다. ");
		    cm.gainMeso(홀.getCustomData() * 1.5);
        	    홀.setCustomData("0");
      	            짝.setCustomData("0");
                    cm.dispose();
                } else {
                    cm.sendOk("이번 홀짝 배팅 결과는 #r짝#k입니다. 아쉽지만 다음에 다시 배팅해주세요.");
        	    홀.setCustomData("0");
      	            짝.setCustomData("0");
                    cm.dispose();
                }
            } else if (짝.getCustomData() >= 1) {
		if (cm.getPlayer().getTOTOresult(1) == 0 && cm.getPlayer().getTOTOresult(2) == 0) {
		cm.sendOk("아직 홀짝결과가 발표되지 않았습니다.");
		cm.dispose();
                } else if (cm.getPlayer().getTOTOresult(2) == 1) {
                  cm.playerMessage(1, "●홀짝 당첨금●\r\n축하합니다. " + 짝.getCustomData() * 1.5  + "원이 지급되었습니다. ");
		    cm.gainMeso(짝.getCustomData() * 1.5);
        	    홀.setCustomData("0");
      	            짝.setCustomData("0");
                    cm.dispose();
                } else {
                    cm.sendOk("이번 홀짝 배팅 결과는 #b홀#k입니다. 아쉽지만 다음에 다시 배팅해주세요.");
        	    홀.setCustomData("0");
      	            짝.setCustomData("0");
                    cm.dispose();
                }
	      } else {
		    if (cm.getPlayer().getTOTOresultlist() == "홀") {
                    cm.sendOk("● 지난 회 홀짝 배팅 결과 : #b"+cm.getPlayer().getTOTOresultlist()); 
                    cm.dispose();
		    } else {
                    cm.sendOk("● 지난 회 홀짝 배팅 결과 : #r"+cm.getPlayer().getTOTOresultlist()); 
                    cm.dispose();
			}
		}
            }
        } else if (status == 2) {
            if (selection == 0) {
                cm.sendGetNumber("#b홀#k을 선택하셧습니다. 얼마를 배팅하시겠습니까?\r\n#r(!)#k 5만원이상부터 배팅이 가능합니다.", 1, 50000, 1000000000);
                status = 10;
            } else if (selection == 1) {
                cm.sendGetNumber("#r짝#k을 선택하셧습니다. 얼마를 배팅하시겠습니까?\r\n#r(!)#k 5만원이상부터 배팅이 가능합니다.", 1, 50000, 1000000000);
                status = 11;
            }
        } else if (status == 10) {
            if (mode != 1) {
                cm.dispose();
            } else {
                if (cm.getPlayer().getMeso() >= selection) {
                    홀.setCustomData(selection + "");
                    cm.gainMeso(-selection);
                    cm.sendOk("#b홀#k에 #r" + selection + "메소#k를 배팅하였습니다.");
                    cm.dispose();
                } else {
                    cm.sendOk("입력하신 배팅금액이 소지금액보다 높습니다.");
                    cm.dispose();
                }
            }
        } else if (status == 11) {
            if (mode != 1) {
                cm.dispose();
            } else {
                if (cm.getPlayer().getMeso() >= selection) {
                    짝.setCustomData(selection + "");
                    cm.gainMeso(-selection);
                    cm.sendOk("#r짝#k에 #r" + selection + "메소#k를 배팅하였습니다.");
                    cm.dispose();
                } else {
                    cm.sendOk("입력하신 배팅금액이 소지금액보다 높습니다.");
                    cm.dispose();
                }
            }
        }
    }
