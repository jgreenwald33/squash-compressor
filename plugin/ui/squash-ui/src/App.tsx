import './App.css'
import { useState } from 'react'
import { Card, Container, Group, Stack, Title } from '@mantine/core'
import { LineChart } from '@mantine/charts'
import SliderGroup from './components/SliderGroup'


function App() {
  const [threshold,setThreshold] = useState(-30);
  const [knee,setKnee] = useState(10);
  return (
    <Container w={"100vw"} h={"100vh"} px={"xl"} py={"sm"} bg={""}>
      <Stack h={"100%"} justify='space-between' gap={"sm"}>
        <Title w={"100%"} style={{textAlign:"start"}}>
          LOGO
        </Title>
        <Card shadow="sm" padding="lg" radius="md" withBorder h={"50%"} display={"flex"} style={{justifyContent:"center"}}>
        <LineChart 
          h="100%"
          withDots={false} 
          withTooltip={false}
          tickLine="none"
          gridAxis="xy"
          withXAxis
          withYAxis
          dataKey="xAxisProps"
          yAxisProps={{ type:"number", domain: [-60, 0] }} 
          xAxisProps={{ type: "number", dataKey: "x", domain: [-60, 0] }}
          data={[{ x: -60, baseline: -60,adjusted:-60 },{ x: -30, baseline: threshold, adjusted:threshold }, { x: 0, baseline: 0, adjusted:0 - knee },]}
          series={[{ name: 'baseline', color: 'indigo.6' }, {name:'adjusted', color:'red'}]}
          curveType="linear"
        />
        </Card>

        <Group justify='space-between'>
          <SliderGroup min={0} max={100} effectName='Threshold' units='db'/>
          <SliderGroup min={0} max={100} effectName='Ratio'/>
          <SliderGroup min={0} max={100} effectName='Attack' units='ms'/>
          <SliderGroup min={0} max={100} effectName='Release' units='ms'/>
          <SliderGroup min={0} max={100} effectName='Makeup Gain' units='db'/>
          <SliderGroup min={0} max={100} effectName='Dry/Wet' units='%'/>
        </Group>
      </Stack>

    </Container>
  )
}

export default App
