import React from 'react'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'

const MemberLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      <main>
        {children}
      </main>
      <Footer />
    </>
  )
}

export default MemberLayout
