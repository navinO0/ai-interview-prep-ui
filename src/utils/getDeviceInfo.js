"use client";
import { UAParser } from 'ua-parser-js'; 
import FingerprintJS from '@fingerprintjs/fingerprintjs';

export const getDeviceInfo = async () => {
  const parser = new UAParser();
  const result = parser.getResult();
  const fp = await FingerprintJS.load();
  const fingerprint = await fp.get();

  // Fetch city using IP-based geolocation

  return {
    fingerprint: fingerprint.visitorId,
    deviceType: result.device.type || 'desktop',
    os: `${result.os.name} ${result.os.version}`,
    browser: `${result.browser.name} ${result.browser.version}`,
    userAgent: navigator.userAgent,
    screenResolution: `${window.screen.width}x${window.screen.height}`,
    platform: navigator.platform,
    language: navigator.language,
  };
};

