/**
 * Notification Utilities (WhatsApp via CallMeBot & Email via EmailJS)
 * 
 * Free / No-backend implementation for Firebase React apps.
 */

// CallMeBot WhatsApp API (Free)
export async function sendWhatsAppAlert(phone: string, apikey: string, message: string) {
    if (!phone || !apikey) return false;

    try {
        // CallMeBot uses a simple GET request
        const encodedMessage = encodeURIComponent(message);
        const url = `https://api.callmebot.com/whatsapp.php?phone=${phone}&text=${encodedMessage}&apikey=${apikey}`;

        // We use no-cors because CallMeBot API doesn't return proper CORS headers
        // The request still sends successfully.
        await fetch(url, { mode: 'no-cors' });
        return true;
    } catch (error) {
        console.error('Failed to send WhatsApp alert via CallMeBot:', error);
        return false;
    }
}

// EmailJS API (Free 200/mo)
export async function sendEmailAlert(
    serviceId: string,
    templateId: string,
    publicKey: string,
    userEmail: string,
    alertTitle: string,
    alertMessage: string
) {
    if (!serviceId || !templateId || !publicKey || !userEmail) return false;

    try {
        const data = {
            service_id: serviceId,
            template_id: templateId,
            user_id: publicKey,
            template_params: {
                to_email: userEmail,
                alert_title: alertTitle,
                alert_message: alertMessage,
                time: new Date().toLocaleString(),
            }
        };

        const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        return response.ok;
    } catch (error) {
        console.error('Failed to send Email alert via EmailJS:', error);
        return false;
    }
}
