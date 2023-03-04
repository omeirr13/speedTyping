const setOfWords = [
    "Yesterday, I woke up early and went for a jog in the park. The sun was just starting to rise, casting a warm glow over the trees and the grass.",
    "It felt good to stretch my legs and breathe in the fresh air. Afterwards, I headed back to my apartment and made myself a cup of coffee.",
    "I sat down at the kitchen table and opened up my laptop to check my email. I had a few new messages, but nothing urgent.",
    "I spent the rest of the morning working on a project for work, taking occasional breaks to look out the window and watch the world go by"
]

const msg = document.getElementById('msg');
const myWords = document.getElementById('mywords');
const btn = document.getElementById('btn');
const timer = document.getElementById('timer');
let timeInt = null;
const audio = new Audio("error.mp3");

let startTime, endTime;
let randomNum = -1;
let currentText = null;
let gameRunning = false;
let totalCorrectLetters = 0;

const correctLettersCount = () =>
{
    let countLetters = 0;
    let current = currentText.split(' ');
    let typed = myWords.value.split(' ');
    for(let i = 0;i<typed.length;i++)
    {
        if(typed[i] == current[i])
        {
            countLetters = countLetters + typed[i].split('').length  + 1;
        }
    }
    return countLetters
}

myWords.addEventListener("keydown", function(event) {
    if (event.key='Backspace' && myWords.selectionStart === myWords.value.length) 
    {
      return true;
    }
    else if (myWords.selectionStart < myWords.value.length) 
    {
        if(event.key != 'ArrowLeft' && event.key != 'ArrowRight' && event.key != 'ArrowUp' && event.key != 'ArrowDown')
        {
            event.preventDefault();
        }
    }
  });


  const runTimer = () =>
  {
    let seconds = 60;
    timeInt = setInterval(function(){
      seconds--;
      if(seconds <= 15)
      {
        timer.style.color='red';
      }
      else if(seconds <= 30)
      {
        timer.style.color='yellow';
      }
      if (seconds <= 0) {
        gameRunning = false;
        clearInterval(timeInt);
        const audio = new Audio("timeup.mp3");
        audio.play();
        totalCorrectLetters = totalCorrectLetters + correctLettersCount();
        endGame();
      }
      timer.innerHTML = `${seconds}s`;
    }, 1000)
  }
  

  function generateRandomWords()
  {
    let random = Math.floor(Math.random() * setOfWords.length);
    while(random == randomNum)
    {
        random = Math.floor(Math.random() * setOfWords.length);
    }
    randomNum = random;

    msg.innerHTML = "";
    currentText = setOfWords[random];
    const letters = currentText.split('');
    for(let i = 0;i<currentText.length;i++)
    {
        msg.innerHTML = msg.innerHTML + `<span>${currentText[i]}</span>`;
    }
  }

const playGame = () => {
    document.getElementById('final').innerHTML = "";
    generateRandomWords();

    console.log(msg.querySelectorAll('span'));

    let date = new Date();
    startTime = date.getTime();

    myWords.focus();
    myWords.value = "";
    btn.innerText = "Stop";

    runTimer();
}

let lastLen = -1;
let backspace = false;

myWords.oninput = function(){
    typeText = myWords.value;
    if(typeText.length < lastLen)
    {
        backspace = true;
        lastLen = typeText.length;
    }
    else
    {
        backspace = false;
        lastLen = typeText.length; 
        if(lastLen == 0)
        {
            lastLen = 1;
        } 
    }
    
    text = msg.querySelectorAll('span');
    if(backspace == true)
    {
        text[lastLen].style.color = 'white';
        text[lastLen].style.textDecoration = 'none';
    }

    let i = 0;
    for(i;i<typeText.length;i++)
    {
        if(typeText[i] == text[i].innerText)
        {
            text[i].style.color = 'lightgreen';
            text[i].style.textDecorationColor = 'green';
            text[i].style.textDecoration = 'underline';
        }
        else
        {
            audio.play();
            text[i].style.color = 'red';
            text[i].style.textDecorationColor = 'red';
            text[i].style.textDecoration = 'underline';
            break;
        }
    }
    if(i == text.length)
    {
        totalCorrectLetters = totalCorrectLetters + correctLettersCount();
        myWords.value = "";
        console.log(totalCorrectLetters);
        generateRandomWords();
    }
}

const wordCounter = (str) =>
{
    let count = str.split(' ').length;
    return count;
}
const endGame = () =>
{
    let date = new Date();
    endTime = date.getTime();
    let totalTime = (endTime - startTime)/1000;
    console.log(totalTime);

    let wpm = (totalCorrectLetters / 5);
    document.getElementById('final').innerHTML = `&nbsp;${wpm} wpm`;
    totalCorrectWords = 0;
}

btn.addEventListener('click', function(){
    if(this.innerText == 'Start')
    {
        gameRunning = true;
        myWords.disabled = false;
        playGame();
    }
    else if(this.innerText == 'Stop')
    {
        timer.innerHTML = "60s";
        timer.style.color="lightgreen";
        clearInterval(timeInt);
        myWords.disabled = true;
        btn.innerText = "Start";
        endGame();
    }
})