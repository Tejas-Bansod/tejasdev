'use client';
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree, extend, createPortal } from '@react-three/fiber';
import { Text, useFBO, shaderMaterial, OrthographicCamera } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

// Shader Materials
const FlowMaterial = shaderMaterial(
    {
        tFlow: null,
        uMouse: new THREE.Vector2(),
        uVelocity: new THREE.Vector2(),
        uAspect: 1,
        uDissipation: 0.92,
        uCursor: 0.05, // Brush size
    },
    // Vertex Shader
    `
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
    `,
    // Fragment Shader
    `
    uniform sampler2D tFlow;
    uniform vec2 uMouse;
    uniform vec2 uVelocity;
    uniform float uAspect;
    uniform float uDissipation;
    uniform float uCursor;
    varying vec2 vUv;

    void main() {
        vec4 color = texture2D(tFlow, vUv) * uDissipation;
        
        vec2 cursor = vUv - uMouse;
        cursor.x *= uAspect;
        
        float dist = length(cursor);
        float falloff = smoothstep(uCursor, 0.0, dist);
        
        vec2 velocity = uVelocity * falloff;
        color.xy += velocity;
        
        gl_FragColor = color;
    }
    `
);

const DistortionMaterial = shaderMaterial(
    {
        tWater: null,
        tFlow: null,
    },
    // Vertex Shader
    `
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
    `,
    // Fragment Shader
    `
    uniform sampler2D tWater;
    uniform sampler2D tFlow;
    varying vec2 vUv;

    void main() {
        vec3 flow = texture2D(tFlow, vUv).rgb;
        vec2 myUV = vUv - flow.xy * 0.15;
        vec4 tex = texture2D(tWater, myUV);
        gl_FragColor = tex;
    }
    `
);

extend({ FlowMaterial, DistortionMaterial });

interface FlowMaterialType extends THREE.ShaderMaterial {
    tFlow: THREE.Texture | null;
    uMouse: THREE.Vector2;
    uVelocity: THREE.Vector2;
    uAspect: number;
    uDissipation: number;
    uCursor: number;
}

interface DistortionMaterialType extends THREE.ShaderMaterial {
    tWater: THREE.Texture | null;
    tFlow: THREE.Texture | null;
}

declare module '@react-three/fiber' {
    interface ThreeElements {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        flowMaterial: any
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        distortionMaterial: any
    }
}
// Props for the DistortedText component
interface DistortedTextProps {
    text: string;
    fontSize?: number;
    color?: string;
    textAlign?: "left" | "center" | "right";
}

function Scene({ text, fontSize: customFontSize, color = "#262626", textAlign = "left" }: DistortedTextProps) {
    const { gl, size, viewport, pointer, camera } = useThree();
    const [hasMouseDevice, setHasMouseDevice] = React.useState(false);

    // Detect if device has a mouse
    React.useEffect(() => {
        const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        setHasMouseDevice(hasFinePointer && !isTouchDevice);
    }, []);

    const flowFBORead = useFBO({ type: THREE.HalfFloatType });
    const flowFBOWrite = useFBO({ type: THREE.HalfFloatType });
    const textFBO = useFBO();

    const flowMat = useRef<FlowMaterialType>(null);
    const distortionMat = useRef<DistortionMaterialType>(null);
    const textRef = useRef<THREE.Mesh>(null);

    const lastMouse = useRef(new THREE.Vector2(0, 0));
    const velocity = useRef(new THREE.Vector2(0, 0));

    const textScene = useMemo(() => {
        const scene = new THREE.Scene();
        return scene;
    }, []);

    // Flow scene needs a fixed camera for the full-screen quad
    const flowScene = useMemo(() => new THREE.Scene(), []);
    const flowCamera = useMemo(() => {
        const cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 10);
        cam.position.z = 1;
        return cam;
    }, []);

    const currentRead = useRef(flowFBORead);
    const currentWrite = useRef(flowFBOWrite);

    // Animation
    // Animation
    useGSAP(() => {
        if (textRef.current) {
            gsap.fromTo(textRef.current.position,
                { y: -0.5 },
                { y: 0, duration: 1.5, ease: "power3.out" }
            );

            const material = textRef.current.material;
            if (material) {
                const mats = Array.isArray(material) ? material : [material];
                mats.forEach((m) => {
                    m.transparent = true;
                    gsap.fromTo(m,
                        { opacity: 0 },
                        { opacity: 1, duration: 1.5, ease: "power3.out" }
                    );
                });
            }
        }
    }, []);

    useFrame((state) => {
        const uvMouse = new THREE.Vector2((pointer.x + 1) / 2, (pointer.y + 1) / 2);
        const deltaX = uvMouse.x - lastMouse.current.x;
        const deltaY = uvMouse.y - lastMouse.current.y;

        velocity.current.set(deltaX * 50, deltaY * 50);
        lastMouse.current.copy(uvMouse);

        if (flowMat.current) {
            flowMat.current.tFlow = currentRead.current.texture;
            flowMat.current.uMouse = uvMouse;
            flowMat.current.uVelocity = velocity.current;
            flowMat.current.uAspect = size.width / size.height;
        }

        gl.setRenderTarget(currentWrite.current);
        gl.render(flowScene, flowCamera);
        gl.setRenderTarget(null);

        const temp = currentRead.current;
        currentRead.current = currentWrite.current;
        currentWrite.current = temp;

        // Render text with the main camera to match viewport
        gl.setRenderTarget(textFBO);
        gl.render(textScene, camera);
        gl.setRenderTarget(null);

        if (distortionMat.current) {
            distortionMat.current.tWater = textFBO.texture;
            distortionMat.current.tFlow = currentRead.current.texture;
        }
    });

    // Font size: 12vw. 
    // In R3F with OrthographicCamera(zoom=1), viewport.width matches the frustum width.
    // So 12vw is viewport.width * 0.12.
    const fontSize = customFontSize || viewport.width * 0.20;

    return (
        <>
            {createPortal(
                <mesh>
                    <planeGeometry args={[2, 2]} />
                    <flowMaterial ref={flowMat} transparent={false} />
                </mesh>,
                flowScene
            )}

            {createPortal(
                <group>
                    <Text
                        ref={textRef}
                        font="/Fonts/Lato/Lato-Bold.ttf"
                        fontSize={fontSize}
                        color={color}
                        anchorX="center"
                        anchorY="middle"
                        lineHeight={0.85}
                        textAlign={textAlign}
                        onPointerOver={hasMouseDevice ? () => (document.body.style.cursor = 'crosshair') : undefined}
                        onPointerOut={hasMouseDevice ? () => (document.body.style.cursor = 'default') : undefined}
                    >
                        {text}
                    </Text>
                </group>,
                textScene
            )}

            <mesh>
                <planeGeometry args={[viewport.width, viewport.height]} />
                <distortionMaterial ref={distortionMat} transparent={true} />
            </mesh>
        </>
    );
}

export default function DistortedText(props: DistortedTextProps) {
    return (
        <div className="w-full h-full">
            <Canvas
                dpr={[1, 2]}
                gl={{ antialias: true, alpha: true }}
            >
                <OrthographicCamera makeDefault position={[0, 0, 5]} zoom={1} />
                <Scene {...props} />
            </Canvas>
        </div>
    );
}
