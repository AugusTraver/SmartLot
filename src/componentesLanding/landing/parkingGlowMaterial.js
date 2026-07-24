import { shaderMaterial } from '@react-three/drei';
import { extend } from '@react-three/fiber';
import * as THREE from 'three';

const ParkingGlowMaterial = shaderMaterial(
  {
    uTime: 0,
    uColor: new THREE.Color('#2563EB'),
  },
  `
    void main() {
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  `
    precision mediump float;

    uniform float uTime;
    uniform vec3 uColor;

    void main() {
      float pulse = 0.55 + 0.45 * sin(uTime * 1.6);
      gl_FragColor = vec4(uColor, pulse);
    }
  `
);

extend({ ParkingGlowMaterial });

export default ParkingGlowMaterial;
