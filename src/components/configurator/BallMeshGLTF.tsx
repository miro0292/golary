"use client";

import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

/**
 * Versión con un modelo 3D real (.glb) en vez del balón procedural.
 * Para usarla:
 *   1. Consigue un modelo de balón de fútbol en formato .glb con buenas
 *      UVs esféricas (hay varios gratuitos en Sketchfab, Poly Pizza o
 *      Kenney.nl con licencia CC0/CC-BY — revisa la licencia de cada uno).
 *   2. Guárdalo en public/models/soccer-ball.glb
 *   3. En BallConfigurator.tsx cambia <BallMesh .../> por
 *      <BallMeshGLTF url="/models/soccer-ball.glb" .../>
 *
 * El componente recorre el modelo y le aplica la textura compuesta
 * (diseño base + logo) a cada malla que encuentre, así que funciona con
 * la mayoría de modelos de un solo balón sin tocar nada más.
 */
export default function BallMeshGLTF({
  url,
  texture,
  spinning,
}: {
  url: string;
  texture: THREE.CanvasTexture;
  spinning: boolean;
}) {
  const { scene } = useGLTF(url);
  const group = useRef<THREE.Group>(null);

  useEffect(() => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        const applyMap = (mat: THREE.Material) => {
          if (mat instanceof THREE.MeshStandardMaterial || mat instanceof THREE.MeshPhysicalMaterial) {
            mat.map = texture;
            mat.needsUpdate = true;
          }
        };
        if (Array.isArray(child.material)) child.material.forEach(applyMap);
        else applyMap(child.material);
      }
    });
  }, [scene, texture]);

  useFrame((_, delta) => {
    if (spinning && group.current) group.current.rotation.y += delta * 0.35;
  });

  return <primitive ref={group} object={scene} />;
}

// Para precargar el modelo antes de que el usuario abra la pestaña:
// useGLTF.preload("/models/soccer-ball.glb");
