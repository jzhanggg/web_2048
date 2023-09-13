var game_board;
var score = 0;
var row_length = 4;
var col_length = 4;
var keyEventActive = 1;

preload_image("i2.png");
preload_image("i4.png");
preload_image("i8.png");
preload_image("i16.JPG");
preload_image("i32.png");
preload_image("i64.png");
preload_image("i128.jpg");
preload_image("i256.png");
preload_image("i512.jpg");
preload_image("1024.png");
preload_image("i2048.jpg");

//Setup game
window.onload = function() {
    setGame();
    document.getElementById('restart_button').addEventListener('click', reload);
}

function preload_image(im_url) {
    let img = new Image();
    img.src = im_url;
  }

function setGame() {
    //Initialize
    game_board = [[0, 0, 0, 0], 
                  [0, 0, 0, 0], 
                  [0, 0, 0, 0], 
                  [0, 0, 0, 0]];

    //Test Win
    // game_board = [[0, 2048, 2048, 0], 
    //                 [0, 0, 0, 0], 
    //                 [0, 0, 0, 0], 
    //                 [0, 0, 0, 0]];

    //Test Lose
    // game_board = [[2, 4, 8, 16], 
    //                 [16, 8, 4, 2], 
    //                 [2, 4, 8, 16], 
    //                 [16, 8, 4, 2]];

    // //Test display all possible cells
    // game_board = [[0, 2, 4, 8], 
    //                 [16, 32, 64, 128], 
    //                 [256, 512, 1024, 2048], 
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
            const winB = document.getElementById("win_button");
            winB.addEventListener('click', winNewGame);
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

// touch event listeners
// Variables to track touch start and end coordinates
let startX = 0;
let startY = 0;
let endX = 0;
let endY = 0;

// Minimum swipe distance to register as a valid swipe
const minSwipeDistance = 10;

// Add a touchstart event listener to record the starting touch coordinates
document.addEventListener('touchstart', function (e) {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
});

// Add a touchend event listener to record the ending touch coordinates and determine the swipe direction
document.addEventListener('touchend', function (e) {
    endX = e.changedTouches[0].clientX;
    endY = e.changedTouches[0].clientY;

    // Calculate the differences in coordinates
    const deltaX = endX - startX;
    const deltaY = endY - startY;

    // Determine the direction of the swipe
    if (Math.abs(deltaX) > minSwipeDistance || Math.abs(deltaY) > minSwipeDistance) {
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            // Horizontal swipe
            if (deltaX > 0) {
                slideRight();
                generateTile();
                checkMovability();
            } else {
                slideLeft();
                generateTile();
                checkMovability();
            }
        } else {
            if (deltaY > 0) {
                slideDown();
                generateTile();
                checkMovability();
            } else {
                slideUp();
                generateTile();
                checkMovability();
            }
        }
    }
});

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
    const cheatB = document.getElementById("cheat_button");
    cheatB.addEventListener('click', cheatTwoTiles);
}

//make win button: unfinished
function makeWinButton() {
    const button = document.createElement('button');
    button.textContent = 'You Win! 为世界上所有的美好而战';
    button.classList.add("big_button");
    button.id = "win_button";
    const buttonContainer = document.getElementById('board');
    buttonContainer.appendChild(button);
    keyEventActive = 0;
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
    button.id = "cheat_button";
    const buttonContainer = document.getElementById('board');
    buttonContainer.appendChild(button);

}

//remove randomly remove 1-2 tiles from the full, unslidable grid
function cheatTwoTiles() {
    console.log("clicked");
    id1 = selectTileDelete();
    r1 = getRowInd(id1);
    c1 = getColInd(id1);

    id2 = selectTileDelete();
    r2 = getRowInd(id2);
    c2 = getColInd(id2);


    game_board[r1][c1] = 0;
    game_board[r2][c2] = 0;
    setTile(r1, c1);
    setTile(r2, c2);
    keyEventActive = 1;
    document.getElementById("cheat_button").remove();
}

function selectTileDelete() {
    var list_2s = document.getElementsByClassName("class_2")
    var list_4s = document.getElementsByClassName("class_4")
    var rand_index;
    var element;

    if (Math.random() <= 0.5){
        rand_index = getRandIndex(0,list_2s.length - 1);
        element = list_2s[rand_index];
        return element.id;
    } else {
        rand_index = getRandIndex(0,list_4s.length - 1);
        element = list_4s[rand_index];
        return element.id;

    }

}

function getRowInd(tile_id_string) {
    var arr = tile_id_string.split('-');
    return arr[0];
}

function getColInd(tile_id_string) {
    var arr = tile_id_string.split('-');
    return arr[1];
}





