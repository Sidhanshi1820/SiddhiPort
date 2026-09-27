import { Grid } from '@react-three/drei'

// Tron-style floor under the whole journey; the shader's fadeDistance keeps it
// dissolving into fog so it reads as an infinite plane.
export function SceneGrid() {
  return (
    <Grid
      position={[0, -3.2, -70]}
      args={[260, 260]}
      cellSize={2.4}
      cellThickness={0.55}
      cellColor="#1a2342"
      sectionSize={12}
      sectionThickness={1.05}
      sectionColor="#1e7f96"
      fadeDistance={52}
      fadeStrength={2.4}
      followCamera={false}
      infiniteGrid
    />
  )
}
