const canvas = document.getElementById("fireworksCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let fireworks = [];
let particles = [];
let step = 0;

// Penyesuaian layar HP
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

function handleSurprise() {
    step++;
    const btn = document.getElementById("actionBtn");

    if (step === 1) {
        // Efek Tanaman, Bunga & Balon dari Bawah
        btn.innerText = "WOW, NEXT!";
        createGardenEffect();
    } else if (step === 2) {
        // Kembang Api Berbentuk Bunga
        btn.innerText = "ONE MORE SURPRISE!";
        launchFirework("flower");
    } else if (step === 3) {
        // Kembang Api Teks & Tampilkan Kartu
        btn.style.display = "none";
        document.getElementById("card").classList.remove("hidden");
        launchFirework("text");
        // Loop kembang api otomatis untuk perayaan
        setInterval(() => launchFirework("random"), 1000);
    }
}

class Particle {
    constructor(x, y, color, speed, angle, friction = 0.95) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.speed = speed;
        this.angle = angle;
        this.vx = Math.cos(this.angle) * this.speed;
        this.vy = Math.sin(this.angle) * this.speed;
        this.alpha = 1;
        this.friction = friction;
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
    }

    update() {
        this.vx *= this.friction;
        this.vy *= this.friction;
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= 0.015;
    }
}

function launchFirework(type) {
    const x = Math.random() * canvas.width;
    const y = canvas.height;
    const targetY = Math.random() * (canvas.height * 0.4);
    
    // Logika ledakan berdasarkan tipe (Bunga/Teks)
    setTimeout(() => explode(x, targetY, type), 1000);
}

function explode(x, y, type) {
    const colors = ['#FFFFFF', '#87CEEB', '#4682B4', '#F5F5F5'];
    
    if (type === "text") {
        ctx.font = "bold 30px Arial";
        ctx.fillStyle = "#4682B4";
        ctx.textAlign = "center";
        ctx.fillText("HAPPY BIRTHDAY!", x, y);
    }

    for (let i = 0; i < 80; i++) {
        const color = colors[Math.floor(Math.random() * colors.length)];
        particles.push(new Particle(x, y, color, Math.random() * 6, Math.random() * Math.PI * 2));
    }
}

function createGardenEffect() {
    // Sederhananya, kita buat efek partikel warna-warni 
    // mawar (merah), sakura (pink), lily (putih) yang naik dari bawah
    for (let i = 0; i < 30; i++) {
        const x = Math.random() * canvas.width;
        const colors = ['#FF0000', '#FFB7C5', '#FFFFFF', '#FFD700']; // Mawar, Sakura, Lily, Tulip
        setTimeout(() => {
            particles.push(new Particle(x, canvas.height, colors[i%4], 5, -Math.PI/2, 0.99));
        }, i * 100);
    }
}

function animate() {
    ctx.fillStyle = 'rgba(135, 206, 235, 0.2)'; // Efek trail biru muda
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p, index) => {
        p.update();
        p.draw();
        if (p.alpha <= 0) particles.splice(index, 1);
    });

    requestAnimationFrame(animate);
}

animate();