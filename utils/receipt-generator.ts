export default function generateUniqueReceiptId () {
    const now = new Date();
  
    const datePart = now.toISOString().slice(0, 10).replace(/-/g, ''); // YYYYMMDD
    const timePart = now
      .toTimeString()
      .slice(0, 8)
      .replace(/:/g, ''); // HHMMSS
  
    const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase(); // 6-char alphanumeric
  
    return `REC-${datePart}-${timePart}-${randomPart}`;
  };
  
  
  