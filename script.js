// Utility function to escape HTML
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// Copy to clipboard function
function copyToClipboard(text) {
    // Remove HTML escaping for actual copy
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = text;
    const actualText = tempDiv.textContent || tempDiv.innerText || text;
    
    navigator.clipboard.writeText(actualText).then(() => {
        showToast('Copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy:', err);
        showToast('Failed to copy');
    });
}

// Show toast notification
function showToast(message) {
    const toast = document.getElementById('toast');
    if (toast) {
        toast.textContent = message;
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
}