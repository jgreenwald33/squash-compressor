import { ThreeElements, useFrame } from "@react-three/fiber";
import { useRef, useEffect, useState } from "react";
import * as THREE from "three";

interface AudioRenderProps {
  amplitude: number;
}

export default function AudioRender({
  amplitude,
  ...props
}: AudioRenderProps & ThreeElements["mesh"]) {
  const mesh = useRef<THREE.Mesh>(null);
  const torusMesh = useRef<THREE.Mesh>(null);


  useFrame(() => {
    if (!mesh.current) return;
  
    const targetScale = 1 + amplitude;
  
    // Smoothly interpolate current scale towards target scale
    const currentScale = mesh.current.scale.x;
    const lerpedScale = THREE.MathUtils.lerp(currentScale, targetScale, 0.1);
    mesh.current.scale.set(lerpedScale, lerpedScale, lerpedScale);
  
    // Rotation noise target based on amplitude
    const rotationXTarget = amplitude * (Math.random() * 2 - 1); // -1 to 1
    const rotationYTarget = amplitude * (Math.random() * 2 - 1);
    const rotationZTarget = amplitude * (Math.random() * 2 - 1);
  
    // Smoothly add small rotation deltas
    mesh.current.rotation.x += rotationXTarget * 0.55;
    mesh.current.rotation.y += rotationYTarget * 0.55;
    mesh.current.rotation.z += rotationZTarget * 0.55;
  });
  

  return (
    <>
    <mesh ref={torusMesh} {...props}>
      <torusGeometry args={[2, 0.1, 200, 200]} />
      <meshPhysicalMaterial
        color="white"
        transparent
        opacity={0.15}
        roughness={0.1}
        metalness={0}
        transmission={1} // makes it glass-like
        thickness={0.5}   // simulates glass thickness
        ior={1.5}         // index of refraction, tweak for realism
        depthWrite={false}
      />
    </mesh>
      <mesh position={[0,0,0]} ref={mesh} {...props}>
        <octahedronGeometry args={[1,1]}/>
        <meshPhongMaterial flatShading color={"#ffa8a8"}/>
      </mesh>
    </>
  );
}
