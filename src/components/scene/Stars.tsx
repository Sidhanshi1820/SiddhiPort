import { useMemo } from 'react'
import { ParticleField } from './ParticleField'

// Stars + near-field dust fill the whole journey volume (the camera travels
// from z=8 to z=-127), so parallax while flying is constant and rich.
export function Stars() {
  const far = useMemo(() => {
    const arr = new Float32Array(2000 * 3)
    for (let i = 0; i < 2000; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 180
      arr[i * 3 + 1] = (Math.random() - 0.5) * 90
      arr[i * 3 + 2] = 30 - Math.random() * 200
    }
    return arr
  }, [])

  const dust = useMemo(() => {
    const arr = new Float32Array(420 * 3)
    for (let i = 0; i < 420; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 32
      arr[i * 3 + 1] = (Math.random() - 0.5) * 18
      arr[i * 3 + 2] = 12 - Math.random() * 167
    }
    return arr
  }, [])

  return (
    <>
      <ParticleField positions={far} color="#aaccff" size={1.1} opacity={0.85} speed={0.6} />
      <ParticleField positions={dust} color="#8ff5ff" size={0.9} opacity={0.45} speed={1.4} />
    </>
  )
}
