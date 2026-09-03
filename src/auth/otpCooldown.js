const COOLDOWN_KEY = "internly-otp-resend-until";
export const OTP_COOLDOWN_SECONDS = 60;

export function getOtpCooldownSeconds() {
  const remaining = Math.ceil((Number(sessionStorage.getItem(COOLDOWN_KEY) || 0) - Date.now()) / 1000);
  return Math.max(0, remaining);
}

export function startOtpCooldown(seconds = OTP_COOLDOWN_SECONDS) {
  sessionStorage.setItem(COOLDOWN_KEY, String(Date.now() + seconds * 1000));
}
