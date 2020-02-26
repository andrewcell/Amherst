/*
This file is part of the ZeroFusion MapleStory Server
Copyright (C) 2008 Patrick Huy <patrick.huy@frz.cc> 
Matthias Butz <matze@odinms.de>
Jan Christian Meyer <vimes@odinms.de>
ZeroFusion organized by "RMZero213" <RMZero213@hotmail.com>

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License version 3
as published by the Free Software Foundation. You may not use, modify
or distribute this program under any other version of the
GNU Affero General Public License.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
package server.events;

import client.MapleCharacter;
import java.util.concurrent.ScheduledFuture;
import server.Timer.EventTimer;
import tools.MaplePacketCreator;

public class MapleFitness extends MapleEvent {

    private static final long serialVersionUID = 845748950824L;
    private long time = 900000; //change
    private long timeStarted = 0;
    private ScheduledFuture<?> fitnessSchedule, msgSchedule;

    public MapleFitness(final int channel, final MapleEventType type) {
	super(channel,type);
    }

    @Override
    public void finished(final MapleCharacter chr) {
//        givePrize(chr);
//        chr.finishAchievement(20);
        chr.dropMessage(0, "축하합니다! [고지를향해서] 이벤트를 완주하셨습니다! NPC [피에트로] 를 더블클릭하면 보상을 받을 수 있습니다.");
    }

    @Override
    public void onMapLoad(MapleCharacter chr) {
	super.onMapLoad(chr);
        if (isTimerStarted()) {
            chr.getClient().getSession().write(MaplePacketCreator.getClock((int) (getTimeLeft() / 1000)));
        }
    }

    @Override
    public void startEvent() {
        unreset();
        super.reset(); //isRunning = true
        broadcast(MaplePacketCreator.getClock((int) (time / 1000)));
        this.timeStarted = System.currentTimeMillis();
        checkAndMessage();

        fitnessSchedule = EventTimer.getInstance().schedule(new Runnable() {

            @Override
            public void run() {
                for (int i = 0; i < type.mapids.length; i++) {
                    for (MapleCharacter chr : getMap(i).getCharactersThreadsafe()) {
                        out(chr);
                    }
                }
                unreset();
            }
        }, this.time);


        broadcast(MaplePacketCreator.serverNotice(0, "포탈이 열렸습니다. 포탈 위에서 ↑를 눌러주세요."));
    }

    public boolean isTimerStarted() {
        return timeStarted > 0;
    }

    public long getTime() {
        return time;
    }

    public void resetSchedule() {
        this.timeStarted = 0;
        if (fitnessSchedule != null) {
            fitnessSchedule.cancel(false);
        }
        fitnessSchedule = null;
        if (msgSchedule != null) {
            msgSchedule.cancel(false);
        }
        msgSchedule = null;
    }

    @Override
    public void reset() {
        super.reset();
        resetSchedule();
        getMap(0).getPortal("join00").setPortalState(false);
    }

    @Override
    public void unreset() {
        super.unreset();
        resetSchedule();
        getMap(0).getPortal("join00").setPortalState(true);
    }

    public long getTimeLeft() {
        return time - (System.currentTimeMillis() - timeStarted);
    }

    public void checkAndMessage() {
        msgSchedule = EventTimer.getInstance().register(new Runnable() {

            @Override
            public void run() {
                final long timeLeft = getTimeLeft();
                if (timeLeft > 9000 && timeLeft < 11000) {
                    broadcast(MaplePacketCreator.serverNotice(0, "제한시간이 10초 남았습니다. 성공하지 못 하신 분들은 다음 이벤트에서 꼭 성공하시길 바랍니다. 그럼 안녕히 가세요."));
                } else if (timeLeft > 11000 && timeLeft < 101000) {
                    broadcast(MaplePacketCreator.serverNotice(0, "자 이제 시간이 얼마 남지 않았습니다. 조금 서둘러 주세요~"));
                } else if (timeLeft > 101000 && timeLeft < 201000) {
                    broadcast(MaplePacketCreator.serverNotice(0, "4단계는 [고지를 향해서]의 마지막 단계입니다. 끝까지 포기하지 마시고 최선을 다해주세요. 위에서 상품이 기다리고 있습니다^^"));
                } else if (timeLeft > 201000 && timeLeft < 301000) {
                    broadcast(MaplePacketCreator.serverNotice(0, "3단계에는 눈에는 보이지만 실제로 밟을 수 없는 함정이 있습니다. 그 함정을 조심히 이동해 주세요."));
                } else if (timeLeft > 301000 && timeLeft < 361000) {
                    broadcast(MaplePacketCreator.serverNotice(0, "렉이 심한 분들은 렉 때문에 아래로 떨어지지 않도록 천천히 이동해 주세요"));
                } else if (timeLeft > 361000 && timeLeft < 501000) {
                    broadcast(MaplePacketCreator.serverNotice(0, "게임 중 캐릭터가 죽게 되면 탈락이니 죽지 않게 조심해 주세요. 아직 시간은 충분하니 에너지가 없는 분들은 물약을 드시거나 HP를 회복 한 뒤에 게임에 임해주세요."));
                } else if (timeLeft > 501000 && timeLeft < 601000) {
                    broadcast(MaplePacketCreator.serverNotice(0, "원숭이들이 던지는 바나나를 피하기 위해 가장 중요한 것은 \"타이밍\" 바로 타이밍 입니다. 힘내세요."));
                } else if (timeLeft > 601000 && timeLeft < 661000) {
                    broadcast(MaplePacketCreator.serverNotice(0, "2단계 에서는 원숭이들이 던지는 바나나를 잘 피해가셔야 합니다. 타이밍을 잘 맞춰서 바나나를 위해 위로 쭉쭉 이동해 주세요."));
                } else if (timeLeft > 661000 && timeLeft < 701000) {
                    broadcast(MaplePacketCreator.serverNotice(0, "게임 중 캐릭터가 죽게 되면 탈락이니 죽지 않게 조심해 주세요. 아직 시간은 충분하니 에너지가 없는 분들은 물약을 드시거나 HP를 회복 한 뒤에 게임에 임해주세요."));
                } else if (timeLeft > 701000 && timeLeft < 781000) {
                    broadcast(MaplePacketCreator.serverNotice(0, "고지를 향해서는 성공 순위에 관계없이 시간내에 성공하신 모든 분들께 상품이 지급되니 너무 서두르지 마시고 이동해 주세요."));
                } else if (timeLeft > 781000 && timeLeft < 841000) {
                    broadcast(MaplePacketCreator.serverNotice(0, "1단계는 사용자가 많이 몰리는 관계로 렉이 조금 심합니다…1단계는 어렵지 않으니 렉 때문에 아래로 떨어지지 않도록 천천히 이동해 주세요."));
                } else if (timeLeft > 841000) {
                    broadcast(MaplePacketCreator.serverNotice(0, "[고지를 향해서] 는 총 4단계의 스테이지로 구성되어 있습니다. 게임 중 캐릭터가 죽게되면 탈락이니 주의해 주세요."));
                }
            }
        }, 60000);
    }
}
