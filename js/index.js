$(function(event) {
  // Set up Outer Scoped Variables to be manipulated by the functions
  // ****************************************************************

  // Rows and columns count
  var dimension = 0;

  var state = {blank:"0", x:"X", o:"O"};
  var playersTurn = true;

  var board = [];
  var moveCount = 0;

  //event listener for get dimentios button
  $("#submit").off().on("click", getDimension);

  //Define functions below
  //**********************

  function getDimension(event) {
    dimension = parseInt($("#dimention").val());

    //initialise board.
    setupBoard(dimension);
  };

  //Fill out 2 dimensional board array
  function setupBoard(dimension) {
    var rowDiv ="", colDiv ="", gridAdd ="";
    var colClass="", rowClass="";

    for (var row = 0; row < dimension; row++) {
      board[row] = [];
      rowClass = "row"+row;
      rowDiv = '<div class="row '+rowClass+'">'
      for (var column = 0; column < dimension; column++) {
        board[row][column] = state.blank;
        colClass = "col"+column;
        colDiv = '<div class="'+colClass+' '+rowClass+' innerSquare col-xs-1">.</div>'
        rowDiv += colDiv
      }
      rowDiv += '</div>';
      gridAdd += rowDiv;
    }
    //build HTML grid
    $(".grid").html(gridAdd);

    //set centering offset
    $(".grid").removeClass("col-xs-offset-4")
    var offset = parseInt( (dimension < 12)? ((12-dimension)/2) : 0 )
    if(offset > 0)
      $(".grid").addClass("col-xs-offset-"+offset);

    //add an Event listener to each innerSquare class
    $(".innerSquare").off().on("click", processMove);
  };

  //check end conditions functions
  function checkColumnWin(dimension, columnIndex, newState) {
    //Check for a win in current Column
    for(var i = 0; i < dimension; i++){
        if(board[columnIndex][i] != newState)
            break;
        if(i == dimension-1){
            //report win for squareState
            console.log("win for: " + newState);
            return "win for: " + newState;
        }
    }
    // No win yet
    return "";
  }

  function checkRowWin(dimension, rowIndex, newState) {
    //Check for a win in current Row
    for(var i = 0; i < dimension; i++){
        if(board[i][rowIndex] != newState)
            break;
        if(i == dimension-1){
            //report win for squareState
            console.log("win for: " + newState);
            return "win for: " + newState;
        }
    }
    // No win yet
    return "";
  }

  function checkDiagonalWin(dimension, columnIndex, rowIndex, newState) {
    //Check for a win on the diagonal
    if(columnIndex == rowIndex){
        //we're on a diagonal
        for(var i = 0; i < dimension; i++){
            if(board[i][i] != newState)
                break;
            if(i == dimension-1){
                //report win for newState
                console.log("win for: " + newState);
                return "win for: " + newState;
            }
        }
    }
    // No win yet
    return "";
  }

  function checkAntiDiagonalWin(dimension, columnIndex, rowIndex, newState) {
    //Check for a win on the anti-diagonal
    if(columnIndex + rowIndex == dimension - 1){
        for(var i = 0; i < dimension; i++){
            if(board[i][(dimension-1)-i] != newState)
                break;
            if(i == dimension-1){
                //report win for newState
                console.log("win for: " + newState);
                return "win for: " + newState;
            }
        }
    }
    // No win yet
    return "";
  }

  function checkForDraw(dimension, moveCount) {
    //Check for a draw
    if(moveCount == (Math.pow(dimension, 2) - 1)){
        //report draw
        console.log("This round was a draw");
        return "This round was a draw";
    }
    // No draw yet continue game.
    return "";
  }

  function checkForWin(columnIndex, rowIndex, newState) {
    moveCount++;
    var result = "";
    //check end conditions

    //check current Column for a win
    result = checkColumnWin(dimension, columnIndex, newState);
    if (result != "") {
        //A win has occured
        return result;
    }

    //check current Row for a win
    result = checkRowWin(dimension, rowIndex, newState);
    if (result != "") {
        //A win has occured
        return result;
    }

    //check Diagonal for a win
    result = checkDiagonalWin(dimension, columnIndex, rowIndex, newState);
    if (result != "") {
        //A win has occured
        return result;
    }

    //check anti diagonal for a win
    result = checkAntiDiagonalWin(dimension, columnIndex, rowIndex, newState);
    if (result != "") {
        //A win has occured
        return result;
    }


    //check if game has reached a draw
    result = checkForDraw(dimension, moveCount);
    if (result != "") {
        //A draw has occured
        return result;
    }

    //No win or draw yet continue game.
    return result;
  };

  //Handle turns, get grid references, set grid state and check For A Win
  function processMove(event) {
    var moveColumn = -1;
    var moveRow = -1;
    var newState = state.blank;

    if(playersTurn == true )
    {
      newState = state.x;
    }
    else {
      newState = state.o;
    }
    playersTurn = !playersTurn

    var square = event.currentTarget;

    var columnString;
    var rowString;
    for (var i = 0; i < dimension; i++) {
      columnString = "col"+i.toString();
      if (square.classList[0] == columnString) {
          moveColumn = i;
      }

      rowString = "row"+i.toString();
      if (square.classList[1] == rowString) {
          moveRow = i;
      }

      if (moveColumn != -1 && moveRow != -1)
        break;
    }

    //Only record move if its for an empty square
    if(board[moveColumn][moveRow] == state.blank){
        var result="";
        board[moveColumn][moveRow] = newState;
        //set display for square to X or O
        square.innerText = newState; //firstElementChild.

        result = checkForWin(moveColumn, moveRow, newState);
        if (result != "")
          alert(result);
    }

  };

});
