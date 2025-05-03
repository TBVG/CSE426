
// Format points with commas for thousands
export const formatPoints = (points: number): string => {
  return new Intl.NumberFormat().format(points);
};

// Format hours and minutes
export const formatTime = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours} hr`;
  } else {
    return `${hours} hr ${remainingMinutes} min`;
  }
};

// Format hours for display
export const formatHours = (hours: number): string => {
  if (hours < 1) {
    return `${Math.round(hours * 60)} min`;
  } else if (hours === 1) {
    return '1 hour';
  } else {
    return `${hours.toFixed(1)} hours`;
  }
};

// Format wallet addresses (truncate middle)
export const formatAddress = (address: string): string => {
  if (!address) return '';
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

// Format dates
export const formatDate = (timestamp: number): string => {
  return new Date(timestamp).toLocaleDateString();
};
