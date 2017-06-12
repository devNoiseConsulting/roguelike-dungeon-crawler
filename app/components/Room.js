class Room {
  constructor(x, y, width, height, doorX = null, doorY = null) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.door = {
      x: doorX,
      y: doorY
    };
    this.minSize = 6;
    this.leftChild = null;
    this.rightChild = null;
  }

  split() {
    if (this.leftChild === null && this.rightChild === null) {
      if ((this.width > (this.minSize * 2)) && (this.height > (this.minSize * 2))) {
        let leftX = this.x;
        let leftY = this.y;
        let rightX;
        let rightY;
        let doorX;
        let doorY;
        let leftWidth;
        let leftHeight;
        let rightWidth;
        let rightHeight;
        let splitSize;

        // The split should always be bigger than the minSize.
        // The split should be between 1/4 and 3/4 of the original size.
        if (this.width > this.height) {
          splitSize = Math.floor((this.width / 4) + (Math.random() * this.width / 2));

          rightX = this.x + splitSize;
          rightY = this.y;

          doorX = rightX;
          doorY = rightY + 3;

          leftWidth = splitSize;
          leftHeight = this.height;

          rightWidth = this.width - splitSize;
          rightHeight = this.height;
        } else {
          splitSize = Math.floor((this.height / 4) + (Math.random() * this.height / 2));

          rightX = this.x;
          rightY = this.y + splitSize;

          doorX = rightX + 3;
          doorY = rightY;

          leftWidth = this.width;
          leftHeight = splitSize;

          rightWidth = this.width;
          rightHeight = this.height - splitSize;
        }

        // create the rooms
        this.leftChild = new Room(leftX, leftY, leftWidth, leftHeight, doorX, doorY);
        this.rightChild = new Room(rightX, rightY, rightWidth, rightHeight, doorX, doorY);

        this.leftChild.split();
        this.rightChild.split();
      }
    }
  }

  traverse() {
    let nodeArray = new Array();
    nodeArray.push(this);
    if (this.leftChild !== null) {
      nodeArray = nodeArray.concat(this.leftChild.traverse());
    }
    if (this.rightChild !== null) {
      nodeArray = nodeArray.concat(this.rightChild.traverse());
    }
    return nodeArray;
  }

  // Mostly for visual dubugging;
  svg() {
    let dungeonRooms = this.traverse();

    dungeonRooms = dungeonRooms.map(room => `<rect x="${room.x}" y="${room.y}" width="${room.width}" height="${room.height}" stroke="black" stroke-width="2" fill="none"/>`);

    dungeonRooms.unshift('<rect x="-10" y="-10" width="100" height="100" stroke="blue" stroke-width="2" fill="none"/>');
    dungeonRooms.unshift('<svg width="250" height="250" viewBox="-10 -10 100 100" xmlns="http://www.w3.org/2000/svg">');
    dungeonRooms.push('<rect x="0" y="0" width="51" height="51" stroke="blue" stroke-width="2" fill="none"/>');
    dungeonRooms.push('</svg>');

    return dungeonRooms.join('\n');
  }
}

// Debug/testing code
/*
let dungeonRoom = new Room(0, 0, 50, 50);
dungeonRoom.split();
let svg = dungeonRoom.svg();
console.log(svg);
*/

module.exports = Room;
