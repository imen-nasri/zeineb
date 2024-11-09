const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // Créez un transporteur pour envoyer les e-mails
    const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE, // Par exemple, 'gmail'
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD, // Utilisez le mot de passe d'application pour Gmail
        },
    });

    // Définissez les options de l'e-mail
    const mailOptions = {
        from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
    };

    try {
        // Envoyez l'e-mail
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
    } catch (error) {
        // Gestion des erreurs
        console.error('Error sending email:', error);
        throw new Error('Email sending failed');
    }
};

module.exports = sendEmail;
