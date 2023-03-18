import React from 'react';
import Layout from './Layout';
import Home from './Home';
import Register from './Register';
import Login from './Login';
import Companies from './Companies';
import Profile from './Profile';
import { Routes, Route } from 'react-router-dom';
import Company from './Company';
import Recommendation from './Recommendation';
import Logout from './Logout';



function App() {

  return (
  
    
      <Routes>
        <Route path="/" element={<Layout/>}>
          <Route index element={<Home />} />
          <Route path='/companies/' element={<Companies />} />
          <Route path='/companies/:companyId/*' element ={<Company/>} />    
          <Route path='/companies/:companyId/recommendation' element ={<Recommendation/>} />  
          
              <Route path='/users/register' element={<Register />} />
              <Route path='/users/login' element={<Login />} />
              <Route path='/users/profile' element={<Profile />} />
              <Route path='/users/logout' element={<Logout />} />  
                    
      </Route>
       {/*<Route path='*' element={<Error404 />} /> */}  
      
      </Routes>
   


      );
}

export default App;
