// script.js

// Obtener el lienzo y establecer el contexto 2D
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 600;

// Variables globales
let player = {
    x: canvas.width / 2 - 20,
    y: canvas.height - 60,
    width: 40,
    height: 40,
    color: 'blue',
    speed: 7, // Aumentamos la velocidad del jugador
    bullets: []
};

let zombies = [];
let zombieSpeed = 1.2; // La velocidad inicial de los zombis
let score = 0;
let gameOver = false;

// Evento para mover al jugador
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' && player.x > 0) {
        player.x -= player.speed;
    } else if (e.key === 'ArrowRight' && player.x + player.width < canvas.width) {
        player.x += player.speed;
    } else if (e.key === ' ') { // Barra espaciadora
        shootBullet();
    }
});

// Función para disparar
function shootBullet() {
    player.bullets.push({
        x: player.x + player.width / 2 - 2.5,
        y: player.y,
        width: 5,
        height: 10,
        color: 'yellow',
        speed: 7
    });
}

// Generar zombis aleatorios que se mueven hacia el jugador
function createZombie() {
    const zombie = {
        x: Math.random() * (canvas.width - 40),
        y: Math.random() * -50,  // Genera zombis en una posición aleatoria fuera de la pantalla
        width: 40,
        height: 40,
        color: 'green',
        speed: zombieSpeed
    };
    zombies.push(zombie);
}

// Actualizar la posición de los zombis y las balas
function updateGameObjects() {
    // Mover las balas
    player.bullets.forEach((bullet, bulletIndex) => {
        bullet.y -= bullet.speed;

        // Eliminar balas que salen de la pantalla
        if (bullet.y < 0) {
            player.bullets.splice(bulletIndex, 1);
        }
    });

    // Mover zombis hacia el jugador
    zombies.forEach((zombie, zombieIndex) => {
        // Calcular la dirección hacia el jugador
        let dx = player.x - zombie.x;
        let dy = player.y - zombie.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        // Mover el zombi hacia el jugador
        zombie.x += (dx / distance) * zombie.speed;
        zombie.y += (dy / distance) * zombie.speed;

        // Eliminar zombis que llegan al jugador (Game Over)
        if (distance < 30) {  // Si el zombi está lo suficientemente cerca del jugador
            gameOver = true; // Termina el juego
        }

        // Detectar colisiones con balas
        player.bullets.forEach((bullet, bulletIndex) => {
            if (bullet.x < zombie.x + zombie.width &&
                bullet.x + bullet.width > zombie.x &&
                bullet.y < zombie.y + zombie.height &&
                bullet.y + bullet.height > zombie.y) {
                // Eliminar el zombi y la bala
                zombies.splice(zombieIndex, 1);
                player.bullets.splice(bulletIndex, 1);
                score += 10; // Aumentar puntuación al matar zombi
                document.getElementById('score').textContent = score;
            }
        });
    });
}

// Dibujar el jugador
function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

// Dibujar las balas
function drawBullets() {
    player.bullets.forEach((bullet) => {
        ctx.fillStyle = bullet.color;
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });
}

// Dibujar los zombis
function drawZombies() {
    zombies.forEach((zombie) => {
        ctx.fillStyle = zombie.color;
        ctx.fillRect(zombie.x, zombie.y, zombie.width, zombie.height);
    });
}

// Función principal del bucle del juego
function gameLoop() {
    if (gameOver) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'red';
        ctx.font = '48px Arial';
        ctx.fillText('¡Juego Terminado!', canvas.width / 2 - 150, canvas.height / 2);
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Crear zombis de forma aleatoria
    if (Math.random() < 0.02) {
        createZombie();
    }

    updateGameObjects();
    drawPlayer();
    drawBullets();
    drawZombies();

    requestAnimationFrame(gameLoop);
}

// Iniciar el bucle del juego
gameLoop();
