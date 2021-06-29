const displayedWordEl = document.getElementById("displayedWord")
const playerProposedLettersEl = document.getElementById("playerProposedLetters")
const proposedWordFormEl = document.getElementById("proposedWordForm")
const proposedWordEl = document.getElementById("proposedWord")
const loseShowWordEl = document.getElementById("loseShowWord")
const alertEl = document.getElementById("alert")
const playerWinEl = document.getElementById("playerWin")
const playerLoseEl = document.getElementById("playerLose")

let game = new Game()

/**
 * Dom event
 */

document.addEventListener("keyup", (event) => {
    game.onLetterPropose(event.key)
})

proposedWordFormEl.addEventListener("submit", (event) => {
    event.preventDefault()
    game.onWordPropose(proposedWordEl.value)
})

Array.from(document.getElementsByClassName("resetButton")).forEach(playAgainButton => {
    playAgainButton.addEventListener("click", (event) => {
        game.reset()
        closeModal("winModal")
        closeModal("loseModal")
    })
})

document.getElementById("statsButton").addEventListener("click", () => {
    console.log(game.player.getLose())
    console.log(localStorage.getItem("lose"))
    playerWinEl.innerText = game.player.getWin()
    playerLoseEl.innerText = game.player.getLose()
    openModal("statsModal")
})

/**
 * Function
 */

function initInterface() {
    displayedWordEl.innerText = game.displayWord.reduce((previousValue, currentValue) => `${previousValue}${currentValue}`, "")
    playerProposedLettersEl.innerText = "Aucune"
    playerWinEl.innerText = game.player.getWin()
    playerLoseEl.innerText = game.player.getLose()
}

function updatedStep(step) {
    document.body.style.boxShadow = `inset 0 0 ${10*step}px #bb2d2d`

    if (step == 0){
        for (let i = 1; i <= 7; i++) {
            document.getElementById("part_" + i).style.opacity = "0"

            if(! document.getElementById("heart_" + i).classList.contains("heart-orange"))
                document.getElementById("heart_" + i).classList.add("heart-orange")
        }

        return
    }

    document.getElementById("part_" + step).style.opacity = "1"
    document.getElementById("heart_" + step).classList.remove("heart-orange")
}

function openModal(id) {
    let modal = document.getElementById(id)

    modal.style.zIndex = "999"
    modal.style.opacity = "1"
}

function closeModal(id) {
    let modal = document.getElementById(id)

    modal.style.zIndex = "-1"
    modal.style.opacity = "0"
}

function alert(message) {
    alertEl.classList.remove("red-alert")
    alertEl.classList.remove("green-alert")
    alertEl.innerText = message
}

function showRedAlert(message) {
    alert(message)
    alertEl.classList.add("red-alert")
}

function showGreenAlert(message) {
    alert(message)
    alertEl.classList.add("green-alert")
}



/**
 * Init interface
 */

initInterface();


/**
 * Game events
 */


game.gameEvents.addEventListener("win", (event) => {
    openModal("winModal")
})

game.gameEvents.addEventListener("lose", (event) => {
    loseShowWordEl.innerText = event.game.word.reduce((previousValue, currentValue) => `${previousValue}${currentValue}`, "")
    proposedWordEl.setAttribute("disabled", true)
    openModal("loseModal")
})

game.gameEvents.addEventListener("word_display_change", (event) => {
    displayedWordEl.innerText = event.new_word
})

game.gameEvents.addEventListener("step_change", (event) => {
    updatedStep(event.step)
})

game.gameEvents.addEventListener("add_proposed_letter", (event) => {
    playerProposedLettersEl.innerText = event.proposed_letters
})

game.gameEvents.addEventListener("wrong_word_propose", (event) => {
    showRedAlert("Le mot proposer est incorrect")
})

game.gameEvents.addEventListener("not_authorized_letter", (event) => {
    showRedAlert("Cette lettre n'est pas authorisée")
})

game.gameEvents.addEventListener("already_proposed_letter", (event) => {
    showRedAlert("Vous avez déjà proposer cetter lettre")
})

game.gameEvents.addEventListener("bad_letter", (event) => {
    showRedAlert(`La lettre '${event.letter}' n'est pas dans le mot`)
})

game.gameEvents.addEventListener("good_letter", (event) => {
    showGreenAlert(`Bravo la lettre '${event.letter}' est dans le mot`)
})

game.gameEvents.addEventListener("reset", (event) => {
    displayedWordEl.innerText = event.game.displayWord.reduce((previousValue, currentValue) => `${previousValue}${currentValue}`, "")
    playerProposedLettersEl.innerText = "Aucune"
    proposedWordEl.removeAttribute("disabled")
    proposedWordEl.value = ""
    showGreenAlert("Le jeu a été réinitialiser")
})

game.gameEvents.addEventListener("player_win_count_change", (event) => {
    localStorage.getItem("win")
    playerWinEl.innerText = event.player.getWin()
})

game.gameEvents.addEventListener("player_lose_count_change", (event) => {
    localStorage.getItem("win")
    playerLoseEl.innerText = event.player.getLose()
})

console.log(localStorage.getItem("win"))