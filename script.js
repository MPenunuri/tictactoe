const setPlayers = (() => {
    const Player = (int) => {
        let id = int;
        let name = '';
        let active = false;
        const setName = (str) => name = str;
        const mark = (chosenCell) => {
            chosenCell.setPlayer(id);
            chosenCell.setMark();
        }; return {id, name, active, setName, mark}
    };
    const players = [Player(1),Player(2)];
    players[0].active = true; //Remover tras depuración y generar algoritmo de inicio aleatorio
    return players;
})();

const setGameboard = (() => {
    const Cell = (row, col) => {
        let data = {row: row, col: col, player: 0, marked: false};
        let setPlayer = (player) => data.player = player;
        let setMark = () => data.marked = true;
        return {data, setPlayer, setMark}
    };

    const rows = 3;
    const columns = 3;
    const gameboard = [];
    let row = -1;
    for(let i = 0; i < rows; i++){
        row++;
        gameboard[i] = [];
        let col = -1;
        for(let j = 0; j < columns; j++){
            col++;
            let newCell = Cell(row,col)
            gameboard[i].push(newCell);
        }
    };
    return gameboard;
})();

const setRules = ((activePlayer,arrayOfCells) =>{

    const gameboard = arrayOfCells;

    const checkRowsOrColumns = (counter, type, axis, activePlayer, gameEnded) => {
        let count = counter;
        for(let i = 0; i < 3; i++){
            let row;
            let column;
            type === 'row' ? (row = axis, column = i) : (row = i, column = axis);
            let cellPlayer = gameboard[row][column].data.player;
            if(cellPlayer === activePlayer.id){
                count++;
            };
        };
        if(count === 3){gameEnded = true};
        return gameEnded;
    };

    const checkCrossAxies = (counterObj,i,j,activePlayer,gameEnded) => {
        let counter = counterObj;
        if(gameboard[i][i].data.player === activePlayer.id){counter.count1()};
        if(counter.value1 >= 3){gameEnded = true} 
        else if(gameboard[i][j].data.player === activePlayer.id){counter.count2()}
        if(counter.value2 >= 3){gameEnded = true} 
        return gameEnded;
    };
    

    const checkBoard = (activePlayer) => {
        let gameEnded = false;
        //Let's check every row:
        let counterRows = 0;
        for(let row = 0; row < 3; row++){
            gameEnded = checkRowsOrColumns(counterRows,'row',row,activePlayer,gameEnded)
        }
        //Let's check every column:
        let counterColumns = 0;
        for(let column = 0; column < 3; column++){
            gameEnded = checkRowsOrColumns(counterColumns,'column',column,activePlayer,gameEnded)
        }
        //To check the cross axies we need another sophisticated counter
        let counter = (() => {
            let value1 = 0;
            let value2 = 0;
            const count1 = () => {counter.value1 = counter.value1 + 1};
            const count2 = () => {counter.value2 = counter.value2 + 1};
            return {value1, value2, count1, count2}
        })();
        //Let's check the cross axies
        for(let i = 0, j = 2; i < 3, j >= 0; i++, j--){
            gameEnded = checkCrossAxies(counter,i,j,activePlayer,gameEnded)};
        return gameEnded;
    };
    return checkBoard(activePlayer);
});

const ticTacToe = (row,col) =>{
    const players = setPlayers;
    const activePlayer =  players.find(player => player.active === true);
    let choice = setGameboard[row][col];

    const playTurn = () => {
        if(choice.data.marked === false){activePlayer.mark(choice)};
    };

    const changeTurns = () => {
        if(players[0].active === true){
            players[0].active = false;
            players[1].active = true;
        } else{
            players[0].active = true;
            players[1].active = false;
        }
    };

    const gameControler = () => {
        playTurn();
        if (setRules(activePlayer,setGameboard) === false){changeTurns()} 
        else {console.log('Game concluded, Player ' + activePlayer.id + ' wins.')};
    };
    return gameControler();
};

ticTacToe(0,0) //1
ticTacToe(2,0)
ticTacToe(1,1) //1
ticTacToe(0,1)
ticTacToe(2,2) //1
ticTacToe(0,2)


// players[0].active = true; //Remover tras depuración
// gameboard[0][2].data.mark = true;
// gameboard[0][2].data.player = 1;
// gameboard[1][1].data.mark = true;
// gameboard[1][1].data.player = 1;
// gameboard[2][0].data.mark = true;
// gameboard[2][0].data.player = 1;