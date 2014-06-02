function Board() {
    this.choosing = false;
    this.choicesLeft = 3;
    this.black = "Black";
    this.white = "White";
    this.red = "Red";
    this.orange = "#FFDD00";
    this.possibleColors = [this.black, this.red, this.white, this.orange];
    this.colors = [[null, null, null, null], [null, null, null, null], [null, null, null, null], [null, null, null, null]];
    this.values = [[null, null, null, null], [null, null, null, null], [null, null, null, null], [null, null, null, null]];
    this.won = false;
    this.lost = false;
    this.score = 0;
    this.possibleAdditions = [2, 4]
    this.size = 4;
    this.moves = 0;
    this.addRandomTile();
    this.last = [null, null];
    this.animate = false;
};

Board.prototype.checkWon = function() {
    for (i = 0; i < this.colors.length; i++) {
        for (j = 0; j < this.colors[0].length; j++) {
            if (j != (this.colors[0].length-1) && j != (this.colors[0].length/2-1)) {
                if (this.colors[i][j] != this.colors[i][j+1]) {
                    return false;
                }
            }
            if (i != (this.colors.length-1) && i != (this.colors.length/2-1)) {
                if (this.colors[i][j] != this.colors[i+1][j]) {
                    return false;
                }
            }

        }
    }
    return true;
}

Board.prototype.checkLoss = function() {
    var noNulls = [[],[],[],[]];
  	for (k = 0; k < this.values.length; k++) {
  	  for (l = 0; l < this.values[k].length; l++) {
    		if (this.values[l][k] != null) {
    			noNulls[l][k] = this.values[l][k];
    		}
    		else {
    		  return false;
    		}
  	  }
  	}
    
    for (i = 0; i < noNulls.length; i++) {
        for (j = 0; j < noNulls[i].length; j++) {
            if (j != noNulls[i].length-1) {
                if (noNulls[i][j] == noNulls[i][j+1]) {
                    return false;
                }
            }
            if (i != noNulls.length-1) {
                if (noNulls[i][j] == noNulls[i+1][j]) {
                    return false;
                }
            }
        }
    }
    return true;
}

Board.prototype.addRandomTile = function() {
    var randomY = Math.floor(Math.random()*4);
    var randomX = Math.floor(Math.random()*4);
    while (this.values[randomY][randomX] != null) {
        randomY = Math.floor(Math.random()*4);
        randomX = Math.floor(Math.random()*4);
    }
    if (typeof(this.choice) === "undefined" || this.choice == null) {
      var randomColor = this.possibleColors[Math.floor(Math.random()*4)];
    }
    else {
      randomColor = this.choice;
    }
    var randomNumber = Math.floor(Math.random()*4);
    if (randomNumber < 3) {
        randomNumber = 0;
    }
    else {
        randomNumber = 1;
    }
    this.values[randomY][randomX] = this.possibleAdditions[randomNumber];
    this.colors[randomY][randomX] = randomColor;
    this.last = [randomY, randomX];
    this.choice = null;
}

Board.prototype.addColors = function(a, b) {
	if (a == b) {
		return a;
	}
	if (a == this.white) {
		return b;
	}
	if (b == this.white) {
		return a;
	}
	var cols = [a, b];
	cols.sort();
	console.log(cols);
	if (cols.oneEquals([this.black, this.orange])) {
		return this.red;
	}
	if (cols.oneEquals([this.black, this.red])) {
		return this.orange;
	}
	if (cols.oneEquals([this.orange, this.red])) {
		return this.black;
	}
	return this.white;

}

