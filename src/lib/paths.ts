// World-space choreography for the scroll journey.
//
// The page is 6 sections × 100svh in normal flow. One camera waypoint + one
// lookAt waypoint per section; the dwell-and-fly remap in CameraRig holds the
// camera at each station while that section fills the viewport.

export const SECTION_COUNT = 6

export const CAM_POINTS: Array<[number, number, number]> = [
  [0, 0.35, 8.2], // hero, facing the core
  [4.5, 1.4, -20], // about, swept right
  [-4.2, 1.1, -44], // projects
  [4.2, 1.1, -66], // ctf write-ups
  [-4.2, 1.2, -88], // certifications
  [0, 0.9, -118], // contact
]

export const LOOK_POINTS: Array<[number, number, number]> = [
  [0, 0.1, 0],
  [0, 0.8, -33],
  [0, 1.0, -54],
  [0, 1.0, -72],
  [0, 1.0, -90],
  [0.2, 0.9, -118],
]

export const HERO_OBJECT_POSITION: [number, number, number] = [0, 0.1, 0]
