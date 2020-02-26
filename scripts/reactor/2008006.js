
function act() {
    var eim = rm.getPlayer().getEventInstance();
    var em = rm.getEventManager("OrbisPQ");
    if (eim != null) {
        var droppeditem = parseInt(eim.getProperty("ActivatedReactorItem"));
        if (droppeditem == 4001056) {
            rm.changeMusic("Bgm08/ForTheGlory"); //빨
            em.setProperty("stage3_music", "1");
        }
        if (droppeditem == 4001057) {
            rm.changeMusic("Bgm11/Aquarium"); //주
            em.setProperty("stage3_music", "2");
        }
        if (droppeditem == 4001058) {
            rm.changeMusic("Bgm06/WelcomeToTheHell"); //노
            em.setProperty("stage3_music", "3");
        }
        if (droppeditem == 4001059) {
            rm.changeMusic("Bgm06/FantasticThinking"); //보
            em.setProperty("stage3_music", "4");
        }
        if (droppeditem == 4001060) {
            rm.changeMusic("Bgm02/EvilEyes"); //파
            em.setProperty("stage3_music", "5");
        }
        if (droppeditem == 4001061) {
            rm.changeMusic("Bgm10/TheWayGrotesque"); //하
            em.setProperty("stage3_music", "6");
        }
        if (droppeditem == 4001062) {
            rm.changeMusic("Bgm01/MoonlightShadow"); //초
            em.setProperty("stage3_music", "7");
        }
        rm.getReactor().forceHitReactor(1);
    }
}