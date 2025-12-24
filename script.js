// Choghadiya data structure
const choghadiyaTypes = {
    amrit: { name: 'Amrit (अमृत)', desc: 'Most auspicious - Perfect for all activities', class: 'amrit' },
    shubh: { name: 'Shubh (शुभ)', desc: 'Auspicious - Good for new beginnings', class: 'shubh' },
    labh: { name: 'Labh (लाभ)', desc: 'Profitable - Ideal for financial matters', class: 'labh' },
    char: { name: 'Char (चर)', desc: 'Moveable - Good for travel', class: 'char' },
    udveg: { name: 'Udveg (उद्वेग)', desc: 'Anxiety - Avoid important work', class: 'udveg' },
    kaal: { name: 'Kaal (काल)', desc: 'Death - Inauspicious, avoid', class: 'kaal' },
    rog: { name: 'Rog (रोग)', desc: 'Disease - Avoid new ventures', class: 'rog' }
};

// Choghadiya sequence for each day of the week
// Day sequences (from sunrise to sunset)
const daySequences = {
    0: ['udveg', 'char', 'labh', 'amrit', 'kaal', 'shubh', 'rog', 'udveg'], // Sunday
    1: ['amrit', 'kaal', 'shubh', 'rog', 'udveg', 'char', 'labh', 'amrit'], // Monday
    2: ['char', 'rog', 'udveg', 'char', 'labh', 'amrit', 'kaal', 'shubh'], // Tuesday
    3: ['rog', 'udveg', 'char', 'labh', 'amrit', 'kaal', 'shubh', 'rog'], // Wednesday
    4: ['udveg', 'char', 'labh', 'amrit', 'kaal', 'shubh', 'rog', 'udveg'], // Thursday
    5: ['char', 'labh', 'amrit', 'kaal', 'shubh', 'rog', 'udveg', 'char'], // Friday
    6: ['labh', 'amrit', 'kaal', 'shubh', 'rog', 'udveg', 'char', 'labh']  // Saturday
};

// Night sequences (from sunset to next sunrise)
const nightSequences = {
    0: ['shubh', 'amrit', 'char', 'rog', 'kaal', 'labh', 'udveg', 'shubh'], // Sunday
    1: ['char', 'rog', 'kaal', 'labh', 'udveg', 'shubh', 'amrit', 'char'], // Monday
    2: ['rog', 'kaal', 'labh', 'udveg', 'shubh', 'amrit', 'char', 'rog'], // Tuesday
    3: ['kaal', 'labh', 'udveg', 'shubh', 'amrit', 'char', 'rog', 'kaal'], // Wednesday
    4: ['labh', 'udveg', 'shubh', 'amrit', 'char', 'rog', 'kaal', 'labh'], // Thursday
    5: ['udveg', 'shubh', 'amrit', 'char', 'rog', 'kaal', 'labh', 'udveg'], // Friday
    6: ['shubh', 'amrit', 'char', 'rog', 'kaal', 'labh', 'udveg', 'shubh']  // Saturday
};

const cityNames = {
    '28.6139,77.2090': 'New Delhi',
    '19.0760,72.8777': 'Mumbai',
    '12.9716,77.5946': 'Bangalore',
    '13.0827,80.2707': 'Chennai',
    '22.5726,88.3639': 'Kolkata',
    '23.0225,72.5714': 'Ahmedabad',
    '17.3850,78.4867': 'Hyderabad',
    '18.5204,73.8567': 'Pune',
    '26.9124,75.7873': 'Jaipur',
    '21.1702,72.8311': 'Surat',
    '30.7333,76.7794': 'Chandigarh',
    '15.2993,74.1240': 'Goa'
};

