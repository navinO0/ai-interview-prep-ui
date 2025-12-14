"use client";
const KEY_HEX = process.env.NEXT_PUBLIC_KEY_HEX || process.env.ENCRYPTION_KEY_HEX;

function hexToUint8Array(hex) {
    if (!hex) return new Uint8Array(0);
    return new Uint8Array(hex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
}

async function encryptObjectValues(obj, enc_keys) {
    if (!KEY_HEX) {
        console.warn("Encryption key not found (NEXT_PUBLIC_KEY_HEX)");
        return obj;
    }
    
    const keyBuffer = hexToUint8Array(KEY_HEX);
    const key = await crypto.subtle.importKey(
        "raw",
        keyBuffer,
        { name: "AES-GCM", length: 256 },
        false,
        ["encrypt"]
    );

    const encryptedObject = {};

    for (const [keyName, value] of Object.entries(obj)) {
        if (enc_keys.includes(keyName) && value) {
            const ivBuffer = crypto.getRandomValues(new Uint8Array(12));
            const encodedValue = new TextEncoder().encode(String(value));

            const encryptedBuffer = await crypto.subtle.encrypt(
                { name: "AES-GCM", iv: ivBuffer },
                key,
                encodedValue
            );

            // Convert encrypted data to Uint8Array
            const encryptedData = new Uint8Array(encryptedBuffer);

            // Convert IV + encrypted data to Base64 (Using btoa for browser compatibility if Buffer missing)
            const ivBase64 = typeof Buffer !== 'undefined' 
                ? Buffer.from(ivBuffer).toString("base64") 
                : btoa(String.fromCharCode(...ivBuffer));
                
            const encryptedBase64 = typeof Buffer !== 'undefined'
                ? Buffer.from(encryptedData).toString("base64")
                : btoa(String.fromCharCode(...encryptedData));

            encryptedObject[keyName] = `${ivBase64}:${encryptedBase64}`; // Store IV and encrypted data
        }
        else {
            encryptedObject[keyName] = value;
        }
    }

    return encryptedObject;
}

export { encryptObjectValues };
