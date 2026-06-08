import Header from '../Common/Header'
import Footer from '../Common/Footer'
import { Outlet } from 'react-router-dom'

const UserLayout = () => {
  return (
    <div style={{display: 'flex', flexDirection: 'column', minHeight: '100vh'}}>
      {/*Header*/}
      <Header />
      {/*Main*/}
      <main>
        <Outlet />
      </main>
     
      {/*Footer*/}
      <Footer />
    </div>
  )
}

export default UserLayout