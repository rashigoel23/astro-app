# 🕉️ Choghadiya - Auspicious Time Calculator

A beautiful, modern web application to calculate Choghadiya (Hindu auspicious time periods) with a user-friendly interface similar to Drikpanchang.

## Features

✨ **Key Features:**
- 📅 Calculate Choghadiya for any date
- ⏰ **NEW!** Live Current Choghadiya card with real-time updates
- 📍 **NEW!** Search any location worldwide by name
- 🗺️ Pre-configured major Indian cities + custom coordinates
- 📆 **NEW!** Google Calendar integration with one-click event creation
- 🤖 **NEW!** AI-powered insights for each Choghadiya period
- 📧 **NEW!** Professional contact form with reCAPTCHA protection
- 🔮 **NEW!** Direct consultation booking with expert astrologer
- ☀️ Day Choghadiya (8 periods from sunrise to sunset)
- 🌙 Night Choghadiya (8 periods from sunset to next sunrise)
- 🎨 Beautiful, modern UI with color-coded periods and animations
- 📱 Fully responsive design (mobile, tablet, desktop)
- 🌅 Accurate sunrise/sunset calculations using SunCalc library
- ⚡ Real-time location geocoding using OpenStreetMap
- 🎯 Progress tracking for current period
- ✨ Visual enhancements with gradients and smooth animations

## What is Choghadiya?

Choghadiya is a Vedic Hindu calendar system that divides the day into auspicious and inauspicious periods. Each day (from sunrise to sunset) and night (from sunset to next sunrise) is divided into 8 periods called Choghadiya.

### Types of Choghadiya:

- **Amrit (अमृत)** - Most auspicious, perfect for all activities
- **Shubh (शुभ)** - Auspicious, good for new beginnings
- **Labh (लाभ)** - Profitable, ideal for financial matters
- **Char (चर)** - Moveable, good for travel
- **Udveg (उद्वेग)** - Anxiety, avoid important work
- **Kaal (काल)** - Death, inauspicious
- **Rog (रोग)** - Disease, avoid new ventures

## How to Use

1. **Open the App:**
   - Simply open `index.html` in your web browser
   - No server or installation required!

2. **Select Date:**
   - Choose the date for which you want to calculate Choghadiya
   - Defaults to today's date

3. **Choose Location (3 Methods):**
   - **Preset Cities**: Select from 12 pre-configured Indian cities
   - **Search by Name**: Search for any city/location worldwide (e.g., "Varanasi", "London", "New York")
   - **Enter Coordinates**: Manually input latitude and longitude

4. **Calculate:**
   - Click "Calculate Choghadiya" button
   - View day and night Choghadiya periods with timings

5. **Use Advanced Features:**
   - **📅 Add to Google Calendar**: Click the calendar button on any Choghadiya period to create a Google Calendar event with automatic reminders
   - **🤖 AI Insights**: Click the AI button to get detailed, intelligent insights about each period including:
     - Recommended activities
     - Activities to avoid
     - Energy levels
     - Planetary influences
     - Pro tips for maximizing the period

## Pre-configured Cities

- New Delhi
- Mumbai
- Bangalore
- Chennai
- Kolkata
- Ahmedabad
- Hyderabad
- Pune
- Jaipur
- Surat
- Chandigarh
- Goa

## Files Structure

```
auspicioustimecalculator/
├── index.html      # Main HTML structure
├── style.css       # Beautiful, responsive styling
├── script.js       # Choghadiya calculation logic
├── suncalc.js      # Sunrise/sunset calculation library
└── README.md       # This file
```

## Technical Details

- **Pure HTML/CSS/JavaScript** - No frameworks required
- **SunCalc Library** - Accurate astronomical calculations for sunrise/sunset
- **OpenStreetMap Nominatim API** - Worldwide location search and geocoding
- **Google Calendar API** - Seamless calendar integration
- **AI Insights Engine** - Contextual intelligence based on Vedic astrology principles
- **Responsive Design** - Works on all devices
- **Modern UI** - Gradient backgrounds, smooth animations, modal dialogs
- **Color-coded Periods** - Easy visual identification
- **Network Required** - For location search and calendar features (optional)

## Browser Support

Works on all modern browsers:
- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

## New Features in v2.0

### 1. ⏰ Live Current Choghadiya Card
A prominent, beautifully designed card that shows the currently active Choghadiya period:
- **Real-time Updates**: Automatically refreshes every minute
- **Progress Bar**: Visual representation of time remaining
- **Next Period Preview**: See what's coming next
- **Quick Actions**: Direct access to calendar and AI insights
- **Live Badge**: Pulsing indicator showing it's the current period
- **Auto-highlighting**: Current period highlighted in the full list

### 2. 🗺️ Worldwide Location Search
Search for any location in the world by name. Uses OpenStreetMap's Nominatim API for accurate geocoding.

**Example searches:**
- "Varanasi" - Get Choghadiya for the holy city
- "New York" - Calculate for international locations
- "Haridwar" - Find any Indian city
- "London, UK" - Be specific for better results

### 2. 🗺️ Worldwide Location Search
One-click integration with Google Calendar:
- Automatically creates calendar events
- Includes detailed descriptions
- Pre-filled with location information
- Perfect for planning your day around auspicious times

### 3. 📅 Google Calendar Integration
Get intelligent, contextual insights for each Choghadiya period:
- **Comprehensive Analysis**: Detailed overview of each period's energy
- **Activity Recommendations**: Specific activities that are favorable
- **Avoidance List**: What to avoid during inauspicious periods
- **Energy Levels**: Numerical ratings for cosmic energy (1-10)
- **Planetary Influences**: Understanding celestial impacts
- **Pro Tips**: Practical advice for maximizing each period

### 4. 🤖 AI-Powered Insights
- Type of Choghadiya (Amrit, Shubh, Labh, etc.)
- Time of day (day vs. night periods)
- Traditional Vedic astrology principles
- Modern practical applications

## Credits & Attribution

- **SunCalc Library**: https://github.com/mourner/suncalc (Vladimir Agafonkin)
- **OpenStreetMap Nominatim**: https://nominatim.openstreetmap.org
- **Google reCAPTCHA**: https://www.google.com/recaptcha
- **Google Fonts**: Inter font family
- **Choghadiya Calculations**: Based on traditional Vedic astrology principles
- **Design Inspiration**: Drikpanchang and modern web design trends

## Version History

- **v2.5** (Current) - Added Current Choghadiya card, Contact form, Enhanced visuals
- **v2.0** - Added Location search, Calendar integration, AI insights
- **v1.0** - Initial release with basic Choghadiya calculation

## License

Free to use for personal and commercial purposes.

---

Made with ❤️ for Vedic Astrology Enthusiasts

