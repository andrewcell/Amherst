/*
This file is part of the OdinMS Maple Story Server
Copyright (C) 2008 ~ 2010 Patrick Huy <patrick.huy@frz.cc> 
Matthias Butz <matze@odinms.de>
Jan Christian Meyer <vimes@odinms.de>
This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License version 3
as published by the Free Software Foundation. You may not use, modify
or distribute this program under any other version of the
GNU Affero General Public License.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
/*
 * NPCID : 1052015
 * ScriptName : mouse
 * NPCNameFunc : 빌리 - PC방 주인
 * Location : 193000000 (프리미엄로드 - 커닝시티게임방)
 * 
 * @author T-Sun
 * DJ빌리
 */
var status = -1;
var selectedFolder = -1; // 전역변수를 추가했다.
var selection2 = -1
function action(mode, type, selection) {
    if (mode == 1 && type != 1) {
        status++;
    } else {
        if (type == 1 && mode == 1) {
            status++;
            selection = 1;
        } else if (type == 1 && mode == 0) {
            status++;
            selection = 0;
        } else {
            cm.dispose();
            return;
        }
    }
    if (cm.getPlayer().getMapId() == 193000000) {
        cm.dispose();
        return;
    }
    if (status == 0) {
        cm.sendSimple("안녕하신가! 힘세고 강한아침, 만일 내게 물어보면 나는 DJ빌리.\r\n#b#L0# Bgm00#l\r\n#L1# Bgm01#l\r\n#L2# Bgm02#l\r\n#L3# Bgm03#l\r\n#L4# Bgm04#l\r\n#L5# Bgm05#l\r\n#L6# Bgm06#l\r\n#L7# Bgm07#l\r\n#L8# Bgm08#l\r\n#L9# Bgm09#l\r\n#L10# Bgm10#l\r\n#L11# Bgm11#l\r\n#L12# Bgm12#l\r\n#L13# Bgm13#l\r\n#L14# Bgm14#l\r\n#L15# Bgm15#l\r\n#L16# Bgm16#l\r\n#L17# Bgm17#l\r\n#L18# Bgm18#l\r\n#L19# BgmCN#l\r\n#L20# BgmEvent#l\r\n#L21# BgmGL#l\r\n#L22# BgmJp#l\r\n#L23# BgmTH#l\r\n#L24# BgmTW#l\r\n#L25# 한글#l\r\n#L26# ef길티모노가타리#l\r\n#L27# kiss이로하팝#l\r\n#L28# Maple추가브금#l\r\n#L29# supercell#l\r\n#L30# yui#l\r\n#L31# 달동네#l\r\n#L32# 달빛천사#l\r\n#L33# 동방#l\r\n#L34# 디지몬#l\r\n#L35# 럭키하루히학생회일상#l\r\n#L36# 몬무스#l\r\n#L37# 보컬오프#l\r\n#L38# 신만세#l\r\n#L39# 약#l\r\n#L40# 어떤세상#l\r\n#L41# 엔젤비트#l\r\n#L42# 짜투리#l\r\n#L43# 전파케이온아이들#l\r\n#L44# 클라나드#l\r\n#L45# 토라도라 진격거 아노하나#l\r\n#L46# 하야테#l");
    } else if (status >= 1) {
        if (status == 1)
            selectedFolder = selection; // status == 1 일때 전역변수에 선택한 폴더 값을 넣는다.
        switch (selectedFolder) {
            case 0:
                if (status == 1) cm.sendSimple("뭐 켤꺼야?\r\n#b#L0# FloralLife#l\r\n#L1# GoPicnic#l\r\n#L2# Nightmare#l\r\n#L3# RestNPeace#l\r\n#L4# SleepyWood#l");
                else if (status == 2) {
                    switch (selection) {
                        case 0: 
                            cm.playMusic(true, "Bgm00/FloralLife");
			    break;			   			
                        case 1: 
                            cm.playMusic(true, "Bgm00/GoPicnic");
			    break;			  			
                        case 2: 
                            cm.playMusic(true, "Bgm00/Nightmare");
			    break;			   
                        case 3:
                            cm.playMusic(true, "Bgm00/RestNPeace");
			    break;			   
			case 4: 
                            cm.playMusic(true, "Bgm00/SleepyWood");
			    break;			   			
                    }
                    cm.dispose();
                }
                break;
            case 1:
                if (status == 1) cm.sendSimple("뭐 켤꺼야?\r\n#b#L0# AncientMove#l\r\n#L1# BadGuys#l\r\n#L2# CavaBien#l\r\n#L3# HighlandStar#l\r\n#L4# MoonlightShadow#l\r\n#L5# WhereTheBarlogFrom#l");
                else if (status == 2) {
                    switch (selection) {
                        case 0: 
                            cm.playMusic(true, "Bgm01/AncientMove");
			    break;			   			
                        case 1: 
                            cm.playMusic(true, "Bgm01/BadGuys");
			    break;			  			
                        case 2: 
                            cm.playMusic(true, "Bgm01/CavaBien");
			    break;			   
                        case 3:
                            cm.playMusic(true, "Bgm01/HighlandStar");
			    break;			   
			case 4: 
                            cm.playMusic(true, "Bgm01/MoonlightShadow");
			    break;
			case 5:
                            cm.playMusic(true, "Bgm01/WhereTheBarlogFrom");
			    break;							   			
                    }
                    cm.dispose();
                }
                break;
            case 2:
                if (status == 1) cm.sendSimple("뭐 켤꺼야?\r\n#b#L0# AboveTheTreetops#l\r\n#L1# EvilEyes#l\r\n#L2# JungleBook#l\r\n#L3# MissingYou#l\r\n#L4# WhenTheMorningComes#l");
                else if (status == 2) {
                    switch (selection) {
                        case 0: 
                            cm.playMusic(true, "Bgm02/AboveTheTreetops");
			    break;			   			
                        case 1: 
                            cm.playMusic(true, "Bgm02/EvilEyes");
			    break;			  			
                        case 2: 
                            cm.playMusic(true, "Bgm02/JungleBook");
			    break;			   
                        case 3:
                            cm.playMusic(true, "Bgm02/MissingYou");
			    break;			   
			case 4: 
                            cm.playMusic(true, "Bgm02/WhenTheMorningComes");
			    break;						   			
                    }
                    cm.dispose();
                }
                break;
            case 3:
                if (status == 1) cm.sendSimple("뭐 켤꺼야?\r\n#b#L0# Beachway#l\r\n#L1# BlueSky#l\r\n#L2# Elfwood#l\r\n#L3# SnowyVillage#l\r\n#L4# Subway#l");
                else if (status == 2) {
                    switch (selection) {
                        case 0: 
                            cm.playMusic(true, "Bgm03/Beachway");
			    break;			   			
                        case 1: 
                            cm.playMusic(true, "Bgm03/BlueSky");
			    break;			  			
                        case 2: 
                            cm.playMusic(true, "Bgm03/Elfwood");
			    break;			   
                        case 3:
                            cm.playMusic(true, "Bgm03/SnowyVillage");
			    break;			   
			case 4: 
                            cm.playMusic(true, "Bgm03/Subway");
			    break;										   			
                    }
                    cm.dispose();
                }
                break;
            case 4:
                if (status == 1) cm.sendSimple("뭐 켤꺼야?\r\n#b#L0# ArabPirate#l\r\n#L1# PlayWithMe#l\r\n#L2# Shinin'Harbor#l\r\n#L3# UponTheSky#l\r\n#L4# WarmRegard#l\r\n#L5# WhiteChristmas#l");
                else if (status == 2) {
                    switch (selection) {
                        case 0: 
                            cm.playMusic(true, "Bgm04/ArabPirate");
			    break;			   			
                        case 1: 
                            cm.playMusic(true, "Bgm04/PlayWithMe");
			    break;			  			
                        case 2: 
                            cm.playMusic(true, "Bgm04/Shinin'Harbor");
			    break;			   
                        case 3:
                            cm.playMusic(true, "Bgm04/UponTheSky");
			    break;			   
			case 4: 
                            cm.playMusic(true, "Bgm04/WarmRegard");
			    break;
			case 5:
                            cm.playMusic(true, "Bgm04/WhiteChristmas");
			    break;							   			
                    }
                    cm.dispose();
                }
                break;
            case 5:
                if (status == 1) cm.sendSimple("뭐 켤꺼야?\r\n#b#L0# AbandonedMine#l\r\n#L1# DownToTheCave#l\r\n#L2# HellGate#l\r\n#L3# MineQuest#l\r\n#L4# WolfWood#l");
                else if (status == 2) {
                    switch (selection) {
                        case 0: 
                            cm.playMusic(true, "Bgm05/AbandonedMine");
			    break;			   			
                        case 1: 
                            cm.playMusic(true, "Bgm05/DownToTheCave");
			    break;			  			
                        case 2: 
                            cm.playMusic(true, "Bgm05/HellGate");
			    break;			   
                        case 3:
                            cm.playMusic(true, "Bgm05/MineQuest");
			    break;			   
			case 4: 
                            cm.playMusic(true, "Bgm05/WolfWood");
			    break;							   			
                    }
                    cm.dispose();
                }
                break;
            case 6:
                if (status == 1) cm.sendSimple("뭐 켤꺼야?\r\n#b#L0# ComeWithMe#l\r\n#L1# FantasticThinking#l\r\n#L2# FinalFight#l\r\n#L3# FlyingInABlueDream#l\r\n#L4# WelcomeToTheHell#l");
                else if (status == 2) {
                    switch (selection) {
                        case 0: 
                            cm.playMusic(true, "Bgm06/ComeWithMe");
			    break;			   			
                        case 1: 
                            cm.playMusic(true, "Bgm06/FantasticThinking");
			    break;			  			
                        case 2: 
                            cm.playMusic(true, "Bgm06/FinalFight");
			    break;			   
                        case 3:
                            cm.playMusic(true, "Bgm06/FlyingInABlueDream");
			    break;			   
			case 4: 
                            cm.playMusic(true, "Bgm06/WelcomeToTheHell");
			    break;
                    }
                    cm.dispose();
                }
                break;
            case 7:
                if (status == 1) cm.sendSimple("뭐 켤꺼야?\r\n#b#L0# Fantasia#l\r\n#L1# FunnyTimeMaker#l\r\n#L2# HighEnough#l\r\n#L3# WaltzForWork#l\r\n#L4# WhereverYouAre#l");
                else if (status == 2) {
                    switch (selection) {
                        case 0: 
                            cm.playMusic(true, "Bgm07/Fantasia");
			    break;			   			
                        case 1: 
                            cm.playMusic(true, "Bgm07/FunnyTimeMaker");
			    break;			  			
                        case 2: 
                            cm.playMusic(true, "Bgm07/HighEnough");
			    break;			   
                        case 3:
                            cm.playMusic(true, "Bgm07/WaltzForWork");
			    break;			   
			case 4: 
                            cm.playMusic(true, "Bgm07/WhereverYouAre");
			    break;
                    }
                    cm.dispose();
                }
                break;
            case 8:
                if (status == 1) cm.sendSimple("뭐 켤꺼야?\r\n#b#L0# FindingForest#l\r\n#L1# ForTheGlory#l\r\n#L2# LetsHuntAliens#l\r\n#L3# LetsMarch#l\r\n#L4# PlotOfPixie#l");
                else if (status == 2) {
                    switch (selection) {
                        case 0: 
                            cm.playMusic(true, "Bgm08/FindingForest");
			    break;			   			
                        case 1: 
                            cm.playMusic(true, "Bgm08/ForTheGlory");
			    break;			  			
                        case 2: 
                            cm.playMusic(true, "Bgm08/LetsHuntAliens");
			    break;			   
                        case 3:
                            cm.playMusic(true, "Bgm08/LetsMarch");
			    break;			   
			case 4: 
                            cm.playMusic(true, "Bgm08/PlotOfPixie");
			    break;
                    }
                    cm.dispose();
                }
                break;
            case 9:
                if (status == 1) cm.sendSimple("뭐 켤꺼야?\r\n#b#L0# DarkShadow#l\r\n#L1# FairyTale#l\r\n#L2# FairyTalediffvers#l\r\n#L3# TheyMenacingYou#l\r\n#L4# TimeAttack#l");
                else if (status == 2) {
                    switch (selection) {
                        case 0: 
                            cm.playMusic(true, "Bgm09/DarkShadow");
			    break;			   			
                        case 1: 
                            cm.playMusic(true, "Bgm09/FairyTale");
			    break;			  			
                        case 2: 
                            cm.playMusic(true, "Bgm09/FairyTalediffvers");
			    break;			   
                        case 3:
                            cm.playMusic(true, "Bgm09/TheyMenacingYou");
			    break;			   
			case 4: 
                            cm.playMusic(true, "Bgm09/TimeAttack");
			    break;
                    }
                    cm.dispose();
                }
                break;
            case 10:
                if (status == 1) cm.sendSimple("뭐 켤꺼야?\r\n#b#L0# BizarreTales#l\r\n#L1# Eregos#l\r\n#L2# TheWayGrotesque#l\r\n#L3# Timeless#l\r\n#L4# TimelessB#l");
                else if (status == 2) {
                    switch (selection) {
                        case 0: 
                            cm.playMusic(true, "Bgm10/BizarreTales");
			    break;			   			
                        case 1: 
                            cm.playMusic(true, "Bgm10/Eregos");
			    break;			  			
                        case 2: 
                            cm.playMusic(true, "Bgm10/TheWayGrotesque");
			    break;			   
                        case 3:
                            cm.playMusic(true, "Bgm10/Timeless");
			    break;			   
			case 4: 
                            cm.playMusic(true, "Bgm10/TimelessB");
			    break;
                    }
                    cm.dispose();
                }
                break;
            case 11:
                if (status == 1) cm.sendSimple("뭐 켤꺼야?\r\n#b#L0# Aquarium#l\r\n#L1# BlueWorld#l\r\n#L2# DarkMountain#l\r\n#L3# DownTown#l\r\n#L4# ShiningSea#l");
                else if (status == 2) {
                    switch (selection) {
                        case 0: 
                            cm.playMusic(true, "Bgm11/Aquarium");
			    break;			   			
                        case 1: 
                            cm.playMusic(true, "Bgm11/BlueWorld");
			    break;			  			
                        case 2: 
                            cm.playMusic(true, "Bgm11/DarkMountain");
			    break;			   
                        case 3:
                            cm.playMusic(true, "Bgm11/DownTown");
			    break;			   
			case 4: 
                            cm.playMusic(true, "Bgm11/ShiningSea");
			    break;
                    }
                    cm.dispose();
                }
                break;
            case 12:
                if (status == 1) cm.sendSimple("뭐 켤꺼야?\r\n#b#L0# AcientRemain#l\r\n#L1# AquaCave#l\r\n#L2# DeepSee#l\r\n#L3# Dispute#l\r\n#L4# RuinCastle#l\r\n#L5# WaterWay#l");
                else if (status == 2) {
                    switch (selection) {
                        case 0: 
                            cm.playMusic(true, "Bgm12/AcientRemain");
			    break;			   			
                        case 1: 
                            cm.playMusic(true, "Bgm12/AquaCave");
			    break;			  			
                        case 2: 
                            cm.playMusic(true, "Bgm12/DeepSee");
			    break;			   
                        case 3:
                            cm.playMusic(true, "Bgm12/Dispute");
			    break;			   
			case 4: 
                            cm.playMusic(true, "Bgm12/RuinCastle");
			    break;
			case 5:
                            cm.playMusic(true, "Bgm12/WaterWay");
			    break;							   			
                    }
                    cm.dispose();
                }
                break;
            case 13:
                if (status == 1) cm.sendSimple("뭐 켤꺼야?\r\n#b#L0# AcientForest#l\r\n#L1# CokeTown#l\r\n#L2# FightSand#l\r\n#L3# Leafre#l\r\n#L4# Minar'sDream#l\r\n#L5# TowerOfGoddess#l");
                else if (status == 2) {
                    switch (selection) {
                        case 0: 
                            cm.playMusic(true, "Bgm13/AcientForest");
			    break;			   			
                        case 1: 
                            cm.playMusic(true, "Bgm13/CokeTown");
			    break;			  			
                        case 2: 
                            cm.playMusic(true, "Bgm13/FightSand");
			    break;			   
                        case 3:
                            cm.playMusic(true, "Bgm13/Leafre");
			    break;			   
			case 4: 
                            cm.playMusic(true, "Bgm13/Minar'sDream");
			    break;
			case 5:
                            cm.playMusic(true, "Bgm13/TowerOfGoddess");
			    break;							   			
                    }
                    cm.dispose();
                }
                break;
            case 14:
                if (status == 1) cm.sendSimple("뭐 켤꺼야?\r\n#b#L0# Ariant#l\r\n#L1# CaveOfHontale#l\r\n#L2# DragonLoad#l\r\n#L3# DragonNest#l\r\n#L4# HonTale#l\r\n#L5# HotDesert#l");
                else if (status == 2) {
                    switch (selection) {
                        case 0: 
                            cm.playMusic(true, "Bgm14/Ariant");
			    break;			   			
                        case 1: 
                            cm.playMusic(true, "Bgm14/CaveOfHontale");
			    break;			  			
                        case 2: 
                            cm.playMusic(true, "Bgm14/DragonLoad");
			    break;			   
                        case 3:
                            cm.playMusic(true, "Bgm14/DragonNest");
			    break;			   
			case 4: 
                            cm.playMusic(true, "Bgm14/HonTale");
			    break;
			case 5:
                            cm.playMusic(true, "Bgm14/HotDesert");
			    break;							   			
                    }
                    cm.dispose();
                }
                break;
            case 15:
                if (status == 1) cm.sendSimple("뭐 켤꺼야?\r\n#b#L0# ElinForest#l\r\n#L1# inNautilus#l\r\n#L2# MureungForest#l\r\n#L3# MureungHill#l\r\n#L4# Nautilus#l\r\n#L5# Pirate#l\r\n#L6# PoisonForest#l\r\n#L7# SunsetDesert#l\r\n#L8# WhiteHerb#l");
                else if (status == 2) {
                    switch (selection) {
                        case 0: 
                            cm.playMusic(true, "Bgm15/ElinForest");
			    break;			   			
                        case 1: 
                            cm.playMusic(true, "Bgm15/inNautilus");
			    break;			  			
                        case 2: 
                            cm.playMusic(true, "Bgm15/MureungForest");
			    break;			   
                        case 3:
                            cm.playMusic(true, "Bgm15/MureungHill");
			    break;			   
			case 4: 
                            cm.playMusic(true, "Bgm15/Nautilus");
			    break;
			case 5:
                            cm.playMusic(true, "Bgm15/Pirate");
			    break;
                        case 6:
                            cm.playMusic(true, "Bgm15/PoisonForest");
			    break;			   
			case 7: 
                            cm.playMusic(true, "Bgm15/SunsetDesert");
			    break;
			case 8:
                            cm.playMusic(true, "Bgm15/WhiteHerb");
			    break;							   			
                    }
                    cm.dispose();
                }
                break;
            case 16:
                if (status == 1) cm.sendSimple("뭐 켤꺼야?\r\n#b#L0# Duskofgod#l\r\n#L1# FightingPinkBeen#l\r\n#L2# Forgetfulness#l\r\n#L3# Remembrance#l\r\n#L4# Repentance#l\r\n#L5# TimeTemple#l");
                else if (status == 2) {
                    switch (selection) {
                        case 0: 
                            cm.playMusic(true, "Bgm16/Duskofgod");
			    break;			   			
                        case 1: 
                            cm.playMusic(true, "Bgm16/FightingPinkBeen");
			    break;			  			
                        case 2: 
                            cm.playMusic(true, "Bgm16/Forgetfulness");
			    break;			   
                        case 3:
                            cm.playMusic(true, "Bgm16/Remembrance");
			    break;			   
			case 4: 
                            cm.playMusic(true, "Bgm16/Repentance");
			    break;
			case 5:
                            cm.playMusic(true, "Bgm16/TimeTemple");
			    break;							   			
                    }
                    cm.dispose();
                }
                break;
            case 17:
                if (status == 1) cm.sendSimple("뭐 켤꺼야?\r\n#b#L0# MureungSchool1#l\r\n#L1# MureungSchool2#l\r\n#L2# MureungSchool3#l\r\n#L3# MureungSchool4#l");
                else if (status == 2) {
                    switch (selection) {
                        case 0: 
                            cm.playMusic(true, "Bgm17/MureungSchool1");
			    break;			   			
                        case 1: 
                            cm.playMusic(true, "Bgm17/MureungSchool2");
			    break;			  			
                        case 2: 
                            cm.playMusic(true, "Bgm17/MureungSchool3");
			    break;			   
                        case 3:
                            cm.playMusic(true, "Bgm17/MureungSchool4");
			    break;							   			
                    }
                    cm.dispose();
                }
                break;
            case 18:
                if (status == 1) cm.sendSimple("뭐 켤꺼야?\r\n#b#L0# BlackWing#l\r\n#L1# DrillHall#l\r\n#L2# QueensGarden#l\r\n#L3# RaindropFlower#l");
                else if (status == 2) {
                    switch (selection) {
                        case 0: 
                            cm.playMusic(true, "Bgm18/BlackWing");
			    break;			   			
                        case 1: 
                            cm.playMusic(true, "Bgm18/DrillHall");
			    break;			  			
                        case 2: 
                            cm.playMusic(true, "Bgm18/QueensGarden");
			    break;			   
                        case 3:
                            cm.playMusic(true, "Bgm18/RaindropFlower");
			    break;							   			
                    }
                    cm.dispose();
                }
                break;
            case 19:
                if (status == 1) cm.sendSimple("뭐 켤꺼야?\r\n#b#L0# GoShanghai#l\r\n#L1# ShanghaiField#l");
                else if (status == 2) {
                    switch (selection) {
                        case 0: 
                            cm.playMusic(true, "BgmCN/GoShanghai");
			    break;			   			
                        case 1: 
                            cm.playMusic(true, "BgmCN/ShanghaiField");
			    break;							   			
                    }
                    cm.dispose();
                }
                break;
            case 20:
                if (status == 1) cm.sendSimple("뭐 켤꺼야?\r\n#b#L0# FunnyRabbit#l\r\n#L1# FunnyRabbitFaster#l\r\n#L2# wedding#l\r\n#L3# weddingDance#l");
                else if (status == 2) {
                    switch (selection) {
                        case 0: 
                            cm.playMusic(true, "BgmEvent/FunnyRabbit");
			    break;			   			
                        case 1: 
                            cm.playMusic(true, "BgmEvent/FunnyRabbitFaster");
			    break;			  			
                        case 2: 
                            cm.playMusic(true, "BgmEvent/wedding");
			    break;			   
                        case 3:
                            cm.playMusic(true, "BgmEvent/weddingDance");
			    break;							   			
                    }
                    cm.dispose();
                }
                break;
            case 21:
                if (status == 1) cm.sendSimple("뭐 켤꺼야?\r\n#b#L0# amoria#l\r\n#L1# cathedral#l\r\n#L2# chapel#l\r\n#L3# HauntedHouse#l");
                else if (status == 2) {
                    switch (selection) {
                        case 0: 
                            cm.playMusic(true, "BgmGL/amoria");
			    break;			   			
                        case 1: 
                            cm.playMusic(true, "BgmGL/cathedral");
			    break;			  			
                        case 2: 
                            cm.playMusic(true, "BgmGL/chapel");
			    break;			   
                        case 3:
                            cm.playMusic(true, "BgmGL/HauntedHouse");
			    break;
                    }
                    cm.dispose();
                }
                break;
            case 22:
                if (status == 1) cm.sendSimple("뭐 켤꺼야?\r\n#b#L0# Bathroom#l\r\n#L1# BattleField#l\r\n#L2# BizarreForest#l\r\n#L3# Feeling#l\r\n#L4# FirstStepMaster#l\r\n#L5# Hana#l\r\n#L6# Yume#l");
                else if (status == 2) {
                    switch (selection) {
                        case 0: 
                            cm.playMusic(true, "BgmJp/Bathroom");
			    break;			   			
                        case 1: 
                            cm.playMusic(true, "BgmJp/BattleField");
			    break;			  			
                        case 2: 
                            cm.playMusic(true, "BgmJp/BizarreForest");
			    break;			   
                        case 3:
                            cm.playMusic(true, "BgmJp/Feeling");
			    break;			   
			case 4: 
                            cm.playMusic(true, "BgmJp/FirstStepMaster");
			    break;
			case 5:
                            cm.playMusic(true, "BgmJp/Hana");
			    break;
			case 6:
                            cm.playMusic(true, "BgmJp/Yume");
			    break;							   			
                    }
                    cm.dispose();
                }
                break;
            case 23:
                if (status == 1) cm.sendSimple("뭐 켤꺼야?\r\n#b#L0# ThaiField#l\r\n#L1# ThaiTown#l");
                else if (status == 2) {
                    switch (selection) {
                        case 0: 
                            cm.playMusic(true, "BgmTH/ThaiField");
			    break;			   			
                        case 1: 
                            cm.playMusic(true, "BgmTH/ThaiTown");
			    break;							   			
                    }
                    cm.dispose();
                }
                break;
            case 24:
                if (status == 1) cm.sendSimple("뭐 켤꺼야?\r\n#b#L0# NightField#l\r\n#L1# NightMarket#l\r\n#L2# YoTaipei#l");
                else if (status == 2) {
                    switch (selection) {
                        case 0: 
                            cm.playMusic(true, "BgmTW/NightField");
			    break;			   			
                        case 1: 
                            cm.playMusic(true, "BgmTW/NightMarket");
			    break;
                        case 2: 
                            cm.playMusic(true, "BgmTW/YoTaipei");
			    break;							   			
                    }
                    cm.dispose();
                }
                break;
            case 25:
                if (status == 1) cm.sendSimple("뭐 켤꺼야?\r\n#b#L0# 1분1초#l\r\n#L1# Blue#l\r\n#L2# MyLove#l\r\n#L3# RPG1#l\r\n#L4# RPG2#l\r\n#L5# 곰세마리#l\r\n#L6# 구구단송#l\r\n#L7# 그체#l\r\n#L8# 나는나비#l\r\n#L9# 메칸더#l\r\n#L10# 바람의너를#l\r\n#L11# 벚꽃엔딩#l\r\n#L12# 별똥별#l\r\n#L13# 빠빠빠#l\r\n#L14# 새나라새주인#l\r\n#L15# 섬집아기#l\r\n#L16# 세일러문#l\r\n#L17# 슈퍼스타#l\r\n#L18# 아빠의얼굴#l\r\n#L19# 애국가1(소리 매우 작음)#l\r\n#L20# 애국가2#l\r\n#L21# 어머니은혜#l\r\n#L22# 여래아#l\r\n#L23# 작은별#l\r\n#L24# 조각나비#l\r\n#L25# 질풍가도#l\r\n#L26# 천사소녀네티#l\r\n#L27# 체리(소리 큼)#l\r\n#L28# 포켓몬#l\r\n#L29# 혼자가아닌나#l");
                else if (status == 2) {
                    switch (selection) {
                        case 0: 
                            cm.playMusic(true, "한글/1분1초");
			    break;   			
                        case 1: 
                            cm.playMusic(true, "한글/Blue");
			    break;
                        case 2: 
                            cm.playMusic(true, "한글/MyLove");
			    break;
                        case 3: 
                            cm.playMusic(true, "한글/RPG1");
			    break;			   			
                        case 4: 
                            cm.playMusic(true, "한글/RPG2");
			    break;
                        case 5: 
                            cm.playMusic(true, "한글/곰세마리");
			    break;
                        case 6: 
                            cm.playMusic(true, "한글/구구단송");
			    break;			   			
                        case 7: 
                            cm.playMusic(true, "한글/그체");
			    break;
                        case 8: 
                            cm.playMusic(true, "한글/나는나비");
			    break;
                        case 9: 
                            cm.playMusic(true, "한글/메칸더");
			    break;			   			
                        case 10: 
                            cm.playMusic(true, "한글/바람의너를");
			    break;
                        case 11: 
                            cm.playMusic(true, "한글/벚꽃엔딩");
			    break;
                        case 12: 
                            cm.playMusic(true, "한글/별똥별");
			    break;			   			
                        case 13: 
                            cm.playMusic(true, "한글/빠빠빠");
			    break;
                        case 14: 
                            cm.playMusic(true, "한글/새나라새주인");
			    break;
                        case 15: 
                            cm.playMusic(true, "한글/섬집아기");
			    break;			   			
                        case 16: 
                            cm.playMusic(true, "한글/세일러문");
			    break;
                        case 17: 
                            cm.playMusic(true, "한글/슈퍼스타");
			    break;
                        case 18: 
                            cm.playMusic(true, "한글/아빠의얼굴");
			    break;			   			
                        case 19: 
                            cm.playMusic(true, "한글/애국가1");
			    break;
                        case 20: 
                            cm.playMusic(true, "한글/애국가2");
			    break;
                        case 21: 
                            cm.playMusic(true, "한글/어머니은혜");
			    break;			   			
                        case 22: 
                            cm.playMusic(true, "한글/여래아");
			    break;
                        case 23: 
                            cm.playMusic(true, "한글/작은별");
			    break;
                        case 24: 
                            cm.playMusic(true, "한글/조각나비");
			    break;			   			
                        case 25: 
                            cm.playMusic(true, "한글/질풍가도");
			    break;
                        case 26: 
                            cm.playMusic(true, "한글/천사소녀네티");
			    break;
                        case 27: 
                            cm.playMusic(true, "한글/체리");
			    break;			   			
                        case 28: 
                            cm.playMusic(true, "한글/포켓몬");
			    break;
                        case 29: 
                            cm.playMusic(true, "한글/혼자가아닌나");
			    break;							   			
                    }
                    cm.dispose();
                }
                break;
            case 26:
                if (status == 1) cm.sendSimple("뭐 켤꺼야?\r\n#b#L0# Departures#l\r\n#L1# ef1#l\r\n#L2# ef2#l\r\n#L3# ReleaseMySoul#l\r\n#L4# 고백#l\r\n#L5# 백금디스코#l\r\n#L6# 세노#l\r\n#L7# 영원한유죄#l\r\n#L8# 출발#l");
                else if (status == 2) {
                    switch (selection) {
                        case 0: 
                            cm.playMusic(true, "ef길티모노가타리/Departures");
			    break;			   			
                        case 1: 
                            cm.playMusic(true, "ef길티모노가타리/ef1");
			    break;			  			
                        case 2: 
                            cm.playMusic(true, "ef길티모노가타리/ef2");
			    break;			   
                        case 3:
                            cm.playMusic(true, "ef길티모노가타리/ReleaseMySoul");
			    break;			   
			case 4: 
                            cm.playMusic(true, "ef길티모노가타리/고백");
			    break;
			case 5:
                            cm.playMusic(true, "ef길티모노가타리/백금디스코");
			    break;
                        case 6:
                            cm.playMusic(true, "ef길티모노가타리/세노");
			    break;			   
			case 7: 
                            cm.playMusic(true, "ef길티모노가타리/영원한유죄");
			    break;
			case 8:
                            cm.playMusic(true, "ef길티모노가타리/출발");
			    break;							   			
                    }
                    cm.dispose();
                }
                break;
            case 27:
                if (status == 1) cm.sendSimple("뭐 켤꺼야?\r\n#b#L0# MarryMe#l\r\n#L1# TheGreatEscape#l\r\n#L2# 이로하1#l\r\n#L3# 이로하2#l\r\n#L4# 키스시스1#l\r\n#L5# 키스시스2#l");
                else if (status == 2) {
                    switch (selection) {
                        case 0: 
                            cm.playMusic(true, "kiss이로하팝/MarryMe");
			    break;			   			
                        case 1: 
                            cm.playMusic(true, "kiss이로하팝/TheGreatEscape");
			    break;			  			
                        case 2: 
                            cm.playMusic(true, "kiss이로하팝/이로하1");
			    break;			   
                        case 3:
                            cm.playMusic(true, "kiss이로하팝/이로하2");
			    break;			   
			case 4: 
                            cm.playMusic(true, "kiss이로하팝/키스시스1");
			    break;
			case 5:
                            cm.playMusic(true, "kiss이로하팝/키스시스2");
			    break;							   			
                    }
                    cm.dispose();
                }
                break;
            case 28:
                if (status == 1) cm.sendSimple("뭐 켤꺼야?\r\n#b#L0# Anniv1#l\r\n#L1# 사자왕의 성#l\r\n#L2# 시그너스 정원#l\r\n#L3# 팬텀#l\r\n#L4# 커닝스퀘어#l\r\n#L5# 커닝스퀘어 필드#l\r\n#L6# KnightsStronghold#l\r\n#L7# LowGradeOre#l\r\n#L8# MapleLeaf#l\r\n#L9# PowerStation#l\r\n#L10# Smile#l\r\n#L11# Title_Japan#l\r\n#L12# Title2010Winter#l\r\n#L13# 보컬오프 Smile#l\r\n#L14# 에델슈타인#l\r\n#L15# 에우렐#l\r\n#L16# 엔젤릭버스터#l\r\n#L17# 크리스탈가든#l");
                else if (status == 2) {
                    switch (selection) {
                        case 0: 
                            cm.playMusic(true, "Maple/Anniv1");
			    break;   			
                        case 1: 
                            cm.playMusic(true, "Maple/BlizzardCastle");
			    break;
                        case 2: 
                            cm.playMusic(true, "Maple/CygnusGarden");
			    break;
                        case 3: 
                            cm.playMusic(true, "Maple/DancingWithTheMoon");
			    break;			   			
                        case 4: 
                            cm.playMusic(true, "Maple/KerningSquare");
			    break;
                        case 5: 
                            cm.playMusic(true, "Maple/KerningSquareField");
			    break;
                        case 6: 
                            cm.playMusic(true, "Maple/KnightsStronghold");
			    break;			   			
                        case 7: 
                            cm.playMusic(true, "Maple/LowGradeOre");
			    break;
                        case 8: 
                            cm.playMusic(true, "Maple/MapleLeaf");
			    break;
                        case 9: 
                            cm.playMusic(true, "Maple/PowerStation");
			    break;			   			
                        case 10: 
                            cm.playMusic(true, "Maple/Smile");
			    break;
                        case 11: 
                            cm.playMusic(true, "Maple/Title_Japan");
			    break;
                        case 12: 
                            cm.playMusic(true, "Maple/Title2010Winter");
			    break;			   			
                        case 13: 
                            cm.playMusic(true, "Maple/VO_Smile");
			    break;
                        case 14: 
                            cm.playMusic(true, "Maple/에델슈타인");
			    break;
                        case 15: 
                            cm.playMusic(true, "Maple/에우렐");
			    break;			   			
                        case 16: 
                            cm.playMusic(true, "Maple/엔젤릭버스터");
			    break;
                        case 17: 
                            cm.playMusic(true, "Maple/크리스탈가든");
			    break;							   			
                    }
                    cm.dispose();
                }
                break;
            case 29:
                if (status == 1) cm.sendSimple("뭐 켤꺼야?\r\n#b#L0# Aozora#l\r\n#L1# LoveMeGimmie#l\r\n#L2# Palette#l\r\n#L3# TheBravery#l\r\n#L4# 길티크라운#l\r\n#L5# 너의모르는이야기#l\r\n#L6# 락앤롤#l\r\n#L7# 러브앤롤#l\r\n#L8# 리루모아#l\r\n#L9# 마마파파#l\r\n#L10# 모시모#l\r\n#L11# 별이반짝이는#l\r\n#L12# 복수#l\r\n#L13# 사요나라메모리즈#l\r\n#L14# 앨범op#l\r\n#L15# 오시에테아게루#l\r\n#L16# 앨범ed#l\r\n#L17# 요루(sheep)#l\r\n#L18# 월드와이드#l\r\n#L19# 은색비행선#l\r\n#L20# 첫사랑이 끝날 때#l\r\n#L21# 퍼펙트데이#l\r\n#L22# 필소굿#l\r\n#L23# 하나비#l\r\n#L24# 히어로#l");
                else if (status == 2) {
                    switch (selection) {
                        case 0: 
                            cm.playMusic(true, "supercell/Aozora");
			    break;   			
                        case 1: 
                            cm.playMusic(true, "supercell/LoveMeGimmie");
			    break;
                        case 2: 
                            cm.playMusic(true, "supercell/Palette");
			    break;
                        case 3: 
                            cm.playMusic(true, "supercell/TheBravery");
			    break;			   			
                        case 4: 
                            cm.playMusic(true, "supercell/길티크라운");
			    break;
                        case 5: 
                            cm.playMusic(true, "supercell/너의모르는이야기");
			    break;
                        case 6: 
                            cm.playMusic(true, "supercell/락앤롤");
			    break;			   			
                        case 7: 
                            cm.playMusic(true, "supercell/러브앤롤");
			    break;
                        case 8: 
                            cm.playMusic(true, "supercell/리루모아");
			    break;
                        case 9: 
                            cm.playMusic(true, "supercell/마마파파");
			    break;			   			
                        case 10: 
                            cm.playMusic(true, "supercell/모시모");
			    break;
                        case 11: 
                            cm.playMusic(true, "supercell/별이반짝이는");
			    break;
                        case 12: 
                            cm.playMusic(true, "supercell/복수");
			    break;			   			
                        case 13: 
                            cm.playMusic(true, "supercell/사요나라메모리즈");
			    break;
                        case 14: 
                            cm.playMusic(true, "supercell/시작");
			    break;
                        case 15: 
                            cm.playMusic(true, "supercell/오시에테아게루");
			    break;			   			
                        case 16: 
                            cm.playMusic(true, "supercell/오와리");
			    break;
                        case 17: 
                            cm.playMusic(true, "supercell/요루");
			    break;
                        case 18: 
                            cm.playMusic(true, "supercell/월드와이드");
			    break;			   			
                        case 19: 
                            cm.playMusic(true, "supercell/은색비행선");
			    break;
                        case 20: 
                            cm.playMusic(true, "supercell/첫사랑이끝날때");
			    break;
                        case 21: 
                            cm.playMusic(true, "supercell/퍼펙트데이");
			    break;			   			
                        case 22: 
                            cm.playMusic(true, "supercell/필소굿");
			    break;
                        case 23: 
                            cm.playMusic(true, "supercell/하나비");
			    break;
                        case 24: 
                            cm.playMusic(true, "supercell/히어로");
			    break;						   			
                    }
                    cm.dispose();
                }
                break;
            case 30:
                if (status == 1) cm.sendSimple("뭐 켤꺼야?\r\n#b#L0# Gloria#l\r\n#L1# GoodByeDays#l\r\n#L2# Laugh_away#l\r\n#L3# Life#l");
                else if (status == 2) {
                    switch (selection) {
                        case 0: 
                            cm.playMusic(true, "yui/Gloria");
			    break;			   			
                        case 1: 
                            cm.playMusic(true, "yui/GoodByeDays");
			    break;			  			
                        case 2: 
                            cm.playMusic(true, "yui/Laugh_away");
			    break;			   
                        case 3:
                            cm.playMusic(true, "yui/Life");
			    break;
                    }
                    cm.dispose();
                }
                break;
            case 31:
                if (status == 1) cm.sendSimple("뭐 켤꺼야?\r\n#b#L0# Arcadia#l\r\n#L1# Disillusion2#l\r\n#L2# 구름조각#l\r\n#L3# 제로1ed#l\r\n#L4# 제로1op#l\r\n#L5# 제로2ed#l\r\n#L6# 제로2op#l\r\n#L7# 제로 앨범 삽입곡#l\r\n#L8# 카니발ed#l\r\n#L9# 카니발op#l\r\n#L10# 프리즘이리야op#l");
                else if (status == 2) {
                    switch (selection) {
                        case 0: 
                            cm.playMusic(true, "달동네/Arcadia");
			    break;			   			
                        case 1: 
                            cm.playMusic(true, "달동네/Disillusion2");
			    break;			  			
                        case 2: 
                            cm.playMusic(true, "달동네/구름조각");
			    break;			   
                        case 3:
                            cm.playMusic(true, "달동네/제로1ed");
			    break;			   
			case 4: 
                            cm.playMusic(true, "달동네/제로1op");
			    break;
			case 5:
                            cm.playMusic(true, "달동네/제로2ed");
			    break;
                        case 6:
                            cm.playMusic(true, "달동네/제로2op");
			    break;			   
			case 7: 
                            cm.playMusic(true, "달동네/제로투투투");
			    break;
			case 8:
                            cm.playMusic(true, "달동네/카니발ed");
			    break;
			case 9: 
                            cm.playMusic(true, "달동네/카니발op");
			    break;
			case 10:
                            cm.playMusic(true, "달동네/프리즘이리야op");
			    break;							   			
                    }
                    cm.dispose();
                }
                break;
            case 32:
                if (status == 1) cm.sendSimple("뭐 켤꺼야?\r\n#b#L0# 나의마음을담아#l\r\n#L1# 내자신의#l\r\n#L2# 미소#l\r\n#L3# 사랑의기록표#l\r\n#L4# 새로운미래#l\r\n#L5# 영원한눈#l");
                else if (status == 2) {
                    switch (selection) {
                        case 0: 
                            cm.playMusic(true, "달빛천사/나의마음을담아");
			    break;			   			
                        case 1: 
                            cm.playMusic(true, "달빛천사/내자신의");
			    break;			  			
                        case 2: 
                            cm.playMusic(true, "달빛천사/미소");
			    break;			   
                        case 3:
                            cm.playMusic(true, "달빛천사/사랑의기록표");
			    break;			   
			case 4: 
                            cm.playMusic(true, "달빛천사/새로운미래");
			    break;
			case 5:
                            cm.playMusic(true, "달빛천사/영원한눈");
			    break;							   			
                    }
                    cm.dispose();
                }
                break;
            case 33:
                if (status == 1) cm.sendSimple("뭐 켤꺼야?\r\n#b#L0# 마법소녀들#l\r\n#L1# 신들이사랑한#l\r\n#L2# 유령악단#l");
                else if (status == 2) {
                    switch (selection) {
                        case 0: 
                            cm.playMusic(true, "동방/마법소녀들");
			    break;			   			
                        case 1: 
                            cm.playMusic(true, "동방/신들이사랑한");
			    break;
                        case 2: 
                            cm.playMusic(true, "동방/유령악단");
			    break;							   			
                    }
                    cm.dispose();
                }
                break;
            case 34:
                if (status == 1) cm.sendSimple("뭐 켤꺼야?\r\n#b#L0# 어드벤쳐ed#l\r\n#L1# 어드벤쳐op#l\r\n#L2# 어드벤쳐ost#l\r\n#L3# 어드벤쳐볼레로#l\r\n#L4# 어드벤쳐서브타이틀#l\r\n#L5# 어드벤쳐시작#l\r\n#L6# 어드벤쳐악당#l\r\n#L7# 어드벤쳐위기#l\r\n#L8# 어드벤쳐전투#l\r\n#L9# 어드벤쳐진화#l\r\n#L10# 어드벤쳐파워업#l\r\n#L11# 파워ed#l\r\n#L12# 파워op#l\r\n#L13# 파워진화1#l\r\n#L14# 파워진화2#l\r\n#L15# 파워진화2한글#l");
                else if (status == 2) {
                    switch (selection) {
                        case 0: 
                            cm.playMusic(true, "디지몬/어드벤쳐ed");
			    break;   			
                        case 1: 
                            cm.playMusic(true, "디지몬/어드벤쳐op");
			    break;
                        case 2: 
                            cm.playMusic(true, "디지몬/어드벤쳐ost");
			    break;
                        case 3: 
                            cm.playMusic(true, "디지몬/어드벤쳐볼레로");
			    break;			   			
                        case 4: 
                            cm.playMusic(true, "디지몬/어드벤쳐서브타이틀");
			    break;
                        case 5: 
                            cm.playMusic(true, "디지몬/어드벤쳐시작");
			    break;
                        case 6: 
                            cm.playMusic(true, "디지몬/어드벤쳐악당");
			    break;			   			
                        case 7: 
                            cm.playMusic(true, "디지몬/어드벤쳐위기");
			    break;
                        case 8: 
                            cm.playMusic(true, "디지몬/어드벤쳐전투");
			    break;
                        case 9: 
                            cm.playMusic(true, "디지몬/어드벤쳐진화");
			    break;			   			
                        case 10: 
                            cm.playMusic(true, "디지몬/어드벤쳐파워업");
			    break;
                        case 11: 
                            cm.playMusic(true, "디지몬/파워ed");
			    break;
                        case 12: 
                            cm.playMusic(true, "디지몬/파워op");
			    break;			   			
                        case 13: 
                            cm.playMusic(true, "디지몬/파워진화1");
			    break;
                        case 14: 
                            cm.playMusic(true, "디지몬/파워진화2");
			    break;
                        case 15: 
                            cm.playMusic(true, "디지몬/파워진화2한글");
			    break;							   			
                    }
                    cm.dispose();
                }
                break;
            case 35:
                if (status == 1) cm.sendSimple("뭐 켤꺼야?\r\n#b#L0# 세라복2(기본 빠른 템포)#l\r\n#L1# 일상ed#l\r\n#L2# 일상op1#l\r\n#L3# 일상op2#l\r\n#L4# 하루히ost1#l\r\n#L5# 하루히ost2#l\r\n#L6# 학생회ed#l");
                else if (status == 2) {
                    switch (selection) {
                        case 0: 
                            cm.playMusic(true, "럭키하루히학생회일상/세라복2");
			    break;			   			
                        case 1: 
                            cm.playMusic(true, "럭키하루히학생회일상/일상ed");
			    break;			  			
                        case 2: 
                            cm.playMusic(true, "럭키하루히학생회일상/일상op1");
			    break;			   
                        case 3:
                            cm.playMusic(true, "럭키하루히학생회일상/일상op2");
			    break;			   
			case 4: 
                            cm.playMusic(true, "럭키하루히학생회일상/하루히ost1");
			    break;
			case 5:
                            cm.playMusic(true, "럭키하루히학생회일상/하루히ost2");
			    break;
			case 6:
                            cm.playMusic(true, "럭키하루히학생회일상/학생회ed");
			    break;							   			
                    }
                    cm.dispose();
                }
                break;
            case 36:
                if (status == 1) cm.sendSimple("뭐 켤꺼야?\r\n#b#L0# izumi#l\r\n#L1# 댄스#l\r\n#L2# 만담#l\r\n#L3# 반성#l\r\n#L4# 슬픔1#l\r\n#L5# 슬픔2#l\r\n#L6# 시르후#l\r\n#L7# 아쿠아#l\r\n#L8# 야영#l\r\n#L9# 에덴#l\r\n#L10# 연구실#l\r\n#L11# 이리아스#l\r\n#L12# 최종보스#l\r\n#L13# 크롬#l\r\n#L14# 타마모#l\r\n#L15# 플랜섹트#l");
                else if (status == 2) {
                    switch (selection) {
                        case 0: 
                            cm.playMusic(true, "몬무스/izumi");
			    break;   			
                        case 1: 
                            cm.playMusic(true, "몬무스/댄스");
			    break;
                        case 2: 
                            cm.playMusic(true, "몬무스/만담");
			    break;
                        case 3: 
                            cm.playMusic(true, "몬무스/반성");
			    break;			   			
                        case 4: 
                            cm.playMusic(true, "몬무스/슬픔1");
			    break;
                        case 5: 
                            cm.playMusic(true, "몬무스/슬픔2");
			    break;
                        case 6: 
                            cm.playMusic(true, "몬무스/시르후");
			    break;			   			
                        case 7: 
                            cm.playMusic(true, "몬무스/아쿠아");
			    break;
                        case 8: 
                            cm.playMusic(true, "몬무스/야영");
			    break;
                        case 9: 
                            cm.playMusic(true, "몬무스/에덴");
			    break;			   			
                        case 10: 
                            cm.playMusic(true, "몬무스/연구실");
			    break;
                        case 11: 
                            cm.playMusic(true, "몬무스/이리아스");
			    break;
                        case 12: 
                            cm.playMusic(true, "몬무스/최종보스");
			    break;			   			
                        case 13: 
                            cm.playMusic(true, "몬무스/크롬");
			    break;
                        case 14: 
                            cm.playMusic(true, "몬무스/타마모");
			    break;
                        case 15: 
                            cm.playMusic(true, "몬무스/플랜섹트");
			    break;							   			
                    }
                    cm.dispose();
                }
                break;
            case 37:
                if (status == 1) cm.sendSimple("뭐 켤꺼야?\r\n#b#L0# Aozora#l\r\n#L1# AsitanoSora#l\r\n#L2# Everything#l\r\n#L3# GentleJena#l\r\n#L4# GrowSlowly#l\r\n#L5# HappySong#l\r\n#L6# LoveMeGimmie#l\r\n#L7# MyDearest#l\r\n#L8# Oshieteageru#l\r\n#L9# Palette#l\r\n#L10# TheBravery#l\r\n#L11# 경단대가족#l\r\n#L12# 꽃의댄스#l\r\n#L13# 나친적op#l\r\n#L14# 네가모르는이야기#l\r\n#L15# 놀라운그레이스#l\r\n#L16# 달묘전설#l\r\n#L17# 마비노기#l\r\n#L18# 메모리아#l\r\n#L19# 백금디스코#l\r\n#L20# 별빛쪼개기#l\r\n#L21# 세라샵#l\r\n#L22# 센과치히로#l\r\n#L23# 소원이이루어지는장소#l\r\n#L24# 시대를초월한마음#l\r\n#L25# 아즈망가대왕#l\r\n#L26# 언덕아래의이별#l\r\n#L27# 익시온사가게임#l\r\n#L28# 캐롤샵#l\r\n#L29# 크로아티아랩소디#l\r\n#L30# 클라나드일렉톤#l\r\n#L31# 테일즈위버ost1#l\r\n#L32# 테일즈위버ost2#l\r\n#L33# 테일즈위버ost3#l\r\n#L34# 테일즈위버ost4#l\r\n#L35# 포켓몬도로#l\r\n#L36# 하늘에빛나다#l\r\n#L37# 하울#l\r\n#L38# 해적#l\r\n#L39# 히로시의회상#l");
                else if (status == 2) {
                    switch (selection) {
                        case 0: 
                            cm.playMusic(true, "보컬오프/Aozora");
			    break;   			
                        case 1: 
                            cm.playMusic(true, "보컬오프/AsitanoSora");
			    break;
                        case 2: 
                            cm.playMusic(true, "보컬오프/Everything");
			    break;
                        case 3: 
                            cm.playMusic(true, "보컬오프/GentleJena");
			    break;			   			
                        case 4: 
                            cm.playMusic(true, "보컬오프/GrowSlowly");
			    break;
                        case 5: 
                            cm.playMusic(true, "보컬오프/HappySong");
			    break;
                        case 6: 
                            cm.playMusic(true, "보컬오프/LoveMeGimmie");
			    break;			   			
                        case 7: 
                            cm.playMusic(true, "보컬오프/MyDearest");
			    break;
                        case 8: 
                            cm.playMusic(true, "보컬오프/Oshieteageru");
			    break;
                        case 9: 
                            cm.playMusic(true, "보컬오프/Palette");
			    break;			   			
                        case 10: 
                            cm.playMusic(true, "보컬오프/TheBravery");
			    break;
                        case 11: 
                            cm.playMusic(true, "보컬오프/경단대가족");
			    break;
                        case 12: 
                            cm.playMusic(true, "보컬오프/꽃의댄스");
			    break;			   			
                        case 13: 
                            cm.playMusic(true, "보컬오프/나친적op");
			    break;
                        case 14: 
                            cm.playMusic(true, "보컬오프/네가모르는이야기");
			    break;
                        case 15: 
                            cm.playMusic(true, "보컬오프/놀라운그레이스");
			    break;			   			
                        case 16: 
                            cm.playMusic(true, "보컬오프/달묘전설");
			    break;
                        case 17: 
                            cm.playMusic(true, "보컬오프/마비노기");
			    break;
                        case 18: 
                            cm.playMusic(true, "보컬오프/메모리아");
			    break;			   			
                        case 19: 
                            cm.playMusic(true, "보컬오프/백금디스코");
			    break;
                        case 20: 
                            cm.playMusic(true, "보컬오프/별빛쪼개기");
			    break;
                        case 21: 
                            cm.playMusic(true, "보컬오프/세라샵");
			    break;			   			
                        case 22: 
                            cm.playMusic(true, "보컬오프/센과치히로");
			    break;
                        case 23: 
                            cm.playMusic(true, "보컬오프/소원이이루어지는장소");
			    break;
                        case 24: 
                            cm.playMusic(true, "보컬오프/시대를초월한마음");
			    break;			   			
                        case 25: 
                            cm.playMusic(true, "보컬오프/아즈망가대왕");
			    break;
                        case 26: 
                            cm.playMusic(true, "보컬오프/언덕아래의이별");
			    break;
                        case 27: 
                            cm.playMusic(true, "보컬오프/익시온사가게임");
			    break;			   			
                        case 28: 
                            cm.playMusic(true, "보컬오프/캐롤샵");
			    break;
                        case 29: 
                            cm.playMusic(true, "보컬오프/크로아티아랩소디");
			    break;
                        case 30: 
                            cm.playMusic(true, "보컬오프/클라나드일렉톤");
			    break;
                        case 31: 
                            cm.playMusic(true, "보컬오프/테일즈위버ost1");
			    break;			   			
                        case 32: 
                            cm.playMusic(true, "보컬오프/테일즈위버ost2");
			    break;
                        case 33: 
                            cm.playMusic(true, "보컬오프/테일즈위버ost3");
			    break;
                        case 34: 
                            cm.playMusic(true, "보컬오프/테일즈위버ost4");
			    break;			   			
                        case 35: 
                            cm.playMusic(true, "보컬오프/포켓몬도로");
			    break;
                        case 36: 
                            cm.playMusic(true, "보컬오프/하늘에빛나다");
			    break;
                        case 37: 
                            cm.playMusic(true, "보컬오프/하울");
			    break;			   			
                        case 38: 
                            cm.playMusic(true, "보컬오프/해적");
			    break;
                        case 39: 
                            cm.playMusic(true, "보컬오프/히로시의회상");
			    break;							   			
                    }
                    cm.dispose();
                }
                break;
            case 38:
                if (status == 1) cm.sendSimple("뭐 켤꺼야?\r\n#b#L0# 사랑의예감#l\r\n#L1# 신만세1op#l\r\n#L2# 신만세1op2#l\r\n#L3# 신만세2op#l\r\n#L4# 신만세3op#l\r\n#L5# 집적회로#l\r\n#L6# 집적회로2#l");
                else if (status == 2) {
                    switch (selection) {
                        case 0: 
                            cm.playMusic(true, "신만세/사랑의예감");
			    break;			   			
                        case 1: 
                            cm.playMusic(true, "신만세/신만세1op");
			    break;			  			
                        case 2: 
                            cm.playMusic(true, "신만세/신만세1op2");
			    break;			   
                        case 3:
                            cm.playMusic(true, "신만세/신만세2op");
			    break;			   
			case 4: 
                            cm.playMusic(true, "신만세/신만세3op");
			    break;
			case 5:
                            cm.playMusic(true, "신만세/집적회로");
			    break;
			case 6:
                            cm.playMusic(true, "신만세/집적회로2");
			    break;							   			
                    }
                    cm.dispose();
                }
                break;
            case 39:
                if (status == 1) cm.sendSimple("뭐 켤꺼야?\r\n#b#L0# Electric_Six_Gay_Bar#l\r\n#L1# I_just_had_sex#l\r\n#L2# You_spin_me_round#l\r\n#L3# 가그린기자#l\r\n#L4# 고자라니#l\r\n#L5# 기자리믹스1#l\r\n#L6# 기자리믹스2#l\r\n#L7# 남극탐험#l\r\n#L8# 뚤훍뚤#l\r\n#L9# 라면한박스#l\r\n#L10# 마제윤주제가#l\r\n#L11# 문학소녀#l\r\n#L12# 발랄라이카#l\r\n#L13# 비둘기야#l\r\n#L14# 빠삐놈1#l\r\n#L15# 빠삐놈2#l\r\n#L16# 빠삐코기자#l\r\n#L17# 숨겨왔던#l\r\n#L18# 스머프 양념통닭#l\r\n#L19# 스폰지밥op#l\r\n#L20# 스폰지밥크리스마스#l\r\n#L21# 시유천#l\r\n#L22# 심영#l\r\n#L23# 앵그리기자#l\r\n#L24# 야라나이카#l\r\n#L25# 에어맨#l\r\n#L26# 오리온좌#l\r\n#L27# 우마우마#l\r\n#L28# 운지천#l\r\n#L29# 이루마고자라니#l\r\n#L30# 케이크하우스#l\r\n#L31# 파돌리기송#l\r\n#L32# 피카츄기자#l");
                else if (status == 2) {
                    switch (selection) {
                        case 0: 
                            cm.playMusic(true, "약/Electric_Six_Gay_Bar");
			    break;   			
                        case 1: 
                            cm.playMusic(true, "약/I_just_had_sex");
			    break;
                        case 2: 
                            cm.playMusic(true, "약/You_spin_me_round");
			    break;
                        case 3: 
                            cm.playMusic(true, "약/가그린기자");
			    break;			   			
                        case 4: 
                            cm.playMusic(true, "약/고자라니");
			    break;
                        case 5: 
                            cm.playMusic(true, "약/기자리믹스1");
			    break;
                        case 6: 
                            cm.playMusic(true, "약/기자리믹스2");
			    break;			   			
                        case 7: 
                            cm.playMusic(true, "약/남극탐험");
			    break;
                        case 8: 
                            cm.playMusic(true, "약/뚤훍뚤");
			    break;
                        case 9: 
                            cm.playMusic(true, "약/라면한박스");
			    break;			   			
                        case 10: 
                            cm.playMusic(true, "약/마제윤주제가");
			    break;
                        case 11: 
                            cm.playMusic(true, "약/문학소녀");
			    break;
                        case 12: 
                            cm.playMusic(true, "약/발랄라이카");
			    break;			   			
                        case 13: 
                            cm.playMusic(true, "약/비둘기야");
			    break;
                        case 14: 
                            cm.playMusic(true, "약/빠삐놈1");
			    break;
                        case 15: 
                            cm.playMusic(true, "약/빠삐놈2");
			    break;			   			
                        case 16: 
                            cm.playMusic(true, "약/빠삐코기자");
			    break;
                        case 17: 
                            cm.playMusic(true, "약/숨겨왔던");
			    break;
                        case 18: 
                            cm.playMusic(true, "약/스머프");
			    break;			   			
                        case 19: 
                            cm.playMusic(true, "약/스폰지밥op");
			    break;
                        case 20: 
                            cm.playMusic(true, "약/스폰지밥크리스마스");
			    break;
                        case 21: 
                            cm.playMusic(true, "약/시유천");
			    break;			   			
                        case 22: 
                            cm.playMusic(true, "약/심영");
			    break;
                        case 23: 
                            cm.playMusic(true, "약/앵그리기자");
			    break;
                        case 24: 
                            cm.playMusic(true, "약/야라나이카");
			    break;			   			
                        case 25: 
                            cm.playMusic(true, "약/에어맨");
			    break;
                        case 26: 
                            cm.playMusic(true, "약/오리온좌");
			    break;
                        case 27: 
                            cm.playMusic(true, "약/우마우마");
			    break;			   			
                        case 28: 
                            cm.playMusic(true, "약/운지천");
			    break;
                        case 29: 
                            cm.playMusic(true, "약/이루마고자라니");
			    break;
                        case 30: 
                            cm.playMusic(true, "약/케이크하우스");
			    break;
                        case 31: 
                            cm.playMusic(true, "약/파돌리기송");
			    break;			   			
                        case 32: 
                            cm.playMusic(true, "약/피카츄기자");
			    break;
                    }
                    cm.dispose();
                }
                break;
            case 40:
                if (status == 1) cm.sendSimple("뭐 켤꺼야?\r\n#b#L0# Dear My Friend#l\r\n#L1# Grow Slowly#l\r\n#L2# Late in autumn#l\r\n#L3# Memory of snow#l\r\n#L4# Only my lailgun#l\r\n#L5# Smile#l\r\n#L6# Special one#l\r\n#L7# 질주감#l");
                else if (status == 2) {
                    switch (selection) {
                        case 0: 
                            cm.playMusic(true, "어과초어마금/DearMyFriend");
			    break;			   			
                        case 1: 
                            cm.playMusic(true, "어과초어마금/GrowSlowly");
			    break;			  			
                        case 2: 
                            cm.playMusic(true, "어과초어마금/Late_in_autumn");
			    break;			   
                        case 3:
                            cm.playMusic(true, "어과초어마금/Memory_of_snow");
			    break;			   
			case 4: 
                            cm.playMusic(true, "어과초어마금/OnlyMyLailgun");
			    break;
			case 5:
                            cm.playMusic(true, "어과초어마금/Smile");
			    break;
			case 6:
                            cm.playMusic(true, "어과초어마금/Special_One");
			    break;
			case 7:
                            cm.playMusic(true, "어과초어마금/질주감");
			    break;							   			
                    }
                    cm.dispose();
                }
                break;
	    case 41:
                if (status == 1) cm.sendSimple("뭐 켤꺼야?\r\n#b#L0# Alchemy#l\r\n#L1# BraveSong#l\r\n#L2# CrowSong#l\r\n#L3# God_bless_you#l\r\n#L4# HighestSong#l\r\n#L5# HotMeal#l\r\n#L6# LastSong#l\r\n#L7# MySong#l\r\n#L8# ShineDays#l\r\n#L9# ThousandEnemies#l\r\n#L10# 엔비op#l\r\n#L11# 최고의보물ori#l\r\n#L12# 최고의보물yui#l");
                else if (status == 2) {
                    switch (selection) {
                        case 0: 
                            cm.playMusic(true, "엔젤비트/Alchemy");
			    break;   			
                        case 1: 
                            cm.playMusic(true, "엔젤비트/BraveSong");
			    break;
                        case 2: 
                            cm.playMusic(true, "엔젤비트/CrowSong");
			    break;
                        case 3: 
                            cm.playMusic(true, "엔젤비트/God_bless_you");
			    break;			   			
                        case 4: 
                            cm.playMusic(true, "엔젤비트/HighestSong");
			    break;
                        case 5: 
                            cm.playMusic(true, "엔젤비트/HotMeal");
			    break;
                        case 6: 
                            cm.playMusic(true, "엔젤비트/LastSong");
			    break;			   			
                        case 7: 
                            cm.playMusic(true, "엔젤비트/MySong");
			    break;
                        case 8: 
                            cm.playMusic(true, "엔젤비트/ShineDays");
			    break;
                        case 9: 
                            cm.playMusic(true, "엔젤비트/ThousandEnemies");
			    break;			   			
                        case 10: 
                            cm.playMusic(true, "엔젤비트/엔비op");
			    break;
                        case 11: 
                            cm.playMusic(true, "엔젤비트/최고의보물ori");
			    break;
                        case 12: 
                            cm.playMusic(true, "엔젤비트/최고의보물yui");
			    break;							   			
                    }
                    cm.dispose();
                }
                break;
	    case 42:
                if (status == 1) cm.sendSimple("뭐 켤꺼야?\r\n#b#L0# AliceMagic#l\r\n#L1# FirstKiss#l\r\n#L2# You#l\r\n#L3# 나친적ed#l\r\n#L4# 남고생op#l\r\n#L5# 네기마op#l\r\n#L6# 늑향ed#l\r\n#L7# 베토벤 바이러스#l\r\n#L8# 브툼op#l\r\n#L9# 블리치13op#l\r\n#L10# 빈보가미op#l\r\n#L11# 시달소ost#l\r\n#L12# 프리징op#l");
                else if (status == 2) {
                    switch (selection) {
                        case 0: 
                            cm.playMusic(true, "잡/AliceMagic");
			    break;   			
                        case 1: 
                            cm.playMusic(true, "잡/FirstKiss");
			    break;
                        case 2: 
                            cm.playMusic(true, "잡/You");
			    break;
                        case 3: 
                            cm.playMusic(true, "잡/나친적ed");
			    break;			   			
                        case 4: 
                            cm.playMusic(true, "잡/남고생op");
			    break;
                        case 5: 
                            cm.playMusic(true, "잡/네기마op");
			    break;
                        case 6: 
                            cm.playMusic(true, "잡/늑향ed");
			    break;			   			
                        case 7: 
                            cm.playMusic(true, "잡/베토벤");
			    break;
                        case 8: 
                            cm.playMusic(true, "잡/브툼op");
			    break;
                        case 9: 
                            cm.playMusic(true, "잡/블리치13op");
			    break;			   			
                        case 10: 
                            cm.playMusic(true, "잡/빈보가미op");
			    break;
                        case 11: 
                            cm.playMusic(true, "잡/시달소ost");
			    break;
                        case 12: 
                            cm.playMusic(true, "잡/프리징op");
			    break;							   			
                    }
                    cm.dispose();
                }
                break;
            case 43:
                if (status == 1) cm.sendSimple("뭐 켤꺼야?\r\n#b#L0# Heart Goes Boom!!#l\r\n#L1# Don't say 'lazy'#l\r\n#L2# Listen!#l\r\n#L3# NO,Thank You!#l\r\n#L4# 카제히쿠노#l\r\n#L5# 하나마루센세이션#l");
                else if (status == 2) {
                    switch (selection) {
                        case 0: 
                            cm.playMusic(true, "전파케이온아이들/Boom");
			    break;			   			
                        case 1: 
                            cm.playMusic(true, "전파케이온아이들/Lazy");
			    break;			  			
                        case 2: 
                            cm.playMusic(true, "전파케이온아이들/Listen");
			    break;			   
                        case 3:
                            cm.playMusic(true, "전파케이온아이들/Thank");
			    break;			   
			case 4: 
                            cm.playMusic(true, "전파케이온아이들/전파녀ed");
			    break;
			case 5:
                            cm.playMusic(true, "전파케이온아이들/코도모ed");
			    break;							   			
                    }
                    cm.dispose();
                }
                break;
            case 44:
                if (status == 1) cm.sendSimple("뭐 켤꺼야?\r\n#b#L0# 경단대가족#l\r\n#L1# 기쁨의 섬#l\r\n#L2# 사쿠라 사쿠라 아이타이요#l\r\n#L3# 시간을 새기는 노래#l\r\n#L4# 작은 손바닥#l");
                else if (status == 2) {
                    switch (selection) {
                        case 0: 
                            cm.playMusic(true, "클라나드/경단대가족");
			    break;			   			
                        case 1: 
                            cm.playMusic(true, "클라나드/기쁨의섬");
			    break;			  			
                        case 2: 
                            cm.playMusic(true, "클라나드/사쿠라");
			    break;			   
                        case 3:
                            cm.playMusic(true, "클라나드/시간을새기는노래");
			    break;			   
			case 4: 
                            cm.playMusic(true, "클라나드/작은손바닥");
			    break;
                    }
                    cm.dispose();
                }
                break;
            case 45:
                if (status == 1) cm.sendSimple("뭐 켤꺼야?\r\n#b#L0# Vanilla_Salt#l\r\n#L1# 아노하나op#l\r\n#L2# 아노하나ost(secret base)#l\r\n#L3# Orange#l\r\n#L4# Orange2#l\r\n#L5# 진격거ed#l\r\n#L6# 진격거op#l\r\n#L7# 진격거ost#l\r\n#L8# HolyNight#l");
                else if (status == 2) {
                    switch (selection) {
                        case 0: 
                            cm.playMusic(true, "토라도라진격거아노하나/바닐라소금");
			    break;			   			
                        case 1: 
                            cm.playMusic(true, "토라도라진격거아노하나/아노하나op");
			    break;			  			
                        case 2: 
                            cm.playMusic(true, "토라도라진격거아노하나/아노하나ost");
			    break;			   
                        case 3:
                            cm.playMusic(true, "토라도라진격거아노하나/오렌지1");
			    break;			   
			case 4: 
                            cm.playMusic(true, "토라도라진격거아노하나/오렌지2");
			    break;
			case 5:
                            cm.playMusic(true, "토라도라진격거아노하나/진격거ed");
			    break;
                        case 6:
                            cm.playMusic(true, "토라도라진격거아노하나/진격거op");
			    break;			   
			case 7: 
                            cm.playMusic(true, "토라도라진격거아노하나/진격거ost");
			    break;
			case 8:
                            cm.playMusic(true, "토라도라진격거아노하나/홀리나이트");
			    break;							   			
                    }
                    cm.dispose();
                }
                break;
            case 46:
                if (status == 1) cm.sendSimple("뭐 켤꺼야?\r\n#b#L0# 유카1#l\r\n#L1# 유카2#l\r\n#L2# 하야테1-2ed#l\r\n#L3# 하야테1-3ed#l\r\n#L4# 하야테3ed#l\r\n#L5# 하야테3op#l\r\n#L6# 하야테 극장판 ed#l\r\n#L7# Princess is me!#l\r\n#L8# 축하#l\r\n#L9# 히나기쿠#l");
                else if (status == 2) {
                    switch (selection) {
                        case 0:
                            cm.playMusic(true, "하야테/유카1");
                            cm.dispose();
                            break;
                        case 1:
                            cm.playMusic(true, "하야테/유카2");
                            cm.dispose();
                            break;
                        case 2:
                            cm.playMusic(true, "하야테/하야테1-2ed");
                            cm.dispose();
                            break;
                        case 3:
                            cm.playMusic(true, "하야테/하야테1-3ed");
                            cm.dispose();
                            break;
                        case 4:
                            cm.playMusic(true, "하야테/하야테3ed");
                            cm.dispose();
                            break;
                        case 5:
                            cm.playMusic(true, "하야테/하야테3op");
                            cm.dispose();
                            break;
                        case 6:
                            cm.playMusic(true, "하야테/하야테극장판ed");
                            cm.dispose();
                            break;
                        case 7:
                            cm.playMusic(true, "하야테/하야테이즈미");
                            cm.dispose();
                            break;
                        case 8:
                            cm.playMusic(true, "하야테/축하");
                            cm.dispose();
                            break;
                        case 9:
                            cm.sendSimple("히나 히나 히나 히나 히나 히나 히나!!\r\n#b#L0# Do my best!#l\r\n#L1# Honjitsu Mankai#l\r\n#L2# I miss you#l\r\n#L3# Power of flower#l\r\n#L4# Tensi#l");
                            break;
                    }
                } else if (status == 3) { 
                    switch (selection) {
                        case 0:
                            cm.playMusic(true, "하야테/히나기쿠/Do_my_best");
                            break;
                        case 1:
                            cm.playMusic(true, "하야테/히나기쿠/Honjitsu");
                            break;
                        case 2:
                            cm.playMusic(true, "하야테/히나기쿠/I_miss_you");
                            break;
                        case 3:
                            cm.playMusic(true, "하야테/히나기쿠/PowerOfFlower");
                            break;
                        case 4:
                            cm.playMusic(true, "하야테/히나기쿠/Tensi");
                            break;
                    }
                    cm.dispose();
                }

                break;
        }
    }
}