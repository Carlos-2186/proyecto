const ctx = pintura.getContext('2d');

let objetos = [
    { nombre: 'juanito perez', x: 50, y: 0, width: 10, color: '#aa9900', velocidad: 0.1, activo: true },
    { nombre: 'piedra2', x: 80, y: 0, width: 10, color: '#BB1100', velocidad: 1, activo: true },
    { nombre: 'piedra3', x: 20, y: 60, width: 10, color: '#aa99CC', velocidad: 2, activo: true },
    { nombre: 'piedra4', x: 350, y: 0, width: 10, color: '#025', velocidad: 2, activo: true },
];

const minRad = 10;
const rangeRad = 20;
let p = 0;
let x = 0, y = 0;
let mouseRadioCrece = true;
let finJuego = false;
let puntaje = 0;

let proyectiles = [];

// colisión
colision = (objecto1, objecto2) => {
    const distancia = Math.sqrt((objecto2.x - objecto1.x) ** 2 + (objecto2.y - objecto1.y) ** 2);
    return distancia <= (objecto1.width / 2 + objecto2.width / 2);
};

// disparo
function dispararProyectil(x, y) {
    const proyectil = {
        x: x,
        y: y,
        radius: 5,
        color: '#FF0000',
        velocidad: 2,
        direccionX: 0,
        direccionY: -1,
    };
    proyectiles.push(proyectil);
}

// img puntaje
function dibujarPuntaje() {
    ctx.font = '20px Arial';
    ctx.fillStyle = '#000000';
    ctx.fillText('Puntaje: ' + puntaje, 10, 30);
}

function animate() {
    if (mouseRadioCrece) {
        p = p + 0.01;
        if (p > 1) {
            mouseRadioCrece = false;
        }
    } else {
        p = p - 0.01;
        if (p < 0.1) {
            mouseRadioCrece = true;
        }
    }

    const rad = minRad + rangeRad * p;
    ctx.clearRect(0, 0, pintura.width, pintura.height);
// objetos 
    objetos.forEach((objeto, index) => {
        if (objeto.activo) {
            ctx.beginPath();
            ctx.arc(objeto.x, objeto.y, objeto.width, 0, Math.PI * 2);
            ctx.fillStyle = objeto.color;
            ctx.fill();
            ctx.stroke();
            ctx.font = "10px Arial";
            const a = ctx.measureText(objeto.nombre);
            ctx.fillText(objeto.nombre, objeto.x - a.width / 2, objeto.y + 20);
// colisión  mouse
            if (colision({ x: x, y: y, width: rad }, objeto)) {
                alert('¡Perdiste!');
                finJuego = true;
            }

            objeto.y += objeto.velocidad;
            if (objeto.y > pintura.height) {
                objeto.y = 0;
                objeto.velocidad *= 1.2;
                puntaje += 5;

                objeto.x = Math.random() * pintura.width;
            }
        }
    });

    // Colicion proyectiles
    proyectiles.forEach((proyectil, pIndex) => {
        ctx.beginPath();
        ctx.arc(proyectil.x, proyectil.y, proyectil.radius, 0, Math.PI * 2);
        ctx.fillStyle = proyectil.color;
        ctx.fill();
        ctx.stroke();

        proyectil.x += proyectil.direccionX * proyectil.velocidad;
        proyectil.y += proyectil.direccionY * proyectil.velocidad;

        objetos.forEach((objeto, oIndex) => {
            if (colision(proyectil, objeto) && objeto.activo) {
                objeto.activo = false;
                proyectiles.splice(pIndex, 1);
                puntaje += 10;
                return; 
            }
        });
    })

    //  mouse
    ctx.beginPath();
    ctx.arc(x, y, rad, 0, Math.PI * 2);
    ctx.fillStyle = '#1288AA';
    ctx.fill();
    ctx.stroke();

    // bord
    ctx.beginPath();
    ctx.rect(1, 1, pintura.width - 1, pintura.height - 1);
    ctx.stroke();

    dibujarPuntaje();

    if (!finJuego) {
        requestAnimationFrame(animate);
    }
}

animate();

pintura.addEventListener('mousemove', (info) => {
    x = info.x;
    y = info.y;
});

pintura.addEventListener('click', (info) => {
    dispararProyectil(info.x, info.y);
});





