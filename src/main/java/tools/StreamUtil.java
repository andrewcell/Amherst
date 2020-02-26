/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package tools;

import java.io.Closeable;
import java.io.IOException;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *
 * @author Eternal
 */
public class StreamUtil {

    private static Logger _log = Logger.getLogger(StreamUtil.class.getName());

    public static void close(Closeable... closeables) {
        for (Closeable c : closeables) {
            try {
                if (c != null) {
                    c.close();
                }
            } catch (IOException e) {
                _log.log(Level.SEVERE, e.getLocalizedMessage(), e);
            }
        }
    }
}
