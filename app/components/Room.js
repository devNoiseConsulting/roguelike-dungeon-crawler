class Room {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.minSize = 6;
    this.leftChild = null;
    this.rightChild = null;
  }

  split() {
    if (this.leftChild === null && this.rightChild === null) {
      if ((this.width > (this.minSize * 2)) || (this.height > (this.minSize * 2))) {
        let leftX, leftY;
        let rightX, rightY;
        let leftWidth, leftHeight;
        let rightWidth, rightHeight;
        let splitSize;

        // The split should always be bigger than the minSize.
        // The split should be between 1/4 and 3/4 of the original size.
        if (this.width > this.height) {
          splitSize = Math.floor((this.width / 4) + (Math.random() * this.width / 2));
          leftX = this.x;
          leftY = this.y;

          rightX = this.x + splitSize;
          rightY = this.y;

          leftWidth = splitSize;
          leftHeight = this.height;

          rightWidth = this.width - splitSize;
          rightHeight = this.height;
        } else {
          splitSize = Math.floor((this.height / 4) + (Math.random() * this.height / 2));
          leftX = this.x;
          leftY = this.y;

          rightX = this.x;
          rightY = this.y + splitSize;

          leftWidth = this.width;
          leftHeight = splitSize;

          rightWidth = this.width;
          rightHeight = this.height - splitSize;
        }

        // create the rooms
        this.leftChild = new Room(leftX, leftY, leftWidth, leftHeight);
        this.rightChild = new Room(rightX, rightY, rightWidth, rightHeight);

        this.leftChild.split();
        this.rightChild.split();
      }
    }
  }
}

let dungeon = new Room(0, 0, 51, 51);
dungeon.split();
console.log(dungeon);
dungeon.split();
console.log(dungeon);
