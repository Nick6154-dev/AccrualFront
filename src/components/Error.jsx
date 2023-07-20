import Alert from 'react-bootstrap/Alert';
function Error({children}) {
  return (
    <div className='d-flex flex-column justify-content-center align-items-center py-2 '>
    <Alert variant='danger'className=" col-sm-5 text-center">
      {children}
    </Alert>
    </div>
  )
}

export default Error
