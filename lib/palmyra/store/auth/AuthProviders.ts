import { AuthDecorator } from "..";

class BasicAuthProvider implements AuthDecorator {
    constructor(private username: string, private password: string) {}

    decorate(request: any): void {
        request.headers = request.headers || {};
        request.headers.Authorization = `Basic ${encodeCredentials(this.username, this.password)}`;
    }
}

class OauthProvider implements AuthDecorator {
    decorate(request: any): void {

    }
}

function encodeCredentials(username: string, password: string): string {
    const raw = `${username}:${password}`;
    if (typeof Buffer !== 'undefined') {
        return Buffer.from(raw, 'utf-8').toString('base64');
    }
    const bytes = new TextEncoder().encode(raw);
    let binary = '';
    for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

export { BasicAuthProvider, OauthProvider };
