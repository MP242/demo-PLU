'use server'

import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: 'ssl0.ovh.net',
    port: 465,
    secure: true,
    auth: {
        user: 'alert@australsolar.re',
        pass: 'acyzkh974'
    }
  });

export async function sendMail(email: string, link: string, role: string) {
    try {
        const mailOptions = {
            from: 'alert@australsolar.re',
            to: email,
            subject: 'Bienvenue sur notre plateforme !',
            html: `<h1>Bienvenue sur notre plateforme Call Center !</h1>` +
                `<p>Vous avez été ajouté en tant qu'${role}.</p>` +
                `<p>Veuillez cliquer sur le lien suivant pour confirmer votre inscription : <a href="${process.env.NEXTAUTH_URL}/confirmation?link=${link}">ici</a></p>` +
                `<p>Si vous n'êtes pas à l'origine de cette demande, veuillez ignorer ce mail.</p>`

        };
        const info = await transporter.sendMail(mailOptions);
        
    } catch (error) {
        console.log(error);
    }
}
