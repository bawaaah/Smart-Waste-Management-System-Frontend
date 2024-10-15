import React from 'react'
import VerticalNav from '../components/Navi'


function PaymentDetails() {
  return (
    <div className="h-screen flex">
        <VerticalNav />

        {/* Main Area */}
        <div className='flex-1 p-8'>
            <h1 className="text-3xl font-bold">Payment</h1>
        </div>
    </div>
  )
}

export default PaymentDetails