import React from 'react'

const header = ({ title }) => {
  return (
    <div
    className='w-100 d-flex justify-content-center align-items-center'
    style={{
        backgroundColor: "red",
        height: "120px",
        color: "white",
        marginTop: "60px"
    }}
    >
        <h1 className='h1 fw-bold text-start mb-3' style={{ color: "black"}}>{ title }</h1>
    </div>
  )
}

export default header