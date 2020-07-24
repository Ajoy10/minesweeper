
const mineImage = new Image();
mineImage.src = "https://static.thenounproject.com/png/915944-200.png";

let rows = 5, cols = 20;
var gameScreen = document.getElementById("game");
let cells = Array(rows);
let cellsBtn = Array(rows)

const totalCell = rows * cols;
let totalMine = 0;
let minesBtn= [];
let openedCells = 0;

let gameOver = false;

const MineRatio = .1;
const block = (bomb) => {
    if (bomb == 1)
    {   
        
        return {
            content: "mine",
            action: "closed"
        }}
    return {
        content: " ",
        action: "closed"
    }
};

for (let i = 0; i < rows; i++) {
    cells[i] = Array(cols);
    cellsBtn[i] = Array(cols);

}


//Initiating cells
for (let i = 0; i < rows; i++){
    for (let j = 0; j < cols; j++){
        if(Math.random()>1-MineRatio)
        {
            cells[i][j] = block(1);
            totalMine++;
            
        }
        else
            cells[i][j] = block(0);
            
    }
}

//Checking mines and defining content

const NearbyCountUpdate = (cell) => {

    if (cell.content == "mine")
        return "mine";
    else
        if (cell.content == " ")
            return 1;
        else {
            let cur = Number(cell.content);
            return ++cur;
        }
};

const NearbyCellUpdate = (a,b) => {
    if (cells[a]&&cells[a][b] != undefined)
        cells[a][b].content = NearbyCountUpdate(cells[a][b]);
}

for (let i = 0; i < rows; i++){
    for (let j = 0; j < cols; j++){
        if (cells[i][j].content == "mine") {


            NearbyCellUpdate(i - 1, j - 1);
            NearbyCellUpdate(i - 1, j);
            NearbyCellUpdate(i - 1, j + 1);

            NearbyCellUpdate(i, j - 1);
            NearbyCellUpdate(i , j + 1);

            NearbyCellUpdate(i+ 1, j - 1);
            NearbyCellUpdate(i +1, j);
            NearbyCellUpdate(i + 1, j + 1);
            
            
        
        }
    }
}

const NearbyCellCheck = (a, b) => {
    if (cells[a] != undefined && cells[a][b] != undefined) {
        console.log("here");
        if (cells[a][b].content == "mine") {
            return 1;
        }
    }
    return 0;
}
const NearbyCellMineCheck = (i, j) => {
    let count = 0;
    count+=NearbyCellCheck(i - 1, j - 1);
    count+=NearbyCellCheck(i - 1, j);
    count+=NearbyCellCheck(i - 1, j + 1);

    count+=NearbyCellCheck(i, j - 1);
    count+=NearbyCellCheck(i , j + 1);

    count+=NearbyCellCheck(i+ 1, j - 1);
    count+=NearbyCellCheck(i +1, j);
    count += NearbyCellCheck(i + 1, j + 1);
    
    console.log(count);
    if (count == 0)
        NearbyCellsOpen(i, j);
    
}

const NearbyCellsOpen = (i, j) => {
    
    Open(i - 1, j - 1);
    Open(i - 1, j);
    Open(i - 1, j + 1);

    Open(i, j - 1);
    Open(i , j + 1);

    Open(i+ 1, j - 1);
    Open(i +1, j);
    Open(i + 1, j + 1);
    
}

function Open(i, j) {
    if (cells[i] != undefined && cells[i][j] != undefined) {
        if (cells[i][j].action == "open")
            return;
        if (cells[i][j].content == "mine")
        {
            alert("Game over");
            gameOver = true;
            cellsBtn[i][j].classList.add("mine-blown");
            
            
            minesBtn.forEach(mine => {
                
                mine.classList.add("mine-shown");
                let img = document.createElement("img");
                img.src = mineImage.src;
                mine.appendChild(img);
                console.log(mineImage.src);
            });
        }
        else {
            cells[i][j].action = "open";
            openedCells++;
            cellsBtn[i][j].innerHTML = cells[i][j].content;
            cellsBtn[i][j].classList.add("opened-button");
            NearbyCellMineCheck(i, j);
            
            if (openedCells >= (totalCell - totalMine))
                alert("You won!");
            
        }
    }
}

//Drawing cells initially
function BlockClick(i,j){
    if (gameOver)
        return;
    Open(i, j);
    
}

const DrawBlock = (x, y) => {
    var btn = document.createElement("button");
    btn.id = `block${x}-${y}`;
    btn.addEventListener("click", function () { BlockClick(x, y); })
    return btn;
}

for (let i = 0; i < rows; i++){
    for (let j = 0; j < cols; j++){
        let btn = DrawBlock(i, j, cells[i][j]);
        cellsBtn[i][j] = btn;
        if(cells[i][j].content == "mine")
            minesBtn.push(btn);
        gameScreen.appendChild(btn);
    }
}




console.log(cells);
