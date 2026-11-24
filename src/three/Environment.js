import * as THREE from 'three';
import { CAMPUS_ROADS } from './CampusData.js';

export function createCampusEnvironment(scene, timeOfDay = 'day') {
  const envGroup = new THREE.Group();
  envGroup.name = 'campus-environment';

  // 1. Terrain Ground
  const groundGeo = new THREE.PlaneGeometry(500, 500, 32, 32);
  groundGeo.rotateX(-Math.PI / 2);

  // Procedural grass texture canvas
  const grassCanvas = document.createElement('canvas');
  grassCanvas.width = 512;
  grassCanvas.height = 512;
  const gctx = grassCanvas.getContext('2d');
  gctx.fillStyle = '#1e3a1f';
  gctx.fillRect(0, 0, 512, 512);

  // Noise / grass tufts
  for (let i = 0; i < 4000; i++) {
    const gx = Math.random() * 512;
    const gy = Math.random() * 512;
    const gCol = Math.random() > 0.5 ? '#2d5a27' : '#14532d';
    gctx.fillStyle = gCol;
    gctx.fillRect(gx, gy, 2, 3);
  }

  const grassTex = new THREE.CanvasTexture(grassCanvas);
  grassTex.wrapS = THREE.RepeatWrapping;
  grassTex.wrapT = THREE.RepeatWrapping;
  grassTex.repeat.set(30, 30);

  const groundMat = new THREE.MeshStandardMaterial({
    map: grassTex,
    roughness: 0.9,
    metalness: 0.05
  });
  const groundMesh = new THREE.Mesh(groundGeo, groundMat);
  groundMesh.receiveShadow = true;
  envGroup.add(groundMesh);

  // 2. Road Network (Asphalt Roads with yellow/white curbs)
  const roadMat = new THREE.MeshStandardMaterial({ color: 0x1f2937, roughness: 0.85 });
  const curbMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.7 });

  CAMPUS_ROADS.forEach((points) => {
    for (let i = 0; i < points.length - 1; i++) {
      const p1 = points[i];
      const p2 = points[i + 1];

      const dx = p2.x - p1.x;
      const dz = p2.z - p1.z;
      const length = Math.sqrt(dx * dx + dz * dz);
      const angle = Math.atan2(dz, dx);

      const roadWidth = (p1.z > 60 || p2.z > 60) ? 8 : 6;

      const roadGeo = new THREE.PlaneGeometry(length, roadWidth);
      roadGeo.rotateX(-Math.PI / 2);
      roadGeo.rotateY(-angle);

      const road = new THREE.Mesh(roadGeo, roadMat);
      road.position.set((p1.x + p2.x) / 2, 0.04, (p1.z + p2.z) / 2);
      road.receiveShadow = true;
      envGroup.add(road);

      // Curbs on both sides
      const curbGeo = new THREE.BoxGeometry(length, 0.15, 0.4);
      curbGeo.rotateY(-angle);

      const offsetDist = roadWidth / 2 + 0.2;
      const nx = -Math.sin(angle) * offsetDist;
      const nz = Math.cos(angle) * offsetDist;

      const curb1 = new THREE.Mesh(curbGeo, curbMat);
      curb1.position.set((p1.x + p2.x) / 2 + nx, 0.08, (p1.z + p2.z) / 2 + nz);
      envGroup.add(curb1);

      const curb2 = new THREE.Mesh(curbGeo, curbMat);
      curb2.position.set((p1.x + p2.x) / 2 - nx, 0.08, (p1.z + p2.z) / 2 - nz);
      envGroup.add(curb2);
    }
  });

  // 3. Karatoya / Jamuneswari River on Eastern Boundary (করতোয়া নদী)
  const riverGeo = new THREE.PlaneGeometry(90, 360, 32, 64);
  riverGeo.rotateX(-Math.PI / 2);

  const riverMat = new THREE.MeshStandardMaterial({
    color: 0x0369a1,
    roughness: 0.15,
    metalness: 0.75,
    transparent: true,
    opacity: 0.88
  });
  const river = new THREE.Mesh(riverGeo, riverMat);
  river.position.set(130, 0.02, -20);
  river.rotation.y = -0.15;
  envGroup.add(river);

  // Sandy riverbank strip
  const sandGeo = new THREE.PlaneGeometry(35, 360);
  sandGeo.rotateX(-Math.PI / 2);
  const sandMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.95 });
  const sand = new THREE.Mesh(sandGeo, sandMat);
  sand.position.set(95, 0.03, -20);
  sand.rotation.y = -0.15;
  envGroup.add(sand);

  // 4. Instanced Trees for High Performance (Over 250 trees with just 2 draw calls!)
  const treeCount = 220;
  const trunkGeo = new THREE.CylinderGeometry(0.25, 0.4, 3, 6);
  trunkGeo.translate(0, 1.5, 0);
  const trunkMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.9 });
  const trunkInstanced = new THREE.InstancedMesh(trunkGeo, trunkMat, treeCount);

  const foliageGeo = new THREE.DodecahedronGeometry(2.2, 1);
  foliageGeo.translate(0, 4.2, 0);
  const foliageMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.8 });
  const foliageInstanced = new THREE.InstancedMesh(foliageGeo, foliageMat, treeCount);

  const dummy = new THREE.Object3D();
  let idx = 0;

  // Planting zones: Along avenues, north perimeter, river bank, around central field
  const rawTreeCoords = [];

  // Avoid planting right in front of reoriented building portals & clearways
  const isClearway = (x, z) => {
    // Academic east portal (x: -12 to 4, z: 10 to 30)
    if (x >= -12 && x <= 4 && z >= 10 && z <= 30) return true;
    // Girls Hall east portal (x: -28 to -10, z: -80 to -60)
    if (x >= -28 && x <= -10 && z >= -80 && z <= -60) return true;
    // Apparel Lab north facade (x: -36 to -14, z: -52 to -32)
    if (x >= -36 && x <= -14 && z >= -52 && z <= -32) return true;
    // Abu Sayed Hall west courtyard & monument (x: -36 to 0, z: -136 to -114)
    if (x >= -36 && x <= 0 && z >= -136 && z <= -114) return true;
    // Weaving Shed west portal (x: 44 to 70, z: -20 to 0)
    if (x >= 44 && x <= 70 && z >= -20 && z <= 0) return true;
    return false;
  };

  // Along main entry avenue
  for (let z = 20; z < 70; z += 6) {
    rawTreeCoords.push({ x: 3, z: z });
    rawTreeCoords.push({ x: 17, z: z });
  }

  // Along North road to Abu Sayed Hall
  for (let z = -110; z < 10; z += 8) {
    rawTreeCoords.push({ x: -14, z: z });
    rawTreeCoords.push({ x: 12, z: z });
  }

  // Around Central Field perimeter
  for (let x = -150; x < -80; x += 10) {
    rawTreeCoords.push({ x: x, z: -120 });
    rawTreeCoords.push({ x: x, z: -60 });
  }
  for (let z = -120; z < -60; z += 10) {
    rawTreeCoords.push({ x: -150, z: z });
  }

  // Quarters garden perimeter
  for (let a = 0; a < 25; a++) {
    rawTreeCoords.push({
      x: -10 + (Math.random() - 0.5) * 50,
      z: -75 + (Math.random() - 0.5) * 20
    });
  }

  // Near riverbank
  for (let z = -130; z < 60; z += 8) {
    rawTreeCoords.push({ x: 80 + Math.random() * 8, z: z });
  }

  // Filter clearways
  const treeCoords = rawTreeCoords.filter(pt => !isClearway(pt.x, pt.z));

  // Fill up the rest with random scattered greenery
  while (treeCoords.length < treeCount) {
    const rx = (Math.random() - 0.5) * 280;
    const rz = (Math.random() - 0.5) * 280;
    // Don't plant inside central buildings or fields or clearways
    if ((Math.abs(rx) > 20 || Math.abs(rz) > 20) && !isClearway(rx, rz)) {
      treeCoords.push({ x: rx, z: rz });
    }
  }

  treeCoords.slice(0, treeCount).forEach((pt, i) => {
    const s = 0.8 + Math.random() * 0.45;
    dummy.position.set(pt.x, 0, pt.z);
    dummy.rotation.y = Math.random() * Math.PI;
    dummy.scale.set(s, s, s);
    dummy.updateMatrix();

    trunkInstanced.setMatrixAt(i, dummy.matrix);
    foliageInstanced.setMatrixAt(i, dummy.matrix);
  });

  trunkInstanced.castShadow = true;
  foliageInstanced.castShadow = true;
  envGroup.add(trunkInstanced);
  envGroup.add(foliageInstanced);

  // 5. Campus Boundary Wall
  const wallMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.8 });
  const wallH = 2.2;
  const wallSections = [
    // South wall left of gate
    { x1: -140, z1: 65, x2: 2, z2: 65 },
    // South wall right of gate
    { x1: 18, z1: 65, x2: 85, z2: 65 },
    // West wall
    { x1: -140, z1: 65, x2: -140, z2: -140 },
    // North wall
    { x1: -140, z1: -140, x2: 85, z2: -140 }
  ];

  wallSections.forEach(({ x1, z1, x2, z2 }) => {
    const dx = x2 - x1;
    const dz = z2 - z1;
    const len = Math.sqrt(dx * dx + dz * dz);
    const angle = Math.atan2(dz, dx);

    const wGeo = new THREE.BoxGeometry(len, wallH, 0.4);
    wGeo.rotateY(-angle);
    const wall = new THREE.Mesh(wGeo, wallMat);
    wall.position.set((x1 + x2) / 2, wallH / 2, (z1 + z2) / 2);
    wall.castShadow = true;
    envGroup.add(wall);
  });

  scene.add(envGroup);

  // 6. Lighting & Atmosphere Setup
  const lights = setupLighting(scene, timeOfDay);

  return { envGroup, lights, river };
}

