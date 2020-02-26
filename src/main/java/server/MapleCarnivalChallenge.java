/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package server;

import client.MapleCharacter;
import handling.world.MaplePartyCharacter;
import java.lang.ref.WeakReference;

/**
 * TODO : Make this a function for NPC instead.. cleaner
 * @author Rob
 */
public class MapleCarnivalChallenge {

    WeakReference<MapleCharacter> challenger;
    String challengeinfo = "";

    public MapleCarnivalChallenge(MapleCharacter challenger) {
        this.challenger = new WeakReference<MapleCharacter>(challenger);
        challengeinfo += "#b";
        for (MaplePartyCharacter pc : challenger.getParty().getMembers()) {
            MapleCharacter c = challenger.getMap().getCharacterById(pc.getId());
            if (c != null) {
                challengeinfo += (c.getName() + " / 레벨 : " + c.getLevel() + " / 직업 : " + getJobNameById(c.getJob()) + "\r\n");
            }
        }
        challengeinfo += "#k\r\n";
    }

    public MapleCharacter getChallenger() {
        return challenger.get();
    }

    public String getChallengeInfo() {
        return challengeinfo;
    }

    public static final String getJobNameById(int job) {
        switch (job) {
            case 0:
                return "초보자";

            case 100:
                return "검사";// Warrior
            case 110:
                return "파이터";
            case 111:
                return "크루세이더";
            case 112:
                return "히어로";
            case 120:
                return "페이지";
            case 121:
                return "나이트";
            case 122:
                return "팔라딘";
            case 130:
                return "스피어맨";
            case 131:
                return "용기사";
            case 132:
                return "다크나이트";

            case 200:
                return "매지션";
            case 210:
                return "위자드(불,독)";
            case 211:
                return "메이지(불,독)";
            case 212:
                return "아크메이지(불,독)";
            case 220:
                return "위자드(얼음,번개)";
            case 221:
                return "메이지(얼음,번개)";
            case 222:
                return "아크메이지(얼음,번개)";
            case 230:
                return "클레릭";
            case 231:
                return "프리스트";
            case 232:
                return "비숍";

            case 300:
                return "아처";
            case 310:
                return "헌터";
            case 311:
                return "레인저";
            case 312:
                return "보우마스터";
            case 320:
                return "사수";
            case 321:
                return "저격수";
            case 322:
                return "신궁";

            case 400:
                return "로그";
            case 410:
                return "어쌔신";
            case 411:
                return "허밋";
            case 412:
                return "나이트로드";
            case 420:
                return "시프";
            case 421:
                return "시프마스터";
            case 422:
                return "섀도어";

            case 500:
                return "운영자";
            

            default:
                return "?";
        }
    }

    public static final String getJobBasicNameById(int job) {
        switch (job) {
            case 0:
                return "초보자";

            case 100:
            case 110:
            case 111:
            case 112:
            case 120:
            case 121:
            case 122:
            case 130:
            case 131:
            case 132:
                return "전사";

            case 200:
            case 210:
            case 211:
            case 212:
            case 220:
            case 221:
            case 222:
            case 230:
            case 231:
            case 232:
                return "마법사";


            case 300:
            case 310:
            case 311:
            case 312:
            case 320:
            case 321:
            case 322:
                return "궁수";

            case 400:
            case 410:
            case 411:
            case 412:
            case 420:
            case 421:
            case 422:
                return "도적";



            default:
                return "?";
        }
    }
}
