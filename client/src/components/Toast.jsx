import React from 'react'
import CustomButton from './CustomButton'
import { success, error } from '../assets'

const Toast = ({ type, message, setAlert }) => {
  return (
    <div className={`toast ${type}`}>
      <img
        src={type === 'error' ? error : success} alt={type}
        className='size-8 rounded-full invert brightness-0' />
      <p className='text-sm'>{message}</p>
      <CustomButton
        type='filled'
        title='Close'
        customStyles={'w-fit px-4 py-2.5 font-bold text-sm'}
        handleClick={() => setAlert({ open: false, message: '', type: '' })}
      />
    </div>
  )
}

export default Toast