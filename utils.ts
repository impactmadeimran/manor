import JWT from 'jsonwebtoken'
import { Resend } from 'resend';

const maxAge = 30000;
export const createToken = async (id: any) => {
    return JWT.sign(id, process.env.JWT_SECRET as string, { expiresIn: maxAge });
}

export function generateRandomAlphanumeric(length: number): string {
    const alphanumericChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * alphanumericChars.length);
        result += alphanumericChars.charAt(randomIndex);
    }

    return result;
}

export const resend = new Resend(process.env.RESEND_KEY);