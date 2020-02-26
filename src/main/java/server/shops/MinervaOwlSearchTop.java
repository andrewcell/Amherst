/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package server.shops;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.ObjectInputStream;
import java.io.ObjectOutput;
import java.io.ObjectOutputStream;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.logging.Level;
import java.util.logging.Logger;
import tools.Pair;

/**
 *
 * @author 티썬
 */
public class MinervaOwlSearchTop {

    private static MinervaOwlSearchTop instance = new MinervaOwlSearchTop();
    private final Map<Integer, AtomicInteger> searchedItem = new LinkedHashMap<Integer, AtomicInteger>();

    public static MinervaOwlSearchTop getInstance() {
        return instance;
    }

    public void searchItem(int itemid) {
        synchronized (searchedItem) {
            if (!searchedItem.containsKey(Integer.valueOf(itemid))) {
                searchedItem.put(Integer.valueOf(itemid), new AtomicInteger(0));
            }
            searchedItem.get(Integer.valueOf(itemid)).incrementAndGet();
        }
    }

    public List<Integer> getMostSearched() {
        List<Integer> ret = new ArrayList<Integer>();
        List<Pair<Integer, Integer>> items = new ArrayList<Pair<Integer, Integer>>();
        synchronized (searchedItem) {
            for (Entry<Integer, AtomicInteger> e : searchedItem.entrySet()) {
                items.add(new Pair<Integer, Integer>(e.getKey(), e.getValue().intValue()));
            }
        }
        Collections.sort(items, new Comparator<Pair<Integer, Integer>>() {
            @Override
            public int compare(Pair<Integer, Integer> o1, Pair<Integer, Integer> o2) {
                if (o1.getRight() > o2.getRight()) {
                    return -1;
                } else if (o1.getRight() < o2.getRight()) {
                    return 1;
                } else {
                    return 0;
                }
            }
        });
        for (int i = 0; i < 10; ++i) {
            try {
                Integer z = items.get(i).getLeft();
                ret.add(z);
            } catch (ArrayIndexOutOfBoundsException aiobe) {
                break;
            } catch (IndexOutOfBoundsException iii) {
                break;
            }
            //
        }
        return ret;

    }

    public void loadFromFile() {
        File toLoad = new File("owlsearch.db");
        if (toLoad.exists()) {
            try {
                FileInputStream fis = null;
                byte[] buf = null;
                ObjectInputStream ois = null;
                ByteArrayInputStream bais = null;
                fis = new FileInputStream(toLoad);
                buf = new byte[fis.available()];
                fis.read(buf);
                bais = new ByteArrayInputStream(buf);
                ois = new ObjectInputStream(bais);
                Map<Integer, AtomicInteger> input = (Map<Integer, AtomicInteger>) ois.readObject();
                searchedItem.putAll(input);
                ois.close();
                bais.close();
                fis.close();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    public void saveToFile() {
        File toSave = new File("owlsearch.db");
        try {
            if (!toSave.exists()) {
                toSave.createNewFile();
            }

            ByteArrayOutputStream byteout = null;
            ObjectOutput objout = null;
            OutputStream out = null;
            synchronized (searchedItem) {
                byteout = new ByteArrayOutputStream();
                objout = new ObjectOutputStream(byteout);
                out = new FileOutputStream(toSave);
                objout.writeObject(searchedItem);
                byteout.writeTo(out);
                if (byteout != null) {
                    byteout.close();
                }
                if (out != null) {
                    out.close();
                }
                if (objout != null) {
                    objout.close();
                }
            }
        } catch (Exception ex) {
            Logger.getLogger(MinervaOwlSearchTop.class.getName()).log(Level.SEVERE, null, ex);
        }
    }
}
