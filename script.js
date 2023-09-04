const setPlayers = (player1, player2,first) => {
    const Player = (int,str) => {
        let id = int;
        let name = str;
        let active = false;
        const mark = (chosenCell) => {
            chosenCell.setPlayer(id);
            chosenCell.setMark();
        }; return {id, name, active, mark}
    };
    const players = [Player(1,player1),Player(2,player2)];
    players[first].active = true;
    return players;
};

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

const ticTacToe = (arrayOfplayers) =>{
    const players = arrayOfplayers;

    const playTurn = (activePlayer,row,col) => {
        let choice = setGameboard[row][col];
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

    const gameControler = (row,col) => {
        const activePlayer =  players.find(player => player.active === true);
        playTurn(activePlayer,row,col);
        changeTurns();
        let status = false;
        let winner = null;
        if (setRules(activePlayer,setGameboard) === true){
            status = true;
             winner = activePlayer;
        };
        return { status, winner } ;
    };
    return { gameControler };
};

const app = ((gameType) => {

    const displayHTMLelements = (option) => {
        const displayElementByID = (id) => {document.getElementById(id).style.display = 'flex'};
        const getForm = () => displayElementByID('form');
        const getAdditionalInput = () => displayElementByID('inputName2Container');
        const getStartBtn = () => displayElementByID('startGameButton1');
        const displayByCase = (option) => {
            if(option === 'p_VS_m_Op'){getForm()}
            else if (option === 'p_VS_p_Op') {getForm();getAdditionalInput()}
            else if(option === 'm_VS_m_Op'){getStartBtn()};
        };
        return displayByCase(option);
    };

    const options = document.querySelectorAll('.optionContainer');
    let selectedOption;
    options.forEach((option) => {
        option.addEventListener('click', () => {
            selectedOption = option.id;
            displayHTMLelements(selectedOption);
        });
    });

    const players = (player1, player2, first) => setPlayers(player1, player2, first);
    const names = (() => {let name1, name2; return { name1, name2 }})();

    const getPlayerName = (num,type) => {
        let name = '';
        const get = () => {
            let input = document.getElementById(`inputName${num}`);
            return name = input.value;
        };
        const set = () => {
            const names = ["ShadowBladeX","CyberNova","FireStorm","FrostByte", 
                            "StarSlinger","IronHeart","LunaWraith","DrakonViper",
                            "QuantumPulse","ThunderSoul","NeonPhantom","SkyRider",
                            "VenomStrike","AstralWolf","EmberFury","Frostfang",
                            "StormSurge","NovaScythe", "BladeRunner","TechnoMage"];
            return names[Math.floor(Math.random() * (names.length))]
        };
        type === 'person' ? name = get() : name = set();
        return name;
    };

    const displayGameboard = () => {
        document.getElementById('selectGameContainer').style.display = 'none';
        document.getElementById('form').style.display = 'none';
        document.getElementById('gameContainer').style.display = 'flex';
        document.getElementById('player1name').textContent = names.name1;
        document.getElementById('player2name').textContent = names.name2;
    };

    let play;

    let currentPlayer = 1;

    const setGame = () => {
        const playGame = ticTacToe(players(names.name1,names.name2,currentPlayer-1));
        play = playGame.gameControler;
    };


    let startBtn1 = document.getElementById('startGameButton1');
    startBtn1.addEventListener('click', () => {
        names.name1 = getPlayerName(null,'machine');
        let name2 = getPlayerName(null,'machine');
        while(names.name1 === name2){name2 = getPlayerName(null,'machine')}
        names.name2 = name2;
        displayGameboard();
        setGame();
    });

    let startBtn2 = document.getElementById('startGameButton2');
    startBtn2.addEventListener('click', () =>{
        names.name1 = getPlayerName(1,'person');
        if(selectedOption != 'p_VS_p_Op'){
            names.name2 = getPlayerName(null,'machine')
        } else{names.name2 = getPlayerName(2,'person')};
        displayGameboard();
        setGame();
    });

    const displayChangeOfTurns = (currentPlayer) => {

        let endTurn;
        let startTurn;
        currentPlayer === 1 ? (endTurn = 1, startTurn = 2) :  (endTurn = 2, startTurn = 1);

        const changeClasses = (id,add,remove) => {
            const scoreContainer = document.getElementById(`player${id}scoreContainer`);
            if(scoreContainer.classList.contains(remove)){scoreContainer.classList.remove(remove)};
            scoreContainer.classList.add(add);
            let cellsClass = `.player_${id}`;
            const cells = document.querySelectorAll(cellsClass);
            cells.forEach((cell) => {
                if(cell.classList.contains(remove)){cell.classList.remove(remove)};
                cell.classList.add(add);
            });
        };

        changeClasses(endTurn,'otherPlayer','currentPlayer');
        changeClasses(startTurn,'currentPlayer','otherPlayer');
    };

    const changeOfTurns = () => {
        displayChangeOfTurns(currentPlayer);
        currentPlayer === 1 ? currentPlayer = 2 : currentPlayer = 1;
    }

    let player1wins = 0;
    let player2wins = 0;

    const endGame = (game) => {

        document.getElementById('adviseSection').style.display = 'flex';
        document.getElementById('winner').textContent = game.winner.name + ' wins!';
        game.winner.id === 1 ? player1wins++ : player2wins++;
        let player1score = document.getElementById('player1score');
        player1score.textContent = player1wins;
        let player2score = document.getElementById('player2score');
        player2score.textContent = player2wins;

        player1score.classList.remove('loosing', 'winning');
        player2score.classList.remove('loosing', 'winning');

        if (player1wins > player2wins) {
            player1score.classList.add('winning');
            player2score.classList.add('loosing');
        } else if (player1wins < player2wins) {
            player1score.classList.add('loosing');
            player2score.classList.add('winning');
        }
    };

    const cells = document.querySelectorAll('.availableCell');
    cells.forEach((cell) => {
        cell.addEventListener('click',() =>{
            let symbol = '';
            currentPlayer === 1 ? symbol = 'X' : symbol = 'O';
            cell.textContent = symbol;
            cell.classList.add(`player_${currentPlayer}`);
            let row = cell.id.split('-')[0];
            let col = cell.id.split('-')[1];
            let game = play(row,col);
            game.status === true ? endGame(game) : changeOfTurns();
        })
    });

    const changeModeButton = document.getElementById('changeModeButton');
    changeModeButton.addEventListener('click',() => {
        location.reload();
    });


    const resetGameboard = () => {
        cells.forEach((cell) => {
            if(cell.classList.contains('currentPlayer')){cell.classList.remove('currentPlayer')};
            if(cell.classList.contains('otherPlayer')){cell.classList.remove('otherPlayer')};
            if(cell.classList.contains('player_1')){cell.classList.remove('player_1')};
            if(cell.classList.contains('player_2')){cell.classList.remove('player_2')};
            cell.textContent = '';
            let row = cell.id.split('-')[0];
            let col = cell.id.split('-')[1];
            let obj = setGameboard[row][col];
            obj.data.player = 0;
            obj.data.marked = false;
        });
    };

    const playAgainButton = document.getElementById('playAgainButton');
    playAgainButton.addEventListener('click',() => {
        document.getElementById('adviseSection').style.display = 'none';
        resetGameboard();
        setGame();
    });
})();