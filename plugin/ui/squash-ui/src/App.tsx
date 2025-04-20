import './App.css'
import * as Juce from "./juce/index.js";
import {Container, Group, Paper, Select, Stack, Title } from '@mantine/core'
import NumberSlider from './components/NumberSlider.js';
import AudioRender from './components/AudioRender.js';
import { Canvas } from '@react-three/fiber';
import { useEffect, useState } from 'react';

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

    setThreshold(thresholdVal);
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

  const [amplitude, setAmplitude] = useState<number>(0);

  useEffect(()=> {
    window.__JUCE__.backend.addEventListener("getAmplitudeData", (amplitudeData:number)=>{
      setAmplitude(amplitudeData);
    });
  },[])

  const [threshold, setThreshold] = useState<number>(0);

  return (
    <Container w={"100vw"} h={"100vh"} px={"xs"} py={"lg"} bg={""}>
      <Stack h={"100%"} justify='space-between' gap={"sm"}>
        <Group w={"100%"} justify='space-between' align='center'>
          <Title w={"fit-content"} style={{textAlign:"start"}} c="#fff">
            Squash Compressor
          </Title>
          <Select id='custom-select'
              bg={"gray.3"}
              placeholder="Presets"
              data={['Custom', 'Punchy', 'Limiter']}
            />
        </Group>
        <Canvas >
          <directionalLight
            position={[5, 10, 100]}
            intensity={1.2}
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />
          <ambientLight intensity={0.3} /> 
          <AudioRender thresholdDb={threshold} amplitude={amplitude} />
        </Canvas>
        <Paper p={"5px"} radius={"md"} px={0} style={{background:"inherit"}}>
          <Group justify='space-between'>
            <NumberSlider min={1} max={10} defaultValue={1} effectName='Ratio' onChangeEvent={emitRatioEvent}/>
            <NumberSlider min={-12} max={12} step={0.5} defaultValue={0} effectName='Gain' units='db' onChangeEvent={emitGainEvent}/>
            <NumberSlider min={-60.0} max={0} defaultValue={0} effectName='Threshold' units='db' onChangeEvent={emitThresholdEvent}/>
            <NumberSlider min={0.0} max={1000} defaultValue={0} effectName='Attack' units='ms' onChangeEvent={emitAttackEvent} />
            <NumberSlider min={1.0} max={3000} defaultValue={1} effectName='Release' units='ms' onChangeEvent={emitReleaseEvent}/>
            <NumberSlider min={0} max={100} defaultValue={100} effectName='Dry/Wet' units='%' onChangeEvent={emitDryWetEvent}/>
          </Group>
        </Paper>
      </Stack>
    </Container>
  )
}

export default App
