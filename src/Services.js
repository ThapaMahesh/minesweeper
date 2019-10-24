class Services{

    createNewMine = (boardSize, mines) => {
        let sides = boardSize + 2;
        let board = [];
        let minesPosition = [];
        let emptyboard = [];

        /* create a board of 2 big size than the selected matrix
            initiate the values as 0
        */
        for (let row = 0; row < sides; row++) {
            if(!Array.isArray(board[row])){
                board[row] = [];
            }
            for (let col = 0; col < sides; col++) {
                board[row][col] = "";
            }
        }

        // create empty board for play
        for (let row = 0; row < boardSize; row++) {
            if(!Array.isArray(emptyboard[row])){
                emptyboard[row] = [];
            }
            for (let col = 0; col < boardSize; col++) {
                emptyboard[row][col] = 0;
            }
        }

        
        /*
         * add designated number of mines in random places except (first row and col) and (last row and col)
        */
        while(mines > 0){
            let row = this.randomIndex(sides);
            let col = this.randomIndex(sides);
            // we don't want mines in the boundry, we'll remove boundry later
            if(row === 0 || row === sides-1 || col === 0 || col === sides-1){
                continue;
            }
            if(board[row][col] === ""){
                board[row][col] = "*";
                mines--;
                minesPosition.push([row-1, col-1]); // -1 because current position includes the boundry row and column
            }
        }
        /*
         * except for (first row and col) and (last row and col), count the neighboring mines
        */
        for (let row = 1; row < sides-1; row++) {
            for (let col = 1; col < sides-1; col++) {
                if(board[row][col] !== "*"){
                    board[row][col] =   (board[row-1][col-1] === "*" ? 1 : 0) + (board[row-1][col] === "*" ? 1 : 0) + (board[row-1][col+1] === "*" ? 1 : 0) +
                                        (board[row][col-1] === "*" ? 1 : 0) + (board[row][col+1] === "*" ? 1 : 0) +
                                        (board[row+1][col-1] === "*" ? 1 : 0) + (board[row+1][col] === "*" ? 1 : 0) + (board[row+1][col+1] === "*" ? 1 : 0);
                }
            }
        }
        
        // remove the boundry row and column
        board.splice(0, 1);
        board.splice(boardSize, 1);

        board = board.map(function(val){
            return val.slice(0, -1);
        });

        board = board.map(function(val){
            return val.slice(1);
        });

        return {
            actualboard: board,
            minesPosition: minesPosition,
            tempboard: emptyboard
        };
    }

    randomIndex = (size) => {
        return Math.floor(Math.random()*size);
    }

}

export default Services;