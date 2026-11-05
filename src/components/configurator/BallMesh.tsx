"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Balón procedural (esfera UV) con la textura compuesta aplicada, más un
 * mapa de relieve (bump map) con las costuras de un balón real, para que
 * se vea con paneles y brillo, no plano. No depende de ningún archivo
 * .glb: funciona de inmediato. Si más adelante quieres un modelo real
 * (formato .GLTF/.GLB) con la forma exacta de un balón de fútbol (paneles
 * en relieve de verdad, no simulados), revisa `BallMeshGLTF.tsx` — está
 * listo para recibirlo, solo hay que poner el archivo en
 * /public/models/soccer-ball.glb.
 */
export default function BallMesh({
  texture,
  bumpTexture,
  spinning,
}: {
  texture: THREE.CanvasTexture;
  bumpTexture: THREE.CanvasTexture | null;
  spinning: boolean;
}) {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (spinning && mesh.current) mesh.current.rotation.y += delta * 0.35;
  });

  return (
    <mesh ref={mesh} castShadow receiveShadow rotation={[0, 0.3, 0]}>
      <sphereGeometry args={[1, 128, 128]} />
      <meshPhysicalMaterial
        map={texture}
        bumpMap={bumpTexture ?? undefined}
        bumpScale={0.012}
        roughness={0.42}
        metalness={0.04}
        clearcoat={0.45}
        clearcoatRoughness={0.3}
      />
    </mesh>
  );
}
