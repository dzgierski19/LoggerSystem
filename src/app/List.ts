export class ItemList<T, U> {
  list: Map<T, U> = new Map();
  addItem(itemId: T, item: U) {
    this.list.set(itemId, item);
  }
  deleteItem(itemId: T) {
    this.isItemAvailable(itemId);
    this.list.get(itemId);
  }

  isItemAvailable(itemId: T) {
    if (!this.list.has(itemId)) {
      throw new Error("Item not found");
    }
  }
}
