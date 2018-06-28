/*
##### Word Guess Game Bonuses

1. Play a sound or song when the user guesses their word correctly, like in our demo.
2. Write some stylish CSS rules to make a design that fits your game's theme.



########################################################################################
###########################      TODO      #############################################
########################################################################################
### Create a README.md

Add a `README.md` to your repository describing the project. Here are some resources for creating your `README.md`.
Here are some resources to help you along the way:

* [About READMEs](https://help.github.com/articles/about-readmes/)

* [Mastering Markdown](https://guides.github.com/features/mastering-markdown/)

- - -

### Add To Your Portfolio

After completing the homework please add the piece to your portfolio. 
Make sure to add a link to your updated portfolio in the comments section of your homework
so the TAs can easily ensure you completed this step when they are grading the assignment. 
To receive an 'A' on any assignment, you must link to it from your portfolio.
########################################################################################
###########################      TODO      #############################################
########################################################################################


*/

// Word list
var globalWordList = ["ducks", "cats", "stuff", "testing", "dogs", "twitter"];

// References to HTML elements by ID to:
//   header
//   display_word
//   remaining_guesses
//   letters_guessed
//   num_wins
//   new_game
//   round_action
var $header = document.getElementById("header");
var $display_word = document.getElementById("display_word");
var $remaining_guesses = document.getElementById("remaining_guesses");
var $letters_guessed = document.getElementById("letters_guessed");
var $num_wins = document.getElementById("num_wins");
var $new_game = document.getElementById("new_game"); // button
var $round_action = document.getElementById("round_action"); // button

// Generate random number between 0 and n
function randomNum(n) {
    return Math.floor(Math.random() * n);
}

