import * as THREE from 'three';

export const GROUND_MATERIAL = new THREE.MeshBasicMaterial({color: 0x00c18e});
export const MINUS_MATERIAL = new THREE.MeshBasicMaterial({color: 0xb8333e});
export const PLUS_MATERIAL = new THREE.MeshBasicMaterial({color: 0x0000ff});
export const RAIL_MATERIAL = new THREE.MeshBasicMaterial({color: 0x929292});

export const PERSON_GEOMETRY = new THREE.BoxGeometry(0.4, 1.8, 0.4);
export const TAXI_GEOMETRY = new THREE.BoxGeometry(2.0, 1.6, 2.0);
export const STOP_GEOMETRY = new THREE.BoxGeometry(2.0, 1.6, 2.0);
export const STATION_GEOMETRY = new THREE.BoxGeometry(3.0, 3.0, 3.0);

export function getGeometry(name: string): THREE.BufferGeometry | null {
  switch (name) {
    case 'person':
      return PERSON_GEOMETRY
      break;
    default:
      break;
  }
  return null;
}