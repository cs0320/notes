import * as crypto from 'crypto';

export function generateRandomString(length: number): string {
    const charset = '0123456789';
    const randomBytes = crypto.randomBytes(length);
    let result = '';
    for (let i = 0; i < length; i++) {
        // Use modulo to map the random byte to our charset
        const randomIndex = randomBytes[i] % charset.length;
        result += charset[randomIndex];
    }
    return result;
}