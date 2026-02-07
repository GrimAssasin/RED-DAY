/* ========= GAME NAV ========= */

function openGame(name){

  if(name === "puzzle"){
    goTo("puzzleScreen");
    startPuzzle();
  }

}


/* ========= PUZZLE GAME ========= */

const PUZZLE_SIZE = 3;
let puzzleOrder = [];
let selectedTile = null;

function startPuzzle(){

  const grid = document.getElementById("puzzleGrid");
  const status = document.getElementById("puzzleStatus");

  status.textContent = "";
  grid.innerHTML = "";

  // correct order
  puzzleOrder = [...Array(9).keys()];

  // shuffle
  puzzleOrder.sort(()=>Math.random()-0.5);

  puzzleOrder.forEach((pos,index)=>{
    const tile = document.createElement("div");
    tile.className = "tile";
    tile.dataset.index = index;
    tile.dataset.correct = pos;

    // background slice
    tile.style.backgroundImage =
      "url('assets/images/IT TAKES 2.jpeg')";

    const x = pos % PUZZLE_SIZE;
    const y = Math.floor(pos / PUZZLE_SIZE);

    tile.style.backgroundPosition =
      `${(x/(PUZZLE_SIZE-1))*100}% ${(y/(PUZZLE_SIZE-1))*100}%`;

    tile.onclick = () => selectTile(tile);

    grid.appendChild(tile);
  });
}


/* ========= TILE SWAP ========= */

function selectTile(tile){

  if(!selectedTile){
    selectedTile = tile;
    tile.classList.add("selected");
    return;
  }

  if(selectedTile === tile){
    tile.classList.remove("selected");
    selectedTile = null;
    return;
  }

  swapTiles(selectedTile, tile);

  selectedTile.classList.remove("selected");
  selectedTile = null;

  checkPuzzleSolved();
}


function swapTiles(a,b){
  const tempBg = a.style.backgroundPosition;
  const tempCorrect = a.dataset.correct;

  a.style.backgroundPosition = b.style.backgroundPosition;
  a.dataset.correct = b.dataset.correct;

  b.style.backgroundPosition = tempBg;
  b.dataset.correct = tempCorrect;
}


/* ========= SOLVE CHECK ========= */

function checkPuzzleSolved(){

  const tiles = document.querySelectorAll(".tile");

  for(let i=0;i<tiles.length;i++){
    if(Number(tiles[i].dataset.correct) !== i){
      return;
    }
  }

  document.getElementById("puzzleStatus")
    .textContent = "Puzzle solved PROCEED TO THE NEXT GIFT";
}

/* =========================
   RIDDLE HANGMAN (10 SETS)
========================= */

const hmRiddles = [
  {q:"What is your Fav colour?", a:"JOHNSON"},
  {q:"First documentary we ever watched together?", a:"UNKNOWNNUMBER"},
  {q:"Last show we watched together?", a:"POPSTARACADEMY"},
  {q:"What is my Fav colour?", a:"BECKY"},
  {q:"Last documentary we watched together?", a:"SEANCOMBS"},
  {q:"What's the date of our first offical date?", a:"16/09/23"},
  {q:"Where did we meet?", a:"MARRYLANDMALL"},
  {q:"First church service we attended together in 2026?", a:"CROSSOVERSERVICE"},
  {q:"What church was it?", a:"GLOBALHARVEST"},
  {q:"Where did you say yes to being my girlfriend?", a:"MANNA"}
];

let hmIndex = 0;
let hmWord, hmGuess, hmWrong;
const hmMax = 6;

function startHangman(){
  goTo("hangmanScreen");
  hmIndex = 0;
  loadRiddleRound();
}

function loadRiddleRound(){
  const item = hmRiddles[hmIndex];
  hmWord = item.a.toUpperCase();
  hmGuess = [];
  hmWrong = 0;

  document.getElementById("hmRiddle").textContent =
    "Riddle "+(hmIndex+1)+"/10: " + item.q;

  buildHMKeys();
  updateHMWord();
  updateHMHearts();
  setHM("Solve the riddle!!");
}

function buildHMKeys(){
  const box = document.getElementById("hmLetters");
  box.innerHTML = "";

  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/";

  chars.split("").forEach(L=>{
    const b = document.createElement("button");
    b.textContent = L;
    b.className = "hmBtn";
    b.onclick = ()=>guessHM(L,b);
    box.appendChild(b);
  });
}


