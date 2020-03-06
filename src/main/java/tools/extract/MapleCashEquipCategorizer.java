/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package tools.extract;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import provider.MapleData;
import provider.MapleDataDirectoryEntry;
import provider.MapleDataEntry;
import provider.MapleDataProvider;
import provider.MapleDataProviderFactory;
import provider.MapleDataTool;

/**
 *
 * @author
 */
public class MapleCashEquipCategorizer {

    public static void main(String[] args) throws IOException {
        MapleDataProvider pro = MapleDataProviderFactory.getDataProvider(new File("wz/OLDCHAR.wz"));
        for (MapleDataDirectoryEntry mdde : pro.rootForNavigation.getSubdirectories()) {
            File ff1 = new File("wz/Sorted_OldChar.wz/" + mdde.getName());
            if (!ff1.exists()) {
                ff1.mkdir();
            } else {
                if (ff1.isFile()) {
                    throw new IOException(ff1.getAbsolutePath() + " cannot be file.");
                }
            }
            for (MapleDataEntry mde : mdde.getFiles()) {
                MapleData d1 = pro.getData(mdde.getName() + "/" + mde.getName());
                System.out.print("Checking wz/OLDCHAR.wz/" + mdde.getName() + "/" + mde.getName() + ".xml");
                int cash = MapleDataTool.getIntConvert("info/cash", d1, 0);
                if (cash == 1) { //캐시아이템은 패스
                    System.out.println(" is CashItem.. Failed");
                    continue;
                }
                MapleData dr1_ = d1.getChildByPath("info");
                if (dr1_ == null) { //제대로된 장비가 아님..
                    System.out.println(" is incorrect Equipment.. Failed");
                    continue;
                }
                MapleData dr2_ = d1.getChildByPath("info/price");
                if (dr2_ == null) { //제대로된 장비가 아님..
                    System.out.println(" is does not have Price... Failed");
                    continue;
                }
                if (MapleDataTool.getInt(dr2_, 1) <= 1 ) {
                    System.out.println(" is have 1 Price... Failed");
                    continue;
                }
                
//                for (MapleData dr2 : dr1_) {
//                    if (dr2.getName().substring(0, 3).equalsIgnoreCase("inc")) { //능력치를 올려주는 옵션이 있어선 안됨.
//                        System.out.println(" has increase stats.. Failed");
//                        continue;
//                    }
//                }

                System.out.print(" ... Equip is correct! Copying... ");
                File copyFrom = new File("wz/OLDCHAR.wz/" + mdde.getName() + "/" + mde.getName() + ".xml");
                File copyTo = new File("wz/Sorted_OldChar.wz/" + mdde.getName() + "/" + mde.getName() + ".xml");

                //파일 복사
                FileInputStream fis = new FileInputStream(copyFrom);
                FileOutputStream fos = new FileOutputStream(copyTo);
                byte[] read = new byte[fis.available()];
                fis.read(read);
                fos.write(read);
                fis.close();
                fos.close();
                read = null;
                System.out.println("OK!");
            }
        }


    }
}
