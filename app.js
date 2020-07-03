//what are best practices for module pattern, mvc, organising of logic?
//needed to create board, and board state
const board = (function () {
  const boardArr = ["", "", "", "", "", "", "", "", ""];

  //add mark to board at specified index
  const addToBoardArr = (index, isPlayer1Turn) => {
    const mark = isPlayer1Turn ? player1.mark : player2.mark;

    if (!boardArr[index]) {
      boardArr[index] = mark;
      control.renderMarks(boardArr);
      checkForWin(boardArr);
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

  //eventlisteners
  document.querySelector("#board-grid").addEventListener("click", (e) => {
    const el = e.target;
    if (el.classList.contains("board-box") && !el.textContent) {
      const index = el.dataset.index;
      board.addToBoardArr(index, _isPlayer1Turn);

      _isPlayer1Turn = _isPlayer1Turn ? false : true;
    }
  });
  return { renderMarks };
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

  const addToScore = () => {
    _playerScore++;
  };

  const getScore = () => {
    return _playerScore;
  };

  return { changeName, getName, addToScore, getScore, mark };
};

const player1 = playerFactory("X", "X");
const player2 = playerFactory("O", "O");

//the functs have the closure, need to pass values into functs with closure, and can assign to vars in the
//closure.
