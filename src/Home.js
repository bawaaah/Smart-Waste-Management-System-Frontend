import React from 'react'
import VerticalNav from './components/Navi'

function Home() {
  return (
    <div className="h-screen flex">
        <VerticalNav />

        {/* Main Area */}
        <div className='flex-1 p-8'>
            <h1 className="text-3xl font-bold">Welcome to WasteWise Dashboard</h1>
        </div>
    </div>
  )
}

export default Home