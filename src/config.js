const getApiUrl = () => {
  // Get the current hostname
  const hostname = window.location.hostname;
  
  // Development environment
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return process.env.REACT_APP_API_URL || 'http://localhost:5000';
  }
  
  // Production environment - use the same domain as frontend but with https
  return `https://${hostname}`;
};

const config = {
  apiUrl: getApiUrl()
};

export default config;
