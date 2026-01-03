// 1. CORRECTED CHOGHADIYA SEQUENCES (Standard Vedic/Drik Panchang)
const choghadiyaTypes = {
    amrit: { name: 'Amrit (अमृत)', desc: 'Most auspicious - Perfect for all activities', class: 'amrit' },
    shubh: { name: 'Shubh (शुभ)', desc: 'Auspicious - Good for new beginnings', class: 'shubh' },
    labh: { name: 'Labh (लाभ)', desc: 'Profitable - Ideal for financial matters', class: 'labh' },
    char: { name: 'Char (चर)', desc: 'Moveable - Good for travel', class: 'char' },
    udveg: { name: 'Udveg (उद्वेग)', desc: 'Anxiety - Avoid important work', class: 'udveg' },
    kaal: { name: 'Kaal (काल)', desc: 'Death - Inauspicious, avoid', class: 'kaal' },
    rog: { name: 'Rog (रोग)', desc: 'Disease - Avoid new ventures', class: 'rog' }
};

// Sequences for each day (Starting from Sunrise)
const daySequences = {
    0: ['udveg', 'char', 'labh', 'amrit', 'kaal', 'shubh', 'rog', 'udveg'], // Sun
    1: ['amrit', 'kaal', 'shubh', 'rog', 'udveg', 'char', 'labh', 'amrit'], // Mon
    2: ['rog', 'udveg', 'char', 'labh', 'amrit', 'kaal', 'shubh', 'rog'],   // Tue
    3: ['char', 'labh', 'amrit', 'kaal', 'shubh', 'rog', 'udveg', 'char'], // Wed
    4: ['shubh', 'rog', 'udveg', 'char', 'labh', 'amrit', 'kaal', 'shubh'], // Thu
    5: ['rog', 'udveg', 'char', 'labh', 'amrit', 'kaal', 'shubh', 'rog'],   // Fri (Correction)
    6: ['kaal', 'shubh', 'rog', 'udveg', 'char', 'labh', 'amrit', 'kaal']  // Sat
};

// Sequences for each night (Starting from Sunset)
const nightSequences = {
    0: ['shubh', 'amrit', 'char', 'rog', 'kaal', 'labh', 'udveg', 'shubh'], // Sun Night
    1: ['char', 'labh', 'amrit', 'kaal', 'shubh', 'rog', 'udveg', 'char'], // Mon Night
    2: ['kaal', 'shubh', 'rog', 'udveg', 'char', 'labh', 'amrit', 'kaal'], // Tue Night
    3: ['udveg', 'char', 'labh', 'amrit', 'kaal', 'shubh', 'rog', 'udveg'], // Wed Night
    4: ['amrit', 'kaal', 'shubh', 'rog', 'udveg', 'char', 'labh', 'amrit'], // Thu Night
    5: ['char', 'labh', 'amrit', 'kaal', 'shubh', 'rog', 'udveg', 'char'], // Fri Night
    6: ['labh', 'amrit', 'kaal', 'shubh', 'rog', 'udveg', 'char', 'labh']  // Sat Night
};

const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const cityNames = { '28.6139,77.2090': 'New Delhi', '19.0760,72.8777': 'Mumbai', '12.9716,77.5946': 'Bangalore', '13.0827,80.2707': 'Chennai', '22.5726,88.3639': 'Kolkata', '23.0225,72.5714': 'Ahmedabad', '17.3850,78.4867': 'Hyderabad', '18.5204,73.8567': 'Pune', '26.9124,75.7873': 'Jaipur', '21.1702,72.8311': 'Surat', '30.7333,76.7794': 'Chandigarh', '15.2993,74.1240': 'Goa' };

let allPeriods = []; 
let currentPeriodUpdateInterval = null;
let selectedCalculationDate = null;

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    const today = new Date();
    document.getElementById('date-input').value = today.toISOString().split('T')[0];
    
    document.getElementById('location-method').addEventListener('change', function(e) {
        const method = e.target.value;
        document.getElementById('preset-location-section').style.display = method === 'preset' ? 'block' : 'none';
        document.getElementById('search-location-section').style.display = method === 'search' ? 'block' : 'none';
        document.getElementById('coords-location-section').style.display = method === 'coords' ? 'block' : 'none';
    });

    document.getElementById('calculate-btn').addEventListener('click', calculateChoghadiya);
    document.querySelector('.modal-close').addEventListener('click', () => document.getElementById('insights-modal').style.display = 'none');
});

