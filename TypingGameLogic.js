"using strict"

/** 
 * Add (global) key events as required.
*/

// document.addEventListener("mousedown",GameLoop.mousePressed);
// document.addEventListener('keydown', GameLoop.keyPressed); 


 /**
  * Add (global) variables here.
  * 
  * Note: That these will be in the global space: Best to keep them encapsulated within classes.
*/

//corsProxy: Temporary proxy to get around Google sheets CORS requirement for published sheets.
let corsProxy = "https://cors-anywhere.herokuapp.com/";

////////////////////////////////////////////////
//Utility/Misc Objects
////////////////////////////////////////////////
class WordPair {
  constructor(vnWord, engWord) {
    this.vnWord = vnWord;
    this.engWord = engWord;
  }
}
////////////////////////////////////////////////
//Utility Functions
////////////////////////////////////////////////
/**
 * Randomly shuffle an array
 * https://stackoverflow.com/a/2450976/1293256
 * @param  {Array} array The array to shuffle
 * @return {String}      The first item in the shuffled array
 */
var shuffle = function (array) {

	var currentIndex = array.length;
	var temporaryValue, randomIndex;

	// While there remain elements to shuffle...
	while (0 !== currentIndex) {
		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		// And swap it with the current element.
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;

};
////////////////////////////////////////////////
//Main Game Object
////////////////////////////////////////////////
/**
 * Typing game logic:
 * 
 * //PSEUDO CODE:
 * 1: Load list of words from resource (file or API). 
 * 2: Shuffle words if required.
 * 3: Update Page HTML: One to show Vietnamese word, and the other for corresponding English word.
 * 4: If user correctly types and submits Vietnamese word (spell check), then update HTML to show correct answer
 * 5: Show user new word to type.
 * 6: (GOTO 3)
 */
class TypingGameLogic {
    //Define 'local'variables inside constructor.
    constructor() {
      //For now: Hard-code a list of words. 
      //We'll change it later to 
      this.wordList = []; // this.loadWordList();
      this.currentQuestion = null;
    }
    loadNextWord() {
      shuffle(this.wordList);
      document.getElementById("questionId").innerHTML = this.wordList[0].vnWord + " | " + this.wordList[0].engWord;
      this.currentQuestion = this.wordList[0];
    }
    /**
     * Load a list of English/Vietnamese word pairs from file/API.
     * --Temorarily hard-coded
     */
    loadWordList() {
      // let wordList = [];
      // wordList.push(new WordPair("màu xanh lá cây", "green"));
      // wordList.push(new WordPair("màu xám", "grey"));
      // wordList.push(new WordPair("màu bạc", "silver"));
      // wordList.push(new WordPair("màu trắng", "white"));
      // wordList.push(new WordPair("màu vàng", "yellow"));
      // wordList.push(new WordPair("màu cam", "orange"));
      // wordList.push(new WordPair("màu đen", "black"));
      // wordList.push(new WordPair("màu tím", "purple"));
      // wordList.push(new WordPair("màu đỏ", "red"));
      // wordList.push(new WordPair("màu xanh da trời", "blue"));
      // wordList.push(new WordPair("màu nâu", "brown"));
      // wordList.push(new WordPair("màu hồng", "pink"));

      // return wordList;
    }
    /**
     * Check answer of input box against question.
     * 
     */
    checkAnswer(answer) {
      console.log(answer + ' ' + this.currentQuestion);
      answer = answer.toLowerCase();
      document.getElementById("vnInputId").value = answer;
      if ( answer.trim() === this.currentQuestion.vnWord) {
        this.addAnswerToList(this.currentQuestion.vnWord + " | " + this.currentQuestion.engWord);
        document.getElementById("vnInputId").value="";
        this.loadNextWord();
        document.getElementById("vnInputId").focus();
      }
    }
    /**
     * 
     * @param {*} answer 
     */
    addAnswerToList(answer) {
      let node = document.createElement("li");
      let textnode = document.createTextNode(answer);
      node.appendChild(textnode); 
      document.getElementById("answerListId").appendChild(node);
    }
    /**
     * 
     * @param {*} file 
     */
    readTextFile(file){
      //file = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRFfw8Wc12Rn_OeQll12WTjnyMGWPegypnmHD5ng5sb3srI5ucOKjMutPh7FJijE1E7lsR8EHsOMZDl/pub?gid=288009028&single=true&output=csv";
      //file = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRFfw8Wc12Rn_OeQll12WTjnyMGWPegypnmHD5ng5sb3srI5ucOKjMutPh7FJijE1E7lsR8EHsOMZDl/pub?gid=521843372&single=true&output=csv";
      
      file = document.getElementById("wordListId").value;


      let rawFile = new XMLHttpRequest();
      rawFile.open("GET", file, true);
      rawFile.onreadystatechange = function () {
          if(rawFile.readyState === 4)
          {
              if(rawFile.status === 200 || rawFile.status == 0)
              {
                  gameObj.wordList = []; //empty word list.. Do we want to make it empty? :) 

                  let allText = rawFile.responseText;
                  let lines = allText.split("\n");
                  console.log(lines);
                  for ( let line of lines) {
                    console.log(line);
                    let words = line.split(",");

                    //have to use 'gameObj'.. as scope is not in 'this' anymore.
                    gameObj.wordList.push(new WordPair(words[0].trim().toLowerCase(), words[1].trim()));
                  }
                  //alert(allText);
              }
          }
      }
      rawFile.send(null);
    }


    loadWordList(){
      // let wordListLink = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRFfw8Wc12Rn_OeQll12WTjnyMGWPegypnmHD5ng5sb3srI5ucOKjMutPh7FJijE1E7lsR8EHsOMZDl/pub?gid=43556301&single=true&output=csv";
      let wordListLink = "spreadsheets.google.com/spreadsheets/d/e/2PACX-1vRFfw8Wc12Rn_OeQll12WTjnyMGWPegypnmHD5ng5sb3srI5ucOKjMutPh7FJijE1E7lsR8EHsOMZDl/pub?gid=43556301&single=true&output=csv";
      wordListLink = corsProxy + wordListLink;

      let rawFile = new XMLHttpRequest();
      rawFile.open("GET", wordListLink, true);
      rawFile.onreadystatechange = function () {
        if(rawFile.readyState === 4)
          {
              if(rawFile.status === 200 || rawFile.status == 0)
              {
                  gameObj.wordList = [];

                  let allText = rawFile.responseText;
                  let lines = allText.split("\n");
                  console.log(lines);
                  for ( let line of lines) {
                    console.log(line);
                    let words = line.split(",");

                    //have to use 'gameObj'.. as scope is not in 'this' anymore.
                    // gameObj.wordList.push(new WordPair(words[0].trim().toLowerCase(), words[1].trim()));
                    //Add the key/pair values to the drop down box
                    var sel = document.getElementById("wordListId");
                    // create new option element
                    var opt = document.createElement('option');

                    // create text node to add to option element (opt)
                    opt.appendChild( document.createTextNode(words[0].trim()) );

                    // set value property of opt
                    opt.value = corsProxy + words[1].trim(); 

                    // add opt to end of select box (sel)
                    sel.appendChild(opt); 

                  }
                  //alert(allText);
              }
          }
      }
      rawFile.send();

    }
}

//Start Game!
let gameObj = new TypingGameLogic();
gameObj.loadWordList();


/**
 * General HTML helper functions.
 */
