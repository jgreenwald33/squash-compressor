import { ThreeElements, useFrame } from "@react-three/fiber";
import { useRef, useEffect } from "react";
import * as THREE from "three";

interface AudioRenderProps {
  amplitude: number;
}

export default function AudioRender({
  amplitude,
  ...props
}: AudioRenderProps & ThreeElements["mesh"]) {
  const mesh = useRef<THREE.Mesh>(null);
  const timeRef = useRef(0);

  useEffect(() => {
    if (mesh.current) {
      const geometry = mesh.current.geometry;
      const position = geometry.attributes.position;
      mesh.current.rotation.set(Math.PI / 2, 0, 0);

      const originalZ: number[] = [];
      for (let i = 0; i < position.count; i++) {
        originalZ.push(position.getZ(i));
      }

      geometry.userData.originalZ = originalZ;
    }
  }, []);

  useFrame((state, delta) => {
    timeRef.current += delta;

    if (mesh.current) {
      const geometry = mesh.current.geometry;
      const position = geometry.attributes.position;
      const originalZ: number[] = geometry.userData.originalZ || [];

      for (let i = 0; i < position.count; i++) {
        const x = position.getX(i);
        const y = position.getY(i);

        const baseWave =
          Math.sin(x * 0.3 + timeRef.current * 2) *
          Math.cos(y * 0.3 + timeRef.current);
        const displacement = baseWave * amplitude * 4.0;

        const baseZ = originalZ[i] || 0;
        position.setZ(i, baseZ + displacement);
      }

      position.needsUpdate = true;
      geometry.computeVertexNormals();
    }
  });

  return (
    <mesh scale={1.5} position={[0, 0, 0]} ref={mesh} {...props}>
      <planeGeometry args={[40, 10, 150, 50]} />
      <meshToonMaterial wireframe color={"#dbe4ff"} />
    </mesh>
  );
}