export function setupLighting(scene, timeOfDay = 'day') {
  // Remove existing lights if any
  const existing = scene.getObjectByName('campus-lighting');
  if (existing) scene.remove(existing);

  const lightGroup = new THREE.Group();
  lightGroup.name = 'campus-lighting';

  let sunColor = 0xfffaed;
  let sunIntensity = 1.6;
  let ambientColor = 0xe0f2fe;
  let groundColor = 0x14532d;
  let sunPos = new THREE.Vector3(80, 120, 90);
  let bgClearColor = '#0f172a';

  if (timeOfDay === 'sunset') {
    sunColor = 0xf97316;
    sunIntensity = 1.8;
    ambientColor = 0xfde047;
    groundColor = 0x451a03;
    sunPos = new THREE.Vector3(120, 45, 100);
    bgClearColor = '#1e1b4b';
  } else if (timeOfDay === 'night') {
    sunColor = 0x38bdf8;
    sunIntensity = 0.25;
    ambientColor = 0x1e293b;
    groundColor = 0x022c22;
    sunPos = new THREE.Vector3(40, 80, 50);
    bgClearColor = '#020617';
  }

  // Sun / Directional Light with Soft Shadows
  const sunLight = new THREE.DirectionalLight(sunColor, sunIntensity);
  sunLight.position.copy(sunPos);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.width = 1024;
  sunLight.shadow.mapSize.height = 1024;
  sunLight.shadow.camera.near = 10;
  sunLight.shadow.camera.far = 350;
  sunLight.shadow.camera.left = -160;
  sunLight.shadow.camera.right = 160;
  sunLight.shadow.camera.top = 160;
  sunLight.shadow.camera.bottom = -160;
  sunLight.shadow.bias = -0.0005;
  lightGroup.add(sunLight);

  // Hemispheric Ambient Light for natural sky/earth bounce
  const hemiLight = new THREE.HemisphereLight(ambientColor, groundColor, 0.7);
  lightGroup.add(hemiLight);

  // Gate Lanterns
  const gateLeftLight = new THREE.PointLight(0xfef08a, 1.2, 18);
  gateLeftLight.position.set(4, 7.5, 65);
  lightGroup.add(gateLeftLight);

  const gateRightLight = new THREE.PointLight(0xfef08a, 1.2, 18);
  gateRightLight.position.set(16, 7.5, 65);
  lightGroup.add(gateRightLight);

  scene.add(lightGroup);

  return { lightGroup, sunLight, hemiLight, bgClearColor };
}
