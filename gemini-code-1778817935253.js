const canvas = document.getElementById("mainCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let elements = [];
let giftStep = 0;

function goToPage2() {
    document.getElementById("page1").classList.add("hidden");
    document.getElementById("page2").classList.remove("hidden");
}

function handleGift() {
    giftStep++;
    if (giftStep === 1) {
        // Sesi 1: Bunga, Balon, Confetti
        startGardenAndBalloons();
        startConfetti();
    } else if (giftStep % 2 === 0) {
        // Sesi 2: Kembang Api Teks (Setiap klik genap)
        launchFireworkText();
    } else {
        // Sesi 3: Kembang Api Biasa (Setiap klik ganjil setelah step 1)
        launchFireworkNormal();
    }
}

// Objek untuk partikel (Bunga, Balon, Kembang api)
class Element {
    constructor(x, y, type, color, speedY, text = "") {
        this.x = x;
        this.y = y;
        this.type = type;
        this.color = color;
        this.speedY = speedY;
        this.speedX = (Math.random() - 0.5) * 2;
        this.alpha = 1;
        this.text = text;
        this.life = 0;
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        if (this.type === 'balloon') {
            ctx.beginPath();
            ctx.arc(this.x, this.y, 15, 0, Math.PI * 2);
            ctx.fill();
        } else if (this.type === 'flower') {
            ctx.font = "20px Arial";
            ctx.fillText("🌸", this.x, this.y); // Bisa diganti mawar 🌹 dll
        } else if (this.type === 'textFW') {
            ctx.font = "bold 35px Montserrat";
            ctx.textAlign = "center";
            ctx.fillText(this.text, this.x, this.y);
        } else {
            ctx.beginPath();
            ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
    }

    update() {
        this.y -= this.speedY;
        this.x += this.speedX;
        if (this.type === 'textFW') {
            this.life++;
            if (this.life > 120) this.alpha -= 0.02; // Muncul 2 detik (60fps * 2)
        } else {
            this.alpha -= 0.005;
        }
    }
}

function startGardenAndBalloons() {
    // Balon terbang durasi sedang
    setInterval(() => {
        const colors = ['#FF9999', '#99FF99', '#9999FF', '#FFFF99'];
        elements.push(new Element(Math.random() * canvas.width, canvas.height, 'balloon', colors[Math.floor(Math.random()*4)], 2));
    }, 500);

    // Bunga muncul dari bawah
    setInterval(() => {
        elements.push(new Element(Math.random() * canvas.width, canvas.height, 'flower', '', 1.5));
    }, 700);
}

function startConfetti() {
    for(let i=0; i<100; i++) {
        // Confetti dari kiri & kanan atas
        const xPos = i % 2 === 0 ? 0 : canvas.width;
        elements.push(new Element(xPos, 0, 'pixel', `hsl(${Math.random()*360}, 100%, 50%)`, -Math.random()*3));
    }
}

function launchFireworkText() {
    elements.push(new Element(canvas.width/2, canvas.height/2, 'textFW', '#4682B4', 0, "HAPPY BIRTHDAY"));
}

function launchFireworkNormal() {
    const x = Math.random() * canvas.width;
    const y = Math.random() * (canvas.height/2);
    for(let i=0; i<30; i++) {
        elements.push(new Element(x, y, 'pixel', '#FFF', (Math.random()-0.5)*4));
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    elements.forEach((el, index) => {
        el.update();
        el.draw();
        if (el.alpha <= 0 || el.y < -50) elements.splice(index, 1);
    });
    requestAnimationFrame(animate);
}

animate();
