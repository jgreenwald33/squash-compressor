import './App.css'
import * as Juce from "./juce/index.js";
// import { useState } from 'react'
import { Button, Container, Group, Paper, Select, Stack, Title } from '@mantine/core'
// import { LineChart } from '@mantine/charts'
// import SliderGroup from './components/SliderGroup'
import NumberSlider from './components/NumberSlider.js';
import AudioRender from './components/AudioRender.js';
import { Canvas } from '@react-three/fiber';
import { useEffect, useState } from 'react';
import { DirectionalLight, Fog, Scene } from 'three';

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

  const [squashFactor, setSquashFactor] = useState(1);

  function handleRatioChange(newSquashFactor:number) {
    setSquashFactor(squashFactor);
  }

  useEffect(()=> {
    window.__JUCE__.backend.addEventListener("getAmplitudeData", (amplitudeData:number)=>{
      console.log("Received amplitudeData:", amplitudeData);
    });
  },[])

  return (
    <Container w={"100vw"} h={"100vh"} px={"xs"} py={"lg"} bg={""}>
      <Stack h={"100%"} justify='space-between' gap={"sm"}>
        <Group w={"100%"} justify='space-between' align='center'>
          <Title w={"fit-content"} style={{textAlign:"start"}}>
            Squash Compressor
          </Title>
          <Select
              placeholder="Presets"
              data={['Custom', 'Punchy', 'Limiter']}
            />
        </Group>
        <Canvas style={{ background: '#f1f3f5', borderRadius: '5px' }} 
                camera={{ position: [0, 2, 15]}}
          >
              <directionalLight color={"#b197fc"} position={[0,0,0]} intensity={1} />
              <ambientLight intensity={0.3} />
            <AudioRender/>
        </Canvas>
        <Paper p={"5px"} radius={"md"} px={0} style={{background:"inherit"}}>
          <Group justify='space-between'>
            {/* <SliderGroup min={1} max={10} effectName='Ratio' onChangeEvent={emitRatioEvent}/>
            <SliderGroup min={-12} max={12} step={0.5} effectName='Gain' units='db' onChangeEvent={emitGainEvent}/>
            <SliderGroup min={-60.0} max={0} effectName='Threshold' units='db' onChangeEvent={emitThresholdEvent}/>
            <SliderGroup min={0.01} max={1000} effectName='Attack' units='ms' onChangeEvent={emitAttackEvent} />
            <SliderGroup min={1.0} max={3000} effectName='Release' units='ms' onChangeEvent={emitReleaseEvent}/>
            <SliderGroup min={0} max={100} effectName='Dry/Wet' units='%' onChangeEvent={emitDryWetEvent}/> */}
            <NumberSlider min={1} max={10} defaultValue={1} effectName='Ratio' onChangeEvent={emitRatioEvent} callBackFunc={handleRatioChange}/>
            <NumberSlider min={-12} max={12} step={0.5} defaultValue={0} effectName='Gain' units='db' onChangeEvent={emitGainEvent}/>
            <NumberSlider min={-60.0} max={0} defaultValue={0} effectName='Threshold' units='db' onChangeEvent={emitThresholdEvent}/>
            <NumberSlider min={0.0} max={1000} defaultValue={0.01} effectName='Attack' units='ms' onChangeEvent={emitAttackEvent} />
            <NumberSlider min={1.0} max={3000} defaultValue={1} effectName='Release' units='ms' onChangeEvent={emitReleaseEvent}/>
            <NumberSlider min={0} max={100} defaultValue={100} effectName='Dry/Wet' units='%' onChangeEvent={emitDryWetEvent}/>
          </Group>
        </Paper>

      </Stack>

    </Container>
  )
}

export default App
