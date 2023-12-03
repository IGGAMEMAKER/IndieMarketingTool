export const hasCookie = m => {
  const c = document.cookie;
  if (c.endsWith(m + "="))
    return false;

  // has cookie and it's not empty
  return c.includes(m) && !c.includes(m + "=;")
}
export const hasCookies = () => hasCookie("userId") || hasCookie("email")

export const isAuthenticatedGoogleUser = () => hasCookie("email")
export const isGuest = () => hasCookie("userId") && !isAuthenticatedGoogleUser()
