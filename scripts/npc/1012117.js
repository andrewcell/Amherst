﻿var status = -1;
var beauty = 0;
var newAvatar;
var needItemHair = 4033616;

function start() {
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == 1) {
        status++;
    } else {
        cm.dispose();
        return;
    }

    if (status == 0) {
       cm.sendSimple("환영합니다. VIP 뷰티샵 원장 빅 헤드워드 입니다. #rneedfix 뷰티쿠폰#k만 있다면 최신유행하는 헤어,얼굴로 스페셜 하게 바꿔드립니다.\r\n#b#L0#최신 스타일로 머리자르기#l\r\n#L1#최신 스타일로 성형하기#l\r\n#L2#랜덤 쿠폰 헤어에 사용하기#l\r\n#L3#랜덤 쿠폰 성형에 사용하기#l");
    } else if (status == 1) {
        if (selection == 0) {
            var hair = cm.getPlayerStat("HAIR");
            newAvatar = [];
            beauty = 1;
            var curColor = hair % 10;
            var customData = cm.getQuestRecord(50011);
            if (customData.getCustomData() == "남자") {
                newAvatar = [33060,33070,33080,33090,33110,33120,33130,33150,33170,33180,33190,33210,33220,33250,33260,33270,33280,33310,33330,33350,33360,33370,33380,33390,33400,33410,33430,33440,33450,33460,33480,33500,33510,33520,33530,33550,33580,33590,33600,33610,33620,33630,33640,33660,33670,33680,33690,33700,33710,33720,33730,33740,33750,33760,33770,33780,33790,33800,33810,33820,33830,33930,33940,33950,33960,33990,35000,35010,35020,35030,35040,35050,35060,35070,35080,35090,35100,35150,35180,35190,35210,35280,35290,35300,35310,35320,35330,35350,35360,35430,35440,35460,35470,35480,35490,35500,35510,35520,35530,35540,36010,36020,36030,36040,36050,36070,36080,36090,36100,36130,36140,36150,36160,36170,36180,36190,36210,36220,36230,36240,36250,36300,36310,36330,36340,36350,36380,36390,36400,36410,36420,36430,36440,36450,36460,36470,36480,36510,36520,36530,36570,36580,36590,36620,36630,36640,36650,36670,36680,36690,36700,36710,36720,36730,36740,36750,36760,36770,36780,36790,36800,36810,36820,36830,36840,36850,36860,36900,36910,36920,36940,36950,36980,36990];
            } else {
                newAvatar = [31470,31480,31490,31510,31520,31530,31540,31550,31560,31590,31610,31620,31630,31640,31650,31670,31680,31690,31700,31710,31720,31740,31750,31780,31790,31800,31810,31820,31840,31850,31860,31880,31890,31910,31920,31930,31940,31950,31990,34040,34070,34080,34090,34100,34110,34120,34130,34140,34150,34160,34170,34180,34190,34210,34220,34230,34240,34250,34260,34270,34310,34320,34330,34340,34360,34370,34380,34400,34410,34420,34430,34440,34450,34470,34480,34490,34510,34540,34560,34590,34600,34610,34620,34630,34640,34660,34670,34680,34690,34700,34710,34720,34730,34740,34750,34760,34770,34780,34790,34800,34810,34820,34830,34840,34850,34860,34870,34880,34900,34910,34940,34950,34960,34970,37000,37010,37020,37030,37040,37060,37070,37090,37100,37110,37120,37130,37140,37190,37210,37220,37230,37240,37250,37260,37300,37310,37320,37330,37340,37350,37370,37380,37400,37450,37460,37490,37500,37510,37520,37530,37560,37570,37580,37610,37620,37630,37640,37650,37660,37670,37680,37690,37700,37710,37720,37730,37740,37750,37760,37770,37780,37790,37800,37810,37820,37830,37840,37850,37860,37880,37910,37920,37940,37950,37960,37970,37980,37990,38000,38010,38020,38030,38040,38050,38060,38070,38090,38100,38110,38120,38130,38270,38280,38290,38300,38310,38390,38400,38410,38420,38430,38440,38460,38490,38560,38570,38580,38590,38620,38630,38640,38650,38660,38670];
            }
            cm.askAvatar("오호호~ 어떤 헤어스타일을 원하시나요 고객님?", newAvatar);
        } else if (selection == 1) {
	cm.dispose();
	cm.openNpc(2430011);
        } else if (selection == 2) {
	cm.dispose();
	cm.openNpc(9000124);
        } else if (selection == 3) {
	cm.dispose();
	cm.openNpc(2012036);
        }
    } else if (status == 2) {
        if (beauty == 1){
            if (cm.setAvatar(needItemHair, newAvatar[selection]) == 1) {
                cm.sendOk("자~ 다 되었답니다. 어떠세요? 저희 미용실만의 최고의 솜씨를 발휘해 보았답니다.");
            } else {
                cm.sendOk("죄송하지만 최신 헤어로 스타일하시기 위해서는 #rneedfix 뷰티쿠폰#k이 필요합니다.");
            }
        }
        cm.dispose();
    }
}
