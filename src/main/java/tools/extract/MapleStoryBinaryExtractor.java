/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package tools.extract;

import java.io.File;
import java.io.RandomAccessFile;
import java.nio.charset.Charset;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Map.Entry;
import java.util.concurrent.atomic.AtomicInteger;
import tools.data.input.GenericSeekableLittleEndianAccessor;
import tools.data.input.RandomAccessByteStream;
import tools.data.input.SeekableLittleEndianAccessor;

/**
 *
 * @author 티썬
 */
public class MapleStoryBinaryExtractor {

    private static void getString(int key, int foffset, SeekableLittleEndianAccessor slea) throws Exception {
        int KeyOffset = key * 4 + foffset;
        slea.seek(KeyOffset);
        int Key_Key = slea.readInt();//10f32
        if (showDebug) {
            System.out.println("Found a key : 0x" + Integer.toHexString(Key_Key) + " OffSet : " + Integer.toHexString(KeyOffset));
        }

        int strStartOffset = foffset + Key_Key;
        slea.seek(strStartOffset);

        int strLength = slea.readInt();
        if (showDebug) {
            System.out.println("Found a length : 0x" + Integer.toHexString(strLength) + " OffSet : " + Integer.toHexString(strStartOffset));
        }

        int[] v11aob = new int[strLength];
        int[] v12aob = new int[strLength / 4];
        int[] v14aob = new int[strLength / 4];
        for (int i = 0; i < strLength; ++i) {
            if (i % 4 == 0) {
                v11aob[i] = 0x0D;
            } else if (i % 4 == 1) {
                v11aob[i] = 0xF0;
            } else if (i % 4 == 2) {
                v11aob[i] = 0xAD;
            } else if (i % 4 == 3) {
                v11aob[i] = 0xBA;
            }
        }
        for (int i = 0; i < v14aob.length; ++i) {
            v14aob[i] = slea.readInt();
            if (showDebug) {
                System.out.println("Found a v14aob : 0x" + Integer.toHexString(v14aob[i]) + " OffSet : " + Integer.toHexString((int) (slea.getPosition() - 4)));
            }
        }
        slea.skip(v11aob.length % 4);
        for (int i = 0; i < v12aob.length; ++i) {
            v12aob[i] = slea.readInt();
            if (showDebug) {
                System.out.println("Found a v12aob : 0x" + Integer.toHexString(v12aob[i]) + " OffSet : " + Integer.toHexString((int) (slea.getPosition() - 4)));
            }
        }

        test3(slea, v11aob, v12aob, v14aob, strStartOffset);
//        if (strLength % 4 != 0) {
//            for (int i = 0; i < strLength % 4; ++i) {
//                v11aob[i + (strLength >> 2)] = slea.readByteAsInt() & 0xFF;
//                System.err.println(Integer.toHexString(v11aob[i + (strLength >> 2)]));
//            }
//        }


//        int[] v11aob = new int[]{0xBAADF00D, 0xBAADF00D};
//        int[] v12aob = new int[]{0x93830842, 0x6B3B6BFE};
//        int[] v14aob = new int[]{0x6528, 0x16E3};

//        int baseoffset = 0x3e763e; //base
        //7d92f8 - foffset 3d72f8
        //3d7334
    }

    public static enum IA32Instructions {

        Push4(0x68),
        Push1(0x6A),
        Call(0xE8),
        Jump(0xEB),
        MovToEax(0xB8);

        private IA32Instructions(int i) {
            this.opcode = i;
        }
        protected int opcode;
    }
    private static int imageBase = 0;
    private static Map<Integer, Integer> strCal = new LinkedHashMap<Integer, Integer>(); // K : id, V : offset?
    private static AtomicInteger ai = new AtomicInteger(0);
    private static AtomicInteger ai2 = new AtomicInteger(0);
    private static AtomicInteger ai3 = new AtomicInteger(0);
    private static int getStringOffset = 0;
    private static int getStringWOffset = 0;
    private static int getStringUOffset = 0;
    private static final boolean showDebug = false;