function guessHM(L,btn){
  btn.disabled = true;

  if(hmWord.includes(L)) hmGuess.push(L);
  else hmWrong++;

  updateHMWord();
  updateHMHearts();
  checkHM();
}

function updateHMWord(){
  document.getElementById("hmWord").textContent =
    hmWord.split("").map(l=>hmGuess.includes(l)?l:"_").join(" ");
}

function updateHMHearts(){
  document.getElementById("hmHearts").textContent =
    "❤️".repeat(hmMax-hmWrong)+"🤍".repeat(hmWrong);
}

function checkHM(){
  const win = hmWord.split("").every(l=>hmGuess.includes(l));

  if(win){
    setHM("Correct ✅");
    disableHM();

    setTimeout(()=>{
      hmIndex++;
      if(hmIndex < hmRiddles.length){
        loadRiddleRound();
      } else {
        setHM("All riddles solved PROCEED TO THE NEXT GIFT");
      }
    },1200);
  }

  if(hmWrong >= hmMax){
    setHM("No hearts left 😭 Answer: "+hmWord);
    disableHM();

    setTimeout(loadRiddleRound,1500);
  }
}

function disableHM(){
  document.querySelectorAll(".hmBtn")
    .forEach(b=>b.disabled=true);
}

function setHM(t){
  document.getElementById("hmStatus").textContent=t;
}

/* =====================
   LOVE CROSSWORD LITE
===================== */

const cwLayout = [
  ["L","O","V","E","","C","A","R","D",""],
  ["I","","R","O","S","E","","K","I","S"],
  ["G","I","F","T","","H","E","A","R","T"],
  ["H","","C","U","P","I","D","","S",""],
  ["T","E","D","D","Y","","H","U","G",""],
  ["","","A","M","O","R","","","",""],
  ["D","A","T","E","","R","I","N","G",""],
  ["","","","S","W","E","E","T","",""],
  ["C","H","O","C","O","L","A","T","E",""],
  ["","","","","","","","","",""]
];


const cwWords = [
  {word:"LOVE", clue:"Deep romantic feeling"},
  {word:"CARD", clue:"What you give with a message inside"},
  {word:"ROSE", clue:"Classic Valentine flower"},
  {word:"KISS", clue:"A quick sign of affection"},
  {word:"GIFT", clue:"Something you give on Valentine’s Day"},
  {word:"HEART", clue:"Symbol of love"},
  {word:"CUPID", clue:"The love angel with arrows"},
  {word:"TEDDY", clue:"Plush Valentine toy"},
  {word:"HUG", clue:"Warm romantic embrace"},
  {word:"AMOR", clue:"Latin word for love"},
  {word:"DATE", clue:"Romantic outing"},
  {word:"RING", clue:"Symbol of commitment"},
  {word:"SWEET", clue:"How candy often tastes"},
  {word:"CHOCOLATE", clue:"Popular Valentine treat"}
];

function startCrossword(){
  goTo("crosswordScreen");
  buildCWGrid();
  buildCWClues();
  document.getElementById("cwStatus").textContent = "";
}

function buildCWGrid(){
  const grid = document.getElementById("cwGrid");
  grid.innerHTML = "";

  cwLayout.forEach((row,r)=>{
    row.forEach((cell,c)=>{
      const input = document.createElement("input");
      input.maxLength = 1;
      input.className = "cwCell";

      if(cell === ""){
        input.classList.add("cwBlock");
        input.disabled = true;
      }

      grid.appendChild(input);
    });
  });
}

function buildCWClues(){
  const ul = document.getElementById("cwClues");
  ul.innerHTML = "";

  cwWords.forEach(w=>{
    const li = document.createElement("li");
    li.textContent = w.clue;
    ul.appendChild(li);
  });
}

document.getElementById("cwCheckBtn")
  ?.addEventListener("click", checkCrossword);

function checkCrossword(){
  const cells = [...document.querySelectorAll(".cwCell")];
  let i = 0;
  let ok = true;

  cwLayout.forEach(row=>{
    row.forEach(cell=>{
      if(cell !== ""){
        if(cells[i].value.toUpperCase() !== cell){
          ok = false;
        }
      }
      i++;
    });
  });

  document.getElementById("cwStatus").textContent =
    ok ? "Correct 💖 Genius detected" : "Some letters are off 🤔";
}