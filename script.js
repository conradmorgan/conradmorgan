const canvas = document.getElementById('canvas');
const c = canvas.getContext('2d');

var width = 6;
var height = canvas.height / canvas.width * width;

var left = -width/2;
var bottom = -height/2;

var waveFunction = [];
var wLen = canvas.width;
var co = Math.round((wLen - canvas.width) / 2);

function initialWaveFunction(x) {
    return [Math.exp(-(x+1)*(x+1)),
            0];
}

const E = 10;
function potential(x) {
    return Math.atan(x*3) + 2;
}

function normalize() {
    var sum = 0;
    var dx = getX(1) - getX(0);
    for (var i = 0; i < wLen; i++) {
        sum += getDensity(i) * dx;
    }
    for (var i = 0; i < wLen; i++) {
        waveFunction[i][0] /= Math.sqrt(sum);
        waveFunction[i][1] /= Math.sqrt(sum);
    }
}

for (var i = 0; i < wLen; i++) {
    waveFunction.push(initialWaveFunction(getX(i - co)));
}
waveFunction[0] = [0, 0];
waveFunction[wLen-1] = [0, 0];
normalize();

function getX(i) {
    return i / canvas.width * width + left;
}

function getPy(y) {
    return (1 - (y - bottom) / height) * canvas.height;
}

function getPx(x) {
    return (x - left) / width * canvas.width;
}

var time = 0;
var dt = 0.002;
var dx = getX(1) - getX(0);

function evolveWaveFunction() {
    for (var i = 1; i < wLen - 1; i++) {
        var dx = getX(1) - getX(0);
        var lapWFreal = 
            ((waveFunction[i+1][0] - waveFunction[i][0]) / dx -
            (waveFunction[i][0] - waveFunction[i-1][0]) / dx) / dx;
        var lapWFimag = 
            ((waveFunction[i+1][1] - waveFunction[i][1]) / dx -
            (waveFunction[i][1] - waveFunction[i-1][1]) / dx) / dx;
        var p = E*potential(getX(i - co));
        var h = 0;
        lapWFreal *= h;
        lapWFimag *= h;
        lapWFreal += p * waveFunction[i][0];
        lapWFimag += p * waveFunction[i][1];
        waveFunction[i][0] += -lapWFimag * dt;
        waveFunction[i][1] += lapWFreal * dt;
    }
    time += dt;
}

function drawAxes() {
    c.lineWidth = 1;
    c.strokeStyle = '#000000';
    c.beginPath();
    c.moveTo(0, getPy(0));
    c.lineTo(canvas.width - 1, getPy(0));
    c.stroke();
    c.moveTo(getPx(0), 0)
    c.lineTo(getPx(0), canvas.height - 1);
    c.stroke();
}

function drawPotential() {
    c.lineWidth = 2;
    c.strokeStyle = '#000000';
    c.beginPath();
    c.moveTo(0, getPy(-potential(getX(0))));
    for (var i = 1; i < canvas.width; i++) {
        c.lineTo(i, getPy(-potential(getX(i))));
    }
    c.stroke();
}

function drawWaveFunction() {
    c.lineWidth = 3;
    c.strokeStyle = '#ff0000';
    c.beginPath();
    c.moveTo(0, getPy(waveFunction[co][0]));
    for (var i = 1; i < canvas.width; i++) {
        c.lineTo(i, getPy(waveFunction[i + co][0]));
    }
    c.stroke();
    c.strokeStyle = '#0000ff';
    c.beginPath();
    c.moveTo(0, getPy(waveFunction[co][1]));
    for (var i = 1; i < canvas.width; i++) {
        c.lineTo(i, getPy(waveFunction[i + co][1]));
    }
    c.stroke();
}

function getDensity(i) {
    return waveFunction[i][0]*waveFunction[i][0] + waveFunction[i][1]*waveFunction[i][1];
}

function drawDensity() {
    c.lineWidth = 1;
    c.strokeStyle = '#00ff00';
    c.beginPath();
    c.moveTo(0, getPy(getDensity(co)));
    for (var i = 1; i < canvas.width; i++) {
        c.lineTo(i, getPy(getDensity(i + co)));
    }
    c.stroke();
}

function draw() {
    c.fillStyle = '#ffffff';
    c.clearRect(0, 0, canvas.width, canvas.height);
    drawAxes();
    drawPotential();
    drawWaveFunction();
    drawDensity();
}

function evolveAndDraw(t) {
    draw();
    evolveWaveFunction();
    normalize();
    window.requestAnimationFrame(evolveAndDraw);
}

evolveAndDraw(0);