const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// Global variables for current calculation
let currentDate, currentLocationName, currentLat, currentLng;
let allPeriods = []; // Store all periods for current period tracking
let currentPeriodUpdateInterval = null;

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Set today's date
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];
    document.getElementById('date-input').value = dateStr;
    
    // Location method selector
    document.getElementById('location-method').addEventListener('change', function(e) {
        const method = e.target.value;
        
        document.getElementById('preset-location-section').style.display = 
            method === 'preset' ? 'block' : 'none';
        document.getElementById('search-location-section').style.display = 
            method === 'search' ? 'block' : 'none';
        document.getElementById('coords-location-section').style.display = 
            method === 'coords' ? 'block' : 'none';
    });
    
    // Location search
    document.getElementById('search-btn').addEventListener('click', searchLocation);
    document.getElementById('location-search').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchLocation();
        }
    });
    
    // Modal close
    document.querySelector('.modal-close').addEventListener('click', function() {
        document.getElementById('insights-modal').style.display = 'none';
    });
    
    window.addEventListener('click', function(e) {
        const modal = document.getElementById('insights-modal');
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Calculate button
    document.getElementById('calculate-btn').addEventListener('click', calculateChoghadiya);
    
    // Contact form submission
    document.getElementById('contact-form').addEventListener('submit', handleFormSubmit);
});

// Location Search Functionality
async function searchLocation() {
    const query = document.getElementById('location-search').value.trim();
    
    if (!query) {
        alert('Please enter a location name');
        return;
    }
    
    const resultsDiv = document.getElementById('search-results');
    resultsDiv.innerHTML = '<div class="loading-indicator"><div class="spinner"></div><p>Searching...</p></div>';
    
    try {
        // Using OpenStreetMap Nominatim API (free, no API key required)
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5`,
            {
                headers: {
                    'User-Agent': 'ChoghadiyaCalculator/1.0'
                }
            }
        );
        
        const results = await response.json();
        
        if (results.length === 0) {
            resultsDiv.innerHTML = '<p style="padding: 15px; color: #999;">No locations found. Try a different search term.</p>';
            return;
        }
        
        resultsDiv.innerHTML = '';
        results.forEach((result, index) => {
            const resultItem = document.createElement('div');
            resultItem.className = 'search-result-item';
            resultItem.innerHTML = `
                <strong>${result.display_name.split(',')[0]}</strong><br>
                <small style="color: #666;">${result.display_name}</small>
            `;
            
            resultItem.addEventListener('click', function() {
                // Remove previous selection
                document.querySelectorAll('.search-result-item').forEach(item => {
                    item.classList.remove('selected');
                });
                
                // Mark as selected
                resultItem.classList.add('selected');
                
                // Store location data
                const locationInfo = document.getElementById('selected-location-info');
                locationInfo.style.display = 'block';
                locationInfo.innerHTML = `
                    <strong>Selected Location:</strong> ${result.display_name}<br>
                    <small>Coordinates: ${parseFloat(result.lat).toFixed(4)}, ${parseFloat(result.lon).toFixed(4)}</small>
                `;
                
                // Store in hidden fields
                locationInfo.dataset.lat = result.lat;
                locationInfo.dataset.lon = result.lon;
                locationInfo.dataset.name = result.display_name.split(',')[0];
            });
            
            resultsDiv.appendChild(resultItem);
        });
        
    } catch (error) {
        resultsDiv.innerHTML = '<p style="padding: 15px; color: #ef4444;">Error searching location. Please try again.</p>';
        console.error('Error:', error);
    }
}

function calculateChoghadiya() {
    const dateInput = document.getElementById('date-input').value;
    if (!dateInput) {
        alert('Please select a date');
        return;
    }
    
    const date = new Date(dateInput + 'T12:00:00');
    
    let lat, lng, locationName;
    
    const locationMethod = document.getElementById('location-method').value;
    
    if (locationMethod === 'preset') {
        const cityValue = document.getElementById('city-select').value;
        const coords = cityValue.split(',');
        lat = parseFloat(coords[0]);
        lng = parseFloat(coords[1]);
        locationName = cityNames[cityValue];
    } else if (locationMethod === 'search') {
        const locationInfo = document.getElementById('selected-location-info');
        
        if (!locationInfo.dataset.lat) {
            alert('Please search and select a location first');
            return;
        }
        
        lat = parseFloat(locationInfo.dataset.lat);
        lng = parseFloat(locationInfo.dataset.lon);
        locationName = locationInfo.dataset.name;
    } else if (locationMethod === 'coords') {
        lat = parseFloat(document.getElementById('latitude').value);
        lng = parseFloat(document.getElementById('longitude').value);
        
        if (isNaN(lat) || isNaN(lng)) {
            alert('Please enter valid latitude and longitude');
            return;
        }
        
        locationName = `Custom Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
    }
    
    // Store global variables
    currentDate = date;
    currentLat = lat;
    currentLng = lng;
    currentLocationName = locationName;
    
    // Show loading
    document.getElementById('loading-indicator').style.display = 'block';
    
    // Calculate sun times using SunCalc
    setTimeout(() => {
        const times = SunCalc.getTimes(date, lat, lng);
        const sunrise = times.sunrise;
        const sunset = times.sunset;
        
        // Get day of week (0 = Sunday, 6 = Saturday)
        const dayOfWeek = date.getDay();
        
        // Display results
        displayResults(date, dayOfWeek, sunrise, sunset, locationName);
        
        document.getElementById('loading-indicator').style.display = 'none';
    }, 500);
}

