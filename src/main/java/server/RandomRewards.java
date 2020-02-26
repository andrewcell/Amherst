package server;

import java.util.List;
import java.util.ArrayList;
import java.util.Collections;

import constants.GameConstants;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.ini4j.Ini;
import org.ini4j.InvalidFileFormatException;
import tools.Pair;

public class RandomRewards {

    private static List<Integer> compiledGold = null, compiledSilver = null,  compiledPeanut = null,
            compiledEvent = null, compiledEventC = null, compiledEventB = null, compiledEventA = null, compiledPokemon = null,
            compiledDrops = null, compiledDropsB = null, compiledDropsA = null, tenPercent = null;

    static {
        // Gold Box
        List<Integer> returnArray = new ArrayList<Integer>();

        processRewards(returnArray, GameConstants.goldrewards);

        compiledGold = returnArray;

        // Silver Box
        returnArray = new ArrayList<Integer>();

        processRewards(returnArray, GameConstants.silverrewards);

        compiledSilver = returnArray;

        // Fishing Rewards
        returnArray = new ArrayList<Integer>();

        // Event Rewards
        returnArray = new ArrayList<Integer>();

        processRewards(returnArray, GameConstants.eventCommonReward);

        compiledEventC = returnArray;

        returnArray = new ArrayList<Integer>();

        processRewards(returnArray, GameConstants.eventUncommonReward);

        compiledEventB = returnArray;

        returnArray = new ArrayList<Integer>();

        processRewards(returnArray, GameConstants.eventRareReward);
        processRewardsSimple(returnArray, GameConstants.tenPercent);
        processRewardsSimple(returnArray, GameConstants.tenPercent);//hack: chance = 2

        compiledEventA = returnArray;

        returnArray = new ArrayList<Integer>();

        processRewards(returnArray, GameConstants.eventSuperReward);

        compiledEvent = returnArray;

        returnArray = new ArrayList<Integer>();

        processRewards(returnArray, GameConstants.peanuts);

        compiledPeanut = returnArray;

        returnArray = new ArrayList<Integer>();


        returnArray = new ArrayList<Integer>();

        processRewardsSimple(returnArray, GameConstants.normalDrops);

        compiledDrops = returnArray;

        returnArray = new ArrayList<Integer>();

        processRewardsSimple(returnArray, GameConstants.rareDrops);

        compiledDropsB = returnArray;

        returnArray = new ArrayList<Integer>();

        processRewardsSimple(returnArray, GameConstants.superDrops);

        compiledDropsA = returnArray;

        returnArray = new ArrayList<Integer>();

        processRewardsSimple(returnArray, GameConstants.tenPercent);

        tenPercent = returnArray;


    }

    private static void processRewards(final List<Integer> returnArray, final int[] list) {
        int lastitem = 0;
        for (int i = 0; i < list.length; i++) {
            if (i % 2 == 0) { // Even
                lastitem = list[i];
            } else { // Odd
                for (int j = 0; j < list[i]; j++) {
                    returnArray.add(lastitem);
                }
            }
        }
        Collections.shuffle(returnArray);
    }

    private static void processRewardsSimple(final List<Integer> returnArray, final int[] list) {
        for (int i = 0; i < list.length; i++) {
            returnArray.add(list[i]);
        }
        Collections.shuffle(returnArray);
    }


    public static int getGoldBoxReward() {
        return compiledGold.get(Randomizer.nextInt(compiledGold.size()));
    }

    public static int getSilverBoxReward() {
        return compiledSilver.get(Randomizer.nextInt(compiledSilver.size()));
    }

    public static int getPeanutReward() {
        return compiledPeanut.get(Randomizer.nextInt(compiledPeanut.size()));
    }

    public static int getPokemonReward() {
        return compiledPokemon.get(Randomizer.nextInt(compiledPokemon.size()));
    }

    public static int getEventReward() {
        final int chance = Randomizer.nextInt(101);
        if (chance < 66) {
            return compiledEventC.get(Randomizer.nextInt(compiledEventC.size()));
        } else if (chance < 86) {
            return compiledEventB.get(Randomizer.nextInt(compiledEventB.size()));
        } else if (chance < 96) {
            return compiledEventA.get(Randomizer.nextInt(compiledEventA.size()));
        } else {
            return compiledEvent.get(Randomizer.nextInt(compiledEvent.size()));
        }
    }

    public static int getDropReward() {
        final int chance = Randomizer.nextInt(101);
        if (chance < 76) {
            return compiledDrops.get(Randomizer.nextInt(compiledDrops.size()));
        } else if (chance < 96) {
            return compiledDropsB.get(Randomizer.nextInt(compiledDropsB.size()));
        } else {
            return compiledDropsA.get(Randomizer.nextInt(compiledDropsA.size()));
        }
    }

    public static List<Integer> getTenPercent() {
        return tenPercent;
    }

    static void load() {
        //Empty method to initialize class.
    }
    private static final Map<Integer, List<Pair<Integer, Integer>>> items = new HashMap<Integer, List<Pair<Integer, Integer>>>();
    private static final List<Integer> itemsTotal = new ArrayList<Integer>();

    public static void loadGachaponRewardFromINI(String path) {
        File inipath = new File(path);
        try {
            Ini ini = new Ini(new FileReader(inipath));
            Ini.Section total = ini.get("TOTAL");
            int i = 0;
            while (true) {
                String name = "GACHAPON";
                name += i;
                if (ini.containsKey(name)) {
                    itemsTotal.add(Integer.parseInt(total.get(name)));
                    items.put(i, new ArrayList<Pair<Integer, Integer>>());
                    Ini.Section gachaItems = ini.get(name);
                    for (Map.Entry<String, String> e : gachaItems.entrySet()) {
                        items.get(i).add(new Pair<Integer, Integer>(Integer.parseInt(e.getKey()), Integer.parseInt(e.getValue())));
                    }
                    ++i;
                    continue;
                }
                break;
            }
        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }
    

    public static int[] getGachaponReward(int nTown) {
        if (items.size() <= nTown) {
            if (items.isEmpty()) {
                throw new ArrayIndexOutOfBoundsException("Gachapon Reward DB is Empty..");
            } else {
                throw new ArrayIndexOutOfBoundsException("You can use town number 0 ~ " + (items.size() - 1));
            }
        }
        List<Pair<Integer, Integer>> list = items.get(nTown);
        int cur = 0;
        int Rand = Randomizer.rand(0, itemsTotal.get(nTown));
        for (Pair<Integer, Integer> p : list) {
            if (Rand == cur || Rand == (cur + p.getRight()) || (Rand > cur && Rand < cur + p.getRight())) {
                int q = 1; //장비아이템과 기타아이템 등은 일단 기본으로 랜덤.
                if (p.getLeft() / 1000000 == 2) {
                    //소비아이템 갯수 랜덤으로 정하기.
                    int randq = Randomizer.rand(0, 30);
                    if (randq > 15) {
                        q = 10;
                    } else if (randq > 10) {
                        q = 12;
                    } else if (randq > 3) {
                        q = 25;
                    } else {
                        q = 35;
                    }
                }
                return new int[] {p.getLeft(), q};
            }
            cur += p.getRight();
        }
        throw new RuntimeException("Gachapon Reward Total Num is not valid. - not matched. nTown : "+nTown+" Rand : "+Rand + " Cur : "+cur+" Total : "+itemsTotal.get(nTown));
    }
}
