"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Balón procedural (esfera UV) con la textura compuesta aplicada.
 * No depende de ningún archivo .glb: funciona de inmediato. Si más
 * adelante quieres un modelo real (formato .GLTF/.GLB) con la forma
 * exacta de un balón de fútbol (paneles en relieve), revisa
 * `BallMeshGLTF.tsx` — está listo para recibirlo, solo hay que poner
 * el archivo en /public/models/soccer-ball.glb.
 */
export default function BallMesh({ texture, spinning }: { texture: THREE.CanvasTexture; spinning: boolean }) {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (spinning && mesh.current) mesh.current.rotation.y += delta * 0.35;
  });

  return (
    <mesh ref={mesh} castShadow receiveShadow rotation={[0, 0.3, 0]}>
      <sphereGeometry args={[1, 96, 96]} />
      <meshStandardMaterial map={texture} roughness={0.55} metalness={0.05} />
    </mesh>
  );
}
