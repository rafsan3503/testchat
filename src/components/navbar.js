import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo_no_bg from './../media/img/lead-text.png'
import cancel_icon from './../media/icons/close.png'
import nav_icon from './../media/icons/menu.png'


const NavBar = () => {

    const windowscrollvalue = window.scrollY
    const [showmobilenav, setshowmobilenav] = useState(null)
    const [windowWidth, setWindowWidth] = useState(window.innerWidth)

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
            console.log(window.innerWidth)
        };

        const handleScroll = () => {
            // console.log(window.scrollY)
            setshowmobilenav(null)
        }

        window.addEventListener('resize', handleResize);

        window.addEventListener('scroll', handleScroll);

        // Cleanup: Remove the event listener when the component is unmounted
        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('scroll', handleScroll)
        };
    }, []);

    const handleMobilenav = () => {
        if(!showmobilenav) {
            setshowmobilenav(true)
        } else {
            setshowmobilenav(false)
        }
    }



    return ( 
        <>
            <header>
                <a href="" className='logo flex gap-5 align-center'>
                    <img src={logo_no_bg} className='logo' alt="" />
                    <p>$FRIV</p>
                </a>

                {/* {windowWidth > 991 ? */}
                    <ul>
                        {/* <li className='nav-link'><a href='#htb'>How to Buy</a></li>
                        <li className='nav-link'><a href='#about'>About</a></li>
                        <li className='nav-link'><a href='#roadmap'>Roadmap</a></li>
                        <li className='nav-link'><a href='#tokenomics'>Tokenomics</a></li> */}
                        <li>
                            <Link to='https://movepump.com/token/0xe60240ad5fa8de6db91ea48934f4453a48c67097dc4b7d576b9ebe0d8597a1a2::friv::FRIV' target='_blank' className='gs-btn'>
                                Buy Now
                            </Link>
                        </li>
                        <div className='nav-icon' onClick={handleMobilenav}>
                            <img src={showmobilenav ? cancel_icon : nav_icon} alt="" />
                        </div>
                    </ul>
                {/* : null} */}

                {/* {windowWidth < 991 ?  */}
                    {/* <div className='nav-icon' onClick={handleMobilenav}>
                        <img src={showmobilenav ? cancel_icon : nav_icon} alt="" />
                    </div> */}
                {/* : null} */}
            </header>

            <div className={`mobile-nav ${showmobilenav ? 'active' : ''}`}>
                <div className="mobile-nav-item">
                    <a href='#htb' className='open-sans_f'>How to Buy</a>
                </div>
                <div className="mobile-nav-item">
                    <a href='#about' className='open-sans_f'>About</a>
                </div>
                {/* <div className="mobile-nav-item">
                    <a href='#roadmap' className='open-sans_f'>Roadmap</a>
                </div> */}
                <div className="mobile-nav-item">
                    <a href='#tk' className='open-sans_f'>Tokenomics</a>
                </div>
                <div className="mobile-nav-item">
                    <a href='https://movepump.com/token/0xe60240ad5fa8de6db91ea48934f4453a48c67097dc4b7d576b9ebe0d8597a1a2::friv::FRIV' target='_blank' className='open-sans_f'>
                        Buy Now
                    </a>
                </div>
            </div>

        </>
    );
}
 
export default NavBar;