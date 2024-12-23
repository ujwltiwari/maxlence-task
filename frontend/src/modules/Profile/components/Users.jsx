import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Trash } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useCallback } from 'react'
import Spinner from '@/components/Spinner'
import useAuth from '@/hooks/useAuth'
import { toast } from 'sonner'
import { Toaster } from '@/components/ui/sonner'
const Users = () => {
  const { user } = useAuth()
  const [users, setUsers] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  const fetchUsers = async (page, pageSize) => {
    try {
      const response = await axios.get(`http://localhost:3000/users`, {
        params: { page, pageSize },
      })
      setUsers(response.data.data)
      setCurrentPage(response.data.currentPage)
      setTotalPages(response.data.totalPages)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  useEffect(() => {
    fetchUsers(currentPage, pageSize)
  }, [currentPage, pageSize])

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1)
  }

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1)
  }

  const onSearch = useCallback(async (e) => {
    setLoading(true)
    const response = await axios.get(`http://localhost:3000/users/search`, {
      params: {
        name: e.target.value,
      },
    })
    console.log('response', response)
    setUsers(response.data.data)
    setCurrentPage(response.data.currentPage)
    setTotalPages(response.data.totalPages)
    setLoading(false)
  }, [])

  const handleUserDelete = async (id) => {
    console.log('handleUserDelete', id)
    try {
      const result = await axios.delete(`http://localhost:3000/users/${id}`)
      console.log('result', result)
      toast.success('User Deleted')
    } catch (err) {
      console.error('Error Deleting Users', err)
    }
  }

  return (
    <div className='flex flex-col items-center'>
      <Toaster />
      <div className='w-full max-w-md'>
        <Input
          placeholder='Enter Name to Search...'
          className='mb-4'
          onChange={onSearch}
        />
        {!loading && users.length ? (
          <ul>
            {users.map((x) => (
              <li
                key={x.id}
                className='flex items-center justify-between p-4 border rounded mb-2'
              >
                <img
                  src={x.image}
                  className='w-[50px] h-[50px] cursor-pointer'
                />
                <div>
                  <p className='font-bold'>{x.fullName}</p>
                  <p>{x.email}</p>
                </div>
                {user.role === 'admin' ? (
                  <Button
                    size='icon'
                    variant='destructive'
                    onClick={() => handleUserDelete(x.id)}
                  >
                    <Trash />
                  </Button>
                ) : null}
              </li>
            ))}
          </ul>
        ) : !loading && !users.length ? (
          <p>No User Found!</p>
        ) : (
          <div className='h-[100px] w-full flex items-center justify-center'>
            <Spinner />
          </div>
        )}
      </div>
      <div className='flex items-center justify-center gap-4 mt-4'>
        <Button
          variant='outline'
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className='flex items-center gap-2'
        >
          <ChevronLeft />
          Previous
        </Button>
        <p>
          Page {currentPage} of {totalPages}
        </p>
        <Button
          variant='outline'
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className='flex items-center gap-2'
        >
          Next
          <ChevronRight />
        </Button>
      </div>
    </div>
  )
}

export default Users
