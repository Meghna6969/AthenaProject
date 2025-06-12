const computer = document.querySelector('.computerimg');
const player = document.querySelector('.playerimg');
const computerPoints = document.querySelector('.computerPoints');
const playerPoints = document.querySelector('.playerPoints');
const options = document.querySelectorAll('.options button');

options.forEach((option) => {
    option.addEventListener('click', () => {
        computer.classList.add("shakeComputer");
        player.classList.add('shakePlayer');

        setTimeout(() => {
            computer.classList.remove("shakeComputer");
            player.classList.remove('shakePlayer');

            player.src = "./" + option.innerHTML + ".svg";
            const choice = ["ROCK", "PAPER", "SCISSORS", "SPOCK", "LIZARD"];
            let arrayNo = Math.floor(Math.random()*5);
            let computerChoice = choice[arrayNo];
            computer.src = "./" + computerChoice + ".svg";

            let cPoints = parseInt(computerPoints.innerHTML);
            let pPoints = parseInt(playerPoints.innerHTML);
            if(option.innerHTML === "ROCK"){
                if (computerChoice === "PAPER")
                    computerPoints.innerHTML = cPoints + 1;
                else if (computerChoice === "SCISSORS")
                    playerPoints.innerHTML = pPoints + 1;
            } else if(option.innerHTML === "PAPER"){
                if(computerChoice === "SCISSORS"){
                    computerPoints.innerHTML = cPoints + 1;
                }
                else if (computerChoice === "ROCK"){
                    playerPoints.innerHTML = pPoints + 1;
                }
            } else {
                if(computerChoice === "STONE"){
                    computerPoints.innerHTML = cPoints + 1;
                } else if (computerChoice === "PAPER") {
                    playerPoints.innerHTML = pPoints + 1;
                }
            }
        }, 900);
    })
})