    public static void main(String[] args) throws Exception {
        run();
    }

    public static void run() throws Exception {
        File binary = new File("test/MapleStoryNPKDel.exe");
        RandomAccessFile raf = new RandomAccessFile(binary, "r");
        SeekableLittleEndianAccessor slea = new GenericSeekableLittleEndianAccessor(new RandomAccessByteStream(raf));
        if (!slea.readAsciiString(2).equals("MZ")) {
            throw new RuntimeException("It is not Binary!");
        }

        slea.seek(0x134);
        imageBase = slea.readInt();
        if (showDebug) {
            System.out.println("Image Base : " + "0x" + Integer.toHexString(imageBase));
        }
//        getStringBSTR(0x66a, slea);
        run_search_getstring(slea);


        raf.close();
    }

    private static void run_search_getstring(SeekableLittleEndianAccessor slea) throws Exception {
        while (slea.available() > 0 && slea.getPosition() < 0x36E000) {
            int df = slea.readByteAsInt();
            if (df == IA32Instructions.MovToEax.opcode) {
                if (slea.available() >= 4) {
                    int ddz = slea.readInt();
                    if (ddz == 0x751EA7) { //GetString Function First Machine Code
                        System.out.println("GetString Offset : 0x" + Integer.toHexString((int) (slea.getPosition() - 5)));
                        getStringOffset = (int) (slea.getPosition() - 5);
                    } else if (ddz == 0x751ED3) { //GetStringW Function First Machine Code
                        System.out.println("GetStringW Offset : 0x" + Integer.toHexString((int) (slea.getPosition() - 5)));
                        getStringWOffset = (int) (slea.getPosition() - 5);
                    } else if (ddz == 0x751F2B) { //GetStringU Function First Machine Code
                        System.out.println("GetStringU Offset : 0x" + Integer.toHexString((int) (slea.getPosition() - 5)));
                        getStringUOffset = (int) (slea.getPosition() - 5);
                    }
                }
            }
        }

        slea.seek(0);
        while (slea.available() > 0 && slea.getPosition() < 0x36E000) {
            int df = slea.readByteAsInt();
            if (df == IA32Instructions.Call.opcode) {
                if (slea.available() >= 4) {
                    int ddz = slea.readInt();
                    if (ddz + slea.getPosition() == getStringOffset) {
                        seekGetStringCall(slea, 0);
                    } else if (ddz + slea.getPosition() == getStringWOffset) {
                        seekGetStringCall(slea, 1);
                    } else if (ddz + slea.getPosition() == getStringUOffset) {
                        seekGetStringCall(slea, 2);
                    }
                }
            }
        }

        for (Entry<Integer, Integer> e : strCal.entrySet()) {
            getStringBSTR(e.getKey(), slea);
        }

        System.out.println("TOTAL : GetString : " + ai.get() + " / GetStringW : " + ai2.get() + " / GetStringU : " + ai3.get());
    }

    private static void getStringBSTR(int key, SeekableLittleEndianAccessor slea) throws Exception {
        int foffset = 0x3d670c; // 0x3d72f8 <- ecx:7d92f8
        //3d7334 3d670c
        //7e010c = 3d670c
        getString(key, foffset, slea);
//        if (strLength % 4 != 0) {
//            for (int i = 0; i < strLength % 4; ++i) {
//                v11aob[i + (strLength >> 2)] = slea.readByteAsInt() & 0xFF;
//                System.err.println(Integer.toHexString(v11aob[i + (strLength >> 2)]));
//            }
//        }


//        int[] v11aob = new int[]{0xBAADF00D, 0xBAADF00D};
//        int[] v12aob = new int[]{0x93830842, 0x6B3B6BFE};
//        int[] v14aob = new int[]{0x6528, 0x16E3};

//        int baseoffset = 0x3e763e; //base
        //7d92f8 - foffset 3d72f8
        //3d7334
    }

