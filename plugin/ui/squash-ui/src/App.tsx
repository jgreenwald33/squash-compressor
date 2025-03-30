import { useState } from 'react'
import './App.css'
import { Button } from '@mantine/core'
import SliderGroup from './components/SliderGroup'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <SliderGroup min={0} max={100} effectName='Test' units='Hz'/>
      <div className="card">
        <Button variant="light" color="cyan" size="lg" radius="md" onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </Button>
      </div>
    </>
  )
}

export default App
