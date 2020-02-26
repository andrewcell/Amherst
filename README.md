# Amherst
Original KMS 1.2.65 Server (pack) project. 
## Focus on
This project focus on just how we play KMS in 2008. No custom scripts, No commercial purpose, just back to good old times.
## Base
This pack based on OdinMS, but modified by commercial private KMS servers. We need to remove *money* things first.
## Requirements
 - Windows as Operating System (For Linux, Hold on.) 
 - JDK 11 or later (Maybe work on 8. But I using 11.)
 - Gorgeous Java IDE
 - MySQL Server
 - Of course, KMS v1.2.65 Client
## Build it
### Jetbrains Intellij
1. Open Project whole folder.
2. If appear import dependencies message, click import.
3. Ctrl + Shift + S, go to Artifacts using Left Pane.
4. Click +, JAR, Import modules with dependencies,
5. Click Ok, Change Output directory to /dist.
6. Click OK to close window. and find Build Artifacts, Action -> Build.
7. In dist folder, You can check out Amherst.jar file.
8. Now you can turn to Use it part. 
## Use it
1. Clone repository, or download ZIP and extract.
2. Open amherst.properties, edit values for your situation.
3. Start Start.cmd.
## Trivia
### What is .kt file?
This is Kotlin source file. Working with Java, Much less code than Java. I'm converting java files to kotlin. [Click here](https://kotlinlang.org) to learn about Kotlin. 
### Contribute?
Feel free to open issue, pull request. You know, it is Open-Source. Just do not use it for MONEY. It is for experiment and experience.
### Where is library files?
This project using Maven. So all dependencies(libraries) managed by Maven. If you build correctly, all library classes will be in JAR file.
### Talk about v1.2.65
It has almost all Ossyria fields like Orbis, Ariant, Ludibrium.. Also support World Map. But do not have Cygnus Knights, Ereve. (Related data already in 1.2.65 and officially patched right after 65.). In 65, Added Family system as new feature.
### License
Amherst under AGPL v3. Why? because original OdinMS was AGPL v3. I think it is very important to keep license policy at least at Open-Source.
