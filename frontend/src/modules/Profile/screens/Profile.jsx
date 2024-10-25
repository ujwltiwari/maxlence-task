import useAuth from '@/hooks/useAuth'
import React from 'react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Users from '../components/Users'
import { Button } from '@/components/ui/button'
import { Cog } from 'lucide-react'
import { List } from 'lucide-react'
import { useCallback } from 'react'

const Profile = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  console.log('user', user)

  const handleRedirect = useCallback(
    (location) => {
      navigate(location)
    },
    [navigate]
  )

  return (
    <>
      <h1 className='text-[24px] font-medium'>Welcome {user?.name}</h1>
      <div className='flex flex-col gap-2 mt-4 max-w-[500px] m-auto'>
        <Button
          variant='outline'
          onClick={() => handleRedirect('/profile/users')}
        >
          <List />
          View All Users
        </Button>
        <Button
          variant='outline'
          onClick={() => handleRedirect('/profile/edit')}
        >
          <Cog />
          Edit Profile
        </Button>
      </div>
    </>
  )
}

export default Profile
