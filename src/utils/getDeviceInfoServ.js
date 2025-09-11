
import FingerprintJS from '@fingerprintjs/fingerprintjs';

export const getDeviceInfoServ = async () => {

  // Get unique fingerprint
  const fp = await FingerprintJS.load();
  const fingerprint = await fp.get();

  return {
    fingerprint: fingerprint.visitorId,
  };
};
