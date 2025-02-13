document.addEventListener("DOMContentLoaded", () => {
    const images = [
        "assets/img1.jpg",
        "assets/img2.jpg",
        "assets/img3.jpg",
        "assets/img4.jpg",
        "assets/img9.webp",
        "assets/img7.jpg"
    ];
    let board = [...images, ...images];
    let firstCard = null, secondCard = null, lockBoard = false;
    let attempts = 3, pairsFound = 0;
    let timer = 30;
    let countdown;
    let gameStarted = false; // Para controlar si el juego ha comenzado
    const prizes = [
        "No ganaste nada 😢, pero puedes intentar de nuevo.",
        "Ganaste 🎨 Un set de acuarelas",
        "Ganaste 🍽️ Una cena/comida fuera de casa!",
        "GANASTE 🎮 5,000 Pavos en Fortnite!"
    ];
    const gameBoard = document.getElementById("gameBoard");
    const timeDisplay = document.getElementById("time");
    const attemptsDisplay = document.getElementById("remaining");
    const message = document.getElementById("message");
    const restartBtn = document.getElementById("restart");

    function shuffle(array) {
        return array.sort(() => Math.random() - 0.5);
    }

    function createBoard() {
        gameBoard.innerHTML = "";
        board = shuffle(board);
        board.forEach((imgSrc, index) => {
            const card = document.createElement("div");
            card.classList.add("card");
            card.dataset.index = index;
            card.innerHTML = `<img src="${imgSrc}" alt="card">`;
            card.addEventListener("click", flipCard);
            gameBoard.appendChild(card);
        });
    }

    function flipCard() {
        if (lockBoard || this.classList.contains("flipped")) return;

        // Iniciar el temporizador en la primera interacción
        if (!gameStarted) {
            gameStarted = true;
            startTimer();
        }

        this.classList.add("flipped");

        if (!firstCard) {
            firstCard = this;
        } else {
            secondCard = this;
            lockBoard = true;
            checkMatch();
        }
    }

    function checkMatch() {
        if (firstCard.innerHTML === secondCard.innerHTML) {
            pairsFound++;
            resetBoard();
        } else {
            setTimeout(() => {
                firstCard.classList.remove("flipped");
                secondCard.classList.remove("flipped");
                resetBoard();
            }, 1000);
        }
        attempts--;
        attemptsDisplay.textContent = attempts;
        checkGameOver();
    }

    function resetBoard() {
        [firstCard, secondCard, lockBoard] = [null, null, false];
    }

    function checkGameOver() {
        if (pairsFound === 3 || timer === 0 || attempts === 0) {
            clearInterval(countdown);
            if (pairsFound === 3) {
                message.textContent = "¡Ganaste: " + prizes[3] + "!";
            } else if (timer === 0) {
                if (pairsFound === 0) {
                    // Si no se adivinó ningún par, reorganizar las tarjetas
                    message.textContent = "¡Tiempo agotado! " + prizes[0];
                    setTimeout(() => {
                        resetGame();
                    }, 2000); // Esperar 2 segundos antes de reiniciar
                } else {
                    message.textContent = "¡Ganaste: " + prizes[pairsFound] + "!";
                }
            } else if (attempts === 0) {
                message.textContent = "¡Se acabaron los intentos! " + prizes[pairsFound];
            }
        }
    }

    function startTimer() {
        clearInterval(countdown);
        countdown = setInterval(() => {
            timer--;
            timeDisplay.textContent = timer;
            if (timer === 0) {
                checkGameOver();
            }
        }, 1000);
    }

    function resetGame() {
        attempts = 3;
        pairsFound = 0;
        timer = 30;
        gameStarted = false;
        message.textContent = "";
        attemptsDisplay.textContent = attempts;
        timeDisplay.textContent = timer;
        createBoard();
    }

    restartBtn.addEventListener("click", () => {
        resetGame();
        startTimer();
    });

    // Inicializar el juego
    createBoard();
});

// Obtener referencias a los elementos del DOM
const modal = document.getElementById("rulesModal");
const openModalBtn = document.getElementById("openModalBtn");
const closeModalBtn = document.querySelector(".close");
const startGameBtn = document.getElementById("startGameBtn");

// Función para abrir el modal
function openModal() {
    modal.style.display = "block";
}

// Función para cerrar el modal
function closeModal() {
    modal.style.display = "none";
}

// Eventos para abrir y cerrar el modal
openModalBtn.addEventListener("click", openModal);
closeModalBtn.addEventListener("click", closeModal);
startGameBtn.addEventListener("click", closeModal);

// Cerrar el modal si el usuario hace clic fuera del contenido
window.addEventListener("click", (event) => {
    if (event.target === modal) {
        closeModal();
    }
});

// Mostrar el modal automáticamente al cargar la página
window.onload = openModal;