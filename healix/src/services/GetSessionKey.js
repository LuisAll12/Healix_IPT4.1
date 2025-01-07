export function getSessionKeyFromCookies() {
    const cookies = document.cookie.split("; ");
    const sessionCookie = cookies.find(cookie => cookie.startsWith("sessionKey="));
    if (sessionCookie) {
        return sessionCookie.split("=")[1];
    }
    return null;
}