async function calculateChoghadiya() {
    const dateInput = document.getElementById('date-input').value;
    const date = new Date(dateInput + 'T12:00:00');
    selectedCalculationDate = dateInput; // Store string to compare with "Today"

    let lat, lng, locationName;
    const method = document.getElementById('location-method').value;

    if (method === 'preset') {
        const coords = document.getElementById('city-select').value.split(',');
        lat = parseFloat(coords[0]); lng = parseFloat(coords[1]);
        locationName = cityNames[document.getElementById('city-select').value];
    } else if (method === 'search') {
        const info = document.getElementById('selected-location-info');
        if (!info.dataset.lat) return alert('Select a location first');
        lat = parseFloat(info.dataset.lat); lng = parseFloat(info.dataset.lon);
        locationName = info.dataset.name;
    } else {
        lat = parseFloat(document.getElementById('latitude').value);
        lng = parseFloat(document.getElementById('longitude').value);
        if (isNaN(lat) || isNaN(lng)) return alert('Enter valid coordinates');
        locationName = `Custom Location`;
    }

    document.getElementById('loading-indicator').style.display = 'block';

    setTimeout(() => {
        // 2. CORRECT NIGHT DURATION CALCULATION
        // We need today's sunrise/sunset AND tomorrow's sunrise
        const timesToday = SunCalc.getTimes(date, lat, lng);
        const tomorrow = new Date(date);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const timesTomorrow = SunCalc.getTimes(tomorrow, lat, lng);

        const sunrise = timesToday.sunrise;
        const sunset = timesToday.sunset;
        const nextSunrise = timesTomorrow.sunrise;

        const dayOfWeek = date.getDay();
        displayResults(date, dayOfWeek, sunrise, sunset, nextSunrise, locationName);
        document.getElementById('loading-indicator').style.display = 'none';
    }, 400);
}

function displayResults(date, dayOfWeek, sunrise, sunset, nextSunrise, locationName) {
    document.getElementById('results').style.display = 'block';
    document.getElementById('location-name').textContent = locationName;
    document.getElementById('selected-date').textContent = date.toDateString();
    document.getElementById('day-name').textContent = dayNames[dayOfWeek];
    document.getElementById('sunrise-time').textContent = formatTime(sunrise);
    document.getElementById('sunset-time').textContent = formatTime(sunset);

    const dayChoghadiyas = calculatePeriods(sunrise, sunset, daySequences[dayOfWeek]);
    const nightChoghadiyas = calculatePeriods(sunset, nextSunrise, nightSequences[dayOfWeek]);

    allPeriods = [...dayChoghadiyas, ...nightChoghadiyas];

    displayChoghadiyaPeriods('day-choghadiya', dayChoghadiyas, true);
    displayChoghadiyaPeriods('night-choghadiya', nightChoghadiyas, false);

    updateCurrentChoghadiya();
    if (currentPeriodUpdateInterval) clearInterval(currentPeriodUpdateInterval);
    currentPeriodUpdateInterval = setInterval(updateCurrentChoghadiya, 30000);

    document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
}

function calculatePeriods(startTime, endTime, sequence) {
    const periods = [];
    const totalDuration = endTime.getTime() - startTime.getTime();
    const periodDuration = totalDuration / 8;

    for (let i = 0; i < 8; i++) {
        periods.push({
            type: sequence[i],
            start: new Date(startTime.getTime() + (i * periodDuration)),
            end: new Date(startTime.getTime() + ((i + 1) * periodDuration))
        });
    }
    return periods;
}

// 3. FIX CURRENT PERIOD TRACKER
function updateCurrentChoghadiya() {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const liveCard = document.getElementById('current-choghadiya-card');

    // Only show "Live" if the calculated date is today
    if (selectedCalculationDate !== todayStr) {
        liveCard.style.opacity = '0.5';
        document.getElementById('current-name').textContent = "Viewing Different Date";
        document.getElementById('current-desc').textContent = "Live tracking only available for today's date.";
        document.getElementById('progress-fill').style.width = '0%';
        return;
    }

    liveCard.style.opacity = '1';
    let current = null;
    let next = null;

    for (let i = 0; i < allPeriods.length; i++) {
        if (now >= allPeriods[i].start && now < allPeriods[i].end) {
            current = allPeriods[i];
            next = allPeriods[i + 1];
            break;
        }
    }

    if (current) {
        const type = choghadiyaTypes[current.type];
        document.getElementById('current-name').textContent = type.name;
        document.getElementById('current-time').textContent = `${formatTime(current.start)} - ${formatTime(current.end)}`;
        document.getElementById('current-desc').textContent = type.desc;
        
        const progress = ((now - current.start) / (current.end - current.start)) * 100;
        document.getElementById('progress-fill').style.width = `${progress}%`;
        
        if (next) {
            document.getElementById('next-period-name').textContent = choghadiyaTypes[next.type].name;
            document.getElementById('next-period-time').textContent = formatTime(next.start);
        }
        liveCard.className = `current-card ${type.class}`;
    }
}

function displayChoghadiyaPeriods(containerId, periods, isDay) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    periods.forEach((p, i) => {
        const type = choghadiyaTypes[p.type];
        const div = document.createElement('div');
        div.className = `choghadiya-item ${type.class}`;
        div.innerHTML = `
            <div class="choghadiya-name">${i + 1}. ${type.name}</div>
            <div class="choghadiya-time">${formatTime(p.start)} - ${formatTime(p.end)}</div>
            <div class="choghadiya-desc">${type.desc}</div>
        `;
        container.appendChild(div);
    });
}

function formatTime(date) {
    return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
}
