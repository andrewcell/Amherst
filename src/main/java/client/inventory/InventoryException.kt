package client.inventory

class InventoryException : RuntimeException {
    val serialVersionUID: Long = 1L

    constructor() : super()
    constructor(msg: String) : super(msg)
}