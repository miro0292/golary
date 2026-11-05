"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, ContactShadows, Html } from "@react-three/drei";
import * as THREE from "three";
import BallMesh from "./BallMesh";

function Loader() {
  return (
    <Html center>
      <div className="rounded-full bg-black/70 px-4 py-2 text-xs font-semibold text-white">Cargando balón…</div>
    </Html>
  );
}

export default function BallScene({
  texture,
  spinning,
  onReady,
}: {
  texture: THREE.CanvasTexture;
  spinning: boolean;
  onReady?: (canvas: HTMLCanvasElement) => void;
}) {
  return (
    <Canvas
      onCreated={(state) => onReady?.(state.gl.domElement)}
      shadows
      dpr={[1, 2]}
      gl={{ preserveDrawingBuffer: true, antialias: true }}
      camera={{ position: [0, 0, 3.4], fov: 40 }}
    >
      {/* Iluminación: ambiental suave + una luz principal que proyecta sombra */}
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[3, 4, 2]}
        intensity={1.6}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0005}
      />
      <directionalLight position={[-3, -1, -2]} intensity={0.35} />
      <directionalLight position={[0, 2, -4]} intensity={0.25} color="#00a8e8" />

      <Suspense fallback={<Loader />}>
        <BallMesh texture={texture} spinning={spinning} />
      </Suspense>

      <ContactShadows position={[0, -1.08, 0]} opacity={0.5} scale={6} blur={2.4} far={2} />

      <OrbitControls
        enablePan={false}
        minDistance={1.8}
        maxDistance={6}
        dampingFactor={0.08}
        rotateSpeed={0.7}
        zoomSpeed={0.8}
      />
    </Canvas>
  );
}
