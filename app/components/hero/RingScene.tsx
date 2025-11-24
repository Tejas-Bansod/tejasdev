'use client';
import { Canvas } from '@react-three/fiber';
import { Environment, PerspectiveCamera, OrbitControls } from '@react-three/drei';
import { RingModel } from './RingModel';
import { Suspense, memo, useEffect, useState } from 'react';

function RingScene() {

    return (
        <div className="w-full h-full">
            <Canvas
                shadows
                dpr={[1, 1.5]}
                gl={{
                    antialias: true,
                    alpha: true,
                    powerPreference: 'high-performance',
                    failIfMajorPerformanceCaveat: false,
                }}
                style={{
                    background: 'transparent',
                }}
                frameloop="always"
                onCreated={({ gl }) => {
                    gl.toneMappingExposure = 1.0;
                }}
            >
                <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />

                {/* Lighting */}
                <ambientLight intensity={0.5} />
                <directionalLight
                    position={[10, 10, 5]}
                    intensity={1.5}
                    castShadow
                    shadow-mapSize-width={1024}
                    shadow-mapSize-height={1024}
                />
                <pointLight position={[-10, -10, -5]} intensity={0.5} color="#764ba2" />
                <pointLight position={[10, 10, 10]} intensity={0.5} color="#667eea" />

                {/* 3D Model */}
                <Suspense fallback={
                    <mesh>
                        <boxGeometry args={[1, 1, 1]} />
                        <meshStandardMaterial color="gold" />
                    </mesh>
                }>
                    <RingModel />
                </Suspense>

                {/* Environment for reflections */}
                <Environment preset="city" />
                <OrbitControls enableZoom={false} enablePan={false} />
            </Canvas>
        </div>
    );
}

export default memo(RingScene);
