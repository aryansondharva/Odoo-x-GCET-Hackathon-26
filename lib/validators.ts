// Form validation utilities

export const validators = {
  email: (value: string): string | true => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(value) ? true : "Invalid email address"
  },

  password: (value: string): string | true => {
    if (value.length < 8) return "Password must be at least 8 characters"
    if (!/[A-Z]/.test(value)) return "Password must contain uppercase letter"
    if (!/[0-9]/.test(value)) return "Password must contain number"
    return true
  },

  phone: (value: string): string | true => {
    const regex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/
    return regex.test(value) ? true : "Invalid phone number"
  },

  name: (value: string): string | true => {
    if (value.length < 2) return "Name must be at least 2 characters"
    return true
  },

  otp: (value: string): string | true => {
    return /^\d{6}$/.test(value) ? true : "OTP must be 6 digits"
  },
}
