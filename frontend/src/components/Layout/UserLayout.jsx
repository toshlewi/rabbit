import { useEffect } from 'react'
import Header from '../Common/Header'
import Footer from '../Common/Footer'
import { Outlet } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCart } from '../../redux/slices/cartSlice'

const UserLayout = () => {
  const dispatch = useDispatch();
  const { userId, guestId } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(
      fetchCart({
        userId: userId || null,
        guestId: userId ? null : guestId,
      })
    );
  }, [dispatch, userId, guestId]);

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
