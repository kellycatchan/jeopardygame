let jeopardyData;
let currentQuestion = {};
let userInput;
let filteredData = new p5.Table();
let chosenCategory;
let counter = 0;
let points = 0;

function preload() {
  jeopardyData = loadTable('Jeopardy.csv', 'csv', 'header');
}

function setup() {
  background(186, 238, 255);
  createCanvas(windowWidth, windowHeight);
  
  userInput = createInput('');
  userInput.size(500,20);
  userInput.style('font-size','20px');
  userInput.position(width / 2 - userInput.width / 2, height + windowHeight * 1.5);
  
  let submitButton = createButton('Submit');
  submitButton.style('font-size', '20px');
  submitButton.style('background-color', color(255,215,0));
  submitButton.position(width / 2 - userInput.width / 2, height + windowHeight * 1.55);
  submitButton.mousePressed(checkAnswer);
  
  let pickCategory = createSelect();
  pickCategory.size(500,40);
  pickCategory.style('font-size','20px');
  pickCategory.position(width / 10, height + windowHeight * 0.95);
  pickCategory.option('Select an option', '');
  pickCategory.option('Pop culture, Arts, Sports');
  pickCategory.option('Math, Science, Health');
  pickCategory.option('Language Arts, Literature, Phrases');
  pickCategory.option('History, Culture, Geography, Politics');
  pickCategory.selected('');
  pickCategory.changed(() => {
    chosenCategory = pickCategory.value();
    console.log(chosenCategory);
  })
  
  let startButton = createButton('Start Game');
  startButton.position(width / 10, height + windowHeight * 1.1);
  startButton.style('font-size', '20px');
  startButton.mousePressed(filterQuestions);
}


function filterQuestions() {
  for (let i = 0; i < jeopardyData.getRowCount(); i++) {
    
    let row = jeopardyData.getRow(i);
    let columnValue = row.get('category_group');

    if (columnValue === chosenCategory) {
      filteredData.addRow(row);
    }
  }
  for (let i = 0; i < filteredData.length; i++) {
    let filteredRow = filteredData[i];
    console.log(filteredRow);
  }
  
  if (filteredData.getRowCount() > 0) {
    showRandomQuestion();
  }
}

function showRandomQuestion() {
 
  let rowIndex = floor(random(filteredData.getRowCount()));
    
  currentQuestion = {
    category: filteredData.getString(rowIndex, 'category'),
    question: filteredData.getString(rowIndex, 'question'),
    answer: filteredData.getString(rowIndex, 'answer'),
    points: filteredData.getNum(rowIndex, 'clue_value')
  };
    
}

function draw() {
  background(186, 238, 255);
  displayQuestion();
}

function displayQuestion() {
  textSize(15);
  fill(0);
  textAlign(CENTER, CENTER);
  
  text(`Category: ${currentQuestion.category}`, width / 2, 200);
  text(`Points: ${currentQuestion.points}`, width / 2, 250);
  text(`Question: ${currentQuestion.answer}`, width / 2, 350);
  
  textSize(15);
  fill(0);
  textAlign(CENTER, CENTER);
  text(`Your point total: ${points}`, width / 2, 550)
}


function checkAnswer() {
  counter++;
  let inputValue = userInput.value().toLowerCase();
  console.log('User Input:', inputValue);
console.log('Correct Answer:', currentQuestion.question);
  
  if (inputValue === currentQuestion.question.toLowerCase()) {
    
    points += currentQuestion.points;
    
    alert(`Correct! The answer is ${currentQuestion.question}. You earned ${currentQuestion.points} points.`);
    
    if (counter < 11) {
    userInput.value('');  
    showRandomQuestion();
  }
  else {
    alert(`That concludes your game! Great job, you earned ${points} points.`);
  }
    
  }
  
  else {
    alert(`Wrong! The answer is ${currentQuestion.question}. You earned 0 points.`);
    
    if (counter < 11) {
    showRandomQuestion();
  }
  else {
    alert(`That concludes your game! Great job, you earned ${points} points.`);
    askToRestart();
  }   
 } 
}

function askToRestart() {
  let confirmRestart = confirm('Do you want to restart the game?');
  
  if (confirmRestart) {
    counter = 0;
    points = 0;
    filteredData = new p5.Table();
    currentQuestion = {}
    userInput.value('');
    setup();
  } 
  else {
    console.log('See you next time!');
  }
  
}
