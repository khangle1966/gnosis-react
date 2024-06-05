export function logMessage(message) {
    console.log(message);
    
    // Lấy log hiện tại từ localStorage
    const currentLogs = JSON.parse(localStorage.getItem('logs')) || [];
    
    // Thêm log mới
    currentLogs.push(message);
    
    // Lưu log trở lại localStorage
    localStorage.setItem('logs', JSON.stringify(currentLogs));
}

export function getLogs() {
    const logs = JSON.parse(localStorage.getItem('logs')) || [];
    logs.forEach(log => console.log(log));
}
