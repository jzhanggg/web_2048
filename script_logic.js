var game_board;
var score = 0;
var row_length = 4;
var col_length = 4;
var keyEventActive = 1;

//Setup game
window.onload = function() {
    setGame();
    document.getElementById('restart_button').addEventListener('click', reload);
}

function setGame() {
    game_board = [[0, 0, 0, 0], 
                  [0, 0, 0, 0], 
                  [0, 0, 0, 0], 
                  [0, 0, 0, 0]];

    // game_board = [[2, 4, 2, 4], 
    //                 [4, 2, 4, 2], 
    //                 [2, 4, 2, 4], 
    //                 [4, 2, 4, 2]];

    // game_board = [[0, 2048, 2048, 0], 
    //                 [0, 0, 0, 0], 
    //                 [0, 0, 0, 0], 
    //                 [0, 0, 0, 0]];

    for (let r = 0; r < row_length; r++) {
        for (let c = 0; c < col_length; c++) {
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            let num = game_board[r][c];
            updateTile(tile, num);
            document.getElementById("board").append(tile);
        }
    }
    generateTile();
    generateTile();
}

//game restart function
function reload() {
    location.reload();
}

//Operations on Tiles

function generateTile() {
    if (!hasEmptyTile()) {
        return;
    }
    let fill = false;
    while (!fill) {
        //find random row and column to place a 2 in
        let r = getRandIndex(0,3);
        let c = getRandIndex(0,3);
        if (game_board[r][c] == 0) {
            game_board[r][c] = 2;
            let tile = document.getElementById(r.toString() + "-" + c.toString());

            if (Math.random() < 0.8) {
                tile.innerText = "2";
                tile.classList.add("class_2");
            } else {
                tile.innerText = "4";
                tile.classList.add("class_4");
            }

            fill = true;
        }
    }
}

function setTile (row_index, col_index) {
    let tile = document.getElementById(row_index.toString() + "-" + col_index.toString());
    let num = game_board[row_index][col_index];
    updateTile(tile, num);
}

function updateTile(tile, num) {
    tile.innerText = "";
    tile.classList.value = ""; 
    tile.classList.add("tile");
    if (num > 0) {
        tile.innerText = num.toString();
        if (num <= 2048) {
            tile.classList.add("class_"+num.toString());
        } else {
            makeWinButton();
        }                
    }
}

//Arrow key event listners

document.addEventListener('keyup', (e) => {
    if (e.code == "ArrowLeft" && keyEventActive == 1) {
        slideLeft();
        generateTile();
        checkMovability();
    }
    else if (e.code == "ArrowRight" && keyEventActive == 1) {
        slideRight();
        generateTile();
        checkMovability();
    }
    else if (e.code == "ArrowUp" && keyEventActive == 1) {
        slideUp();
        generateTile();
        checkMovability();

    }
    else if (e.code == "ArrowDown" && keyEventActive == 1) {
        slideDown();
        generateTile();
        checkMovability();
    }
    document.getElementById("score").innerText = score;
})

//Slide functions

function slide(row) {
    row = filterZero(row); 
    for (let i = 0; i < row.length-1; i++){
        if (row[i] == row[i+1]) {
            row[i] *= 2;
            row[i+1] = 0;
            score += row[i];
        }
    } 
    row = filterZero(row); 
    row = appendZero(row);

    return row;
}

function slideLeft() {
    for (let r = 0; r < row_length; r++) {
        let row = game_board[r];
        row = slide(row);
        game_board[r] = row;
        for (let c = 0; c < col_length; c++){
            setTile(r, c);
        }
    }
}

function slideRight() {
    for (let r = 0; r < row_length; r++) {
        let row = game_board[r];         
        row.reverse();              
        row = slide(row)            
        game_board[r] = row.reverse();   
        for (let c = 0; c < col_length; c++){
            setTile(r,c);
        }
    }
}

function getColumn(col_index) {
    column = [];
    for (let i = 0; i < col_length; i++) {
        column.push(game_board[i][col_index]);
      }
    return column;
}

function slideUp() {
    for (let c = 0; c < col_length; c++) {
        let row = getColumn(c);
        row = slide(row);

        for (let r = 0; r < row_length; r++){
            game_board[r][c] = row[r];
            setTile(r,c);
        }
    }
}

function slideDown() {
    for (let c = 0; c < col_length; c++) {
        let row = getColumn(c);
        row.reverse();
        row = slide(row);
        row.reverse();

        for (let r = 0; r < row_length; r++){
            game_board[r][c] = row[r];
            setTile(r,c);
        }
    }
}

//Array manipulation

function filterZero(row){
    return row.filter(num => num != 0); //create new array of all nums != 0
}

function appendZero(row) {
    while (row.length < row_length) {
        row.push(0);
    }
    return row;
}

function getRandIndex(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function hasEmptyTile() {
    let count = 0;
    for (let r = 0; r < row_length; r++) {
        for (let c = 0; c < col_length; c++) {
            if (game_board[r][c] == 0) { //at least one zero in the board
                return true;
            }
        }
    }
    return false;
}

//Check if user can still slide the tiles to play, if not make cheat button
function checkMovability() {
    for (let r = 0; r < row_length; r++) {
        for (let c = 0; c < col_length; c++){
            if (game_board[r][c] == 0) {
                return;
            }
            
            if (c < col_length - 1) {
                if (game_board[r][c] == game_board[r][c+1]){
                    return;
                }
            }

            if (r < row_length - 1) {
                if (game_board[r][c] == game_board[r+1][c]){
                    return;
                }
            }
        }
    }
    keyEventActive = 0;
    makeCheatButton();
}

//make win button: unfinished
function makeWinButton() {
    const button = document.createElement('button');
    button.textContent = 'You Win! 为世界上所有的美好而战';
    button.classList.add("big_button");
    button.id = "win_button";
    const buttonContainer = document.getElementById('board');
    buttonContainer.appendChild(button);
    const winB = document.getElementById("win_button");
    keyEventActive = 0;
    winB.addEventListener('click', winNewGame);
}

function winNewGame() {
    reload();
    document.getElementById("win_button").remove();
}

//create cheat button
function makeCheatButton() {
    const button = document.createElement('button');
    button.textContent = '点击输入密码：我什么都做不到';
    button.classList.add("big_button");
    button.id = "win_button";
    const buttonContainer = document.getElementById('board');
    buttonContainer.appendChild(button);
    const cheatB = document.getElementById("cheat_button");
    cheatB.addEventListener('click', cheatTwoTiles);
}

//remove randomly remove 1-2 tiles from the full, unslidable grid
function cheatTwoTiles() {
    id1 = selectTileDelete();
    r1 = getRowInd(id1);
    c1 = getColInd(id1);

    id2 = selectTileDelete();
    r2 = getRowInd(id2);
    c2 = getColInd(id2);


    game_board[r][c] = 0;
    game_board[r1][c1] = 0;
    setTile(r, c);
    setTile(r1, c1);
    keyEventActive = 1;
    document.getElementById("cheat_button").remove();
}

function selectTileDelete() {
    var list_2s = document.getElementsByClassName("class_2")
    var list_4s = document.getElementsByClassName("class_4")
    var arr_all = Array.from(list_2s);

    for (var i = 0; i < list_4s.length; i++){
        arr_all.push(list_4s);
    }

    var rand_index = getRandIndex(0,arr_all.length - 1);

    return arr_all[rand_index].id;
}

function getRowInd(tile_id_string) {
    var arr = tile_id_string.split('-');
    return arr[0];
}

function getColInd(tile_id_string) {
    var arr = tile_id_string.split('-');
    return arr[1];
}





