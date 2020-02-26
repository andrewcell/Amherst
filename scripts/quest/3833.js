var status = -1;

function start(mode, type, selection) {
    qm.dispose();
}
function end(mode, type, selection) {
    if (mode == 1 && type != 1 && type != 11) {
        status++;
    } else {
        if ((type == 1 || type == 11) && mode == 1) {
            status++;
            selection = 1;
        } else if ((type == 1 || type == 11) && mode == 0) {
            status++;
            selection = 0;
        } else {
            qm.dispose();
            return;
        }
    }
    if (qm.getQuestStatus(3833) == 0) {
        qm.forceStartQuest(3833);
        qm.dispose();
        return;
    }
    
    var file = "#fUI/UIWindow.img/QuestIcon/";  
    nItem = qm.itemQuantity(4000294);
    if (nItem >= 1000) {
        if (status == 0) {
            qm.sendNext("허... 허허허허. 자네는 인간인가?! 이렇게 많이 구해 오다니, 도대체 늙은 도라지를 몇 마리나 학살한 겐가...?! 험. 아무튼 고맙네. 자네가 구한 #b#t4000294# " + nItem + "개#k를 어서 나에게 주게.\r\n\r\n" + file + "4/0#\r\n" + file + "5/0#\r\n\r\n" + file + "8/0# 54000 exp")
        } else if (status == 1) {
            if (qm.getInvSlots(2) >= 2) {
                qm.gainItem(4000294, -nItem);
                qm.gainItem(2000005, 50);
                qm.gainItem(2040501, 1);
                qm.gainExp(54000);
                qm.forceCompleteQuest();
                qm.sendOk("이 정도면 태상이 기절하지 않을까...");
                qm.dispose();
            } else {
                qm.sendOk("뭘 그렇게 많이 들고 다니는건가? 인벤토리에 빈 칸이 있는지 확인해 주게.")
                qm.dispose();
            }
        }
    } else if (nItem >= 900 && nItem < 1000) {
        if (status == 0) {
            qm.sendNext("아니... 정말 이게 모두 자네가 구한 것인가? 괴, 굉장하군... 이 정도까지 구하다니... 자네는 진정 굉장한 모험가일세. 정말 훌륭해! 이 정도면 이런 걸 줘도 아깝지 않지. 자네가 구한 #b#t4000294# " + nItem + "개#k를 어서 나에게 주게.\r\n\r\n" + file + "4/0#\r\n" + file + "5/0#\r\n\r\n" + file + "8/0# 54000 exp")
        } else if (status == 1) {
            if (qm.getInvSlots(2) >= 2) {
                qm.gainItem(4000294, -nItem);
                qm.gainItem(2020013, 50);
                qm.gainItem(2040502, 1);
                qm.gainExp(54000);
                qm.forceCompleteQuest();
                qm.sendOk("이렇게 많은 걸 무슨 수로 무릉까지 가져간다...?");
                qm.dispose();
            } else {
                qm.sendOk("뭘 그렇게 많이 들고 다니는건가? 인벤토리에 빈 칸이 있는지 확인해 주게.")
                qm.dispose();
            }
        }
    } else if (nItem >= 700 && nItem < 900) {
        if (status == 0) {
            qm.sendNext("호오... 정말 굉장하군. 여기까지 모으는 게 쉽지 않았을 텐데. 정말 고맙네. 자네가 구한 #b#t4000294# " + nItem + "개#k를 어서 나에게 주게.\r\n\r\n" + file + "4/0#\r\n" + file + "5/0#\r\n\r\n" + file + "8/0# 54000 exp")
        } else if (status == 1) {
            if (qm.getInvSlots(2) >= 2) {
                qm.gainItem(4000294, -nItem);
                qm.gainItem(2000004, 50);
                qm.gainItem(2040500, 1);
                qm.gainExp(54000);
                qm.forceCompleteQuest();
                qm.sendOk("흠. 잘못하다간 도라지를 배에 모두 싣기도 어렵겠는걸.");
                qm.dispose();
            } else {
                qm.sendOk("뭘 그렇게 많이 들고 다니는건가? 인벤토리에 빈 칸이 있는지 확인해 주게.")
                qm.dispose();
            }
        }
    } else if (nItem >= 500 && nItem < 700) {
        if (status == 0) {
            qm.sendNext("오오... 많군. 이 정도면 태상도 할 말 없겠지. 자네 보기보다 제법이군. 자네가 구한 #b#t4000294# " + nItem + "개#k를 어서 나에게 주게.\r\n\r\n" + file + "4/0#\r\n" + file + "5/0#\r\n\r\n" + file + "8/0# 54000 exp")
        } else if (status == 1) {
            if (qm.getInvSlots(2) >= 1) {
                qm.gainItem(4000294, -nItem);
                qm.gainItem(2020013, 50);
                qm.gainExp(54000);
                qm.forceCompleteQuest();
                qm.sendOk("도라지를 배까지 옮기는 것도 쉽지 않겠는걸. 황선장에게 옮겨달라고 부탁해야겠군...");
                qm.dispose();
            } else {
                qm.sendOk("뭘 그렇게 많이 들고 다니는건가? 인벤토리에 빈 칸이 있는지 확인해 주게.")
                qm.dispose();
            }
        }
    } else if (nItem >= 300 && nItem < 500) {
        if (status == 0) {
            qm.sendNext("흠... 뭐 이 정도면 당분간 태상도 별 말 않겠지. 고맙네. 자네가 구한 #b#t4000294# " + nItem + "개#k를 어서 나에게 주게.\r\n\r\n" + file + "4/0#\r\n" + file + "5/0#\r\n\r\n" + file + "8/0# 51000 exp")
        } else if (status == 1) {
            if (qm.getInvSlots(2) >= 1) {
                qm.gainItem(4000294, -nItem);
                qm.gainItem(2020012, 50);
                qm.gainExp(51000);
                qm.forceCompleteQuest();
                qm.sendOk("이 정도면 태상이 만족하겠지.");
                qm.dispose();
            } else {
                qm.sendOk("뭘 그렇게 많이 들고 다니는건가? 인벤토리에 빈 칸이 있는지 확인해 주게.")
                qm.dispose();
            }
        }
    } else if (nItem >= 200 && nItem < 300) {
        if (status == 0) {
            qm.sendNext("좋아. 이 정도면 그럭저럭 태상을 달래놓을 수 있을 것 같군. 감사하지. 자네가 구한 #b#t4000294# " + nItem + "개#k를 어서 나에게 주게.\r\n\r\n" + file + "4/0#\r\n" + file + "5/0#\r\n\r\n" + file + "8/0# 48000 exp")
        } else if (status == 1) {
            if (qm.getInvSlots(2) >= 1) {
                qm.gainItem(4000294, -nItem);
                qm.gainItem(2001001, 50);
                qm.gainExp(48000);
                qm.forceCompleteQuest();
                qm.sendOk("자아, 그럼 도라지를 잘 말려봐야겠군. 약재로 쓰려면 말리는 것도 중요하지.");
                qm.dispose();
            } else {
                qm.sendOk("뭘 그렇게 많이 들고 다니는건가? 인벤토리에 빈 칸이 있는지 확인해 주게.")
                qm.dispose();
            }
        }
    } else if (nItem >= 100 && nItem < 200) {
        if (status == 0) {
            qm.sendNext("흐음. 좀 모자라긴 하지만 뭐, 당장 급한 건 이쪽이니 어쩔 수 없지. 자네가 구한 #b#t4000294# " + nItem + "개#k를 어서 나에게 주게.\r\n\r\n" + file + "4/0#\r\n" + file + "5/0#\r\n\r\n" + file + "8/0# 45000 exp")
        } else if (status == 1) {
            if (qm.getInvSlots(2) >= 1) {
                qm.gainItem(4000294, -nItem);
                qm.gainItem(2020008, 50);
                qm.gainExp(45000);
                qm.forceCompleteQuest();
                qm.sendOk("쯧. 태상이 한동안 투덜대겠군..");
                qm.dispose();
            } else {
                qm.sendOk("뭘 그렇게 많이 들고 다니는건가? 인벤토리에 빈 칸이 있는지 확인해 주게.")
                qm.dispose();
            }
        }
    } else if (nItem >= 50 && nItem < 100) {
        if (status == 0) {
            qm.sendNext("에잉. 겨우 이 정도인가? 아주 적은 건 아니지만 만족스럽진 않군. 자네가 구한 #b#t4000294# " + nItem + "개#k를 어서 나에게 주게.\r\n\r\n" + file + "4/0#\r\n" + file + "5/0#\r\n\r\n"  + file + "8/0# 10000 exp")
        } else if (status == 1) {
            if (qm.getInvSlots(2) >= 1) {
                qm.gainItem(4000294, -nItem);
                qm.gainItem(2020007, 50);
                qm.gainExp(10000);
                qm.forceCompleteQuest();
                qm.sendOk("약탈만 아니었더라도... 이런 식으로 구할 필요 없을 텐데.");
                qm.dispose();
            } else {
                qm.sendOk("뭘 그렇게 많이 들고 다니는건가? 인벤토리에 빈 칸이 있는지 확인해 주게.")
                qm.dispose();
            }
        }
    } else if (nItem >= 10 && nItem < 50) {
        if (status == 0) {
            qm.sendNext("겨우 이게 단가? 허음... 자네 능력이 이것뿐이 안 된다니 뭐라 할 수는 없겠지만... 쯧쯧쯧. 젊은이가 이래서야 원. 자네가 구한 #b#t4000294# " + nItem + "개#k를 어서 나에게 주게.\r\n\r\n" + file + "4/0#\r\n" + file + "5/0#\r\n\r\n" + file + "8/0# 1000 exp")
        } else if (status == 1) {
            if (qm.getInvSlots(2) >= 1) {
                qm.gainItem(4000294, -nItem);
                qm.gainItem(2022144, 10);
                qm.gainExp(1000);
                qm.forceCompleteQuest();
                qm.sendOk("이래가지고는 태상을 볼 면목이 없군...");
                qm.dispose();
            } else {
                qm.sendOk("뭘 그렇게 많이 들고 다니는건가? 인벤토리에 빈 칸이 있는지 확인해 주게.")
                qm.dispose();
            }
        }
    } else if (nItem >= 1 && nItem < 10) {
        if (status == 0) {
            qm.sendNext("...뭐, 그래. 어쨌든 가져다 주긴 하는구만. 자네가 구한 #b#t4000294# " + nItem + "개#k를 어서 나에게 주게.\r\n\r\n" + file + "4/0#\r\n" + file + "5/0#\r\n\r\n"  + file + "8/0# 10 exp")
        } else if (status == 1) {
            if (qm.getInvSlots(2) >= 1) {
                qm.gainItem(4000294, -nItem);
                qm.gainItem(2000000, 1);
                qm.gainExp(10);
                qm.forceCompleteQuest();
                qm.sendOk("한동안 태상과 연락을 하지 않는 게 좋을 듯 하군...");
                qm.dispose();
            } else {
                qm.sendOk("뭘 그렇게 많이 들고 다니는건가? 인벤토리에 빈 칸이 있는지 확인해 주게.")
                qm.dispose();
            }
        }
    } else {
        qm.sendOk("아직 100년 묵은 도라지는 구하지 못한 모양이군. 그건 늙은 도라지를 잡아 얻을 수 있다네.");
        qm.dispose();
    }
}
