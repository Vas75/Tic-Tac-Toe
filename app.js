//what are best practices for module pattern, mvc, organising of logic?
//needed to create board, and board state
const board = (function () {
  const boardArr = [];
  const boardRowIndexes = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  //returns string of board row vals
  const getRowVals = (ind1, ind2, ind3) => {
    return `${boardArr[ind1]}${boardArr[ind2]}${boardArr[ind3]}`;
  };

  //check for winning pattern on board
  const _checkForWin = () => {
    const rowMarks = boardRowIndexes.map((row) => getRowVals(...row));

    for (let i = 0; i < rowMarks.length; i++) {
      const marks = rowMarks[i];
      if (marks === "XXX") {
        control.declareWinner(player1.getName(), i);
      } else if (marks === "OOO") {
        control.declareWinner(player2.getName(), i);
      } else if (boardArr.length === 9 && !boardArr.includes(undefined)) {
        control.declareDraw();
      }
    }
    console.log(boardArr, boardArr.length, boardArr[1]);
  };

  //add mark to board at specified index
  const addToBoardArr = (index, isPlayer1Turn) => {
    const mark = isPlayer1Turn ? player1.getMark() : player2.getMark();

    if (!boardArr[index]) {
      boardArr[index] = mark;
      control.renderMarks(boardArr);
      _checkForWin();
    }
  };

  return { addToBoardArr };
})();

//needed for game control
const control = (function () {
  const _domBoard = document.querySelectorAll("#board-grid div");
  let _isPlayer1Turn = true;

  //render marks to appropriate spaces on board when boardArr changes
  const renderMarks = (boardArr) => {
    _domBoard.forEach((sqr, index) => {
      sqr.textContent = boardArr[index];
    });
  };

  const declareWinner = (name) => {
    console.log(name + " is the winner");
  };

  const declareDraw = () => {
    console.log("Games a draw");
  };

  //eventlisteners
  document.querySelector("#board-grid").addEventListener("click", (e) => {
    const el = e.target;
    if (el.classList.contains("board-box") && !el.textContent) {
      const index = el.dataset.index;
      board.addToBoardArr(index, _isPlayer1Turn);

      _isPlayer1Turn = _isPlayer1Turn ? false : true;
    }
  });
  return { renderMarks, declareWinner, declareDraw };
})();

//needed to build players
const playerFactory = (name, mark) => {
  let _playerName = name;

  let _playerScore = 0;

  const changeName = (newName) => {
    _playerName = newName;
  };

  const getName = () => {
    return _playerName;
  };

  const getMark = () => {
    return mark;
  };

  const addToScore = () => {
    _playerScore++;
  };

  const getScore = () => {
    return _playerScore;
  };

  return { changeName, getName, addToScore, getScore, getMark };
};

const player1 = playerFactory("X", "X");
const player2 = playerFactory("O", "O");

//the functs have the closure, need to pass values into functs with closure, and can assign to vars in the
//closure.
