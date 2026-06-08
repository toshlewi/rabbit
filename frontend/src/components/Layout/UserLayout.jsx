import Header from '../Common/Header'
import Footer from '../Common/Footer'

const UserLayout = () => {
  return (
    <div style={{display: 'flex', flexDirection: 'column', minHeight: '100vh'}}>
      {/*Header*/}
      <Header />
      {/*Main*/}
      
      {/*Footer*/}
      <Footer />
    </div>
  )
}

export default UserLayout