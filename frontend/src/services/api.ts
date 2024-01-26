const BASE_URL = 'http://localhost:3002';
const BASE_URL_API = 'https://staging.giftlov.com/api/Base';
const API_ENCRYPTION_KEY = 'TEST';

const getUserData = ()=>{
   return JSON.parse(localStorage.getItem('USER_DATA') || '{}');
}

const generateTimestamp = () => {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0'); // Month is zero-based
  const year = String(now.getFullYear());
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  return `${day}${month}${year}${hours}${minutes}${seconds}`;
};

const getToken = ()=>{
  return getUserData().token;
}

const generateSignature = (method:string, endpoint:string, params:any, body:any) => {
  const authToken = getToken();
  if (!authToken) {
    throw new Error('Authentication token not available');
  }

  const sortedParams = Object.entries(params).sort(([keyA], [keyB]) => keyA.localeCompare(keyB));

  const valuesToConcatenate = sortedParams.map(([key, value]) => (Array.isArray(value) ? value.join('') : value)).join('');

  const requestPart = endpoint;
  const signatureString = `${requestPart}${method}${valuesToConcatenate}`;

  const timestamp = generateTimestamp();
  const authAndTimestamp = `${timestamp}${authToken}`;
  const finalSignatureString = `${signatureString}${authAndTimestamp}`;

  return finalSignatureString;
};

const api = {
  login: async (credentials:any) => {
    try {
      const response = await fetch(`${BASE_URL_API}/generateToken`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-GIFTLOV-DATE': generateTimestamp(),
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }
      const data = await response.json();
      return data;
    } catch (error:any) {
      throw new Error(`Login error: ${error.message}`);
    }
  },

  getWalletBalances: async () => {
    try {
      const authToken = getToken();
      if (!authToken) {
        throw new Error('Authentication token not available');
      }

      const timestamp = generateTimestamp();

      const response = await fetch(`${BASE_URL_API}/wallets/balances/`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${authToken}`,
          'X-GIFTLOV-DATE': timestamp,
          'signature': generateSignature('GET','/wallets/balances',{},null),
        },
      });

      if (!response.ok) {
        throw new Error('Request failed');
      }

      return response.json();
    } catch (error:any) {
      throw new Error(`API request error: ${error.message}`);
    }
  },

  checkToken: async () => {
    try {
      const authToken = getToken();
      if (!authToken) {
        throw new Error('Authentication token not available');
      }

      const timestamp = generateTimestamp();

      const response = await fetch(`${BASE_URL_API}/checkToken`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
          'X-GIFTLOV-DATE': timestamp,
          'signature': generateSignature('POST','/checkToken',null,null),
        },
      });

      if (!response.ok) {
        throw new Error('Token validation failed');
      }

      return response.json();
    } catch (error:any) {
      throw new Error(`Token validation error: ${error.message}`);
    }
  },

  getCatalogue: async () => {
    const response = await fetch(`${BASE_URL}/catalogue`);

    if (!response.ok) {
      throw new Error('Error fetching catalogue');
    }

    return response.json();
  },

  placeOrder: async (orderData:any) => {
    const loginInfo = getUserData()
    const response = await fetch(`${BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({...orderData,...loginInfo}),
    });

    if (!response.ok) {
      throw new Error('Error placing order');
    }

    return response.json();
  },

  getOrders: async () => {
    const response = await fetch(`${BASE_URL}/orders`);

    if (!response.ok) {
      throw new Error('Error fetching orders');
    }

    return response.json();
  },

  getOrderDetails: async (orderId:any) => {
    const response = await fetch(`${BASE_URL}/orders/${orderId}`);

    if (!response.ok) {
      throw new Error('Error fetching order details');
    }

    return response.json();
  },
};

export default api;
