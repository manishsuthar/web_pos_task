import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './components/Login';
import Main from './components/Main';
import Catalogue from './components/Catalogue';
import Ordering from './components/Ordering';
import OrderDetails from './components/OrderDetails';
import Orders from './components/Orders';
import api from './services/api';

function App() {

  const [isLogin, setIsLogin] = useState(false);
  const [loading, setIsLoading] = useState(true);

  useEffect(()=>{
    validateToken();
  },[])

  useEffect(() => {
    if (!loading) {
      const tokenInfo = localStorage.getItem('USER_DATA');
      const data = tokenInfo ? JSON.parse(tokenInfo) : null;
      if (data) {
        console.log("----CALL----")
        setIsLogin(true);
      }
    }
  }, [loading])

  const validateToken = async () => {
    setIsLoading(true);
    try {
      const validate = await api.checkToken();
      if (!validate) {
        localStorage.removeItem('USER_DATA')
      }
    } catch (err) {
      localStorage.removeItem('USER_DATA')
    }
    setIsLoading(false);
  }

  if (loading) return <div>...Loading</div>;

  return (
    <div className="App">
      <BrowserRouter>
        {
          !isLogin ?
            (<Routes>
              <Route path="/*" element={<Login setIsLogin={setIsLogin} />} />
            </Routes>) :
            (<Routes>
              <Route path="/" element={<Main />} />
              <Route path="/main" element={<Main />} />
              <Route path="/main/catalogue" element={<Catalogue />} />
              <Route path="/main/ordering" element={<Ordering />} />
              <Route path="/main/orders" element={<Orders />} />
              <Route path="/main/orders/:id" element={<OrderDetails />} />
            </Routes>)
        }

      </BrowserRouter>
    </div>
  );
}

export default App;
