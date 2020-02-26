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
package server.marriage;

/**
 *
 * @author Eternal
 */
public enum MarriageTicketType {

    CheapTicket(5251004),
    SweetieTicket(5251005),
    PremiumTicket(5251006);
    

    private MarriageTicketType(int i) {
        itemid = i;
        if (i == 5251004) {
            invitationItemId = 4211000;
            invitationQuantity = 10;
            invitedItemId = 4212000;
            receiptItemId = 4214000;
            buffEffectItemId = 2022196;
        } else if (i == 5251005) {
            invitationItemId = 4211001;
            invitationQuantity = 20;
            invitedItemId = 4212001;
            receiptItemId = 4214001;
            buffEffectItemId = 2022197;
        } else if (i == 5251006) {
            invitationItemId = 4211002;
            invitationQuantity = 30;
            invitedItemId = 4212002;
            receiptItemId = 4214002;
            buffEffectItemId = 2022200;
        }
    }

    public int getItemId() {
        return itemid;
    }
    
    public int getInvitationItemId () {
        return invitationItemId;
    }
    
    public int getInvitationQuantity () {
        return invitationQuantity;
    }
    
    public int getReceiptItemId () {
        return receiptItemId;
    }
    
    public int getInvitedItemId () {
        return invitedItemId;
    }
    
    public int getBuffEffectItemId () {
        return buffEffectItemId;
    }
    
    public static MarriageTicketType getTypeById(int id) {
        if (id == 5251006) {
            return MarriageTicketType.PremiumTicket;
        } else if (id == 5251005) {
            return MarriageTicketType.SweetieTicket;
        } else if (id == 5251004) {
            return MarriageTicketType.CheapTicket;
        }
        return null;
    }

    private int itemid;
    private int invitationItemId;
    private int invitationQuantity;
    private int receiptItemId;
    private int invitedItemId;
    private int buffEffectItemId;
}
