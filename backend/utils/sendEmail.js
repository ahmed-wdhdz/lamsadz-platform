/**
 * sendEmail.js
 * Sends emails using a Google Apps Script Web App to bypass Render's strict SMTP Port blocking.
 */

const sendEmail = async (to, subject, html) => {
    try {
        const scriptUrl = process.env.GOOGLE_SCRIPT_URL;

        if (!scriptUrl) {
            console.error("ERROR: GOOGLE_SCRIPT_URL is not set in environment variables.");
            return { success: false, error: 'Email service is not configured correctly on the server.' };
        }

        // We use fetch to call our custom serverless Google Apps Script API
        const response = await fetch(scriptUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                to: to,
                subject: subject,
                html: html
            })
        });

        const result = await response.json();

        if (result.status === 'success') {
            console.log("Message sent successfully via Google Apps Script");
            return { success: true };
        } else {
            console.error("Google Script API returned an error:", result);
            return { success: false, error: result.message || 'Unknown API error' };
        }

    } catch (error) {
        console.error("Error connecting to Google Script API: ", error);
        return { success: false, error: error.message || 'Network/Fetch error' };
    }
};

module.exports = sendEmail;