var game = {
    // Game object:
    //   Local word list (clone of global word list, with words removed as they are played, to prevent repeats)
    //   Current word (array of chars)
    //   Display word (array of chars)
    //   Letters guessed already
    //   Guesses remaining
    //   Number of wins
    //   Current game state: 0 ongoing, 1 won round, -1 lost round
    //   gameOver boolean
    localWordList: [],
    currentWord: [],
    displayWord: [],
    guesses: [],
    guessesRemaining: 12,
    numWins: 0,
    gameState: 0,
    gameOver: false,


    init: function () {
        //     clone global word list into local word list
        //     set wins to 0
        //     startNewRound()
        this.gameOver = false;
        this.localWordList = [];
        globalWordList.forEach(function (item) {
            game.localWordList.push(item);
        });
        this.numWins = 0;
        this.startNewRound();
    },

    startNewRound: function () {
        //     if wordlist length = 0, endGame() - user has played all the words!
        //
        //     index = randomNum(wordlist.length)
        //     set current word to wordlist[index].split
        //     remove current word from local word list (prevents repeated plays of the same word)
        //     change new word button to reset word
        //     resetRound()
        if (this.localWordList.length === 0) {
            this.endGame();
            return;
        }

        var index = randomNum(this.localWordList.length);
        this.currentWord = Array.from(this.localWordList[index]);
        this.localWordList.splice(index, 1);
        this.resetRound();
    },

    resetRound: function () {
        //     fill display word array, of equal length, populated by "_"
        //     empty array of letters guessed
        //     reset guesses remaining
        //     reset current game state
        //     updateDisplay()
        this.displayWord = [];
        for (var i = 0; i < this.currentWord.length; i++) {
            this.displayWord.push("_");
        }
        $header.textContent = "Press any alphabet key to submit a guess!";
        $round_action.textContent = "Reset Word";
        this.guesses = [];
        this.guessesRemaining = 12;
        this.gameState = 0;
        this.gameOver = false;
        this.updateDisplay();
    },

    playTurn: function (key) {
        //     compares key to existing correct guesses; return
        //     compares key to existing incorrect guesses; return
        // 
        //     decrements remaining guesses if wrong 
        //     compares key to remaining letters in current word
        //       if correct
        //         replace underscores in displayWord with correct guess
        //         replace letters in currentWord with underscores
        //           (this allows loop to catch all matching letters in the word,
        //              but there is probably a better way!)
        //     push letter to guesses
        //     updateDisplay()
        //     updateGameState()
        //     endRound()
        if (this.displayWord.indexOf(key) > -1 || this.guesses.indexOf(key.toUpperCase()) > -1) {
            return;
        }

        var index = this.currentWord.indexOf(key)

        if (index === -1) { // incorrect guess
            this.guessesRemaining--;
        } else {
            while (index > -1) { // correct guess
                this.displayWord[index] = key.toUpperCase();
                this.currentWord.splice(index, 1, "_");
                index = this.currentWord.indexOf(key);
            }
        }

        this.guesses.push(key.toUpperCase());
        this.updateDisplay();
        this.updateGameState();
        this.endRound();
    },

    endRound: function () {
        //     if (gameState === 0)
        //       return?
        //     else if (gameState > 0)
        //       increment wins
        //       display a winning message
        //       change reset round button to next round
        //     else (gameState < 0)
        //       display a losing message
        //       present a new game or try again button
        if (this.gameState === 0) {
            return;
        } else if (this.gameState > 0) {

            this.numWins++;
            $num_wins.textContent = this.numWins;

            // Automatically moving to the next word can be jarring and doesn't provide any user feedback
            // Allow the user to press a button to move to the next word
            $header.textContent = "You won this word! Play another?";
            $round_action.textContent = "New Word";
            // To go to next word automatically, comment out the 2 lines above, and uncomment below:
            // game.startNewRound();

        } else if (this.gameState < 0) {

            // See above as to why this does not take place automatically
            $header.textContent = "You lost this round! Try again, or start a new game?";
            $round_action.textContent = "Try Again";
            // To go to the next word automatically, comment out the 2 lines above, and uncomment below:
            // game.startNewRound();
        }
    },

    updateDisplay: function () {
        //     update textcontent of display-word**
        //     update textcontent of to remaining-guesses**
        //     update textcontent of to letters-guessed
        //     update textcontent of to num-wins
        var displayWordString = this.displayWord.join(" ");
        $display_word.textContent = displayWordString;

        var lettersGuessedString = this.guesses.join(", ");
        $letters_guessed.textContent = lettersGuessedString;

        $remaining_guesses.textContent = this.guessesRemaining;
        $num_wins.textContent = this.numWins;
    },

    updateGameState: function () {
        //     check if display word has any remaining underscores - win condition
        //       set gameState to 1
        //     else if remaining guesses is 0 - loss condition
        //       set gameState to -1
        //     else set gameState to 0 (probably redundant)
        var roundWon = true;

        this.displayWord.forEach(function (item) {
            if (item === "_") {
                roundWon = false;
            }
        });

        if (roundWon) {
            this.gameState = 1;
        } else if (this.guessesRemaining === 0) {
            this.gameState = -1;
        } else {
            this.gameState = 0;
        }
    },

    // Only called if user has successfully played all of the words
    // in the word list; the game is over, but the user can press New Game
    endGame: function () {
        this.gameOver = true;
        $header.textContent = "You beat the game!";
    }
};

// Encapsulating the listeners
function createListeners() {

    // Event listener onkeyup:
    //   if game state !== 0 or game over, return;
    //   if key is non-alphabet, return;
    //   playTurn(key);
    document.addEventListener('keyup', function (event) {
        // This is ATROCIOUS, and I have no doubt that there is a way to accomplish it with regexp.
        // I tried a few methods but wasn't getting it to work - Googled it, and those solutions didn't work as intended either.
        // So, instead, here's an ugly, massive check against an array of the alphabet!
        var alphabet = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
        var key = event.key.toLowerCase();

        if (alphabet.indexOf(key) === -1 || game.gameOver || game.gameState !== 0) {
            return;
        }

        game.playTurn(key);

    });

    // Event listener button click:
    //   If game over, return (there is no round to start)
    //   If game state won, game startNewRound() (get a new word)
    //   else, game resetRound() (restart the current word)
    $round_action.addEventListener('click', function () {
        if (game.gameOver) {
            return;
        } else if (game.gameState > 0) {
            game.startNewRound();
        } else {
            game.resetRound();
        }
    });

    // Event listener button click:
    //   New game - game.init();
    $new_game.addEventListener('click', function () {
        game.init();
    });
}

// Create listeners and initialize game object
function playGame() {
    createListeners();
    game.init();
}

// Function call
playGame();