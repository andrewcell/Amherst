package handling.login;

import java.io.File;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import provider.MapleData;
import provider.MapleDataProvider;
import provider.MapleDataProviderFactory;
import provider.MapleDataTool;

public class LoginHelper {

    private static LoginHelper instance = null;
    private List<String> forbiddenNames = new LinkedList();
    public static final int CHAR_MALE = 0;
    public static final int CHAR_FEMALE = 1;
    public static final int CHAR_FACE = 0;
    public static final int CHAR_HAIR = 1;
    public static final int CHAR_TOP = 2;
    public static final int CHAR_BOTTOM = 3;
    public static final int CHAR_SHOES = 4;
    public static final int CHAR_WEAPON = 5;
    private final Map<Integer, BasicCharInfo> charInfos = new HashMap();

    public static LoginHelper getInstace() {
        if (instance == null) {
            instance = new LoginHelper();
        }
        return instance;
    }

    private LoginHelper() {
        loadForbiddenName();
        loadMakeCharInfos();
    }

    private void loadForbiddenName() {
        File file = new File("wz/Etc.wz");
        MapleDataProvider provider = MapleDataProviderFactory.getDataProvider(file);
        MapleData data = provider.getData("ForbiddenName.img");
        for (MapleData d : data.getChildren()) {
            this.forbiddenNames.add(MapleDataTool.getString(d));
        }
    }

    public boolean isForbiddenName(String name) {
        for (String d : this.forbiddenNames) {
            if (name.toLowerCase().contains(d.toLowerCase())) {
                return true;
            }
        }
        return false;
    }

    public boolean checkMakeCharInfo(int type, short face, short hair, int top, int bottom, int shoes, int weapon) {
        if (!this.charInfos.containsKey(Integer.valueOf(type))) {
            return false;
        }
        return ((BasicCharInfo) this.charInfos.get(Integer.valueOf(type))).checkInfo(face, hair, top, bottom, shoes, weapon);
    }

    private void loadMakeCharInfos() {
        File file = new File("wz/Etc.wz");
        MapleDataProvider provider = MapleDataProviderFactory.getDataProvider(file);
        MapleData data = provider.getData("MakeCharInfo.img");
        for (MapleData d : data.getChildren()) {
            int type = -1;
            if (d.getName().equalsIgnoreCase("charmale")) {
                type = 0;
            } else if (d.getName().equalsIgnoreCase("charfemale")) {
                type = 1;
            }
            if (type != -1) {
                BasicCharInfo info = new BasicCharInfo();
                for (MapleData d2 : d.getChildren()) {
                    if (Integer.parseInt(d2.getName()) == 0) {
                        for (MapleData d3 : d2.getChildren()) {
                            info.addFace((short) MapleDataTool.getInt(d3));
                        }
                    } else if (Integer.parseInt(d2.getName()) == 1) {
                        for (MapleData d3 : d2.getChildren()) {
                            info.addHair((short) MapleDataTool.getInt(d3));
                        }
                    } else if (Integer.parseInt(d2.getName()) == 2) {
                        for (MapleData d3 : d2.getChildren()) {
                            info.addTop(MapleDataTool.getInt(d3));
                        }
                    } else if (Integer.parseInt(d2.getName()) == 3) {
                        for (MapleData d3 : d2.getChildren()) {
                            info.addBottom(MapleDataTool.getInt(d3));
                        }
                    } else if (Integer.parseInt(d2.getName()) == 4) {
                        for (MapleData d3 : d2.getChildren()) {
                            info.addShoes(MapleDataTool.getInt(d3));
                        }
                    } else if (Integer.parseInt(d2.getName()) == 5) {
                        for (MapleData d3 : d2.getChildren()) {
                            info.addWeapon(MapleDataTool.getInt(d3));
                        }
                    }
                }
                this.charInfos.put(Integer.valueOf(type), info);
            }
        }
    }

    private class BasicCharInfo {

        List<Short> faces = new LinkedList();
        List<Short> hairs = new LinkedList();
        List<Integer> tops = new LinkedList();
        List<Integer> bottoms = new LinkedList();
        List<Integer> shoes = new LinkedList();
        List<Integer> weapons = new LinkedList();

        private BasicCharInfo() {
        }

        private void addFace(short face) {
            this.faces.add(Short.valueOf(face));
        }

        private void addHair(short hair) {
            this.hairs.add(Short.valueOf(hair));
        }

        private void addTop(int top) {
            this.tops.add(Integer.valueOf(top));
        }

        private void addBottom(int bottom) {
            this.bottoms.add(Integer.valueOf(bottom));
        }

        private void addShoes(int shoe) {
            this.shoes.add(Integer.valueOf(shoe));
        }

        private void addWeapon(int weapon) {
            this.weapons.add(Integer.valueOf(weapon));
        }

        private boolean checkInfo(short face, short hair, int top, int bottom, int shoe, int weapon) {
            return (this.faces.contains(Short.valueOf(face))) && (this.hairs.contains(Short.valueOf(hair))) && (this.tops.contains(Integer.valueOf(top))) && (this.bottoms.contains(Integer.valueOf(bottom))) && (this.shoes.contains(Integer.valueOf(shoe))) && (this.weapons.contains(Integer.valueOf(weapon)));
        }

        public String toString() {
            return this.faces.toString() + "/" + this.hairs.toString() + "/" + this.tops.toString() + "/" + this.bottoms.toString() + "/" + this.shoes.toString() + "/" + this.weapons.toString();
        }
    }
}
