// script.js

// 1. Configuración del juego
const gameBoard = document.getElementById('game-board');
const resetButton = document.getElementById('reset-button');
const messageElement = document.querySelector('.message');

// Símbolos de programador para las parejas (8 parejas = 16 cartas)
const symbols = ['💻', '💾', '⚙️', '💡', '🐛', '🧩', '🚀', '🔑'];
let gameCards = [];

// Variables de estado del juego
let flippedCards = []; // Cartas actualmente volteadas (máximo 2)
let matchesFound = 0;
let isWaiting = false; // Bandera para evitar clics mientras se espera el resultado

// 2. Funciones principales

// Función para mezclar un array (Algoritmo de Fisher-Yates)
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Inicializa el tablero
function initializeGame() {
    // Duplica y mezcla los símbolos
    gameCards = shuffle([...symbols, ...symbols]);
    gameBoard.innerHTML = ''; // Limpia el tablero anterior
    flippedCards = [];
    matchesFound = 0;
    isWaiting = false;
    messageElement.textContent = 'Encuentra las parejas.';

    // Crea los elementos de las cartas
    gameCards.forEach((symbol, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.symbol = symbol; // Almacena el valor de la pareja
        card.dataset.index = index; // Para identificarla
        card.textContent = symbol;
        card.addEventListener('click', () => handleCardClick(card));
        gameBoard.appendChild(card);
    });
}

// Maneja el clic en una carta
function handleCardClick(card) {
    // No hacer nada si: ya está volteada, es una pareja, o estamos esperando
    if (card.classList.contains('flipped') || card.classList.contains('matched') || isWaiting) {
        return;
    }

    // Voltea la carta
    card.classList.add('flipped');
    flippedCards.push(card);

    // Si ya hay dos cartas volteadas, verifica la pareja
    if (flippedCards.length === 2) {
        isWaiting = true; // Detiene temporalmente otros clics
        setTimeout(checkForMatch, 1000); // Espera 1 segundo antes de verificar
    }
}

// Verifica si las dos cartas volteadas son una pareja
function checkForMatch() {
    const [card1, card2] = flippedCards;

    if (card1.dataset.symbol === card2.dataset.symbol) {
        // 🎉 ¡Es una pareja!
        card1.classList.add('matched');
        card2.classList.add('matched');
        matchesFound++;
        messageElement.textContent = `¡Pareja encontrada! Llevas ${matchesFound}/${symbols.length}.`;

        // Revisa si el juego terminó
        if (matchesFound === symbols.length) {
            messageElement.textContent = '🏆 ¡Felicidades! Has ganado el juego. 🥳';
        }
    } else {
        // 😞 No es una pareja, voltéalas de nuevo
        card1.classList.remove('flipped');
        card2.classList.remove('flipped');
        messageElement.textContent = 'No es una pareja. Intenta de nuevo.';
    }

    // Restablece el estado de las cartas volteadas
    flippedCards = [];
    isWaiting = false; // Permite nuevos clics
}

// 3. Event Listeners e Inicio
resetButton.addEventListener('click', initializeGame);

// Inicia el juego al cargar la página
initializeGame();