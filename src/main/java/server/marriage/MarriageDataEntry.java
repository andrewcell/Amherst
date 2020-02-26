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

import client.inventory.Item;
import java.util.ArrayList;
import java.util.List;

/**
 *
 * @author Eternal
 */
public class MarriageDataEntry {
    
    private int marriageId;
    
    private boolean newData;
    
    private int groomId;
    private int brideId;
    
    private String groomName;
    private String brideName;
    
    /**
     * 결혼 상태.
     * 0 : 아무것도 아님
     * 1 : 약혼상태
     * 2 : 결혼상태
     */
    private int status;
    /**
     * 결혼 진행 상태.
     * 0 : 아무것도 아님
     * 1 ~ 7 : 결혼식 예약에서 위시리스트 등록 단계
     * 8 : 결혼식 예약 완료 상태.
     */
    private int weddingStatus;
    
    private List<String> groomWishList;
    private List<String> brideWishList;
    private List<Item> groomWeddingPresents;
    private List<Item> brideWeddingPresents;
    
    private List<Integer> reservedPeople;
    private List<Integer> enteredPeople;
    
    private MarriageTicketType ticketType;
    
    private long EngagementTime;
    private long MakeReservationTime;
    private long RequestDivorceTimeGroom;
    private long RequestDivorceTimeBride;
    
    
    public MarriageDataEntry (int id, boolean newData) {
        this.marriageId = id;
        this.newData = newData;
        this.weddingStatus = 0;
        ticketType = null;
        MakeReservationTime = 0;
        RequestDivorceTimeBride = 0;
        RequestDivorceTimeGroom = 0;
    }
    
    public int getMarriageId() {
        return marriageId;
    }
    
    public void setGroomId (int in) {
        groomId = in;
    }
    
    public int getGroomId () {
        return groomId;
    }
    
    public void setBrideId(int in) {
        brideId = in;
    }
    
    public int getBrideId () {
        return brideId;
    }
    
    public void setGroomName (String str) {
        groomName = str;
    }
    
    public String getGroomName() {
        return groomName;
    }
    
    public void setBrideName (String str) {
        brideName = str;
    }
    
    public String getBrideName () {
        return brideName;
    }
    
    public void setStatus (int stat) {
        status = stat;
    }
    
    public int getStatus () {
        return status;
    }
    
    public boolean isNewData() {
        return newData;
    }
    
    public void setNewData(boolean l) {
        newData = l;
    }
    
    public void setWeddingStatus (int g) {
        weddingStatus = g;
    }
    
    public int getWeddingStatus () {
        return weddingStatus;
    }
    
    public List<String> getGroomWishList() {
        if (groomWishList == null) {
            groomWishList = new ArrayList<String>();
        }
        return groomWishList;
    }
    
    public List<String> getBrideWishList() {
        if (brideWishList == null) {
            brideWishList = new ArrayList<String>();
        }
        return brideWishList;
    }
    
    public List<Item> getGroomPresentList() {
        if (groomWeddingPresents == null) {
            groomWeddingPresents = new ArrayList<Item>();
        }
        return groomWeddingPresents;
    }
    
    public List<Item> getBridePresentList() {
        if (brideWeddingPresents == null) {
            brideWeddingPresents = new ArrayList<Item>();
        }
        return brideWeddingPresents;
    }
    
    public List<Integer> getReservedPeopleList() {
        if (reservedPeople == null) {
            reservedPeople = new ArrayList<Integer>();
        }
        return reservedPeople;
    }
    public List<Integer> getEnteredPeopleList() {
        if (enteredPeople == null) {
            enteredPeople = new ArrayList<Integer>();
        }
        return enteredPeople;
    }
    
    public void setTicketType (MarriageTicketType type) {
        this.ticketType = type;
    }
    
    public MarriageTicketType getTicketType () {
        return ticketType;
    }
    
    public void setEngagementTime (long time) {
        EngagementTime = time;
    }
    
    public long getEngagementTime () {
        return EngagementTime;
    }
    
    public void setMakeReservationTime (long time) {
        MakeReservationTime = time;
    }
    
    public long getMakeReservationTime () {
        return MakeReservationTime;
    }
    
    public void setDivorceTimeGroom (long time) {
        RequestDivorceTimeGroom = time;
    }
    
    public long getDivorceTimeGroom () {
        return RequestDivorceTimeGroom;
    }
    
    public void setDivorceTimeBride (long time) {
        RequestDivorceTimeBride = time;
    }
    
    public long getDivorceTimeBride () {
        return RequestDivorceTimeBride;
    }
    
    public int getPartnerId (int id) {
        if (id == getGroomId()) {
            return getBrideId();
        } else if (id == getBrideId()) {
            return getGroomId();
        }
        
        return -1;
    }
    
    
    
    
}
