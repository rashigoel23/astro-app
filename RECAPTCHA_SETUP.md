# 🔐 reCAPTCHA Setup Guide

## Current Status

The app is configured with **Google's test reCAPTCHA key** which works for testing but should be replaced for production use.

**Test Key (Currently Used):**
```
Site Key: 6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI
```

⚠️ **This test key will always pass validation. Replace it for production!**

---

## Setting Up Your Own reCAPTCHA

### Step 1: Get Your reCAPTCHA Keys

1. **Go to Google reCAPTCHA Admin**
   - Visit: https://www.google.com/recaptcha/admin

2. **Sign in with Google Account**
   - Use your Gmail account

3. **Register a New Site**
   - Click the **"+"** button
   - Fill in the form:
     - **Label**: "Choghadiya Calculator" (or your site name)
     - **reCAPTCHA type**: Select **"reCAPTCHA v2"** → **"I'm not a robot Checkbox"**
     - **Domains**: 
       - For local testing: `localhost`
       - For production: `yourdomain.com` (your actual domain)
     - Accept the terms
     - Click **Submit**

4. **Get Your Keys**
   - You'll receive two keys:
     - **Site Key** (Public key - goes in HTML)
     - **Secret Key** (Private key - goes in backend)

### Step 2: Update the HTML File

Open `index.html` and find this line (around line 116):

```html
<div class="g-recaptcha" data-sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"></div>
```

Replace the `data-sitekey` value with your **Site Key**:

```html
<div class="g-recaptcha" data-sitekey="YOUR_SITE_KEY_HERE"></div>
```

### Step 3: Backend Integration (Required for Production)

The current implementation is **frontend-only**. For production, you need to:

1. **Create a Backend Endpoint**
   - Set up a server (Node.js, PHP, Python, etc.)
   - Create an API endpoint to receive form submissions

2. **Verify reCAPTCHA Server-Side**

**Example (Node.js/Express):**

```javascript
const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

app.post('/api/contact', async (req, res) => {
    const { name, email, phone, city, message, consultationType, recaptchaToken } = req.body;
    
    // Verify reCAPTCHA
    const secretKey = 'YOUR_SECRET_KEY_HERE';
    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaToken}`;
    
    try {
        const recaptchaResponse = await axios.post(verifyUrl);
        
        if (!recaptchaResponse.data.success) {
            return res.status(400).json({ error: 'reCAPTCHA verification failed' });
        }
        
        // Process form submission
        // - Save to database
        // - Send email notification
        // - etc.
        
        // Example: Send email using nodemailer
        // await sendEmailToAstrologer(name, email, phone, city, message, consultationType);
        
        res.json({ success: true, message: 'Form submitted successfully' });
        
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));
```

**Example (PHP):**

```php
<?php
header('Content-Type: application/json');

$secretKey = "YOUR_SECRET_KEY_HERE";
$recaptchaToken = $_POST['recaptchaToken'];

// Verify reCAPTCHA
$verifyUrl = "https://www.google.com/recaptcha/api/siteverify";
$response = file_get_contents($verifyUrl . "?secret=" . $secretKey . "&response=" . $recaptchaToken);
$responseData = json_decode($response);

if (!$responseData->success) {
    http_response_code(400);
    echo json_encode(['error' => 'reCAPTCHA verification failed']);
    exit;
}

// Get form data
$name = $_POST['name'];
$email = $_POST['email'];
$phone = $_POST['phone'];
$city = $_POST['city'];
$message = $_POST['message'];
$consultationType = $_POST['consultationType'];

// Process form (save to DB, send email, etc.)
// mail("astrologer@example.com", "New Consultation Request", $message);