    private static void getStringA(int key, SeekableLittleEndianAccessor slea) throws Exception {
        int foffset = 0x3d670c;
        getString(key, foffset, slea);
    }

    private static void getStringW(int key, SeekableLittleEndianAccessor slea) throws Exception {
        int foffset = 0x3d670c;
        getString(key, foffset, slea);
    }

    public static void test3(SeekableLittleEndianAccessor slea, int[] v11aob, int[] v12aob, int[] v14aob, int startoffset) throws Exception {
//        int v11 = 0x15E7B8;
//        int v12 = 0x15E7E0;
//        int v14 = 0x15E7CC;

        int v13 = v11aob.length / 4;
        int buffer = 0xBAADF00D;
        for (int i = 0; i < v13; ++i) {
//            if (showDebug) {
//                System.out.println(Integer.toHexString(Integer.rotateLeft(v12aob[i], 5)));
//            }
            int v17 = (v14aob[i] ^ Integer.rotateLeft(v12aob[i], 5)) & 0xFFFFFFFF;
            int v18 = (buffer ^ v14aob[i]) & 0xFFFFFFFF;
            int za = v17;
            v11aob[i * 4] = (za) & 0xFF;
            v11aob[i * 4 + 1] = (za >> 8) & 0xFF;
            v11aob[i * 4 + 2] = (za >> 16) & 0xFF;
            v11aob[i * 4 + 3] = (za >> 24) & 0xFF;
            if (showDebug) {
                System.out.println("aob" + i + " : " + Integer.toHexString(v17));
            }
            int v19 = (Integer.rotateRight(v18, 5) & 0xFFFFFFFF);
//            v14 += 4;
//            v12 += 4;
//            v11 += 4;
            buffer = v12aob[i] + v19;
        }

        v13 = v11aob.length / 4;

        int v22 = v13 * 4;
        int v21 = v11aob.length - v22;
        if (v21 > 0) { //문자열 디코딩 하고 4에 딱 떨어지지 않고 길이가 남으면?
            int keyoffset = startoffset + 4 + v22;
            int stroffset = keyoffset + (v11aob.length % 4) + v22;
//            int offset2 = fuckyou
            int count = v21; //a1 - 0x20
            if (showDebug) {
                System.out.println("0x" + Integer.toHexString((int) slea.getPosition()));
            }
            for (int i = 0; i < count; ++i) {
                slea.seek(stroffset + i);
                int v27 = slea.readByteAsInt();
                if (showDebug) {
                    System.out.println("0x" + Integer.toHexString(v27));
                }
                slea.seek(keyoffset + i);
                if (showDebug) {
                    System.out.println("0x" + Integer.toHexString((int) slea.getPosition()));
                }
                int v28 = slea.readByteAsInt();
                if (showDebug) {
                    System.out.println("0x" + Integer.toHexString(v28));
                }
                int xored = (v27 ^ v28) & 0xFF;
                if (showDebug) {
                    System.out.println("0x" + Integer.toHexString(xored));
                }
                int v30 = buffer ^ v28;
                v11aob[v22 + i] = xored & 0xFF;
                int v31 = Integer.rotateRight(v30, 5);
                buffer = v31;
            }
        }
        int check = slea.readInt();

        if (showDebug) {
            System.out.println("Buffer : " + Integer.toHexString(buffer) + " Check : " + Integer.toHexString(check));
        }
        if (showDebug) {
            System.out.print("complete aob : ");
            for (int i : v11aob) {
                System.out.print(Integer.toHexString(i) + " ");
            }
            System.out.println();
        }
        byte[] strbuf = new byte[v11aob.length];
        for (int i = 0; i < v11aob.length; ++i) {
            if (showDebug) {
                System.out.print(Integer.toHexString(v11aob[i]) + " - ");
            }
            strbuf[i] = (byte) ((v11aob[i]) & 0xFF);
        }



        System.out.println("Decrypted String : " + new String(strbuf, Charset.forName("MS949")));
//        if (buffer == check) {
//            System.err.println("Checksum Wrong");
//        } else {
//            System.err.println("OK!");
//        }

//        v13 = 2;
//        int v11addr = 0x15E7B8;
//
//        int v22 = 16 * v13;
//        int v21 = (v13) - 16 * v13;
//        if (v21 > 0) {
//            if (buffer == check) {
//                throw new RuntimeException("!?");
//            } else {
//                System.err.println("OK!");
//            }
//        }

    }

