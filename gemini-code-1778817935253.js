const canvas = document.getElementById("fireworksCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];
let step = 0;

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Fungsi ini harus ada di scope global agar bisa dipanggil onclick
window.handleSurprise = function() {
    step++;
    const btn = document.getElementById("actionBtn");

    if (step === 1) {
        btn.innerText = "WOW, LAGI!";
        createGardenEffect();
    } else if (step === 2) {
        btn.innerText = "LIHAT KEJUTAN TERAKHIR!";
        for(let i=0; i<5; i++) {
            setTimeout(() => launchFirework("flower"), i * 500);
        }
    } else if (step === 3) {
        btn.style.display = "none";
        document.getElementById("card").classList.remove("hidden");
        launchFirework("text");
        // Kembang api otomatis setelah kartu muncul
        setInterval(() => launchFirework("random"), 1500);
    }
};

class Particle {
    constructor(x, y, color, speed, angle) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.speed = speed;
        this.angle = angle;
        this.vx = Math.cos(this.angle) * this.speed;
        this.vy = Math.sin(this.angle) * this.speed;
        this.alpha = 1;
        this.gravity = 0.05;
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
    }

    update() {
        this.vy += this.gravity;
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= 0.01;
    }
}

function launchFirework(type) {
    const x = Math.random() * canvas.width;
    const y = canvas.height;
    const targetY = Math.random() * (canvas.height * 0.5);
    explode(x, targetY, type);
}

function explode(x, y, type) {
    const colors = ['#FFFFFF', '#4682B4', '#B0E0E6', '#FFD700'];
    
    if (type === "text") {
        // Teks kembang api sederhana (visual flash)
        particles.push(new Particle(x, y, '#4682B4', 0, 0));
    }

    for (let i = 0; i < 50; i++) {
        const color = colors[Math.floor(Math.random() * colors.length)];
        particles.push(new Particle(x, y, color, Math.random() * 4, Math.random() * Math.PI * 2));
    }
}

function createGardenEffect() {
    // Efek bunga bermunculan dari bawah
    const flowerColors = ['#FF69B4', '#FFFFFF', '#ADD8E6', '#FFD700'];
    for (let i = 0; i < 40; i++) {
        setTimeout(() => {
            const x = Math.random() * canvas.width;
            particles.push(new Particle(x, canvas.height, flowerColors[i%4], Math.random() * 5 + 2, -Math.PI/2));
        }, i * 50);
    }
}

function animate() {
    // Memberikan efek trail transparan
    ctx.fillStyle = 'rgba(135, 206, 235, 0.3)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p, index) => {
        p.update();
        p.draw();
        if (p.alpha <= 0) particles.splice(index, 1);
    });

    requestAnimationFrame(animate);
}

animate();
