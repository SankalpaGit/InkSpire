import React from 'react'
import NavTabs from '../components/NavTabs'

const StaffLayout = ({children}) => {
  return (
    <div>
        <NavTabs />
        <main>
            {children}
        </main>
    </div>
  )
}

export default StaffLayout
