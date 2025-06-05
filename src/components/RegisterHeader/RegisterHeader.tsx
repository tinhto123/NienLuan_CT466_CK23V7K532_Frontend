import { Link, useLocation } from 'react-router-dom'

export default function RegisterHeader() {
  const { pathname } = useLocation()
  return (
    <header className='py-5'>
      <div className='container'>
        <nav className='flex items-center justify-start'>
          <Link to='/'>
            <img
              src='https://png.pngtree.com/png-clipart/20190705/original/pngtree-hand-drawn-cute-standing-penguin-png-image_4361050.jpg'
              alt='Shop Logo'
              style={{
                objectFit: 'cover',
                background: '#fff',
                borderRadius: '50%',
                width: '60px',
                height: '60px'
              }}
            />
          </Link>
          <div className='ml-5 text-xl lg:text-2xl'>{pathname === '/login' ? 'Đăng nhập' : 'Đăng kí'}</div>
        </nav>
      </div>
    </header>
  )
}
