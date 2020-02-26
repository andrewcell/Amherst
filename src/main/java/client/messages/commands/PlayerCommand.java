package client.messages.commands;

//import client.MapleInventory;
//import client.MapleInventoryType;
import client.MapleClient;
import client.SkillFactory;
import client.inventory.Item;
import client.inventory.MapleInventoryType;
import client.messages.commands.CommandExecute.TradeExecute;
import constants.GameConstants;
import constants.ServerConstants.PlayerGMRank;
import scripting.NPCScriptManager;
import server.MapleItemInformationProvider;
import tools.MaplePacketCreator;
import tools.StringUtil;

/**
 *
 * @author Emilyx3
 */
public class PlayerCommand {

    public static PlayerGMRank getPlayerLevelRequired() {
        return PlayerGMRank.NORMAL;
    }

    public abstract static class OfferCommand extends TradeExecute {

        protected int invType = -1;

        public int execute(MapleClient c, String[] splitted) {
            if (splitted.length < 3) {
                c.getPlayer().dropMessage("오류 : 갯수와 아이템 이름을 입력해주세요.");
            } else {
                String search = StringUtil.joinStringFrom(splitted, 1).toLowerCase();
                Item found = null;
                final MapleItemInformationProvider ii = MapleItemInformationProvider.getInstance();
                for (Item inv : c.getPlayer().getInventory(MapleInventoryType.getByType((byte) invType))) {
                    if (ii.getName(inv.getItemId()) != null && ii.getName(inv.getItemId()).toLowerCase().contains(search)) {
                        found = inv;
                        break;
                    }
                }
                if (!ii.isCash(found.getItemId())) {
                    c.getPlayer().dropMessage("오류 : 캐쉬장비 아이템만 이용할수 있습니다..");
                    return 0;
                }
                if (found == null) {
                    c.getPlayer().dropMessage("오류 : 해당아이템을 보유하고있지 않습니다.");
                    return 0;
                }
                if (GameConstants.isPet(found.getItemId()) || GameConstants.isRechargable(found.getItemId())) {
                    c.getPlayer().dropMessage("오류 : 선택하신 아이템은 교환하실수 없습니다.");
                    return 0;
                }
                if (!c.getPlayer().getTrade().setItems(c, found, (byte) -1, 1)) {
                    c.getPlayer().dropMessage("오류 : 선택하신 아이템은 교환하실수 없습니다.");
                    return 0;
                } else {
                    c.getPlayer().getTrade().chatAuto("알림 : " + c.getPlayer().getName() + " 님이 " + ii.getName(found.getItemId()) + "를 등록하였습니다.");
                }
            }
            return 1;
        }
    }

    public static class 캐쉬 extends PlayerCommand.OfferCommand {

        public 캐쉬() {
            invType = 1;
        }
    }

    public static class 주문의흔적 extends CommandExecute {

        public int execute(MapleClient c, String[] splitted) {
            if (c.getPlayer().주흔모드체크() == true) {
                c.getPlayer().주흔모드설정(false);
                c.getPlayer().dropMessage(1, "※ 주문의 흔적 모드 : OFF ※\r\n주문의 흔적 모드가 종료되었습니다. 주문의 흔적을 사용하기 원하실때에 다시한번 이 명령어로 기능을 활성화 할수 있습니다.");
            } else {
                c.getPlayer().주흔모드설정(true);
                c.getPlayer().dropMessage(1, "※ 주문의 흔적 모드 : ON ※\r\n지금부터 주문서를 사용할시 자동으로 주문의 흔적이 사용됩니다. 100%주문서에도 포함됩니다. 이 기능을 종료하시려면 다시한번 이 명령어를 사용해주세요.");
            }
            return 1;
        }
    }

    public static class 저장 extends CommandExecute {

        public int execute(MapleClient c, String[] splitted) {
            c.getPlayer().saveToDB(false, false);
            c.getPlayer().dropMessage(6, "캐릭터 정보가 백업 되었습니다. 이 기능을 많이 사용할시 서버과부화에 원인이 됩니다.");
            return 1;
        }
    }

    public static class 랙 extends CommandExecute {

        public int execute(MapleClient c, String[] splitted) {
            c.removeClickedNPC();
            NPCScriptManager.getInstance().dispose(c);
            c.getSession().write(MaplePacketCreator.enableActions());
            c.getPlayer().dropMessage(6, "무반응 현상이 해결되었습니다.");
            return 1;
        }
    }
}
