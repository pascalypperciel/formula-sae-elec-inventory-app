namespace backend.Enums
{
    public enum ShoppingCartReasons
    {
        ReorderQuantity = 1,    // Item's Quantity is below its Reorder level
        Components = 2,         // Added by the Components module
        ManuallyAdded = 3,      // Manually added by user
    }
}
