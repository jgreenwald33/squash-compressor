import './App.css'
import * as Juce from "./juce/index.js";
import { useEffect, useState } from 'react'
import { Card, Container, Group, Paper, Slider, Stack, Title } from '@mantine/core'
import { LineChart } from '@mantine/charts'
import SliderGroup from './components/SliderGroup'

function App() {
  const [threshold] = useState(-30);
  const [knee,setKnee] = useState(10);
  useEffect(()=>{
    console.log(window.__JUCE__.backend)
  },
  [])
  return (
    <Container w={"100vw"} h={"100vh"} px={"xl"} py={"xl"} bg={""}>
      <Stack h={"100%"} justify='space-between' gap={"sm"}>
        <Title w={"100%"} style={{textAlign:"start"}}>
          LOGO
        </Title>
        <Card padding="lg" radius="md" withBorder h={"50%"} display={"flex"} style={{justifyContent:"center", borderColor:"#000"}}>
        <LineChart 
          h="100%"
          withDots={false} 
          withTooltip={false}
          tickLine="none"
          gridAxis="xy"
          type="gradient"
          gradientStops={[
            { offset: 0, color: 'red.6' },
            { offset: 20, color: 'orange.6' },
            { offset: 40, color: 'yellow.5' },
            { offset: 70, color: 'lime.5' },
            { offset: 80, color: 'cyan.5' },
            { offset: 100, color: 'blue.5' },
          ]}
          withXAxis
          withYAxis
          dataKey="xAxisProps"
          yAxisProps={{ type:"number", domain: [-60, 0] }} 
          xAxisProps={{ type: "number", dataKey: "x", domain: [-60, 0] }}
          data={[{ x: -60, baseline: -60,adjusted:-60 },{ x: -30, baseline: threshold }, { x: 0, baseline: 0 - knee, }]}
          series={[{ name: 'baseline', color: 'gray.6' }]}
          curveType="linear"
        />
        </Card>
        <Slider onChange={setKnee} value={knee} min={0} step={1} max={100}/>
        
        <Paper style={{border:"1px solid #000"}} p={"20px"} radius={"md"}>
          <Group justify='space-between'>
            <SliderGroup min={0} max={20} effectName='Ratio'/>
            <SliderGroup min={-60} max={0} step={0.5} effectName='Gain' units='db'/>
            <SliderGroup min={0} max={100} effectName='Threshold' units='db'/>
            <SliderGroup min={0} max={100} effectName='Attack' units='ms' />
            <SliderGroup min={0} max={100} effectName='Release' units='ms'/>
            <SliderGroup min={0} max={100} effectName='Dry/Wet' units='%'/>
          </Group>
        </Paper>

      </Stack>

    </Container>
  )
}

export default App