echo json_encode(['success' => true, 'message' => 'Form submitted successfully']);
?>
```

3. **Update JavaScript to Send to Backend**

In `script.js`, find the `handleFormSubmit` function and update it:

```javascript
async function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('contact-name').value,
        phone: document.getElementById('contact-phone').value,
        email: document.getElementById('contact-email').value,
        city: document.getElementById('contact-city').value,
        message: document.getElementById('contact-message').value,
        consultationType: document.getElementById('consultation-type').value,
        recaptchaToken: grecaptcha.getResponse()
    };
    
    if (!formData.recaptchaToken) {
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
        // Send to your backend
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            showFormMessage('✅ Thank you! Your request has been received. Our expert astrologer will contact you within 24 hours.', 'success');
            document.getElementById('contact-form').reset();
            grecaptcha.reset();
        } else {
            throw new Error(result.error || 'Submission failed');
        }
        
    } catch (error) {
        showFormMessage('❌ Something went wrong. Please try again or contact us directly.', 'error');
        console.error('Form submission error:', error);
    } finally {
        btnText.style.display = 'inline';
        btnLoader.style.display = 'none';
        submitBtn.disabled = false;
    }
}
```

---

## Alternative: Use Form Services

If you don't want to set up a backend, use these services:

### 1. **Formspree** (Recommended)
- Free tier: 50 submissions/month
- Easy setup: https://formspree.io/

```html
<form id="contact-form" action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
    <!-- Your form fields -->
</form>
```

### 2. **Netlify Forms**
- Free with Netlify hosting
- Add `netlify` attribute to form

```html
<form id="contact-form" netlify netlify-recaptcha>
    <!-- Your form fields -->
</form>
```

### 3. **Google Forms**
- Completely free
- Create a Google Form and embed it
- Or use form submission endpoint

### 4. **Email Services**
- **EmailJS**: Send emails directly from JavaScript
- Setup: https://www.emailjs.com/

---

## Testing reCAPTCHA

### Test Keys (Current Setup)
These keys work for testing only:

**Site Key:** `6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI`
**Secret Key:** `6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe`

✅ **Always passes validation** - Good for development
❌ **Don't use in production** - Not secure

### Testing Checklist

- [ ] reCAPTCHA widget appears on page
- [ ] Can click "I'm not a robot"
- [ ] Form doesn't submit without checking reCAPTCHA
- [ ] Form submits successfully after verification
- [ ] Success message appears
- [ ] Form resets after submission

---

## Security Best Practices

1. **Never expose Secret Key in frontend code**
2. **Always verify reCAPTCHA server-side**
3. **Use HTTPS in production**
4. **Validate all form inputs server-side**
5. **Implement rate limiting on your backend**
6. **Store form data securely**
7. **Use environment variables for keys**

---

## Form Data Handling

When you receive form submissions, you can:

1. **Email Notification**
   - Send email to astrologer using nodemailer, SendGrid, etc.
   - Include all form details

2. **Database Storage**
   - Store in MongoDB, PostgreSQL, MySQL, etc.
   - Track consultation requests

3. **CRM Integration**
   - Send to HubSpot, Salesforce, etc.
   - Manage client relationships

4. **WhatsApp/SMS Notification**
   - Use Twilio to send SMS
   - Notify astrologer immediately

---

## Quick Start (Local Testing)

The app works out of the box with test keys for local development:

1. Open `index.html` in browser
2. Fill out the form
3. Complete reCAPTCHA (it will always pass)
4. Submit - see console for form data
5. Success message appears

For production, follow the setup steps above!

---

## Troubleshooting

### reCAPTCHA not showing?
- Check internet connection
- Make sure script is loaded: `<script src="https://www.google.com/recaptcha/api.js" async defer></script>`
- Check browser console for errors

### "ERROR for site owner: Invalid site key"?
- Site key is incorrect
- Domain not registered for the key
- Using wrong reCAPTCHA version

### Form submits without reCAPTCHA check?
- Validation code might be commented out
- Check `handleFormSubmit` function

### reCAPTCHA stuck on loading?
- Network issues
- Firewall blocking Google services
- Try different browser

---

## Support

For more help:
- **reCAPTCHA Documentation**: https://developers.google.com/recaptcha/docs/display
- **reCAPTCHA FAQ**: https://developers.google.com/recaptcha/docs/faq

---

**🔒 Remember: Security is important! Always validate server-side and never trust client-side validation alone.**

