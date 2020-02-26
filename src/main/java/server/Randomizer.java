package server;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Random;

public class Randomizer {

    private final static Random rand = new Random();

    public static final int nextInt() {
	  
        return rand.nextInt();
    }

    public static final int nextInt(final int arg0) {
	  
        return rand.nextInt(arg0);
    }

    public static final void nextBytes(final byte[] bytes) {
	  
        rand.nextBytes(bytes);
    }

    public static final boolean nextBoolean() {
	  
        return rand.nextBoolean();
    }

    public static final double nextDouble() {
	  
        return rand.nextDouble();
    }

    public static final float nextFloat() {
	  
        return rand.nextFloat();
    }

    public static final long nextLong() {
	  
        return rand.nextLong();
    }

    public static final int rand(final int lbound, final int ubound) {
	  
        return nextInt(ubound - lbound + 1) + lbound;
    }
    
    public static final String shuffle(String origin) {
        List<Character> aa = new ArrayList<Character>();
        char[] chars = new char[origin.length()];
        for (int i = 0; i < chars.length; ++i) {
            aa.add(origin.charAt(i));
        }
        Collections.shuffle(aa);
        for (int i = 0; i < chars.length; ++i) {
            chars[i] = aa.get(i);
        }
        return String.valueOf(chars);
    }
}
