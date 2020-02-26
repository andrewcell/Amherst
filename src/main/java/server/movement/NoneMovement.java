/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package server.movement;

import java.awt.Point;
import tools.data.MaplePacketLittleEndianWriter;

/**
 *
 * @author 티썬
 */
public class NoneMovement extends AbstractLifeMovement {
    public NoneMovement(int i, Point p, int i2, int i3) {
        super(i, p, i2, i3);
    }
    @Override
    public void serialize(MaplePacketLittleEndianWriter lew) {
        lew.write(getType());
        lew.write(getNewstate());
    }
    
}
