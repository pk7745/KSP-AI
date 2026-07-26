export function showToast(message: string, isError: boolean = false) {
  const toast = document.createElement('div');
  toast.className = `global-toast ${isError ? 'toast-error' : 'toast-success'}`;
  
  toast.innerHTML = `
    <div class="toast-icon">
      ${isError ? '✕' : '✓'}
    </div>
    <div class="toast-text">${message}</div>
  `;
  
  document.body.appendChild(toast);
  
  // Trigger animation
  setTimeout(() => {
    toast.classList.add('visible');
  }, 10);
  
  setTimeout(() => {
    toast.classList.remove('visible');
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 300);
  }, 3000);
}
