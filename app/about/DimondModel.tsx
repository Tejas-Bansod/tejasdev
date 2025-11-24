'use client';
import { useRef, useEffect, useMemo } from 'react';
import { useGLTF, Center } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';

export function DimondModel() {
    const groupRef = useRef<THREE.Group>(null);

    // Load the GLTF model
    const { scene } = useGLTF('/ThreeDModels/diamond.glb');
    // Clone the scene to avoid issues with shared materials/geometries across re-renders
    const clonedScene = useMemo(() => scene.clone(), [scene]);

    // Apply frosted glass material with blur
    useEffect(() => {
        clonedScene.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                child.material = new THREE.MeshPhysicalMaterial({
                    color: 0xffffff,
                    metalness: 0.0,
                    roughness: 0.4,
                    transmission: 0.9,
                    thickness: 2.0,
                    transparent: true,
                    opacity: 0.5,
                    envMapIntensity: 3.0,
                    clearcoat: 1.0,
                    clearcoatRoughness: 0.3,
                    ior: 1.5,
                    reflectivity: 1.0,
                    side: THREE.DoubleSide,
                    attenuationDistance: 0.5,
                    attenuationColor: new THREE.Color(0xffffff),
                });
            }
        });
    }, [clonedScene]);

    // Initial animation and material setup
    useEffect(() => {
        if (groupRef.current) {
            // Set initial state
            gsap.set(groupRef.current.position, { y: 0, z: 0 });
            gsap.set(groupRef.current.rotation, { x: 0, y: 0, z: 0 });
            gsap.set(groupRef.current.scale, { x: 0, y: 0, z: 0 });

            // Entrance animation
            const tl = gsap.timeline({
                defaults: {
                    ease: 'back.out(1.7)',
                }
            });

            tl.to(groupRef.current.scale, {
                // SCALE THE MODEL
                x: 1.5,
                y: 1.5,
                z: 1.5,
                duration: 1.5,
                delay: 0.5,
            })
                // Add floating animation after entrance
                .to(groupRef.current.position, {
                    y: 0.1,
                    duration: 2,
                    yoyo: true,
                    repeat: -1,
                    ease: 'sine.inOut'
                });

            // Cleanup function
            return () => {
                tl.kill();
            };
        }
    }, []);

    // Random automatic rotation on all axes
    useFrame((state) => {
        if (groupRef.current) {
            // Random rotation on multiple axes for organic movement
            groupRef.current.rotation.x += Math.sin(state.clock.elapsedTime * 0.3) * 0.002;
            groupRef.current.rotation.y += 0.008;
            groupRef.current.rotation.z += Math.cos(state.clock.elapsedTime * 0.2) * 0.003;
        }
    });

    return (
        <group ref={groupRef}>
            <Center>
                <primitive object={clonedScene} />
            </Center>
        </group>
    );
}

// Preload the model
useGLTF.preload('/ThreeDModels/box.glb');
