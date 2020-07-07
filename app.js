//what are best practices for module pattern, mvc, organising of logic?
//needed to create board, and board state
const board = (function () {
  //could i have made an array of element references to work with instead?
  let boardArr = [];

  //if any set of below indexes(on boardArr) have 3 of same char, a player has won.
  const winRowIndexes = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  //returns string of board row marks or undefined
  const getRowMarks = (ind1, ind2, ind3) =>
    `${boardArr[ind1]}${boardArr[ind2]}${boardArr[ind3]}`;

  //check for winning pattern on board
  const _checkForWinOrDraw = () => {
    const winVals = winRowIndexes
      .map((row) => getRowMarks(...row))
      .reduce((result, rowMarks, idx) => {
        return (result =
          rowMarks === "XXX"
            ? [player1.getName(), [...winRowIndexes[idx]]] //indexes used to select 3 win board elems in dom
            : rowMarks === "OOO"
            ? [player2.getName(), [...winRowIndexes[idx]]]
            : result);
      }, []);

    if (winVals[0]) {
      control.showWinner(...winVals);
      return;
    }

    if (boardArr.length === 9 && !boardArr.includes(undefined)) {
      control.declareDraw();
    }
  };

  //add mark to board at specified index, player1Turn true, add X, else O.
  const addToBoardArr = (index, isPlayer1Turn) => {
    const mark = isPlayer1Turn ? player1.getMark() : player2.getMark();

    if (!boardArr[index]) {
      boardArr[index] = mark;
      control.renderMarks(boardArr);
      _checkForWinOrDraw();
    }
  };

  const getBoardArrCopy = () => {
    return [...boardArr];
  };

  const clearBoardArr = () => {
    boardArr = [];
  };

  return { addToBoardArr, clearBoardArr, getBoardArrCopy };
})();

//handles AI logic///
const AI = (function () {
  //return an index an the mark(O), index cant beselected already,call for copy of the array?
  const getAIPick = (boardArrCopy) => {
    return boardArrCopy;
  };
  return { getAIPick };
})();

//needed for game control/////
const control = (function () {
  const boardGrid = document.querySelector("#board-grid");
  const _domBoard = document.querySelectorAll("#board-grid div");
  const mssgDisplay = document.querySelector("#display");
  const play = document.querySelector("#play");
  const reset = document.querySelector("#reset");
  const aiBtn = document.querySelector("#toggle-AI");
  const p1NameInp = document.querySelector("#change-name-p1");
  const p2NameInp = document.querySelector("#change-name-p2");
  const p1NameDiv = document.querySelector("#playerXName");
  const p2NameDiv = document.querySelector("#playerOName");
  const p1Score = document.querySelector("#playerXScore");
  const p2Score = document.querySelector("#playerOScore");

  let _isPlayer1Turn = true;
  let _vsComp = false;

  //render marks to appropriate spaces on board when boardArr changes
  const renderMarks = (boardArr) => {
    _domBoard.forEach((boardSqr, index) => {
      boardSqr.textContent = boardArr[index];
    });
  };

  const _clearBoard = () => {
    _domBoard.forEach((boardSqr) => {
      boardSqr.textContent = "";
      boardSqr.classList.remove("lightWinSqrs");
    });
    board.clearBoardArr();
    _displayMssg("");
  };

  const _displayMssg = (mssg) => {
    mssgDisplay.textContent = mssg;
  };

  const showWinner = (name, index) => {
    _displayMssg(`${name} is the winner! Hit play to continue!`);
    _stopPlay();
    _lightWinRow(index);
    _updateScore(name);
  };

  const declareDraw = () => {
    _displayMssg("Sorry, this game was a draw!");
  };

  //if el dataset is in indexes, el is win sqr, should be lit up
  const _lightWinRow = (indexes) => {
    _domBoard.forEach((boardSqr) => {
      if (indexes.includes(parseInt(boardSqr.dataset.index))) {
        boardSqr.classList.add("lightWinSqrs");
      }
    });
  };

  const _updateScore = (name) => {
    if (player1.getName() === name) {
      player1.addToScore();
      p1Score.textContent = player1.getScore();
    } else {
      player2.addToScore();
      p2Score.textContent = player2.getScore();
    }
  };

  const _handleGridClickEvent = (e) => {
    const el = e.target;
    if (el.classList.contains("board-box") && !el.textContent) {
      const index = el.dataset.index;
      board.addToBoardArr(index, _isPlayer1Turn);

      _isPlayer1Turn = _isPlayer1Turn ? false : true;

      if (_vsComp) {
        const boardArrCopy = board.getBoardArrCopy();
        const AIPick = AI.getAIPick(boardArrCopy);
        console.log(AIPick);
        _isPlayer1Turn = true; //ai picks, becomes player1 turn again, maybe need to clear board(done below)
      }
    }
  };

  const _stopPlay = () => {
    boardGrid.removeEventListener("click", _handleGridClickEvent);
  };

  //here, trying to make player1 go first each time, so p1Turn true on start btn click
  const _startPlay = () => {
    _isPlayer1Turn = true;
    boardGrid.addEventListener("click", _handleGridClickEvent);
    _clearBoard();
    _displayMssg("Game On!");
  };

  const _changeDisplayedName = (nameDiv, player, e) => {
    const value = e.target.value ? e.target.value : "?";
    player.changeName(value);
    nameDiv.textContent = player.getName();
  };

  const _toggleAI = () => {
    _isPlayer1Turn = true;
    _vsComp = _vsComp ? false : true;
    const mssg = _vsComp
      ? "A.I. is active, press play to begin, good luck!"
      : "A.I. turned off, press play to start PvP match!";
    _stopPlay();
    _clearBoard();
    _zeroOutScores();
    _displayMssg(mssg);
  };

  const _zeroOutScores = () => {
    p1Score.textContent = 0;
    p2Score.textContent = 0;
    player1.resetScore();
    player2.resetScore();
  };

  //eventlisteners
  reset.addEventListener("click", () => location.reload());
  play.addEventListener("click", _startPlay);

  p1NameInp.addEventListener("input", (e) =>
    _changeDisplayedName(p1NameDiv, player1, e)
  );

  p2NameInp.addEventListener("input", (e) =>
    _changeDisplayedName(p2NameDiv, player2, e)
  );

  aiBtn.addEventListener("click", _toggleAI);

  return { renderMarks, showWinner, declareDraw };
})();

//needed to build players(factory function)//
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

  const resetScore = () => {
    _playerScore = 0;
  };

  return { changeName, getName, addToScore, getScore, resetScore, getMark };
};

const player1 = playerFactory("Player X", "X");
const player2 = playerFactory("Player O", "O");

//the functs have the closure, need to pass values into functs with closure, and can assign to vars in the
//closure.
//need to get ai up and running, if vsComp true, get pick from AI object logic

//Scrap whole app? Make better use of factory function, player1turn true,
