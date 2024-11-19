// Функции для конвертации между цветовыми моделями

// Функция CMYK -> RGB
function cmykToRgb(c, m, y, k) {
    const r = 255 * (1 - c / 100) * (1 - k / 100);
    const g = 255 * (1 - m / 100) * (1 - k / 100);
    const b = 255 * (1 - y / 100) * (1 - k / 100);
    return [Math.round(r), Math.round(g), Math.round(b)];
}

// Функция RGB -> HSV
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

// Функция RGB -> CMYK
function rgbToCmyk(r, g, b) {
    const k = 1 - Math.max(r / 255, g / 255, b / 255);
    const c = (1 - r / 255 - k) / (1 - k) || 0;
    const m = (1 - g / 255 - k) / (1 - k) || 0;
    const y = (1 - b / 255 - k) / (1 - k) || 0;
    return [Math.round(c * 100), Math.round(m * 100), Math.round(y * 100), Math.round(k * 100)];
}

// Функция HSV -> RGB
function hsvToRgb(h, s, v) {
    let r, g, b;
    const f = (n, k = (n + h / 60) % 6) => v * (1 - s * Math.max(Math.min(k, 4 - k, 1), 0));
    [r, g, b] = [0, 1, 2].map(n => Math.round(f(n) * 255));
    return [r, g, b];
}

// Функция для валидации ввода
function validateInput(value, min, max) {
    let number = parseFloat(value);
    return isNaN(number) ? min : Math.max(min, Math.min(max, number));
}

// Обновление значений
function updateColors(el) {
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

    cInput.value = validateInput(cInput.value, 0, 100);
    mInput.value = validateInput(mInput.value, 0, 100);
    yInput.value = validateInput(yInput.value, 0, 100);
    kInput.value = validateInput(kInput.value, 0, 100);
    rInput.value = validateInput(rInput.value, 0, 255);
    gInput.value = validateInput(gInput.value, 0, 255);
    bInput.value = validateInput(bInput.value, 0, 255);
    hInput.value = validateInput(hInput.value, 0, 360);
    sInput.value = validateInput(sInput.value, 0, 100);
    vInput.value = validateInput(vInput.value, 0, 100);

    // Определяем, какие координаты изменились и обновляем другие модели
    if (el === rInput || el === gInput || el === bInput) {
        // Изменился RGB, пересчитываем CMYK и HSV
        const [cmykC, cmykM, cmykY, cmykK] = rgbToCmyk(r, g, b);
        cInput.value = cmykC;
        mInput.value = cmykM;
        yInput.value = cmykY;
        kInput.value = cmykK;

        const [hsvH, hsvS, hsvV] = rgbToHsv(r, g, b);
        hInput.value = hsvH;
        sInput.value = hsvS;
        vInput.value = hsvV;
    } else if (el === cInput || el === mInput || el === yInput || el === kInput) {
        // Изменился CMYK, пересчитываем RGB и HSV
        const [rgbR, rgbG, rgbB] = cmykToRgb(c, m, y, k);
        rInput.value = rgbR;
        gInput.value = rgbG;
        bInput.value = rgbB;

        const [hsvH, hsvS, hsvV] = rgbToHsv(rgbR, rgbG, rgbB);
        hInput.value = hsvH;
        sInput.value = hsvS;
        vInput.value = hsvV;
    } else if (el === hInput || el === sInput || el === vInput) {
        // Изменился HSV, пересчитываем RGB и CMYK
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

    // Обновляем ползунки
    document.getElementById('c-slider').value = cInput.value;
    document.getElementById('m-slider').value = mInput.value;
    document.getElementById('y-slider').value = yInput.value;
    document.getElementById('k-slider').value = kInput.value;
    document.getElementById('r-slider').value = rInput.value;
    document.getElementById('g-slider').value = gInput.value;
    document.getElementById('b-slider').value = bInput.value;
    document.getElementById('h-slider').value = hInput.value;
    document.getElementById('s-slider').value = sInput.value;
    document.getElementById('v-slider').value = vInput.value;

    // Обновляем цвет фона
    document.body.style.backgroundColor = `rgb(${rInput.value}, ${gInput.value}, ${bInput.value})`;
}

// Обработчики событий для инпутов и ползунков
const inputs = document.querySelectorAll('input[type="number"]');
inputs.forEach(input => {
    input.addEventListener('input', (e)=>{updateColors(e.target)});
});

const sliders = document.querySelectorAll('input[type="range"]');
sliders.forEach(slider => {
    slider.addEventListener('input', (event) => {
        const sliderId = event.target.id;
        const value = event.target.value;

        // Синхронизация ползунков и полей ввода
        switch (sliderId) {
            case 'c-slider':
                document.getElementById('c').value = value;
                updateColors(document.getElementById('c'));
                break;
            case 'm-slider':
                document.getElementById('m').value = value;
                updateColors(document.getElementById('m'));
                break;
            case 'y-slider':
                document.getElementById('y').value = value;
                updateColors(document.getElementById('y'));
                break;
            case 'k-slider':
                document.getElementById('k').value = value;
                updateColors(document.getElementById('k'));
                break;
            case 'r-slider':
                document.getElementById('r').value = value;
                updateColors(document.getElementById('r'));
                break;
            case 'g-slider':
                document.getElementById('g').value = value;
                updateColors(document.getElementById('g'));
                break;
            case 'b-slider':
                document.getElementById('b').value = value;
                updateColors(document.getElementById('b'));
                break;
            case 'h-slider':
                document.getElementById('h').value = value;
                updateColors(document.getElementById('h'));
                break;
            case 's-slider':
                document.getElementById('s').value = value;
                updateColors(document.getElementById('s'));
                break;
            case 'v-slider':
                document.getElementById('v').value = value;
                updateColors(document.getElementById('v'));
                break;
        }
        // Обновляем цвета после изменения ползунка
    });
});

// Инициализация страницы (например, если есть предустановленные значения, применим их)
document.addEventListener('DOMContentLoaded', () => {
    updateColors(document.getElementById('v'));
    // Обновить начальные значения на странице
});