function cmykToRgb(c, m, y, k) {
    const r = 255 * (1 - c / 100) * (1 - k / 100);
    const g = 255 * (1 - m / 100) * (1 - k / 100);
    const b = 255 * (1 - y / 100) * (1 - k / 100);
    return [Math.round(r), Math.round(g), Math.round(b)];
}

function rgbToHsv(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, v = max;

    const d = max - min;
    s = max === 0 ? 0 : d / max;

    if (max === min) {
        h = 0; // achromatic
    } else {
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return [Math.round(h * 360), Math.round(s * 100), Math.round(v * 100)];
}

function rgbToCmyk(r, g, b) {
    const k = 1 - Math.max(r / 255, g / 255, b / 255);
    const c = (1 - r / 255 - k) / (1 - k) || 0;
    const m = (1 - g / 255 - k) / (1 - k) || 0;
    const y = (1 - b / 255 - k) / (1 - k) || 0;
    return [Math.round(c * 100), Math.round(m * 100), Math.round(y * 100), Math.round(k * 100)];
}

function hsvToRgb(h, s, v) {
    let r, g, b;
    const f = (n, k = (n + h / 60) % 6) => v * (1 - s * Math.max(Math.min(k, 4 - k, 1), 0));
    [r, g, b] = [0, 1, 2].map(n => Math.round(f(n) * 255));
    return [r, g, b];
}

function validateInput(value, min, max) {
    let number = parseFloat(value);
    return isNaN(number) ? min : Math.max(min, Math.min(max, number));
}

function updateColors() {
    const cInput = document.getElementById('c');
    const mInput = document.getElementById('m');
    const yInput = document.getElementById('y');
    const kInput = document.getElementById('k');
    const rInput = document.getElementById('r');
    const gInput = document.getElementById('g');
    const bInput = document.getElementById('b');
    const hInput = document.getElementById('h');
    const sInput = document.getElementById('s');
    const vInput = document.getElementById('v');

    const c = validateInput(cInput.value, 0, 100);
    const m = validateInput(mInput.value, 0, 100);
    const y = validateInput(yInput.value, 0, 100);
    const k = validateInput(kInput.value, 0, 100);
    const r = validateInput(rInput.value, 0, 255);
    const g = validateInput(gInput.value, 0, 255);
    const b = validateInput(bInput.value, 0, 255);
    const h = validateInput(hInput.value, 0, 360);
    const s = validateInput(sInput.value, 0, 100);
    const v = validateInput(vInput.value, 0, 100);

    // Определяем, какие координаты изменились
    if (document.activeElement === rInput || document.activeElement === gInput || document.activeElement === bInput) {
        const [cmykC, cmykM, cmykY, cmykK] = rgbToCmyk(r, g, b);
        cInput.value = cmykC;
        mInput.value = cmykM;
        yInput.value = cmykY;
        kInput.value = cmykK;

        const [hsvH, hsvS, hsvV] = rgbToHsv(r, g, b);
        hInput.value = hsvH;
        sInput.value = hsvS;
        vInput.value = hsvV;
    } else if (document.activeElement === cInput || document.activeElement === mInput || document.activeElement === yInput || document.activeElement === kInput) {
        const [rgbR, rgbG, rgbB] = cmykToRgb(c, m, y, k);
        rInput.value = rgbR;
        gInput.value = rgbG;
        bInput.value = rgbB;

        const [hsvH, hsvS, hsvV] = rgbToHsv(rgbR, rgbG, rgbB);
        hInput.value = hsvH;
        sInput.value = hsvS;
        vInput.value = hsvV;
    } else if (document.activeElement === hInput || document.activeElement === sInput || document.activeElement === vInput) {
        const [tempR, tempG, tempB] = hsvToRgb(h, s / 100, v / 100);
        rInput.value = tempR;
        gInput.value = tempG;
        bInput.value = tempB;

        const [cmykC, cmykM, cmykY, cmykK] = rgbToCmyk(tempR, tempG, tempB);
        cInput.value = cmykC;
        mInput.value = cmykM;
        yInput.value = cmykY;
        kInput.value = cmykK;
    }

    document.body.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
}

// Обработчик событий для инпутов
const inputs = document.querySelectorAll('input');
inputs.forEach(input => {
    input.addEventListener('input', updateColors); // Используем 'blur'
});