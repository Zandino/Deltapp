export function generatePassword(length = 12): string {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  
  // Ensure at least one of each character type
  password += charset.match(/[a-z]/)[0];
  password += charset.match(/[A-Z]/)[0];
  password += charset.match(/[0-9]/)[0];
  password += charset.match(/[!@#$%^&*]/)[0];
  
  // Fill the rest randomly
  for (let i = password.length; i < length; i++) {
    const randomIndex = crypto.getRandomValues(new Uint32Array(1))[0] % charset.length;
    password += charset[randomIndex];
  }
  
  // Shuffle the password
  return password.split('').sort(() => 0.5 - Math.random()).join('');
}