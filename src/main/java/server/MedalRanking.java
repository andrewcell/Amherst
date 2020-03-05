/*
 * Copyright (C) 2013 Nemesis Maple Story Online Server Program

 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.

 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.

 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
package server;

import database.DatabaseConnection;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.Comparator;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;
import tools.Pair;

/**
 *
 * @author Eternal
 */
public class MedalRanking {

    public static enum MedalRankingType {

        ExpertHunter, //노련한 사냥꾼
        Pop, //아이돌스타
        LithDonor(true),
        SleepyWoodDonor(true),
        NautilusDonor(true),
        PerionDonor(true),
        KerningDonor(true),
        HenesysDonor(true),
        ElliniaDonor(true),
        HorntailSlayer,
        PinkbeanSlayer,;
        private boolean donor;

        private MedalRankingType(boolean d) {
            this.donor = d;
        }

        private MedalRankingType() {
            this.donor = false;
        }

        public boolean isDonor() {
            return donor;
        }
    }
    private static final Map<MedalRankingType, List<Pair<String, Integer>>> medalRanks = new EnumMap<>(MedalRankingType.class);

    static {
        for (MedalRankingType type : MedalRankingType.values()) {
            medalRanks.put(type, new ArrayList<Pair<String, Integer>>());
        }
    }

    public static List<Pair<String, Integer>> getReadOnlyRanking(MedalRankingType type) {
        return Collections.unmodifiableList(new ArrayList<>(medalRanks.get(type)));
    }

    public static int canMedalRank(MedalRankingType type, String name, int score) {
        List<Pair<String, Integer>> l = getReadOnlyRanking(type);
        if (l.isEmpty()) {
            return 0;
        }
        for (Pair<String, Integer> p : l) {
            if (p.right < score || p.left.equals(name)) {
                int a = l.indexOf(p);
                return a;
            }
        }
        return -1;
    }

    public static void addNewMedalRank(MedalRankingType type, String name, int score) {
        List<Pair<String, Integer>> l = medalRanks.get(type);
        if (l.isEmpty()) {
            l.add(new Pair<>(name, score));
            return;
        }
        for (Pair<String, Integer> p : l) { // 중복 닉네임 삭제
            if (p.left.equalsIgnoreCase(name)) {
                l.remove(p);
                break;
            }
        }
        
//        for (Pair<String, Integer> p : l) {
//            if (p.getRight() < score) {
                l.add(new Pair<>(name, score));
//                break;
//            }
//        }
        sortAndCutMedalRank(type);
    }

    public static void sortAndCutMedalRank(MedalRankingType type) {
        List<Pair<String, Integer>> l = medalRanks.get(type);
        if (l.size() <= 1) {
            return;
        }
        Collections.sort(l, new Comparator<Pair<String, Integer>>() {
            @Override
            public int compare(Pair<String, Integer> o1, Pair<String, Integer> o2) {
                if (o1.right < o2.right) {
                    return 1;
                } else if (o1.right == o2.right) {
                    return 0;
                } else {
                    return -1;
                }
            }
        });
        while (l.size() > 5) {
            l.remove(l.size() - 1);
        }
    }

    public static void loadAll() {
        Calendar cal = Calendar.getInstance();
        if (cal.get(Calendar.DAY_OF_MONTH) == 1 && cal.get(Calendar.HOUR) == 5) { // 매월 초 리부팅은 모든 기록 초기화
            return;
        }



        Connection con = null;
        PreparedStatement ps = null;
        ResultSet rs = null;
        try {
            con = DatabaseConnection.getConnection();
            ps = con.prepareStatement("SELECT * FROM `medalranks`");
            rs = ps.executeQuery();
            while (rs.next()) {
                addNewMedalRank(MedalRankingType.valueOf(rs.getString("type")), rs.getString("name"), rs.getInt("score"));
            }
            for (MedalRankingType type : MedalRankingType.values()) {
                sortAndCutMedalRank(type);
            }
        } catch (Exception e) {
            e.printStackTrace(System.err);
        } finally {
            if (con != null) {
                try {
                    con.close();
                } catch (Exception e) {
                }
            }
            if (ps != null) {
                try {
                    ps.close();
                } catch (Exception e) {
                }
            }
            if (rs != null) {
                try {
                    rs.close();
                } catch (Exception e) {
                }
            }
        }
    }

    public static void saveAll() {
        Connection con = null;
        PreparedStatement ps = null;
        try {
            con = DatabaseConnection.getConnection();
            ps = con.prepareStatement("DELETE FROM `medalranks`");
            ps.executeUpdate();
            ps.close();

            ps = con.prepareStatement("INSERT INTO `medalranks` (`type`, `name`, `score`) VALUES (?, ?, ?)");
            for (MedalRankingType type : MedalRankingType.values()) {
                List<Pair<String, Integer>> l = getReadOnlyRanking(type);
                if (!l.isEmpty()) {
                    ps.setString(1, type.name());
                    for (Pair<String, Integer> p : l) {
                        ps.setString(2, p.left);
                        ps.setInt(3, p.right);
                        ps.addBatch();
                    }
                }
            }
            ps.executeBatch();
            System.out.println("Saved Medal Ranking List.");
        } catch (Exception e) {
            e.printStackTrace(System.err);
        } finally {
            if (con != null) {
                try {
                    con.close();
                } catch (Exception e) {
                }
            }
            if (ps != null) {
                try {
                    ps.close();
                } catch (Exception e) {
                }
            }
        }
    }
}
