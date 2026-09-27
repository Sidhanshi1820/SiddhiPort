// World-space choreography for the scroll journey.
//
// The page is 7 sections × 100vh (hero, about, 3× case files, skills, contact).
// One camera waypoint + one lookAt waypoint per section. Catmull-Rom curves
// distribute t uniformly per segment, so t = i / 6 lands exactly on waypoint i
// when section i fills the viewport — the camera "docks" at each station.

export const SECTION_COUNT = 7

export const CAM_POINTS: Array<[number, number, number]> = [
  [0, 0.35, 8.2], // hero — facing the core
  [6.5, 1.6, -21], // about — swept right, gliding through the orbit rings
  [2.6, 0.9, -47.5], // case file 01
  [-2.6, 0.9, -63.5], // case file 02
  [2.6, 0.9, -79.5], // case file 03
  [0, 1.6, -97], // skills — diving toward the protocol ring
  [0, 0.9, -127], // contact — resting before the uplink beacon
]

export const LOOK_POINTS: Array<[number, number, number]> = [
  [0, 0.1, 0],
  [-2.5, 0.6, -33],
  [0, 1.0, -55],
  [0, 1.0, -71],
  [0, 1.0, -87],
  [-1.5, 1.2, -112],
  [0.2, 0.9, -142],
]

export const HERO_OBJECT_POSITION: [number, number, number] = [0, 0.1, 0]
export const ABOUT_POSITION: [number, number, number] = [-2.5, 0.6, -33]
export const SKILLS_POSITION: [number, number, number] = [0, 1.2, -112]
export const PORTAL_POSITION: [number, number, number] = [1.6, 0.9, -142]

// Work slabs alternate along the corridor, each rotated to face its camera waypoint.
export const SLAB_TRANSFORMS: Array<{ position: [number, number, number]; rotationY: number }> = [
  { position: [-3.6, 1.0, -55], rotationY: 0.69 },
  { position: [3.6, 1.0, -71], rotationY: -0.69 },
  { position: [-3.6, 1.0, -87], rotationY: 0.69 },
]
