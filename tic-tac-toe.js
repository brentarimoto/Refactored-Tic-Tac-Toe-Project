window.addEventListener("DOMContentLoaded", (event) => {
///////////////////// FUNCTIONS //////////////////////////////

    ///// Storage Functions /////
    function updateFromStorage(){
        let temp = ['board', 'h1', 'turn', 'virtualBoard', 'Button']
        for (let key in localStorage){
           if (temp.includes(key) && localStorage.getItem(key)){
               board.innerHTML= localStorage.getItem('board')
               h1.className=localStorage.getItem('h1-class')
               h1.innerText=localStorage.getItem('h1-text')
               turn = localStorage.getItem('turn')
               virtualBoard = JSON.parse(localStorage.getItem('virtualBoard'))
               newButton.disabled = JSON.parse(localStorage.getItem('newButton'))
               giveUpButton.disabled = JSON.parse(localStorage.getItem('giveUpButton'))
               playerTurn= JSON.parse(localStorage.getItem('playerTurn'))
           }
        }
    }

    function store(){
        localStorage.setItem('board', board.innerHTML)
        localStorage.setItem('h1-class',h1.className)
        localStorage.setItem('h1-text',h1.innerText)
        localStorage.setItem('turn',turn)
        localStorage.setItem('virtualBoard',JSON.stringify(virtualBoard))
        localStorage.setItem('newButton',JSON.stringify(newButton.disabled))
        localStorage.setItem('giveUpButton',JSON.stringify(giveUpButton.disabled))
        localStorage.setItem('playerTurn',JSON.stringify(true))
    }

    ///// Update the Board Function /////

    // Updates the board based on the virtual board
    function updateBoard(){
        let squares=document.querySelectorAll('.square')
        // Loop through the array, updating the board with the correct array values
        for (let i=0;i<virtualBoard.length;i+=1){
            if (virtualBoard[i] !== '-'){
                let imageXO = `https://assets.aaonline.io/Module-DOM-API/formative-project-tic-tac-toe/player-${virtualBoard[i]}.svg`
                let img = `<img src = "${imageXO}">`
                squares[i].innerHTML=img;
            } else {
                squares[i].innerHTML = ''
            }
        }
    }

    ///// Is Win Function /////

    // Checks if there is a winner based off of current positions on the board
    function isWin(array){
        if (array[0]===array[1] && array[1]===array[2] && array[0]!== '-'){return true}
        else if (array[0]===array[3] && array[3]===array[6] && array[0]!== '-'){return true}
        else if (array[0]===array[4] && array[4]===array[8] && array[0]!== '-'){return true}
        else if (array[1]===array[4] && array[4]===array[7] && array[1]!== '-'){return true}
        else if (array[2]===array[4] && array[4]===array[6] && array[2]!== '-'){return true}
        else if (array[2]===array[5] && array[5]===array[8] && array[2]!== '-'){return true}
        else if (array[3]===array[4] && array[4]===array[5] && array[3]!== '-'){return true}
        else if (array[6]===array[7] && array[7]===array[8] && array[6]!== '-'){return true}
        return false
    }

    ///// Show Result Function /////

    // Shows the header for whoever won, or if there was a tie then no one wins
    function showResult(giveup){
        newButton.disabled = false;
        giveUpButton.disabled = true;
        if (isWin(virtualBoard) || giveup){
            h1.innerText = `Winner is ${turn.toUpperCase()}`;
            h1.classList.remove("hide");
            h1.classList.add("announcement");
        } else if (isTie(virtualBoard)){
            h1.innerText = `Winner is None`;
            h1.classList.remove("hide");
            h1.classList.add("announcement");
        }
    }

    ///// Is Tie Function /////
    function isTie(array){
        let bool=true;
        array.forEach((el)=>{
            if (el==='-'){bool=false}
        })
        return bool
    }

    ///// Computer Player /////

    // Random flip to see if computer or player starts
    // If in situation where you're reload the page and it was player's turn, then it won't do the computers turn
    function compStart(playerTurn){
        let start = Math.floor(Math.random()*2)
        if (start === 0 && !playerTurn){
            compPlayer();
        }
    }

    // Function replacating a computer choosing a random location, and making its move
    function compPlayer(){
        let bool = true;
        let position;
        while(bool){
            position = Math.floor(Math.random()*(9))
            if (virtualBoard[position]==='-'){
                virtualBoard[position]=turn
                bool=false
            }
        }
        updateBoard();
        if (isWin(virtualBoard) || isTie(virtualBoard)){
            showResult();
        }else {
            if (turn === "x"){
                turn = 'o'
            } else {
                turn = 'x'
            }
        }
        store()
    }
///////////////////////////////////////////////////////////
    ///// Initialize and Define Variables /////

    let board = document.getElementById("tic-tac-toe-board");
    let virtualBoard =['-','-','-','-','-','-','-','-','-']
    let h1 = document.getElementById("game-status");
    let buttons = document.querySelector(".actions");
    let newButton = buttons.getElementsByTagName('button')[0];
    newButton.setAttribute('id','new-game')
    newButton.disabled=true
    let giveUpButton = buttons.getElementsByTagName('button')[1];
    giveUpButton.setAttribute('id','give-up');
    let turn = "x"; // it start with X's turn
    playerTurn=false;

    updateFromStorage()

    ///// Start Game /////
    compStart(playerTurn)

    ///// Clicks /////

    // Records click events on the board
    board.addEventListener("click", event => {

        // If the board is alread in a won or tied state or the giveup button is greyed out, makes it so you cant click on the board
        if (isWin(virtualBoard)|| isTie(virtualBoard) || giveUpButton.disabled === true) {return}

        // To Prevent clicking outside the board
        if (!event.target.id.includes("square")) {return};

        // Assigns position to Virtual Board (The array that keeps track of the players moves)
        let position = Number(event.target.id[7]);
        virtualBoard[position] = turn;

        // Updates the board to the match the Virtual Board
        updateBoard(virtualBoard);

        // Checks for Win or Tie
        if (isWin(virtualBoard) || isTie(virtualBoard)){
            showResult();
            store()
        // If not then just switch turns (in this case to the computers turn)
        }else {
            if (turn === "x"){
                turn = 'o'
                compPlayer()
            } else {
                turn = 'x'
                compPlayer()
            }
        }
    });

    ///// New Game and Give Up Buttons /////

    buttons.addEventListener("click", event => {

        // NEW GAME resets all the values back to base - button listener
        if (event.target.id === "new-game") {

            virtualBoard =['-','-','-','-','-','-','-','-','-']
            updateBoard();
            newButton.disabled = true;
            giveUpButton.disabled = false;
            // Rehide h1 (header of who won)
            h1.classList.remove("announcement");
            h1.classList.add("hide")
            turn = 'x';
            compStart();

        // GIVE UP makes the other player the winner -- button listener
        } else if (event.target.id === "give-up") {
            newButton.disabled = false;
            giveUpButton.disabled = true;
            if (turn === 'x') {
                turn = 'o'
                showResult(true);
            } else {
                turn = 'x'
                showResult(true);
            }
        }
        store()
    })
});