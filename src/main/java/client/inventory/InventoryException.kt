package client.inventory

class InventoryException : RuntimeException {
    /** Creates a new instance of InventoryException  */
    constructor() : super() {}

    constructor(msg: String?) : super(msg) {}

    companion object {
        private const val serialVersionUID = 1L
    }
}