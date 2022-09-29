import { BrowserRouter as Router } from 'react-router-dom';
import { Navigate, Route, Routes } from 'react-router';
import TaskList from './components/views/TaskList';
import Login from './components/views/Login';
import Logout from './components/views/Logout';
import 'antd/dist/antd.css';
import './App.css';
import Register from './components/views/Register';
import { useEffect, useState } from 'react';

function App() {

  const [userAuth, setUserAuth] = useState();
  const [loading, setLoading]= useState(true)

  const checkAuth = ()=>{
    const accessKey = localStorage.getItem("accessKey");
    if(accessKey!=null){
      setUserAuth(JSON.parse(accessKey))
      setLoading(false)
    }
    else
    {
      setUserAuth(null)
      setLoading(false)
    }
  }

  useEffect(()=>{
    checkAuth()
  },[])

  if(loading){
    return null;
  }

  if(userAuth!=null){
    return(
    <Router>
      <Routes>
        <Route path="/" element={<TaskList checkAuth={checkAuth} userAuth={userAuth} />} />
        <Route path="*" element={<Navigate to="/" replace/>}/>
      </Routes>
    </Router>
    );
  }
  else
  {
    return (
      <Router>
        <Routes>
          <Route path="/login" element={<Login checkAuth ={checkAuth}/>} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/Register" element={<Register/>} />
          <Route path="*" element={<Navigate to="/login" replace />}/>
        </Routes>
      </Router>
    );
  }


}

export default App;
