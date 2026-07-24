import { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Instances, Instance } from '@react-three/drei';
import { DoubleSide } from 'three';
import './parkingGlowMaterial';

function seededRandom(seed) {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

const LEVEL_GAP = 3.2;
const SPOTS_PER_LEVEL = 8;
const ACTIVE_COLOR = '#3B82F6';
const IDLE_COLOR = '#2A4270';
// Exactly 1.5x LEVEL_GAP — the point of *maximum* distance from every
// integer multiple of the gap (mod LEVEL_GAP it sits exactly at the
// halfway mark, 1.6). Any offset close to a multiple of the gap makes the
// camera's height coincidentally land near some *other* level's height at
// some point during the descent, viewing its spots edge-on/from underneath
// (invisible) — this value keeps it maximally clear of that at every point.
const CAMERA_HEIGHT_OFFSET = LEVEL_GAP * 1.5;
const CAMERA_PAN_AMPLITUDE = 2.2;

export default function ParkingStructureScene({ scrollProgressRef, levelCount = 4 }) {
  const glowRef = useRef(null);
  const glowGroupRef = useRef(null);
  const activeLevelRef = useRef(-1);
  const [activeLevel, setActiveLevel] = useState(0);

  const spotPositions = useMemo(() => (
    Array.from({ length: levelCount * SPOTS_PER_LEVEL }, (_, i) => {
      const level = Math.floor(i / SPOTS_PER_LEVEL);
      const slot = i % SPOTS_PER_LEVEL;
      const jitter = seededRandom(i * 13) * 0.3 - 0.15;
      return {
        level,
        position: [
          (slot - (SPOTS_PER_LEVEL - 1) / 2) * 0.62,
          -level * LEVEL_GAP + 0.12,
          jitter,
        ],
      };
    })
  ), [levelCount]);

  // activeLevel only flips levelCount-1 times across the whole scroll range
  // (a handful of discrete transitions, not a per-frame value), so driving
  // which Instances group each spot belongs to via React state — rather than
  // mutating InstancedMesh.instanceColor imperatively — is the simpler,
  // guaranteed-correct choice here without violating the "no setState in the
  // render loop" rule.
  const idleSpots = useMemo(() => spotPositions.filter((s) => s.level !== activeLevel), [spotPositions, activeLevel]);
  const activeSpots = useMemo(() => spotPositions.filter((s) => s.level === activeLevel), [spotPositions, activeLevel]);

  useFrame((state, delta) => {
    const progress = scrollProgressRef.current ?? 0;
    // Continuous 0..(levelCount-1) position along the descent — the single
    // source of truth for both the camera target and which level counts as
    // "active". Deriving activeLevel from a *different* scale (e.g. equal
    // 1/levelCount buckets) than the camera's own motion causes the
    // highlighted level to drift out of sync with where the camera actually
    // is, most visibly right at the level-count boundaries.
    const levelProgress = progress * (levelCount - 1);
    const targetY = -levelProgress * LEVEL_GAP;
    const targetX = Math.sin(progress * Math.PI) * CAMERA_PAN_AMPLITUDE;
    const lerp = Math.min(1, delta * 4);

    state.camera.position.y += (targetY + CAMERA_HEIGHT_OFFSET - state.camera.position.y) * lerp;
    state.camera.position.x += (targetX - state.camera.position.x) * lerp;
    state.camera.lookAt(0, targetY, 0);

    if (glowRef.current) {
      glowRef.current.uTime = state.clock.elapsedTime;
    }

    const level = Math.min(levelCount - 1, Math.max(0, Math.round(levelProgress)));
    if (level !== activeLevelRef.current) {
      activeLevelRef.current = level;
      if (glowGroupRef.current) {
        glowGroupRef.current.position.y = -level * LEVEL_GAP + 0.2;
      }
      setActiveLevel(level);
    }
  });

  return (
    <group>
      <ambientLight intensity={0.55} />
      <pointLight position={[4, 6, 6]} intensity={0.85} color="#6C93D6" />
      <pointLight position={[-4, -3, -4]} intensity={0.35} color="#2563EB" />

      <Instances limit={levelCount} range={levelCount}>
        <boxGeometry args={[4.6, 0.14, 2.8]} />
        <meshStandardMaterial color="#1C2F52" emissive="#0C1E3F" emissiveIntensity={0.4} roughness={0.6} metalness={0.15} />
        {Array.from({ length: levelCount }).map((_, i) => (
          <Instance key={i} position={[0, -i * LEVEL_GAP, 0]} />
        ))}
      </Instances>

      {/* Two plain, single-color Instances groups (idle vs. active) instead
          of one instance-colored mesh — simpler and renders reliably. */}
      <Instances limit={levelCount * SPOTS_PER_LEVEL} range={idleSpots.length}>
        <planeGeometry args={[0.56, 0.96]} />
        <meshBasicMaterial color={IDLE_COLOR} side={DoubleSide} toneMapped={false} />
        {idleSpots.map((s) => (
          <Instance key={`idle-${s.position.join(',')}`} position={s.position} rotation={[-Math.PI / 2, 0, 0]} />
        ))}
      </Instances>

      <Instances limit={SPOTS_PER_LEVEL} range={activeSpots.length}>
        <planeGeometry args={[0.56, 0.96]} />
        <meshBasicMaterial color={ACTIVE_COLOR} side={DoubleSide} toneMapped={false} />
        {activeSpots.map((s) => (
          <Instance key={`active-${s.position.join(',')}`} position={s.position} rotation={[-Math.PI / 2, 0, 0]} />
        ))}
      </Instances>

      <group ref={glowGroupRef}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <torusGeometry args={[2.7, 0.025, 8, 48]} />
          <parkingGlowMaterial ref={glowRef} transparent />
        </mesh>
      </group>
    </group>
  );
}
