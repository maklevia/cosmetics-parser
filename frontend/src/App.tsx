import { AbsoluteCenter, Button } from "@chakra-ui/react"
import { Link } from 'react-router-dom'

function App() {
  return (
    <>
    <AbsoluteCenter axis="horizontal">
      <h1>Cosmetic Price Tracker</h1>
    </AbsoluteCenter>
    <AbsoluteCenter>
      <Link to={"/login"}>
        <Button>Log In</Button>
      </Link>
    </AbsoluteCenter>
    </>
  )
}

export default App
