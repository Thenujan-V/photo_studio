import React from 'react'

const Header = ({ title }) => {
  return (
    <div
    className='w-100 d-flex justify-content-center align-items-center'
    style={{
        backgroundColor: "#bd2752",
        height: "120px",
        color: "white",
        marginTop: "60px"
    }}
    >
        <h1 className='h1 text-start mb-3' style={{ color: "rgb(245, 222, 222)", fontWeight: '800'}}>{ title }</h1>
    </div>
  )
}

export default Header