import './App.css'
import logo from "./assets/squash compressor logo.png"
import * as Juce from "./juce/index.js";
import {Container, Group, Image, Paper, Select, Stack, Title } from '@mantine/core'
import NumberSlider from './components/NumberSlider.js';
import AudioRender from './components/AudioRender.js';
import { Canvas } from '@react-three/fiber';
import { useEffect, useState } from 'react';

// holds the structure of the JSON coming from the JUCE backend
interface AudioData {
  amplitudeData:number,
  preprocessedAmplitudeData:number
}

function App() {
  // events for JUCE Backend
  function emitRatioEvent(ratioVal:number) {
    window.__JUCE__.backend.emitEvent("ratioUpdate", {
        ratioVal: ratioVal
      });
      setPresetChoice("Custom");
  }

  function emitGainEvent(gainVal:number) {
    window.__JUCE__.backend.emitEvent("gainUpdate", {
        gainVal: gainVal
      });
      setPresetChoice("Custom");
  }

  function emitThresholdEvent(thresholdVal:number) {
    window.__JUCE__.backend.emitEvent("thresholdUpdate", {
      thresholdVal: thresholdVal
    });
    setPresetChoice("Custom");
  }

  function emitAttackEvent(attackVal:number) {
    window.__JUCE__.backend.emitEvent("attackUpdate", {
      attackVal: attackVal
    });

    setPresetChoice("Custom");
  }

  function emitReleaseEvent(releaseVal:number) {
    window.__JUCE__.backend.emitEvent("releaseUpdate", {
      releaseVal: releaseVal
    });

    setPresetChoice("Custom");
  }

  function emitDryWetEvent(dryWetVal:number) {
    window.__JUCE__.backend.emitEvent("dryWetUpdate", {
      dryWetVal: dryWetVal
    });

    setPresetChoice("Custom");

  }

  const [amplitude, setAmplitude] = useState<number>(0);
  const [preprocessedAmplitudeData, setPreprocessedAmplitudeData] = useState<number>(0);

  useEffect(()=> {
    window.__JUCE__.backend.addEventListener("getAmplitudeData", (incomingAudio:AudioData)=>{
      setAmplitude(incomingAudio.amplitudeData);
      setPreprocessedAmplitudeData(incomingAudio.preprocessedAmplitudeData);
    });
  },[])

  const [threshold, setThreshold] = useState<number>(0);
  const [ratio, setRatio] = useState<number>(1);
  const [attack,setAttack] = useState<number>(0);
  const [release,setRelease] = useState<number>(0);
  const [gain, setGain] = useState<number>(0);
  const [presetChoice, setPresetChoice] = useState<string | null>("Default")


  function handlePresetChange(presetName:string) {
      switch (presetName) {
        case "Default":
          setThreshold(0);
          setRatio(1);
          setAttack(0);
          setRelease(0);
          setGain(0);
          break;
      }

      setPresetChoice(presetName);
  }

  return (
    <Container w={"100vw"} h={"100vh"} px={"xs"} py={"lg"} bg={""}>
      <Stack h={"100%"} justify='space-between' gap={"sm"}>
        <Group w={"100%"} justify='space-between' align='center'>
          <Image src={logo} w={"25%"} alt="Squash compressor logo"/>
          <Select id='custom-select'
              bg={"gray.3"}
              placeholder="Presets"
              value={presetChoice}
              onChange={(e)=> {
                if (e !== null) {
                  handlePresetChange(e);
                }
              }}
              data={['Default', 'Punchy', 'Limiter', 'Custom']}
            />
        </Group>
        <Canvas>
          <directionalLight
            position={[5, 10, 100]}
            intensity={1.2}
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />
          <ambientLight intensity={0.3} /> 
          <AudioRender preprocessedAmplitude={preprocessedAmplitudeData} amplitude={amplitude} />
        </Canvas>
        <Paper p={"5px"} radius={"md"} px={0} style={{background:"inherit"}}>
          <Group justify='space-between'>
            <NumberSlider min={1} max={10} defaultValue={ratio} effectName='Ratio' onChangeEvent={emitRatioEvent}/>
            <NumberSlider min={-12} max={12} step={0.5} defaultValue={gain} effectName='Gain' units='db' onChangeEvent={emitGainEvent}/>
            <NumberSlider min={-60.0} max={0} defaultValue={threshold} effectName='Threshold' units='db' onChangeEvent={emitThresholdEvent}/>
            <NumberSlider min={0.0} max={1000} defaultValue={attack} effectName='Attack' units='ms' onChangeEvent={emitAttackEvent} />
            <NumberSlider min={1.0} max={3000} defaultValue={release} effectName='Release' units='ms' onChangeEvent={emitReleaseEvent}/>
            <NumberSlider min={0} max={100} defaultValue={100} effectName='Dry/Wet' units='%' onChangeEvent={emitDryWetEvent}/>
          </Group>
        </Paper>
      </Stack>
    </Container>
  )
}

export default App
