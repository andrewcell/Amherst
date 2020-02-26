function run() {
    self.say("안녕?");
    self.say("사실 나도 왜이러는지 모르겠어.");
    if (target.getPlayer().getGender() == 0 || target.getPlayer().isGM()) {
        var 관심 = self.askMenu("후..#b\r\n#L0#(무슨 일인지 물어본다.)#l\r\n#L1#(나에게 좋지 않은 것을 몰고 오는 듯하다. 도망가자.)#l");
        if (관심 == 0) {
            var 게이바 = self.askMenu("어릴 땐 몰랐는데 자라오면서 내겐 큰 고민이 생겼어. 너는 그 고민을 들어줄 수 있을까?..#b\r\n#L0#물론#l\r\n#L1#꺼져#l");
            if (게이바 == 0) {
                target.music("약/숨겨왔던");
                for (var count = 1; count < 20; ++count) {
                    var userHP = target.getPlayer().getStat().getHp();
                    target.getPlayer().addHP(-userHP / 2);
                    var userMP = target.getPlayer().getStat().getMp();
                    target.getPlayer().addMP(-userMP / 2);//유저'현재' 피 50퍼 감소, 엠피 제로
                    self.askYesNo("정말로?");
                    target.message("정말로?");
                }
                self.say("#b(버섯똘이가 #r#e점점#n#b 가까워진다.)");
                self.say("#b#h0##k은(는) 눈앞이 깜깜해졌다.");
                self.say("... ...");

                //target.warp(103000004);//중환자실로 워프
                var em = self.getEventManager("Gojarani");
                em.startInstance_Solo(target.getPlayer().getId(), target.getPlayer());
                target.music("약/이루마고자라니");
                target.openNpc(1052004);
                //... ... 이보시오. 여긴 어디오..
                //Aㅏ.. 안심하세요. 여긴 중환자실입니다.
                //
            }
            else if (게이바 == 1) {
                self.say("들어올 땐 맘대로 였겠지만, 나갈 땐 아니란다.");
                target.music("약/Electric_Six_Gay_Bar");
                var userHP = target.getPlayer().getStat().getHp();
                target.getPlayer().addHP(-userHP / 2);
                var userMP = target.getPlayer().getStat().getMp();
                target.getPlayer().addMP(-userMP);	//유저'현재' 피,엠 50퍼 감소
                self.say("#b(어서 대화를 중단하고 빠르게 도망가는게 좋겠다.)");
            }
        }
        else if (관심 == 1) {
            target.music("약/문학소녀");
        }
    }
    else {
        self.askMenu("넌 나의 고민을 해결할수 없겠구나.#b\r\n#L0#(무슨 소리인지 알 수 없지만 왠지 라이벌이 될지도 모른다고 나는 생각했다.)#l");
    }
}