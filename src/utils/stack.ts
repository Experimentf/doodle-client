/**
 * STACK THAT KEEPS POPPED ITEMS IN MEMORY
 */
class Stack<T> {
  private container: Array<T> = [];
  private _top = -1;

  get top() {
    return this.container[this._top];
  }

  get size() {
    return this._top + 1;
  }

  push(item: T) {
    this._top = this._top + 1;
    if (this._top === this.container.length) this.container.push(item);
    else this.container[this._top] = item;
    if (!this.isActualTop())
      this.container = this.container.slice(0, this._top + 1);
  }

  pop() {
    if (this._top === -1) return;
    this._top = this._top - 1;
  }

  unpop() {
    if (!this.isActualTop()) this._top = this._top + 1;
  }

  isEmpty() {
    return this.size === 0;
  }

  toArray() {
    return this.container.slice(0, this._top + 1);
  }

  private isActualTop() {
    return this.container.length === this._top + 1;
  }
}

export default Stack;