    public static void seekGetStringCall(SeekableLittleEndianAccessor slea, int type) {
        Map<Integer, Integer> toWrite = null;
        String toType = null;
        AtomicInteger count = null;
        toWrite = strCal;
        if (type == 0) {
            //GetString
            toType = "GetString";
            count = ai;
        }
        if (type == 1) {
            //GetStringW
            toType = "GetStringW";
            count = ai2;
        }
        if (type == 2) {
            //GetStringU
            toType = "GetStringU";
            count = ai3;
        }


        int curPos = (int) slea.getPosition();
        slea.seek(slea.getPosition() - 20);
        for (int i = 0; i < 20; ++i) {
            int opc = slea.readByteAsInt();
            if (opc == IA32Instructions.Push4.opcode || opc == IA32Instructions.Push1.opcode) { // parameter of GetString function
                int callId = opc == IA32Instructions.Push4.opcode ? slea.readInt() : slea.readByteAsInt();
                int seekOffset = opc == IA32Instructions.Push4.opcode ? 4 : 1;
                if (callId < 10000 && callId > 0) { //GetString Id < 10000
                    toWrite.put(callId, (int) slea.getPosition() - seekOffset - 1);
                    System.out.println("Found " + count.incrementAndGet() + " " + toType + " Calls - Call Id : " + callId);
                    slea.seek(curPos);
                    break;
                } else {
                    System.out.println(toType + " Call ID : " + callId + " offset : " + getRVA(slea.getPosition() - seekOffset - 1));
                    slea.seek(slea.getPosition() - seekOffset);
                }
            }
        }
    }

    public static String getRVA(long pos) {
        return "0x" + Integer.toHexString((int) (imageBase + pos - 0x600));
    }

    protected static class DecodeStringStruct {

        int ebp = 0x12FFC0;
        int ebp_4 = 0x40109A;
        int ebp_8 = 0x7D69E8;
        int ebp_C = 0x30A;
        int ebp_10 = 0x401081;
        int ebp_14 = 0x71D41E;
        int ebp_18 = 0;
        int ebp_1C = 0x71D310;
        int ebp_20 = 0x7C9000;
        int ebp_24 = 0x7C976C;
        int ebp_28 = 0x7C9770;
        int ebp_2C = 0x7C9784;
        int ebp_30 = 0x71D731;
        int ebp_34 = 0x7C940208; //ntdll
        int ebp_38 = -1;
        int ebp_3C = 0x7FFDE000;
        int ebp_40 = 0;
        int ebp_44 = 0;
        int ebp_48 = 0;
        int ebp_4C = 0x805018B4;
        int ebp_50 = 5;
        String ebp_54 = "::=::\\";
        int ebp_58 = 0;
        int ebp_5C = 0x7C930000;
        int ebp_60 = 0;
        int ebp_64 = 0;
        int ebp_68 = 0;
        int ebp_6C = 0;
        int ebp_70 = 0x71D687;
        int ebp_74 = 0;
        int ebp_78 = 0x85E8B2F0;
        int ebp_7C = 0x80504F4A;
        int ebp_80 = 0;
        int ebp_84 = 0;
        int ebp_88 = 0;
        int ebp_8C = 0x80504F5A;
        int ebp_90 = 0x12FF4C;
        int ebp_94 = 0x806E8EF2;
        int ebp_98 = 0x12FFE0;
        int ebp_9C = 0x71DF80;
        int ebp_A0 = 0x777820; //function
        int ebp_A4 = 0;
        int ebp_A8 = 0x12FFF0;
    }
}