function displayResults(date, dayOfWeek, sunrise, sunset, locationName) {
    // Show results section
    document.getElementById('results').style.display = 'block';
    
    // Set location and date info
    document.getElementById('location-name').textContent = locationName;
    document.getElementById('selected-date').textContent = date.toLocaleDateString('en-IN', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    document.getElementById('day-name').textContent = dayNames[dayOfWeek];
    document.getElementById('sunrise-time').textContent = formatTime(sunrise);
    document.getElementById('sunset-time').textContent = formatTime(sunset);
    
    // Calculate choghadiya periods
    const dayChoghadiyas = calculatePeriods(sunrise, sunset, daySequences[dayOfWeek]);
    const nightChoghadiyas = calculatePeriods(sunset, getNextDaySunrise(sunrise, sunset), nightSequences[dayOfWeek]);
    
    // Store all periods for current period tracking
    allPeriods = [...dayChoghadiyas, ...nightChoghadiyas];
    
    // Display choghadiyas
    displayChoghadiyaPeriods('day-choghadiya', dayChoghadiyas);
    displayChoghadiyaPeriods('night-choghadiya', nightChoghadiyas);
    
    // Update current Choghadiya card
    updateCurrentChoghadiya();
    
    // Start interval to update current period
    if (currentPeriodUpdateInterval) {
        clearInterval(currentPeriodUpdateInterval);
    }
    currentPeriodUpdateInterval = setInterval(updateCurrentChoghadiya, 60000); // Update every minute
    
    // Scroll to results
    document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
}

// Update Current Choghadiya Card
function updateCurrentChoghadiya() {
    const now = new Date();
    
    // Find current period
    let currentPeriod = null;
    let nextPeriod = null;
    let currentIndex = -1;
    
    for (let i = 0; i < allPeriods.length; i++) {
        if (now >= allPeriods[i].start && now < allPeriods[i].end) {
            currentPeriod = allPeriods[i];
            currentIndex = i;
            nextPeriod = allPeriods[i + 1] || null;
            break;
        }
    }
    
    if (!currentPeriod) {
        // If no current period found (different day), just show placeholder
        document.getElementById('current-name').textContent = 'Not Available';
        document.getElementById('current-time').textContent = 'Please calculate for today';
        document.getElementById('current-desc').textContent = '';
        document.getElementById('progress-text').textContent = '';
        document.getElementById('current-next-info').style.display = 'none';
        return;
    }
    
    const typeInfo = choghadiyaTypes[currentPeriod.type];
    const isDayPeriod = currentIndex < 8;
    
    // Update current period info
    document.getElementById('current-name').textContent = typeInfo.name;
    document.getElementById('current-time').textContent = 
        `${formatTime(currentPeriod.start)} - ${formatTime(currentPeriod.end)}`;
    document.getElementById('current-desc').textContent = typeInfo.desc;
    
    // Update progress bar
    const totalDuration = currentPeriod.end - currentPeriod.start;
    const elapsed = now - currentPeriod.start;
    const percentage = (elapsed / totalDuration) * 100;
    
    document.getElementById('progress-fill').style.width = `${percentage}%`;
    
    const remaining = currentPeriod.end - now;
    const minutesRemaining = Math.floor(remaining / 60000);
    document.getElementById('progress-text').textContent = 
        `${minutesRemaining} minutes remaining`;
    
    // Set card background based on type
    const card = document.querySelector('.current-card');
    card.className = `current-card ${typeInfo.class}`;
    
    // Update next period info
    if (nextPeriod) {
        const nextTypeInfo = choghadiyaTypes[nextPeriod.type];
        document.getElementById('next-period-name').textContent = nextTypeInfo.name;
        document.getElementById('next-period-time').textContent = formatTime(nextPeriod.start);
        document.getElementById('current-next-info').style.display = 'block';
    } else {
        document.getElementById('current-next-info').style.display = 'none';
    }
    
    // Update action buttons
    document.getElementById('current-calendar-btn').onclick = function() {
        addToGoogleCalendar(
            currentPeriod.type,
            currentPeriod.start.toISOString(),
            currentPeriod.end.toISOString(),
            isDayPeriod
        );
    };
    
    document.getElementById('current-insights-btn').onclick = function() {
        showAIInsights(
            currentPeriod.type,
            currentPeriod.start.toISOString(),
            currentPeriod.end.toISOString(),
            isDayPeriod
        );
    };
    
    // Highlight current period in the lists
    highlightCurrentPeriodInList(currentPeriod);
}

function calculatePeriods(startTime, endTime, sequence) {
    const periods = [];
    const totalDuration = endTime - startTime;
    const periodDuration = totalDuration / 8;
    
    for (let i = 0; i < 8; i++) {
        const periodStart = new Date(startTime.getTime() + (i * periodDuration));
        const periodEnd = new Date(startTime.getTime() + ((i + 1) * periodDuration));
        
        periods.push({
            type: sequence[i],
            start: periodStart,
            end: periodEnd
        });
    }
    
    return periods;
}

function displayChoghadiyaPeriods(containerId, periods) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    
    const isDay = containerId === 'day-choghadiya';
    
    periods.forEach((period, index) => {
        const typeInfo = choghadiyaTypes[period.type];
        const periodDiv = document.createElement('div');
        periodDiv.className = `choghadiya-item ${typeInfo.class}`;
        periodDiv.dataset.startTime = period.start.toISOString();
        periodDiv.dataset.endTime = period.end.toISOString();
        
        periodDiv.innerHTML = `
            <div class="choghadiya-name">${index + 1}. ${typeInfo.name}</div>
            <div class="choghadiya-time">${formatTime(period.start)} - ${formatTime(period.end)}</div>
            <div class="choghadiya-desc">${typeInfo.desc}</div>
            <div class="choghadiya-actions">
                <button class="btn-action btn-calendar" onclick="addToGoogleCalendar('${period.type}', '${period.start.toISOString()}', '${period.end.toISOString()}', ${isDay})">
                    📅 Add to Calendar
                </button>
                <button class="btn-action btn-insights" onclick="showAIInsights('${period.type}', '${period.start.toISOString()}', '${period.end.toISOString()}', ${isDay})">
                    🤖 AI Insights
                </button>
            </div>
        `;
        
        container.appendChild(periodDiv);
    });
}

