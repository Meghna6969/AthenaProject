const computer = document.querySelector('.computer img');
const player = document.querySelector('.player img');
const computerPoints = document.querySelector('.computerPoints');
const playerPoints = document.querySelector('.playerPoints');
const options = document.querySelectorAll('.options button');
const resultMessage = document.querySelector('.result-message')

options.forEach((option) => {
    option.addEventListener('click', () => {
        computer.src = "./BeforePlay.svg"
        player.src = "./BeforePlay.svg";
        computer.classList.add("shakeComputer");
        player.classList.add('shakePlayer');

        setTimeout(() => {
            computer.classList.remove("shakeComputer");
            player.classList.remove('shakePlayer');

            const playerChoice = option.innerHTML.toUpperCase();
            player.src = "./" + option.innerHTML + ".svg";

            const choice = ["ROCK", "PAPER", "SCISSORS", "SPOCK", "LIZARD"];
            let arrayNo = Math.floor(Math.random()*5);
            let computerChoice = choice[arrayNo];
            computer.src = "./" + computerChoice + ".svg";

            let cPoints = parseInt(computerPoints.innerHTML);
            let pPoints = parseInt(playerPoints.innerHTML);

            if(computerChoice === playerChoice){
                resultMessage.textContent = "It's a tie!"
                return;
            }


            if(player === "ROCK"){
                if(computerChoice === "PAPER" || computerChoice === "SPOCK"){
                    playerPoints.innerHTML = cPoints + 1;
                    resultMessage.textContent = `You win! ${playerChoice} beats ${computerChoice}`;
                }else if (computerChoie === "SCISSORS" || computerChoice === "LIZARD") {
                    computerPoints.innerHTML = pPoints + 1;
                    resultMessage.textContent = `You lose! ${computerChoice} beats ${playerChoice}`;
                }
            } else if (playerChoice === "PAPER"){
                if (computerChoice === "SCISSORS" || computerChoice === "LIZARD"){
                    computerPoints.innerHTML = cPoints + 1;
                    resultMessage.textContent = `You lose! ${computerChoice} beats ${playerChoice}`;
                } else if (computerChoice === "ROCK" || computerChoice === "SPOCK"){
                    playerPoints.innerHTML = pPoints + 1;
                    resultMessage.textContent = `You win! ${playerChoice} beats ${computerChoice}`;
                }
            } else if (playerChoice === "SCISSORS"){
                if(computerChoice === "ROCK" || computerChoice === "SPOCK"){
                    computerPoints.innerHTML = cPoints + 1;
                    resultMessage.textContent = `You lose! ${computerChoice} beats ${playerChoice}`;
                } else if (computerChoice === "PAPER" || computerChoice === "LIZARD"){
                    playerPoints.innerHTML = pPoints + 1;
                    resultMessage.textContent = `You win! ${playerChoice} beats ${computerChoice}`;
                }
            } else if (playerChoice === "LIZARD") {
                if (computerChoice === "ROCK" || computerChoice === "SCISSORS") {
                    computerPoints.innerHTML = cPoints + 1;
                    resultMessage.textContent = `You lose! ${computerChoice} beats ${playerChoice}`;
                } else if (computerChoice === "SPOCK" || computerChoice === "PAPER"){
                    playerPoints.innerHTML = pPoints + 1;
                    resultMessage.textContent = `You win! ${playerChoice} beats ${computerChoice}`;
                }
            }else if (playerChoice === "SPOCK"){
                if(computerChoice === "PAPER" || computerChoice === "LIZARD"){
                    computerPoints.innerHTML = cPoints + 1;
                    resultMessage.textContent = `You lose! ${computerChoice} beats ${playerChoice}`;
                } else if (computerChoice === "ROCK" || computerChoice === "SCISSORS"){
                    playerPoints.innerHTML = pPoints + 1;
                    resultMessage.textContent = `You win! ${playerChoice} beats ${computerChoice}`;
                }
            }
            
        }, 900);
    })
})
