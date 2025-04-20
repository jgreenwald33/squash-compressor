import { ThreeElements, useFrame } from "@react-three/fiber";
import { useRef, useEffect, useState } from "react";
import * as THREE from "three";

interface AudioRenderProps {
  amplitude: number;
  thresholdDb: number;
}

function mapThresholdToRadius(
  thresholdDb: number,
  minDb = -60,
  maxDb = 0,
  minRadius = 0.2,
  maxRadius = 3
): number {
  const clampedDb = Math.max(minDb, Math.min(maxDb, thresholdDb));
  const normalized = (clampedDb - minDb) / (maxDb - minDb);
  return normalized * (maxRadius - minRadius) + minRadius;
}


export default function AudioRender({
  amplitude,
  thresholdDb,
  ...props
}: AudioRenderProps & ThreeElements["mesh"]) {
  const mesh = useRef<THREE.Mesh>(null);
  const torusMesh = useRef<THREE.Mesh>(null);

  const [torusRadius, setTorusRadius] = useState(() =>
    mapThresholdToRadius(thresholdDb)
  );

  useEffect(() => {
    const newRadius = mapThresholdToRadius(thresholdDb);
    setTorusRadius((prev) => THREE.MathUtils.lerp(prev, newRadius, 0.1));
  }, [thresholdDb]);

  useFrame(() => {
    if (!mesh.current) return;

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
  });

  return (
    <>
      <mesh ref={torusMesh} position={[0,0,1]} {...props}>
        <torusGeometry args={[torusRadius, 0.1, 200, 200]} />
        <meshBasicMaterial
          color="white"
          transparent
          opacity={0.4}
        />
      </mesh>

      <mesh position={[0, 0, 0]} ref={mesh} {...props}>
        <octahedronGeometry args={[1, 1]} />
        <meshPhongMaterial flatShading color={"#ffa8a8"} />
      </mesh>
    </>
  );
}
