import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux';
import { Store } from './redux/store';

// components
import NavBar from './components/navbar';
import Footer from './components/footer';

// pages
import Home from './pages/home';

// library_-_styles
import './styles/aos.css'


// styles
import './styles/main.css'
import './styles/flex-system.css'
import './styles/grid-system.css'
import './styles/text.css'
import './styles/spacing.css'
import './styles/responsive.css'
import './styles/effect.css'

// 
import './styles/lightslider.css'

// custom_-_js_-_files
import './scripts/main';

function App() {
  return (
    <Provider store={Store}>
        
      <BrowserRouter>

        {/* <NavBar /> */}

        <Routes>

          <Route 
            index
            path='/'
            element={<Home />}
          />

        </Routes>

      </BrowserRouter>

    </Provider>
  );
}

export default App;
