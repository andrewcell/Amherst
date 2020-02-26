/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package tools.extract;

import java.io.File;
import java.io.FileOutputStream;
import tools.StringUtil;

/**
 *
 * @author
 */
public class MapleFaceHairCodeExtractor {
    
    public static void main(String args[]) {
        try {
            System.out.println("환영합니다. 성형, 헤어 코드 추출 프로그램을 시작합니다.");
            if (new File("남자헤어.txt").exists()) new File("남자헤어.txt").delete();
            if (new File("남자성형.txt").exists()) new File("남자성형.txt").delete();
            if (new File("여자헤어.txt").exists()) new File("여자헤어.txt").delete();
            if (new File("여자성형.txt").exists()) new File("여자성형.txt").delete();
            FileOutputStream mhair = new FileOutputStream ("남자헤어.txt");
            FileOutputStream mface = new FileOutputStream ("남자성형.txt");
            FileOutputStream fhair = new FileOutputStream ("여자헤어.txt");
            FileOutputStream fface = new FileOutputStream ("여자성형.txt");
            
            try {
                //남자/여자 헤어
                for (int i = 3000; i< 3999; i++) {
                    if (new File(getPath(true, i*10)).exists()) {
                        boolean allcheck = true;
                        for (int s = 1 ; s <= 7 ; s++) {
                            if (!new File(getPath(true, i*10+s)).exists()) {
                                allcheck = false;
                            }
                        }
                        
                        if (allcheck) {
                            if (i / 100 == 30 || i / 100 == 33 || i / 100 == 35 || i / 100 == 36) {
                                mhair.write((i*10+",").getBytes());
                            } else {
                                fhair.write((i*10+",").getBytes());
                            }
                        }
                    }
                }
                
                for (int a = 0 ; a <= 4; a++) {
                    for (int i = 0; i< 99; i++) {
                        if (new File(getPath(false, 20000+i+(a*1000))).exists()) {
                            boolean allcheck = true;
                            for (int s = 1 ; s <= 7 ; s++) {
                                if (!new File(getPath(false, (20000+(a*1000)+i)+(s*100))).exists()) {
                                      allcheck = false;  
                                }
                            }
                            if (allcheck) {
                                if (a == 0 || a == 3)
                                    mface.write((20000+(a*1000)+i+",").getBytes());
                                else
                                    fface.write((20000+(a*1000)+i+",").getBytes());
                            }
                        }
                    }
                }
            } catch (NullPointerException npe) {
                System.err.println("널포인터");
            }
            
            
            
            System.out.println("종료되었습니다.");
            System.exit(0);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    
    private static String getPath(boolean hair, int value) {
        String path = "wz/Character.wz/"+(hair ? "Hair" : "Face") +"/"+StringUtil.getLeftPaddedStr(Integer.toString(value), '0', 8)+".img.xml";
        //System.out.println(path);
        File es = new File(path);
       System.out.println(es.getAbsolutePath());
       System.out.println(es.exists());
        
        return path;
    }
}
