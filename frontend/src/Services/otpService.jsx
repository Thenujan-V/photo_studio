
const OTP_TTL_MS = 5 * 60 * 1000;

export const generateOTP = () => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = Date.now() + OTP_TTL_MS;
    localStorage.setItem('otp', otp);
    localStorage.setItem('otp_expires', otpExpiresAt);

    return otp
  };