import { ThreeElements, useFrame } from "@react-three/fiber";
import { useRef, useEffect, useState } from "react";
import * as THREE from "three";

interface AudioRenderProps {
  amplitude: number;
  preprocessedAmplitude: number;
}

export default function AudioRender({
  amplitude,
  preprocessedAmplitude,
  ...props
}: AudioRenderProps & ThreeElements["mesh"]) {
  const mesh = useRef<THREE.Mesh>(null);
  const torusMesh = useRef<THREE.Mesh>(null);
  const torusOpacity = useRef(0);
  const [torusRadius, setTorusRadius] = useState(1);

  useFrame(() => {
    if (mesh.current) {
      const targetScale = 1 + amplitude;
      const currentScale = mesh.current.scale.x;
      const lerpedScale = THREE.MathUtils.lerp(currentScale, targetScale, 0.1);
      mesh.current.scale.set(lerpedScale, lerpedScale, lerpedScale);

      const rotationXTarget = amplitude * (Math.random() * 2 - 1);
      const rotationYTarget = amplitude * (Math.random() * 2 - 1);
      const rotationZTarget = amplitude * (Math.random() * 2 - 1);
  
      mesh.current.rotation.x += rotationXTarget * 0.55;
      mesh.current.rotation.y += rotationYTarget * 0.55;
      mesh.current.rotation.z += rotationZTarget * 0.55;
    }
    if (torusMesh.current) {
      const torusTargetScale = 1 + preprocessedAmplitude;
      const torusCurrentScale = torusRadius;
      const torusLerpedScale = THREE.MathUtils.lerp(torusCurrentScale, torusTargetScale, 0.1);
      setTorusRadius(torusLerpedScale);
      const meshScale = mesh.current?.scale.x ?? 0;
      const difference = Math.abs(torusLerpedScale - meshScale);
      torusOpacity.current = difference < 0.01 ? 0 : 0.4;
    }

  });

  return (
    <>
      <mesh ref={torusMesh} position={[0,0,1]} {...props}>
        <torusGeometry args={[torusRadius, 0.05, 200, 200]} />
        <meshBasicMaterial
          color="white"
          transparent
          opacity={torusOpacity.current}
        />
      </mesh>

      <mesh position={[0, 0, 0]} ref={mesh} {...props}>
        <octahedronGeometry args={[1, 1]} />
        <meshPhongMaterial flatShading color={"#ffa8a8"} />
      </mesh>
    </>
  );
}
