//obiekt randomizer któy odpowiada za mieszanie kafli
var Randomizer = function(tilesNumber) {
  //liczba unikatowych liter
  this.lettersNumber = tilesNumber / 2;
  //tablica która przechowuje wszystkie litery
  this.letters = [];
  //dla każdej unikatowej litery, dodaj dwie litery do tablicy
  for (var i = 0; i < this.lettersNumber; i++) {
    this.letters.push(String.fromCharCode(65 + i));
    this.letters.push(String.fromCharCode(65 + i));
  }
  //Funkcja która miesza litery w tablicy
  this.shuffleLetters = function() {
    var lettersToShuffle = this.letters.slice();
    var lettersSchuffled = [];
    var random,
        letter;
    for (var i = 0; i < this.letters.length; i++) {
      random = Math.floor(Math.random() * lettersToShuffle.length);
      letter = lettersToShuffle[random];
      lettersSchuffled.push(letter);
      lettersToShuffle.splice(random,1);
    }
    return lettersSchuffled;
  }
  this.shuffled = this.shuffleLetters();
}
 
//obiekt kafla który odpowiada za zachowanie się kafli
var Tile = function(back) {
  //litera która będzie znajdować się na odwrocie kafla
  this.back = back;
  this.front = '?';
  //właściwość definiująca czy kafel jest już poza grą
  this.guessed = false;
  //referencja do kafla w DOM
  this.element =  document.createElement('div');
  //Funkcja która dodaje kafel do DOM
  this.makeTile = function() {
    this.element.className = 'tile';
    this.element.textContent = this.front;
    return this.element;
  }
  var that = this;
  //Funkcja odwracająca kafel
  this.flipCard = function() {
    if (!(this.textContent === that.back)) {
      this.textContent = that.back;
    } else {
      return false;
    }
  }
  //Event po kliknięciu
  this.element.addEventListener('click', this.flipCard);
  //Zmiana wyglądu i właściwości kafla po odgadnięciu pary kafli
  this.changeGuessed = function() {
    this.guessed = true;
    this.element.style.opacity = '0.5';
    this.element.style.cursor = 'initial';
    this.element.addEventListener('click', function(e) {
      e.stopPropagation();
      return false;
    });
  }
  //Funkcja, która zostaje wywołana jeśli para kafli nie jest identyczna
  this.resetTile = function() {
    this.element.textContent = '?';
  }
}
 
//obiekt planszy który odpowiada za przechowywanie i wyświetlanie kafli
var Board = {
  tilesNumber: 16,
  tiles: [],
  currentTiles: [],
  letters: new Randomizer(16),
  element: document.createElement('div'),
  makeTiles: function() {
    for (var i = 0; i < this.tilesNumber; i++) {
      this.tiles.push(new Tile(this.letters.shuffled[i]));
    }
  },
  drawTiles: function() {
    this.element.className = 'board';
    for (var i = 0; i < this.tiles.length; i++) {
      this.element.appendChild(this.tiles[i].makeTile());
    }
    document.body.appendChild(this.element);
  },
  isTwoTilesVisible: false,
  handleClick: function(e) {
    e.preventDefault();
    var allTiles = this.element.children;
    var currTile = this.tiles[Array.prototype.indexOf.call(allTiles,e.target)];
    if (currTile.guessed) {
      return false;
    }
    if (this.isTwoTilesVisible) {
      e.stopPropagation();
      return false;
    }
    if (this.currentTiles.length === 1 && currTile.element === this.currentTiles[0].element) {
      return false;
    }
    this.currentTiles.push(currTile);
   
    if (this.currentTiles.length === 2) {
      if (this.currentTiles[0].back === this.currentTiles[1].back) {
        this.currentTiles[0].changeGuessed();
        this.currentTiles[1].changeGuessed();
        this.currentTiles = [];
      } else {
        var that = this;
        this.isTwoTilesVisible = true;
        setTimeout(function() {
          that.currentTiles[0].resetTile();
          that.currentTiles[1].resetTile();
          that.currentTiles = [];
          that.isTwoTilesVisible = false;
        },1000);
      }
    }
  }
}
 
Board.makeTiles();
Board.drawTiles();
Board.element.addEventListener('click',function(e) {
  Board.handleClick(e);
},true);