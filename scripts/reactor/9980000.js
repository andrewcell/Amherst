function act() {
    rm.dispelAllMonsters(parseInt(rm.getReactor().getName().substring(1,2)));
    rm.getMap().destroyReactor(rm.getReactor().getObjectId());
}