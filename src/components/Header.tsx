import React from 'react'

export const Header = () => {
  return (
    <header className="bg-red-600 text-white p-4 shadow">
        <nav className="flex justify-between items-center max-w-6xl mx-auto">
          <div className="text-lg font-bold">Kkopi Portal</div>
          <ul className="flex space-x-6 text-sm">
            <li><a href="#" className="hover:underline">Attendance</a></li>
            <li><a href="#" className="hover:underline">Employee</a></li>
            <li><a href="#" className="hover:underline text-red-300">Logout</a></li>
          </ul>
        </nav>
      </header>
  )
}
