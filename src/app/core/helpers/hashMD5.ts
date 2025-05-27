import * as CryptoJS from 'crypto-js';

export function hashMD5(value: string): string {
    return CryptoJS.MD5(value).toString(CryptoJS.enc.Hex);
}
