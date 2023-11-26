// import logo from './logo.svg';
import './App.css';

import {Component} from 'react';
import {Route, Routes} from 'react-router-dom';

import {ProfilePage} from "./ProfilePage";
import {ProjectPage} from "./ProjectPage";
import {LoginForm, SaveGuestProgressForm} from "./LoginForm";
import {About} from "./About";
import {ResetPasswordForm} from "./ResetPasswordForm";
import {MistakesPage} from "./MistakesPage";
import {VerifyForm} from "./VerifyForm";
import {RegisterForm} from "./RegisterForm";
import {AdminPage} from "./AdminPage";
import {MainPage} from "./MainPage";


class App extends Component {
  render() {
    return <div>
      <div className="App">
        <header className="App-header" style={{height: '100%', minHeight: '100vh'}}>
          <Routes>
            <Route path='/'                               element={<MainPage/>}/>
            <Route path='/mistakes'                       element={<MistakesPage />}/>
            <Route path='/register'                       element={<RegisterForm/>}/>
            <Route path='/verify'                         element={<VerifyForm />}/>
            <Route path='/login'                          element={<LoginForm/>}/>
            <Route path='/save-progress'                  element={<SaveGuestProgressForm/>}/>
            <Route path='/logout'                         element={<LoginForm/>}/>
            <Route path='/reset'                          element={<ResetPasswordForm />}/>

            <Route path='/about'                          element={<About />}/>

            <Route path='/profile'                        element={<ProfilePage/>}/>
            <Route path='/projects/:projectId'            element={<ProjectPage/>}/>
            <Route path='/admin/panel'                    element={<AdminPage/>}/>
          </Routes>
        </header>
      </div>
    </div>
  }
}

export default App;