// Highlight current period in the list
function highlightCurrentPeriodInList(currentPeriod) {
    // Remove all previous highlights
    document.querySelectorAll('.choghadiya-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Find and highlight current period
    const now = new Date();
    document.querySelectorAll('.choghadiya-item').forEach(item => {
        const startTime = new Date(item.dataset.startTime);
        const endTime = new Date(item.dataset.endTime);
        
        if (now >= startTime && now < endTime) {
            item.classList.add('active');
        }
    });
}

// Google Calendar Integration
function addToGoogleCalendar(type, startISO, endISO, isDay) {
    const start = new Date(startISO);
    const end = new Date(endISO);
    
    const typeInfo = choghadiyaTypes[type];
    const title = `${typeInfo.name} - Choghadiya`;
    const description = `${typeInfo.desc}\n\nCalculated for ${currentLocationName}\n\n${isDay ? '☀️ Day' : '🌙 Night'} Choghadiya Period\n\nLearn more about Vedic astrology and auspicious timings.`;
    
    // Format dates for Google Calendar (YYYYMMDDTHHMMSSZ)
    const formatGoogleDate = (date) => {
        return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    };
    
    const startFormatted = formatGoogleDate(start);
    const endFormatted = formatGoogleDate(end);
    
    // Create Google Calendar URL
    const calendarUrl = new URL('https://calendar.google.com/calendar/render');
    calendarUrl.searchParams.append('action', 'TEMPLATE');
    calendarUrl.searchParams.append('text', title);
    calendarUrl.searchParams.append('dates', `${startFormatted}/${endFormatted}`);
    calendarUrl.searchParams.append('details', description);
    calendarUrl.searchParams.append('location', currentLocationName);
    
    // Open in new window
    window.open(calendarUrl.toString(), '_blank');
}

// AI Insights Generation
function showAIInsights(type, startISO, endISO, isDay) {
    const start = new Date(startISO);
    const end = new Date(endISO);
    
    const modal = document.getElementById('insights-modal');
    const modalBody = document.getElementById('modal-body');
    const modalTitle = document.getElementById('modal-title');
    
    // Show modal with loading
    modal.style.display = 'block';
    modalBody.innerHTML = '<div class="insights-loading"><div class="spinner"></div><p>Generating AI insights...</p></div>';
    
    // Simulate AI processing time
    setTimeout(() => {
        const insights = generateAIInsights(type, start, end, isDay);
        
        modalTitle.textContent = `🤖 AI Insights: ${choghadiyaTypes[type].name}`;
        modalBody.innerHTML = insights;
    }, 1500);
}

function generateAIInsights(type, start, end, isDay) {
    const typeInfo = choghadiyaTypes[type];
    const timeOfDay = isDay ? 'daytime' : 'nighttime';
    const hour = start.getHours();
    
    // Generate contextual insights based on type and time
    const insights = {
        amrit: {
            overview: `Amrit Choghadiya is considered the most auspicious period, symbolizing nectar or immortality. This ${timeOfDay} period from ${formatTime(start)} to ${formatTime(end)} is blessed with positive cosmic energy.`,
            activities: [
                'Starting new business ventures or projects',
                'Important meetings and negotiations',
                'Wedding ceremonies and engagements',
                'Buying property, vehicles, or valuable items',
                'Religious ceremonies and spiritual practices',
                'Beginning educational pursuits',
                'Medical procedures and treatments',
                'Travel for important purposes'
            ],
            avoid: [],
            energyLevel: 'Maximum positive energy (10/10)',
            planetaryInfluence: 'This period is governed by benefic planetary alignments, bringing prosperity and success.',
            tips: [
                'Maximize this time for your most important activities',
                'Make important life decisions during this period',
                'Start anything you want to last long and prosper',
                'Practice gratitude and positive affirmations'
            ]
        },
        shubh: {
            overview: `Shubh Choghadiya represents auspiciousness and positivity. This ${timeOfDay} period from ${formatTime(start)} to ${formatTime(end)} carries excellent energy for new beginnings.`,
            activities: [
                'Starting new projects and initiatives',
                'Job interviews and career moves',
                'Financial investments and transactions',
                'Social gatherings and celebrations',
                'Educational activities and learning',
                'Health and wellness activities',
                'Shopping for important items',
                'Beginning construction work'
            ],
            avoid: [],
            energyLevel: 'High positive energy (8/10)',
            planetaryInfluence: 'Influenced by Jupiter and Venus, bringing wisdom and prosperity.',
            tips: [
                'Perfect time for initiating positive changes',
                'Good for networking and building relationships',
                'Ideal for creative and artistic pursuits'
            ]
        },
        labh: {
            overview: `Labh Choghadiya is associated with gains and profits. This ${timeOfDay} period from ${formatTime(start)} to ${formatTime(end)} is excellent for financial and business activities.`,
            activities: [
                'Business negotiations and deals',
                'Stock market transactions',
                'Signing contracts and agreements',
                'Job applications and promotions',
                'Financial planning and investments',
                'Sales and marketing activities',
                'Property dealings',
                'Opening bank accounts'
            ],
            avoid: [],
            energyLevel: 'Positive energy focused on gains (7/10)',
            planetaryInfluence: 'Mercury\'s influence enhances business acumen and communication.',
            tips: [
                'Focus on activities that bring tangible benefits',
                'Good time for strategic planning',
                'Excellent for professional networking',
                'Calculate risks and make informed decisions'
            ]
        },
        char: {
            overview: `Char Choghadiya means "movable" or "variable". This ${timeOfDay} period from ${formatTime(start)} to ${formatTime(end)} is particularly favorable for activities involving movement.`,
            activities: [
                'Travel and journeys',
                'Moving to a new house',
                'Vehicle purchases',
                'Transportation and logistics',
                'Outdoor activities',
                'Sports and exercise',
                'Meetings that require travel',
                'Mobile or flexible work'
            ],
            avoid: [
                'Activities requiring stability',
                'Long-term commitments',
                'Fixed investments'
            ],
            energyLevel: 'Moderate and dynamic energy (6/10)',
            planetaryInfluence: 'Moon\'s influence creates a dynamic and changeable atmosphere.',
            tips: [
                'Stay flexible and adaptable',
                'Good for exploratory activities',
                'Embrace spontaneity',
                'Keep backup plans ready'
            ]
        },
        udveg: {
            overview: `Udveg Choghadiya is associated with anxiety and restlessness. This ${timeOfDay} period from ${formatTime(start)} to ${formatTime(end)} should be approached with caution for important activities.`,
            activities: [
                'Routine daily tasks',
                'Completion of ongoing projects',
                'Meditation and stress relief',
                'Light exercise',
                'Planning (but not execution)',
                'Research and analysis'
            ],
            avoid: [
                'Starting new ventures',
                'Important meetings',
                'Financial investments',
                'Legal matters',
                'Wedding ceremonies',
                'Major purchases',
                'Traveling for important events',
                'Making life-changing decisions'
            ],
            energyLevel: 'Turbulent energy (3/10)',
            planetaryInfluence: 'Malefic planetary positions may cause obstacles and delays.',
            tips: [
                'Use this time for introspection',
                'Focus on completing tasks rather than starting new ones',
                'Practice stress management techniques',
                'Avoid confrontations and conflicts',
                'Double-check all important communications'
            ]
        },
        kaal: {
            overview: `Kaal Choghadiya is considered highly inauspicious, associated with death and negativity. This ${timeOfDay} period from ${formatTime(start)} to ${formatTime(end)} should be used carefully.`,
            activities: [
                'Meditation and spiritual practices',
                'Yoga and breathing exercises',
                'Reading and self-study',
                'Rest and recuperation',
                'Internal reflection',
                'Minimal routine tasks only'
            ],
            avoid: [
                'Starting any new ventures',
                'Important meetings or interviews',
                'Financial transactions',
                'Travel',
                'Weddings and celebrations',
                'Property dealings',
                'Medical procedures (if possible)',
                'Signing contracts',
                'Making major decisions'
            ],
            energyLevel: 'Highly negative energy (2/10)',
            planetaryInfluence: 'Saturn\'s heavy influence brings obstacles and challenges.',
            tips: [
                'Minimize important activities',
                'Focus on spiritual growth',
                'Practice patience and restraint',
                'Avoid taking risks',
                'Use time for planning future activities',
                'Stay calm and centered'
            ]
        },
        rog: {
            overview: `Rog Choghadiya is associated with disease and ailments. This ${timeOfDay} period from ${formatTime(start)} to ${formatTime(end)} requires caution, especially for health-related matters.`,
            activities: [
                'Rest and relaxation',
                'Light household chores',
                'Personal hygiene routines',
                'Reading and learning',
                'Gentle exercise',
                'Organizing and decluttering'
            ],
            avoid: [
                'New business ventures',
                'Important meetings',
                'Medical surgeries (if avoidable)',
                'Starting new treatments',
                'Financial investments',
                'Travel to new places',
                'Weddings and celebrations',
                'Buying vehicles or property',
                'Taking health risks'
            ],
            energyLevel: 'Low and draining energy (2/10)',
            planetaryInfluence: 'Mars\'s influence may cause health issues and conflicts.',
            tips: [
                'Prioritize health and safety',
                'Avoid stress and strain',
                'Focus on preventive care',
                'Maintain hygiene and cleanliness',
                'Postpone important decisions',
                'Practice self-care'
            ]
        }
    };
    
    const data = insights[type];
    
    let html = `
        <div class="insight-section">
            <h3>📋 Overview</h3>
            <p>${data.overview}</p>
        </div>
        
        <div class="insight-section">
            <h3>⚡ Energy Level</h3>
            <p><strong>${data.energyLevel}</strong></p>
        </div>
        
        <div class="insight-section">
            <h3>🌟 Planetary Influence</h3>
            <p>${data.planetaryInfluence}</p>
        </div>
    `;
    
    if (data.activities.length > 0) {
        html += `
            <div class="insight-section">
                <h3>✅ Recommended Activities</h3>
                <ul>
                    ${data.activities.map(activity => `<li>${activity}</li>`).join('')}
                </ul>
            </div>
        `;
    }
    
    if (data.avoid.length > 0) {
        html += `
            <div class="insight-section insight-avoid">
                <h3>⚠️ Activities to Avoid</h3>
                <ul>
                    ${data.avoid.map(activity => `<li>${activity}</li>`).join('')}
                </ul>
            </div>
        `;
    }
    
    if (data.tips.length > 0) {
        html += `
            <div class="insight-section">
                <h3>💡 Pro Tips</h3>
                <ul>
                    ${data.tips.map(tip => `<li>${tip}</li>`).join('')}
                </ul>
            </div>
        `;
    }
    
    html += `
        <div class="insight-section" style="background: #e0e7ff; border-color: #667eea;">
            <p style="margin: 0; font-size: 0.9rem;">
                <strong>Note:</strong> These insights are based on traditional Vedic astrology principles and planetary movements. 
                Use them as guidance while making decisions, but always apply your own judgment and wisdom.
            </p>
        </div>
    `;
    
    return html;
}

// Contact Form Handler
async function handleFormSubmit(e) {
    e.preventDefault();
    
    // Get form data
    const formData = {
        name: document.getElementById('contact-name').value,
        phone: document.getElementById('contact-phone').value,
        email: document.getElementById('contact-email').value,
        city: document.getElementById('contact-city').value,
        message: document.getElementById('contact-message').value,
        consultationType: document.getElementById('consultation-type').value,
        timestamp: new Date().toISOString()
    };
    
    // Validate reCAPTCHA
    const recaptchaResponse = grecaptcha.getResponse();
    if (!recaptchaResponse) {
        showFormMessage('Please complete the reCAPTCHA verification', 'error');
        return;
    }
    
    // Show loading state
    const submitBtn = document.getElementById('submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');
    
    btnText.style.display = 'none';
    btnLoader.style.display = 'inline-block';
    submitBtn.disabled = true;
    
    try {
        // In a real application, you would send this to your backend
        // For now, we'll simulate a successful submission
        await simulateFormSubmission(formData);
        
        // Show success message
        showFormMessage('✅ Thank you! Your request has been received. Our expert astrologer will contact you within 24 hours.', 'success');
        
        // Reset form
        document.getElementById('contact-form').reset();
        grecaptcha.reset();
        
        // Log to console (in production, this would be sent to your server)
        console.log('Form submitted:', formData);
        
    } catch (error) {
        showFormMessage('❌ Something went wrong. Please try again or contact us directly.', 'error');
        console.error('Form submission error:', error);
    } finally {
        // Reset button state
        btnText.style.display = 'inline';
        btnLoader.style.display = 'none';
        submitBtn.disabled = false;
    }
}

function simulateFormSubmission(data) {
    return new Promise((resolve) => {
        setTimeout(() => {
            // Here you would typically send data to your backend
            // Example: fetch('/api/contact', { method: 'POST', body: JSON.stringify(data) })
            resolve();
        }, 2000);
    });
}

function showFormMessage(message, type) {
    const messageDiv = document.getElementById('form-message');
    messageDiv.textContent = message;
    messageDiv.className = `form-message ${type}`;
    messageDiv.style.display = 'block';
    
    // Scroll to message
    messageDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    // Hide after 10 seconds
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 10000);
}

function formatTime(date) {
    return date.toLocaleTimeString('en-IN', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
    });
}

function getNextDaySunrise(currentSunrise, currentSunset) {
    // Approximate next day's sunrise by adding 24 hours
    // In reality, this varies slightly, but for choghadiya calculation this is acceptable
    const nextDay = new Date(currentSunrise);
    nextDay.setDate(nextDay.getDate() + 1);
    return nextDay;
}

