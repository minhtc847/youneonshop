import { signOut } from 'next-auth/react'

const AUTO_LOGOUT_DAYS = 7

export const checkAutoLogout = () => {
  const lastLoginTime = localStorage.getItem('lastLoginTime')
  if (lastLoginTime) {
    const currentTime = new Date().getTime()
    const lastLogin = parseInt(lastLoginTime, 10)
    const daysSinceLastLogin = (currentTime - lastLogin) / (1000 * 60 * 60 * 24)

    if (daysSinceLastLogin > AUTO_LOGOUT_DAYS) {
      signOut({ callbackUrl: '/login' })
    }
  }
}

export const updateLastLoginTime = () => {
  localStorage.setItem('lastLoginTime', new Date().getTime().toString())
}

export const redirectToLogin = () => {
  const event = new CustomEvent('redirectToLogin');
  window.dispatchEvent(event);
};