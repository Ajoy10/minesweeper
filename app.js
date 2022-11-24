// Image for mine
const mineImage = new Image();
mineImage.src = "https://static.thenounproject.com/png/915944-200.png";

// Starting the game in whatever mode the user selects
const easyBtn = document.getElementById("easy");
easyBtn.addEventListener("click", () => {
  Game("easy");
});

const medBtn = document.getElementById("medium");
medBtn.addEventListener("click", () => {
  Game("med");
});

const hardBtn = document.getElementById("hard");
hardBtn.addEventListener("click", () => {
  Game("hard");
});

// Setup is the screen where players can select game mode
const setupScreen = document.getElementById("setup");

// Restart menu screen
const restartScreen = document.getElementById("restart-menu");
restartScreen.style.display = "none"; // hiding the restart menu when the game begins

// Game Screen
const gameScreen = document.getElementById("game");

function Game(dif) {
  let rows,
    cols,
    mineRatio = 0.1;

  // Disabling setup screen
  setupScreen.style.display = "none";

  // Choosing the columns, rows and mineAmount based on the selected difficulty
  switch (dif) {
    case "easy":
      rows = 9;
      cols = 9;
      mineRatio = 0.1;
      break;
    case "med":
      rows = 13;
      cols = 15;
      mineAmount = 0.2;
      break;
    case "hard":
      rows = 16;
      cols = 30;
      mineAmount = 0.45;
      break;

    default:
      break;
  }

  // Updating CSS grid
  gameScreen.style.gridTemplateColumns = `repeat(${cols},auto)`;

  // Initializing cell arrays
  let cells = Array(rows);
  let cellsButton = Array(rows);

  for (let i = 0; i < rows; i++) {
    cells[i] = Array(cols);
    cellsButton[i] = Array(cols);
  }

  // A helper function which returns the object block with or without a mine
  const CreateBlock = (mine) => {
    return {
      content: mine ? "mine" : " ",
      action: "closed",
    };
  };

  // Some variables to keep track of the game progress
  const totalCell = rows * cols;
  let totalMine = 0;
  let minesButton = [];
  let openedCells = 0;

  let gameOver = false;

  // Cell generation
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (Math.random() > 1 - mineRatio) {
        cells[i][j] = CreateBlock(1);
        totalMine++;
      } else cells[i][j] = CreateBlock(0);
    }
  }

  // Helper function to update the content in a cell
  const UpdateCellCount = (cell) => {
    if (cell.content === "mine")
      return "mine"; // if the cell is a mine, just return mine
    else if (cell.content == " ")
      return 1; // if the cell's content is empty, set to 1
    else {
      let value = Number(cell.content);
      return ++value; // Otherwise increase the content by 1
    }
  };

  // For every cell which is a mine update its surronding by one
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (cells[i][j].content == "mine") {
        // On every mine cell update all 8 surrounding cells
        for (let k = -1; k < 2; k++) {
          for (let l = -1; l < 2; l++) {
            if (!(k === 0 && l === 0)) {
              const a = i + k,
                b = j + l;
              if (cells[a] && cells[a][b] != undefined)
                // If the cell is not (i, j)
                cells[a][b].content = UpdateCellCount(cells[a][b]);
            }
          }
        }
      }
    }
  }

  // Debug line
  console.table(cells.map((row) => row.map((cell) => cell.content)));

  // Helper function to check whether given cell have mine or not
  const CheckMineOnCell = (a, b) => {
    if (cells[a] != undefined && cells[a][b] != undefined) {
      if (cells[a][b].content == "mine") {
        return 1;
      }
    }
    return 0;
  };

  // Checks whether any of the neighbours of given cells, is a mine
  const CheckMinesOnNeighbourCells = (i, j) => {
    let count = 0;

    for (let k = -1; k < 2; k++) {
      for (let l = -1; l < 2; l++) {
        if (k == 0 && l == 0) continue;

        count += CheckMineOnCell(i + k, j + l);
      }
    }

    if (count == 0) OpenCellsNearby(i, j); // if no neighbour cells are mine open all those neighbours
  };

  // Helper function to open neighbour cells
  const OpenCellsNearby = (i, j) => {
    for (let k = -1; k < 2; k++) {
      for (let l = -1; l < 2; l++) {
        if (k == 0 && l == 0) continue;

        Open(i + k, j + l);
      }
    }
  };

  // Function to open the given cell
  function Open(i, j) {
    // If the given cell is a valid cell
    if (cells[i] != undefined && cells[i][j] != undefined) {
      // if the cell is already opened just return
      if (cells[i][j].action == "open") return;

      // if the cell is a mine, game over
      if (cells[i][j].content == "mine") {
        cellsButton[i][j].classList.add("mine-blown");
        GameOver("Game over! Try again");
      } else {
        // Otherwise,
        cells[i][j].action = "open"; // Set action to open
        openedCells++; // Increment the count of total open cells
        cellsButton[i][j].innerHTML = cells[i][j].content; // Reveal the content of the cell
        cellsButton[i][j].classList.add("opened-button"); // Add opened-button class to the cell button

        // Check whether the neighbour cells are mines or not,
        // If they are not mines they should be opened
        CheckMinesOnNeighbourCells(i, j);

        // If all non-mine cells are opened, the game is won
        if (openedCells >= totalCell - totalMine) {
          GameOver("Congrats! You won"); // Call game over
        }
      }
    }
    // Debug line
    console.table(cells.map((row) => row.map((cell) => cell.content)));
  }

  const DrawCell = (x, y) => {
    // Creates a new button add a event listener for click event and return the button
    var btn = document.createElement("button");
    btn.id = `block${x}-${y}`;
    btn.addEventListener("click", function () {
      if (!gameOver) Open(x, y);
    });
    return btn;
  };

  // Create a button for all cells, store and display
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      let cellButton = DrawCell(i, j, cells[i][j]);
      cellsButton[i][j] = cellButton;
      if (cells[i][j].content == "mine") minesButton.push(cellButton); // if the current cell is a mine add it to mines buttons
      gameScreen.appendChild(cellButton); // Display it to gameScreen
    }
  }

  // Function for handling game over
  function GameOver(msg) {
    if (msg) alert(msg);

    gameOver = true;

    // Revealing mines
    minesButton.forEach((mine) => {
      mine.classList.add("mine-shown");
      let img = document.createElement("img");
      img.src = mineImage.src;
      mine.appendChild(img);
    });

    //Enabling Restart menu
    restartScreen.style.display = "inline";
    restartScreen.addEventListener("click", () => {
      location.reload();
    });
  }
}
