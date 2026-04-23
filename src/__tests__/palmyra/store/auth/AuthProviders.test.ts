import { describe, test, expect } from 'vitest';
import { BasicAuthProvider, OauthProvider } from 'lib/palmyra/store/auth/AuthProviders';

describe('BasicAuthProvider', () => {
    test('sets Authorization header on the request', () => {
        const provider = new BasicAuthProvider('alice', 's3cret');
        const request: any = { headers: {} };
        provider.decorate(request);
        const expected = 'Basic ' + Buffer.from('alice:s3cret', 'utf-8').toString('base64');
        expect(request.headers.Authorization).toBe(expected);
    });

    test('creates headers object when missing', () => {
        const provider = new BasicAuthProvider('alice', 's3cret');
        const request: any = {};
        provider.decorate(request);
        expect(request.headers).toBeDefined();
        expect(request.headers.Authorization).toMatch(/^Basic /);
    });

    test('preserves existing request headers', () => {
        const provider = new BasicAuthProvider('alice', 's3cret');
        const request: any = { headers: { 'X-Custom': 'value' } };
        provider.decorate(request);
        expect(request.headers['X-Custom']).toBe('value');
        expect(request.headers.Authorization).toMatch(/^Basic /);
    });

    test('encodes UTF-8 credentials correctly', () => {
        const provider = new BasicAuthProvider('user', 'pä$$wörd');
        const request: any = { headers: {} };
        provider.decorate(request);
        const expected = 'Basic ' + Buffer.from('user:pä$$wörd', 'utf-8').toString('base64');
        expect(request.headers.Authorization).toBe(expected);
    });

    test('encodes empty credentials as Basic Og==', () => {
        const provider = new BasicAuthProvider('', '');
        const request: any = { headers: {} };
        provider.decorate(request);
        expect(request.headers.Authorization).toBe('Basic Og==');
    });
});

describe('OauthProvider', () => {
    test('stub does not set Authorization header', () => {
        const provider = new OauthProvider();
        const request: any = { headers: {} };
        provider.decorate(request);
        expect(request.headers.Authorization).toBeUndefined();
    });
});