Board.prototype.shiftBoard = function(row, rowColors) {
	var noNulls = [];
	var noColorNulls = [];
	for (k = 0; k < row.length; k++) {
		if (row[k] != null) {
			noNulls[noNulls.length] = row[k];
			noColorNulls[noColorNulls.length] = rowColors[k];
		}
	}
	var finalRow = [];
	var colors = [];
	for (k = 0; k < noNulls.length; k++) {
		if (k != noNulls.length-1) {
			if (noNulls[k] == noNulls[k+1]) {
				finalRow[finalRow.length] = 2*noNulls[k];
				colors[colors.length] = this.addColors(noColorNulls[k], noColorNulls[k+1]);
				this.score += 2*noNulls[k];
				k++;
			}
			else {
				finalRow[finalRow.length] = noNulls[k];
				colors[colors.length] = noColorNulls[k];
			}
		}
		else {
		  finalRow[finalRow.length] = noNulls[k];
			colors[colors.length] = noColorNulls[k];
		}
	}
	
	var loopNum = row.length-finalRow.length;
	for (k = 0; k < loopNum; k++) {
		finalRow[finalRow.length] = null;
		colors[colors.length] = null;
	}
	return [finalRow, colors];
}

Board.prototype.move = function(key) {
      var currentValues = [];
      for (var i = 0; i < this.values.length; i++)
        currentValues[i] = this.values[i].slice();
      switch (key) {
          case "left":
          	for (i = 0; i < this.values.length; i++) {
        			var row = this.values[i];
        			var rowColors = this.colors[i];
       				packedRow = this.shiftBoard(row, rowColors);
       				row = packedRow[0];
       				rowColors = packedRow[1];
          		this.values[i] = row;
          		this.colors[i] = rowColors;
          	}
          	break;
          case "right":
          	for (i = 0; i < this.values.length; i++) {
        			var row = this.values[i];
        			var rowColors = this.colors[i];
        			row.reverse();
        			rowColors.reverse();
        			packedRow = this.shiftBoard(row, rowColors);
     				  row = packedRow[0];
     				  rowColors = packedRow[1];
        			row.reverse();
        			rowColors.reverse();
          		this.values[i] = row;
          		this.colors[i] = rowColors;
          	}
          	break;
          case "up":
          	for (i = 0; i < this.values[0].length; i++) {
        			var row = [];
        			var rowColors = [];
        			for (j = 0; j < this.values.length; j++) {
        				row[row.length] = this.values[j][i];
        				rowColors[rowColors.length] = this.colors[j][i];
        			}
        			packedRow = this.shiftBoard(row, rowColors);
     				  row = packedRow[0];
     				  rowColors = packedRow[1];
        			for (j = 0; j < this.values.length; j++) {
        				this.values[j][i] = row[j];
        				this.colors[j][i] = rowColors[j];
        			}
          	}
          	break;
          case "down":
            for (i = 0; i < this.values[0].length; i++) {
        			var row = [];
        			var rowColors = [];
        			for (j = 0; j < this.values.length; j++) {
        				row[row.length] = this.values[j][i];
        				rowColors[rowColors.length] = this.colors[j][i];
        			}
        			row.reverse();
        			rowColors.reverse();
        			packedRow = this.shiftBoard(row, rowColors);
       				row = packedRow[0];
       				rowColors = packedRow[1];
        			row.reverse();
        			rowColors.reverse();
        			for (j = 0; j < this.values.length; j++) {
        				this.values[j][i] = row[j];
        				this.colors[j][i] = rowColors[j];
        			}
          	}
          	break;
      }
      var bool = currentValues.equals(this.values);
      return !(bool);
}
Board.prototype.nextMove = function() {
  this.moves+=1;
  this.addRandomTile();
  this.won = this.checkWon();
  this.lost = this.checkLoss();
  if (this.lost == true) {
    alert("You lose.");
    
  }
  if (this.won == true) {
    alert("You win!");
    this.score+=1000000;
  }
}

Array.prototype.oneEquals = function (array) {
  for (i = 0; i < this.length; i++) {
    if (this[i] != array[i]) {
      return false;
    }
  }
  return true;
}

Array.prototype.equals = function (array) {
  for (i = 0; i < this.length; i++) {
    for (j = 0; j < this.length; j++) {
      if (this[i][j] != array[i][j]) {
        return false;
      }
    }
  }
  return true;
}



