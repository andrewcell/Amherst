var status = -1;
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
    if (status == 0) {
        cm.sendSimple("I'm DJ빌리\r\n#b#L0# Bgm00#l\r\n#L1# Bgm01#l\r\n#L2# Bgm02#l\r\n#L3# Bgm03#l\r\n#L4# Bgm04#l\r\n#L5# Bgm05#l\r\n#L6# Bgm06#l\r\n#L7# Bgm07#l\r\n#L8# Bgm08#l\r\n#L9# Bgm09#l\r\n#L10# Bgm10#l\r\n#L11# Bgm11#l\r\n#L12# Bgm12#l\r\n#L13# Bgm13#l\r\n#L14# Bgm14#l\r\n#L15# Bgm15#l\r\n#L16# Bgm16#l\r\n#L17# Bgm17#l\r\n#L18# Bgm18#l\r\n#L19# BgmCN#l\r\n#L20# BgmEvent#l\r\n#L21# BgmGL#l\r\n#L22# BgmJp#l\r\n#L23# BgmTH#l\r\n#L24# BgmTW#l\r\n#L25# 한글#l\r\n#L26# ef길티모노가타리#l\r\n#L27# kiss이로하팝#l\r\n#L28# Maple#l\r\n#L29# supercell#l\r\n#L30# yui#l\r\n#L31# 달동네#l\r\n#L32# 달빛천사#l\r\n#L33# 동방#l\r\n#L34# 디지몬#l\r\n#L35# 럭키하루히학생회일상#l\r\n#L36# 몬무스#l\r\n#L37# 보컬오프#l\r\n#L38# 신만세#l\r\n#L39# 약#l\r\n#L40# 어과초어마금#l\r\n#L41# 엔젤비트#l\r\n#L42# 잡#l\r\n#L43# 전파케이온아이들#l\r\n#L44# 클라나드#l\r\n#L45# 토라도라진격거아노하나#l\r\n#L46# 하야테#l");
    } else if (status >= 1) {
        switch (selection) {
            case 0:
                {
                    if (status == 1) {
                        cm.sendSimple("뭐 켤꺼야?\r\n#b#L0# FloraLife#l\r\n#L1# GoPicnic#l\r\n#L2# Nightmare#l\r\n#L3# RestNPeace#l\r\n#L4# SleepyWood#l");
                    } else if (status == 2) {
                        if (selection == 0)
                            cm.playMusic(true, "Bgm00/FloraLife");
                        else if (selection == 1)
                            cm.playMusic(true, "Bgm00/GoPicnic");
                        else if (selection == 2)
                            cm.playMusic(true, "Bgm00/Nightmare");
                        else if (selection == 3)
                            cm.playMusic(true, "Bgm00/RestNPeace");
                        else if (selection == 4)
                            cm.playMusic(true, "Bgm00/SleepyWood");
                        cm.dispose();
                    }
                    break;
                }
            case 1:
                {
                    cm.sendSimple("뭐 켤꺼야?\r\n#b#L0# AncientMore#l\r\n#L1# BadGuys#l\r\n#L2# CavaBien#l\r\n#L3# HighlandStar#l\r\n#L4# MoonlightShadow#l\r\n#L5# WhereTheBarlogFrom#l");
                    break;
                }
            case 2:
                {
                    cm.sendSimple("뭐 켤꺼야?\r\n#b#L0# AboveTheTreetops#l\r\n#L1# EvilEyes#l\r\n#L2# JungleBook#l\r\n#L3# MissingYou#l\r\n#L4# WhenTheMorningComes#l");
                    break;
                }
            case 3:
                {
                    cm.sendSimple("뭐 켤꺼야?\r\n#b#L0# Beachway#l\r\n#L1# BlueSky#l\r\n#L2# Elfwood#l\r\n#L3# SnowyBillage#l\r\n#L4# Subway#l");
                    break;
                }
            case 4:
                {
                    cm.sendSimple("뭐 켤꺼야?\r\n#b#L0# ArabPirate#l\r\n#L1# PlayWithMe#l\r\n#L2# Shinin'Harbor#l\r\n#L3# UponTheSky#l\r\n#L4# WarmRegard#l\r\n#L5# WhiteChristmas#l");
                    break;
                }
            case 5:
                {
                    cm.sendSimple("뭐 켤꺼야?\r\n#b#L0# AbandonedMine#l\r\n#L1# DownToTheCave#l\r\n#L2# HellGate#l\r\n#L3# MineQuest#l\r\n#L4# WolfWood#l");
                    break;
                }
            case 6:
                {
                    cm.sendSimple("뭐 켤꺼야?\r\n#b#L0# ComeWithMe#l\r\n#L1# FantasticThinking#l\r\n#L2# FinalFight#l\r\n#L3# FlyingABlueDream#l\r\n#L4# WelcomeToTheHell#l");
                    break;
                }
            case 7:
                {
                    cm.sendSimple("뭐 켤꺼야?\r\n#b#L0# Fantasia#l\r\n#L1# FunnyTimeMaker#l\r\n#L2# HighEnough#l\r\n#L3# WaltzForWork#l\r\n#L4# WhereverYouAre#l");
                    break;
                }
            case 8:
                {
                    cm.sendSimple("뭐 켤꺼야?\r\n#b#L0# FindingForest#l\r\n#L1# ForTheGlory#l\r\n#L2# LetsHuntAliens#l\r\n#L3# LetsMarch#l\r\n#L4# PlotOfPixie#l");
                    break;
                }
            case 9:
                {
                    cm.sendSimple("뭐 켤꺼야?\r\n#b#L0# DarkShadow#l\r\n#L1# FairyTale#l\r\n#L2# FairyTalediffvers#l\r\n#L3# TheyMenacingYou#l\r\n#L4# TimeAttack#l");
                    break;
                }
            case 10:
                {
                    cm.sendSimple("뭐 켤꺼야?\r\n#b#L0# BizarreTales#l\r\n#L1# Eregos#l\r\n#L2# TheWayGrotesque#l\r\n#L3# Timeless#l\r\n#L4# TimelessB#l");
                    break;
                }
            case 11:
                {
                    cm.sendSimple("뭐 켤꺼야?\r\n#b#L0# Aquarium#l\r\n#L1# BlueWorld#l\r\n#L2# DarkMountain#l\r\n#L3# DownTown#l\r\n#L4# ShiningSea#l");
                    break;
                }
            case 12:
                {
                    cm.sendSimple("뭐 켤꺼야?\r\n#b#L0# AncientRemain#l\r\n#L1# AquaCave#l\r\n#L2# DeepSee#l\r\n#L3# Dispute#l\r\n#L4# RuinCastle#l\r\n#L5# WaterWay#l");
                    break;
                }
            case 13:
                {
                    cm.sendSimple("뭐 켤꺼야?\r\n#b#L0# AncientForest#l\r\n#L1# CokeTown#l\r\n#L2# FightSand#l\r\n#L3# Leafre#l\r\n#L4# Minar'sDream#l\r\n#L5# TowerOfGoddess#l");
                    break;
                }
            case 14:
                {
                    cm.sendSimple("뭐 켤꺼야?\r\n#b#L0# Ariant#l\r\n#L1# CaveOfHontale#l\r\n#L2# DragonLoad#l\r\n#L3# DragonNest#l\r\n#L4# HonTale#l\r\n#L5# HotDesert#l");
                    break;
                }
            case 15:
                {
                    cm.sendSimple("뭐 켤꺼야?\r\n#b#L0# ElinForest#l\r\n#L1# inNautilus#l\r\n#L2# MureungForest#l\r\n#L3# Nautilus#l\r\n#L4# Pirate#l\r\n#L5# PoisonForest#l\r\n#L6# SunsetDesert#l\r\n#L7# WhiteHerb#l");
                    break;
                }
            case 16:
                {
                    cm.sendSimple("뭐 켤꺼야?\r\n#b#L0# Duskofgod#l\r\n#L1# FightingPinkBeen#l\r\n#L2# Forgetfulness#l\r\n#L3# Remembrance#l\r\n#L4# Repentance#l\r\n#L5# TimeTemplem#l");
                    break;
                }
            case 17:
                {
                    cm.sendSimple("뭐 켤꺼야?\r\n#b#L0# MureungSchool1#l\r\n#L1# MureungSchool2#l\r\n#L2# MureungSchool3#l\r\n#L3# MureungSchool4#l");
                    break;
                }
            case 18:
                {
                    cm.sendSimple("뭐 켤꺼야?\r\n#b#L0# BlackWing#l\r\n#L1# DrillHall#l\r\n#L2# GueensGarden#l\r\n#L3# RaindropFlower#l");
                    break;
                }
            case 19:
                {
                    cm.sendSimple("뭐 켤꺼야?\r\n#b#L0# GoShanghai#l\r\n#L1# ShanghaiField#l");
                    break;
                }
            case 20:
                {
                    cm.sendSimple("뭐 켤꺼야?\r\n#b#L0# FunnyRabbit#l\r\n#L1# FunnyRabbitFaster#l\r\n#L2# wedding#l\r\n#L3# weddingDance#l");
                    break;
                }
            case 21:
                {
                    cm.sendSimple("뭐 켤꺼야?\r\n#b#L0# amoria#l\r\n#L1# Amorianchallenge#l\r\n#L2# cathedral#l\r\n#L3# chapel#l\r\n#L4# HauntedHouse#l");
                    break;
                }
            case 22:
                {
                    cm.sendSimple("뭐 켤꺼야?\r\n#b#L0# Bathroom#l\r\n#L1# BattleField#l\r\n#L2# BizarreForest#l\r\n#L3# Feeling#l\r\n#L4# FirstStepMaster#l\r\n#L5# Hana#l\r\n#L6# Yume#l");
                    break;
                }
            case 23:
                {
                    cm.sendSimple("뭐 켤꺼야?\r\n#b#L0# ThaiField#l\r\n#L1# ThaiTown#l");
                    break;
                }
            case 24:
                {
                    cm.sendSimple("뭐 켤꺼야?\r\n#b#L0# NightField#l\r\n#L1# NightMarket#l\r\n#L2# YoTaipei#l");
                    break;
                }
            case 25:
                {
                    cm.sendSimple("뭐 켤꺼야?\r\n#b#L0# 1분1초#l\r\n#L1# Blue#l\r\n#L2# MyLove#l\r\n#L3# RPG1#l\r\n#L4# RPG2#l\r\n#L5# 곰세마리#l\r\n#L6# 구구단송#l\r\n#L7# 그체#l\r\n#L8# 나는나비#l\r\n#L9# 메칸더#l\r\n#L10# 바람의너를#l\r\n#L11# 벚꽃엔딩#l\r\n#L12# 별똥별#l\r\n#L13# 빠빠빠#l\r\n#L14# 새나라새주인#l\r\n#L15# 섬집아기#l\r\n#L16# 세일러문#l\r\n#L17# 슈퍼스타#l\r\n#L18# 아빠의얼굴#l\r\n#L19# 애국가1#l\r\n#L20# 애국가2#l\r\n#L21# 어머니은혜#l\r\n#L22# 여래아#l\r\n#L23# 작은별#l\r\n#L24# 조각나비#l\r\n#L25# 질풍가도#l\r\n#L26# 천사소녀네티#l\r\n#L27# 체리#l\r\n#L28# 포켓몬#l\r\n#L29# 혼자가아닌나#l");
                    break;
                }
            case 26:
                {
                    cm.sendSimple("뭐 켤꺼야?\r\n#b#L0# Departures#l\r\n#L1# ef1#l\r\n#L2# ef2#l\r\n#L3# ReleaseMySoul#l\r\n#L4# 고백#l\r\n#L5# 백금디스코#l\r\n#L6# 세노#l\r\n#L7# 영원한유죄#l\r\n#L8# 출발#l");
                    break;
                }
            case 27:
                {
                    cm.sendSimple("뭐 켤꺼야?\r\n#b#L0# Departures#l\r\n#L1# ef1#l\r\n#L2# ef2#l\r\n#L3# ReleaseMySoul#l\r\n#L4# 고백#l\r\n#L5# 백금디스코#l\r\n#L6# 세노#l\r\n#L7# 영원한유죄#l\r\n#L8# 출발#l");
                    break;
                }
        }
    }
}