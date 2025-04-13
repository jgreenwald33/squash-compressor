import './App.css'
import * as Juce from "./juce/index.js";
// import { useState } from 'react'
import { Button, Container, Group, Paper, Stack, Title } from '@mantine/core'
// import { LineChart } from '@mantine/charts'
// import SliderGroup from './components/SliderGroup'
import NumberSlider from './components/NumberSlider.js';

function App() {
  // events for JUCE Backend
  function emitRatioEvent(ratioVal:number) {
    window.__JUCE__.backend.emitEvent("ratioUpdate", {
        ratioVal: ratioVal
      });
  }

  function emitGainEvent(gainVal:number) {
    window.__JUCE__.backend.emitEvent("gainUpdate", {
        gainVal: gainVal
      });
  }

  function emitThresholdEvent(thresholdVal:number) {
    window.__JUCE__.backend.emitEvent("thresholdUpdate", {
      thresholdVal: thresholdVal
    });
  }

  function emitAttackEvent(attackVal:number) {
    window.__JUCE__.backend.emitEvent("attackUpdate", {
      attackVal: attackVal
    });
  }

  function emitReleaseEvent(releaseVal:number) {
    window.__JUCE__.backend.emitEvent("releaseUpdate", {
      releaseVal: releaseVal
    });
  }

  function emitDryWetEvent(dryWetVal:number) {
    window.__JUCE__.backend.emitEvent("dryWetUpdate", {
      dryWetVal: dryWetVal
    });
  }

  return (
    <Container w={"100vw"} h={"100vh"} px={"xl"} py={"xl"} bg={""}>
      <Stack h={"100%"} justify='space-between' gap={"sm"}>
        <Title w={"100%"} style={{textAlign:"start"}}>
          Squash Compressor
        </Title>
        <Paper p={"20px"} radius={"md"} px={0}>
          <Group justify='space-between'>
            {/* <SliderGroup min={0} max={20} effectName='Ratio'/>
            <SliderGroup min={-60} max={0} step={0.5} effectName='Gain' units='db'/>
            <SliderGroup min={0} max={100} effectName='Threshold' units='db'/>
            <SliderGroup min={0} max={100} effectName='Attack' units='ms' />
            <SliderGroup min={0} max={100} effectName='Release' units='ms'/>
            <SliderGroup min={0} max={100} effectName='Dry/Wet' units='%'/> */}
            <NumberSlider min={0} max={20} effectName='Ratio' onChangeEvent={emitRatioEvent}/>
            <NumberSlider min={-60} max={0} step={0.5} effectName='Gain' units='db' onChangeEvent={emitGainEvent}/>
            <NumberSlider min={0} max={100} effectName='Threshold' units='db' onChangeEvent={emitThresholdEvent}/>
            <NumberSlider min={0} max={100} effectName='Attack' units='ms' onChangeEvent={emitAttackEvent} />
            <NumberSlider min={0} max={100} effectName='Release' units='ms' onChangeEvent={emitReleaseEvent}/>
            <NumberSlider min={0} max={100} effectName='Dry/Wet' units='%' onChangeEvent={emitDryWetEvent}/>
          </Group>
        </Paper>

      </Stack>

    </Container>
  )
}

export default App
