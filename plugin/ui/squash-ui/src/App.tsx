import './App.css'
import { Card, Container, Group, Stack, Title } from '@mantine/core'
import { AreaChart } from '@mantine/charts'
import SliderGroup from './components/SliderGroup'

function App() {

  return (
    <Container w={"100vw"} h={"100vh"} p={"xl"} bg={""}>
      <Stack h={"100%"} justify='space-between'>
        <Title w={"100%"} style={{textAlign:"start"}}>
          LOGO
        </Title>
        <Card shadow="sm" padding="lg" radius="md" withBorder h={"50%"} display={"flex"} style={{justifyContent:"center"}}>
          <AreaChart 
            h={"100%"} 
            withTooltip={false}
            referenceLines={[]}
            dataKey='audio'
            yAxisProps={{ domain: [-60, 0] }} 
            xAxisProps={{domain: [-60,0]}}
            data={[{x:0, y:0}]}
            series={[{ name: 'audio', color: 'indigo.6' }]}
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
