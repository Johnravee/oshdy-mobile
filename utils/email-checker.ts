export default function isValidEmail(email: string): boolean {
    // Simple and effective email format validator
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailRegex.test(email);
}
