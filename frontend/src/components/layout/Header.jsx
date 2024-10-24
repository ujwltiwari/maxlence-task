import { headerItems } from '@/constants/header.js'
import { Separator } from '@/components/ui/separator.jsx'
import { Link } from 'react-router-dom'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import useAuth from '@/hooks/useAuth'

const Header = () => {
  const { user, isLoggedIn } = useAuth()
  return (
    <>
      <header className='flex justify-between pt-4'>
        <Link
          to='/'
          className='scroll-m-20 text-[25px] font-semibold tracking-tight'
        >
          Auth
        </Link>
        <div className='sm:flex gap-12 items-center hidden'>
          {headerItems.map((item, idx) => (
            <Link
              key={idx}
              to={item.link}
              className='leading-7 font-medium text-[14px] cursor-pointer'
            >
              {item.title}
            </Link>
          ))}
          {isLoggedIn && user ? (
            <Avatar>
              <AvatarImage src={user.image} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          ) : null}
        </div>
        {/*<div className="flex gap-6 items-center cursor-pointer">*/}
        {/*  {headerIcons.map((item, idx) => {*/}
        {/*    const cartCount = item.title === "Cart";*/}
        {/*    const hasLink = item.link;*/}
        {/*    return (*/}
        {/*      <Link to={`${hasLink ? item.link : "#"}`} key={idx}>*/}
        {/*        <div key={idx} className={cartCount ? "relative" : ""}>*/}
        {/*          {createElement(item.icon, {*/}
        {/*            width: 26,*/}
        {/*            height: 26,*/}
        {/*            size: 26,*/}
        {/*          })}*/}
        {/*        </div>*/}
        {/*      </Link>*/}
        {/*    );*/}
        {/*  })}*/}
        {/*</div>*/}
      </header>
      <Separator className='my-4' />
    </>
  )
}

export default Header
