import * as THREE from 'three';

// Shared Materials Palette for optimal GPU batching and realism
export function createMaterialPalette() {
  // Canvas texture generator for gate signage
  const createSignTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    // Background gradient (Deep Academic Emerald to Navy)
    const grad = ctx.createLinearGradient(0, 0, 1024, 0);
    grad.addColorStop(0, '#064e3b');
    grad.addColorStop(0.5, '#042f2e');
    grad.addColorStop(1, '#022c22');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 256);

    // Golden border
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 8;
    ctx.strokeRect(10, 10, 1004, 236);
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 2;
    ctx.strokeRect(18, 18, 988, 220);

    // English Text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('RANGPUR TEXTILE ENGINEERING COLLEGE', 512, 70);

    ctx.fillStyle = '#fef08a';
    ctx.font = '600 24px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('PIRGANJ, RANGPUR', 512, 115);

    // Bengali Text
    ctx.fillStyle = '#6ee7b7';
    ctx.font = 'bold 32px "Hind Siliguri", sans-serif';
    ctx.fillText('রংপুর টেক্সটাইল ইঞ্জিনিয়ারিং কলেজ, পীরগঞ্জ, রংপুর', 512, 168);

    // Subtitle
    ctx.fillStyle = '#94a3b8';
    ctx.font = 'italic 18px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Affiliated with Bangladesh University of Textiles (BUTEX)', 512, 212);

    const texture = new THREE.CanvasTexture(canvas);
    texture.anisotropy = 4;
    return texture;
  };

  // Canvas texture generator for building nameboards
  const createBoardTexture = (titleBn, titleEn) => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, 512, 128);

    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 4;
    ctx.strokeRect(4, 4, 504, 120);

    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 24px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(titleEn, 256, 45);

    ctx.fillStyle = '#34d399';
    ctx.font = 'bold 26px "Hind Siliguri", sans-serif';
    ctx.fillText(titleBn, 256, 92);

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  };

  // Window texture for building facades
  const createWindowTexture = (color = '#38bdf8', frameColor = '#1e293b') => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = frameColor;
    ctx.fillRect(0, 0, 256, 256);

    ctx.fillStyle = color;
    // 4 window panes
    ctx.fillRect(12, 12, 108, 108);
    ctx.fillRect(136, 12, 108, 108);
    ctx.fillRect(12, 136, 108, 108);
    ctx.fillRect(136, 136, 108, 108);

    // Glare reflection
    ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.beginPath();
    ctx.moveTo(12, 12);
    ctx.lineTo(80, 12);
    ctx.lineTo(12, 80);
    ctx.fill();

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
  };

  return {
    brickRed: new THREE.MeshStandardMaterial({ color: 0x993d2e, roughness: 0.85, metalness: 0.05 }),
    concreteCream: new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.7, metalness: 0.1 }),
    concreteDark: new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.8, metalness: 0.1 }),
    roofTile: new THREE.MeshStandardMaterial({ color: 0x854d0e, roughness: 0.6, metalness: 0.1 }),
    roofIndustrial: new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.4, metalness: 0.6 }),
    glassBlue: new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      roughness: 0.1,
      metalness: 0.9,
      transparent: true,
      opacity: 0.75
    }),
    glassWindow: new THREE.MeshStandardMaterial({
      map: createWindowTexture('#38bdf8', '#334155'),
      roughness: 0.2,
      metalness: 0.5
    }),
    ironBlack: new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.4, metalness: 0.8 }),
    goldMetal: new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.3, metalness: 0.85 }),
    emeraldDome: new THREE.MeshStandardMaterial({ color: 0x059669, roughness: 0.3, metalness: 0.3 }),
    mosqueWhite: new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.5, metalness: 0.1 }),
    woodDoor: new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.7, metalness: 0.05 }),
    signTexture: createSignTexture(),
    createBoardTexture
  };
}

/**
 * Procedural Building Builder for all 15 Campus Landmarks
 */
export function buildLandmarkModel(landmark, materials) {
  const group = new THREE.Group();
  group.name = `landmark-${landmark.id}`;
  group.position.set(landmark.coords.x, landmark.coords.y, landmark.coords.z);
  group.userData = { landmarkId: landmark.id, name: landmark.name, landmarkData: landmark };

  const structureGroup = new THREE.Group();
  structureGroup.name = `structure-${landmark.id}`;
  group.add(structureGroup);

  switch (landmark.id) {
    case 'main-gate':
      createMainGate(group, materials);
      break;
    case 'academic':
      createAcademicBuilding(structureGroup, materials);
      // Face EAST (+X) towards central main avenue (User Red Arrow in Image 2)
      structureGroup.rotation.y = Math.PI / 2;
      break;
    case 'library':
      createLibraryBuilding(structureGroup, materials);
      break;
    case 'computer-lab':
      createComputerLab(structureGroup, materials);
      break;
    case 'auditorium':
      createAuditorium(structureGroup, materials);
      break;
    case 'weaving-shed':
      createWeavingShed(structureGroup, materials);
      // Face WEST (-X) towards central avenue & library (User Red Arrow in Image 2)
      structureGroup.rotation.y = -Math.PI / 2;
      break;
    case 'apparel-lab':
      createApparelLab(structureGroup, materials);
      // Face NORTH (-Z) towards inner road & Girls Hall (User Red Arrow in Image 1)
      structureGroup.rotation.y = Math.PI;
      break;
    case 'basketball':
      createBasketballCourt(structureGroup, materials);
      break;
    case 'swimming-pool':
      createSwimmingPool(structureGroup, materials);
      break;
    case 'central-field':
      createCentralField(structureGroup, materials);
      break;
    case 'girls-hall':
      createGirlsHall(structureGroup, materials);
      // Face EAST (+X) towards north-south avenue (User Red Arrow in Image 1)
      structureGroup.rotation.y = Math.PI / 2;
      break;
    case 'teachers-quarters':
      createTeachersQuarters(structureGroup, materials);
      break;
    case 'abu-sayed-hall':
      createAbuSayedHall(structureGroup, materials);
      // Face WEST (-X) towards western approach & sports fields (User Red Arrow in Image 1)
      structureGroup.rotation.y = -Math.PI / 2;
      break;
    case 'principal-quarter':
      createPrincipalQuarter(structureGroup, materials);
      break;
    case 'mosque':
      createMosque(structureGroup, materials);
      break;
    default:
      createGenericBuilding(structureGroup, materials, landmark);
      break;
  }

  // Floating Landmark Pin / Beacon above the building
  const pinGroup = new THREE.Group();
  pinGroup.position.set(0, getBuildingHeight(landmark.id) + 4.5, 0);
  pinGroup.name = `beacon-${landmark.id}`;

  const pinGeo = new THREE.ConeGeometry(0.8, 2, 4);
  pinGeo.rotateX(Math.PI);
  const pinMat = new THREE.MeshStandardMaterial({
    color: 0x10b981,
    emissive: 0x059669,
    emissiveIntensity: 0.6,
    roughness: 0.2
  });
  const pin = new THREE.Mesh(pinGeo, pinMat);
  pinGroup.add(pin);

  const ringGeo = new THREE.TorusGeometry(1.2, 0.08, 8, 24);
  ringGeo.rotateX(Math.PI / 2);
  const ringMat = new THREE.MeshBasicMaterial({ color: 0x34d399 });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  pinGroup.add(ring);

  group.add(pinGroup);
  group.userData.beacon = pinGroup;

  return group;
}

function getBuildingHeight(id) {
  switch (id) {
    case 'academic': return 16;
    case 'abu-sayed-hall': return 15;
    case 'girls-hall': return 14;
    case 'auditorium': return 12;
    case 'library': return 11;
    case 'mosque': return 16;
    case 'weaving-shed': return 9;
    case 'basketball':
    case 'swimming-pool':
    case 'central-field': return 2;
    default: return 8;
  }
}

// 1. MAIN GATE (With Hinged Animated Dual Iron Doors & Overhead Grand Sign)
function createMainGate(group, mats) {
  // Gate Pillars (Left & Right)
  const pillarGeo = new THREE.BoxGeometry(2.4, 7, 2.4);
  const leftPillar = new THREE.Mesh(pillarGeo, mats.brickRed);
  leftPillar.position.set(-6, 3.5, 0);
  leftPillar.castShadow = true;
  group.add(leftPillar);

  const rightPillar = new THREE.Mesh(pillarGeo, mats.brickRed);
  rightPillar.position.set(6, 3.5, 0);
  rightPillar.castShadow = true;
  group.add(rightPillar);

  // Pillar Caps (White Concrete)
  const capGeo = new THREE.BoxGeometry(2.8, 0.6, 2.8);
  const leftCap = new THREE.Mesh(capGeo, mats.concreteCream);
  leftCap.position.set(-6, 7.3, 0);
  group.add(leftCap);

  const rightCap = new THREE.Mesh(capGeo, mats.concreteCream);
  rightCap.position.set(6, 7.3, 0);
  group.add(rightCap);

  // Overhead Arch Beam connecting the two pillars
  const archGeo = new THREE.BoxGeometry(14.8, 1.4, 1.8);
  const arch = new THREE.Mesh(archGeo, mats.concreteCream);
  arch.position.set(0, 8.2, 0);
  arch.castShadow = true;
  group.add(arch);

  // Grand Signboard Board on top of the arch
  const signBoardGeo = new THREE.BoxGeometry(13.5, 3.2, 0.35);
  const signMat = new THREE.MeshStandardMaterial({
    map: mats.signTexture,
    roughness: 0.3,
    metalness: 0.2
  });
  const signMesh = new THREE.Mesh(signBoardGeo, signMat);
  signMesh.position.set(0, 10.4, 0);
  signMesh.castShadow = true;
  group.add(signMesh);

  // Bangladesh Flag atop Main Gate
  const mastGeo = new THREE.CylinderGeometry(0.06, 0.06, 4.5);
  const mast = new THREE.Mesh(mastGeo, mats.ironBlack);
  mast.position.set(0, 13.5, 0);
  group.add(mast);

  const flagGeo = new THREE.PlaneGeometry(2.4, 1.5);
  // Bangladesh Flag Canvas
  const flagCanvas = document.createElement('canvas');
  flagCanvas.width = 120;
  flagCanvas.height = 75;
  const fctx = flagCanvas.getContext('2d');
  fctx.fillStyle = '#006a4e';
  fctx.fillRect(0, 0, 120, 75);
  fctx.fillStyle = '#f42a41';
  fctx.beginPath();
  fctx.arc(54, 37.5, 20, 0, Math.PI * 2);
  fctx.fill();
  const flagTex = new THREE.CanvasTexture(flagCanvas);
  const flagMat = new THREE.MeshBasicMaterial({ map: flagTex, side: THREE.DoubleSide });
  const flag = new THREE.Mesh(flagGeo, flagMat);
  flag.position.set(1.2, 14.5, 0);
  group.add(flag);

  // Side Guard Boothes
  const boothGeo = new THREE.BoxGeometry(3.2, 3.5, 3.5);
  const leftBooth = new THREE.Mesh(boothGeo, mats.concreteCream);
  leftBooth.position.set(-10, 1.75, 0);
  leftBooth.castShadow = true;
  group.add(leftBooth);

  const rightBooth = new THREE.Mesh(boothGeo, mats.concreteCream);
  rightBooth.position.set(10, 1.75, 0);
  rightBooth.castShadow = true;
  group.add(rightBooth);

  // Booth Windows
  const bWinGeo = new THREE.PlaneGeometry(1.5, 1.2);
  const bWinLeft = new THREE.Mesh(bWinGeo, mats.glassBlue);
  bWinLeft.position.set(-8.38, 2, 0);
  bWinLeft.rotation.y = Math.PI / 2;
  group.add(bWinLeft);

  // HINGED DUAL IRON GATE DOORS (Animate open when user scrolls/enters!)
  // Left Gate Door Pivot
  const leftPivot = new THREE.Group();
  leftPivot.position.set(-4.8, 0, 0);
  leftPivot.name = 'gate-left-pivot';

  const gateWingGeo = new THREE.BoxGeometry(4.8, 4.5, 0.15);
  const leftGateMesh = new THREE.Mesh(gateWingGeo, mats.ironBlack);
  leftGateMesh.position.set(2.4, 2.3, 0);
  leftGateMesh.castShadow = true;
  leftPivot.add(leftGateMesh);

  // Decorative Golden Spear tops on gate
  for (let i = 0.5; i <= 4.5; i += 0.8) {
    const spearGeo = new THREE.ConeGeometry(0.12, 0.45, 8);
    const spear = new THREE.Mesh(spearGeo, mats.goldMetal);
    spear.position.set(i, 4.7, 0);
    leftPivot.add(spear);
  }
  group.add(leftPivot);

  // Right Gate Door Pivot
  const rightPivot = new THREE.Group();
  rightPivot.position.set(4.8, 0, 0);
  rightPivot.name = 'gate-right-pivot';

  const rightGateMesh = new THREE.Mesh(gateWingGeo, mats.ironBlack);
  rightGateMesh.position.set(-2.4, 2.3, 0);
  rightGateMesh.castShadow = true;
  rightPivot.add(rightGateMesh);

  for (let i = -4.5; i <= -0.5; i += 0.8) {
    const spearGeo = new THREE.ConeGeometry(0.12, 0.45, 8);
    const spear = new THREE.Mesh(spearGeo, mats.goldMetal);
    spear.position.set(i, 4.7, 0);
    rightPivot.add(spear);
  }
  group.add(rightPivot);

  group.userData.leftPivot = leftPivot;
  group.userData.rightPivot = rightPivot;
}

// 2. ACADEMIC BUILDING (Dr. MA Wazed Miah Academic Complex)
function createAcademicBuilding(group, mats) {
  // Main Central Wing (4 Stories)
  const centerGeo = new THREE.BoxGeometry(28, 14, 18);
  const centerMesh = new THREE.Mesh(centerGeo, mats.brickRed);
  centerMesh.position.set(0, 7, 0);
  centerMesh.castShadow = true;
  centerMesh.receiveShadow = true;
  group.add(centerMesh);

  // East & West Projected Wings (L-shape layout)
  const westWingGeo = new THREE.BoxGeometry(14, 14, 12);
  const westWing = new THREE.Mesh(westWingGeo, mats.brickRed);
  westWing.position.set(-16, 7, 5);
  westWing.castShadow = true;
  group.add(westWing);

  // Front Portico / Grand Entrance with Pillars
  const porticoGeo = new THREE.BoxGeometry(10, 8, 4);
  const portico = new THREE.Mesh(porticoGeo, mats.concreteCream);
  portico.position.set(0, 4, 10);
  portico.castShadow = true;
  group.add(portico);

  // Entrance Columns
  for (let x = -3.5; x <= 3.5; x += 2.3) {
    const colGeo = new THREE.CylinderGeometry(0.35, 0.35, 7.5, 12);
    const col = new THREE.Mesh(colGeo, mats.concreteCream);
    col.position.set(x, 3.8, 12.2);
    col.castShadow = true;
    group.add(col);
  }

  // Windows grid on Facade
  const winMat = mats.glassWindow;
  winMat.map.repeat.set(8, 4);
  const winFrontGeo = new THREE.PlaneGeometry(24, 10);
  const winFront = new THREE.Mesh(winFrontGeo, winMat);
  winFront.position.set(0, 7.5, 9.05);
  group.add(winFront);

  // White parapet border on roof
  const parapetGeo = new THREE.BoxGeometry(28.4, 0.8, 18.4);
  const parapet = new THREE.Mesh(parapetGeo, mats.concreteCream);
  parapet.position.set(0, 14.4, 0);
  group.add(parapet);

  // Building Nameplate
  const boardTex = mats.createBoardTexture('ড. এম এ ওয়াজেদ মিয়া টেক্সটাইল ভবন', 'DR. MA WAZED MIAH ACADEMIC BUILDING');
  const boardGeo = new THREE.PlaneGeometry(8, 1.8);
  const boardMat = new THREE.MeshBasicMaterial({ map: boardTex });
  const board = new THREE.Mesh(boardGeo, boardMat);
  board.position.set(0, 7.2, 12.05);
  group.add(board);
}

// 3. CENTRAL LIBRARY
function createLibraryBuilding(group, mats) {
  // Main Library Block (3 Stories with large curtain glass wall)
  const libGeo = new THREE.BoxGeometry(18, 10, 14);
  const libMesh = new THREE.Mesh(libGeo, mats.concreteCream);
  libMesh.position.set(0, 5, 0);
  libMesh.castShadow = true;
  group.add(libMesh);

  // Blue Tinted Curtain Glass Wall
  const glassGeo = new THREE.PlaneGeometry(14, 8);
  const glassMesh = new THREE.Mesh(glassGeo, mats.glassBlue);
  glassMesh.position.set(0, 5, 7.05);
  group.add(glassMesh);

  // Modern Vertical Architectural Fins
  for (let x = -6; x <= 6; x += 2) {
    const finGeo = new THREE.BoxGeometry(0.2, 8.5, 0.6);
    const fin = new THREE.Mesh(finGeo, mats.goldMetal);
    fin.position.set(x, 5, 7.3);
    group.add(fin);
  }

  // Rooftop Skylight / Pergola
  const pergolaGeo = new THREE.BoxGeometry(12, 1, 8);
  const pergola = new THREE.Mesh(pergolaGeo, mats.concreteDark);
  pergola.position.set(0, 10.5, 0);
  group.add(pergola);

  // Nameboard
  const boardTex = mats.createBoardTexture('সেন্ট্রাল লাইব্রেরি ও ই-রিসোর্স সেন্টার', 'CENTRAL LIBRARY & E-RESOURCE HUB');
  const boardGeo = new THREE.PlaneGeometry(7, 1.6);
  const boardMat = new THREE.MeshBasicMaterial({ map: boardTex });
  const board = new THREE.Mesh(boardGeo, boardMat);
  board.position.set(0, 9.6, 7.1);
  group.add(board);
}

// 4. COMPUTER & CAD LAB
function createComputerLab(group, mats) {
  const labGeo = new THREE.BoxGeometry(16, 7.5, 12);
  const labMesh = new THREE.Mesh(labGeo, mats.concreteDark);
  labMesh.position.set(0, 3.75, 0);
  labMesh.castShadow = true;
  group.add(labMesh);

  // Modern horizontal ribbon windows
  const winGeo = new THREE.PlaneGeometry(13, 2.2);
  const winUpper = new THREE.Mesh(winGeo, mats.glassBlue);
  winUpper.position.set(0, 5.2, 6.05);
  group.add(winUpper);

  const winLower = new THREE.Mesh(winGeo, mats.glassBlue);
  winLower.position.set(0, 2.2, 6.05);
  group.add(winLower);

  // Satellite dish & tech antennas on roof
  const dishGeo = new THREE.CylinderGeometry(1.2, 0.2, 0.4, 16);
  dishGeo.rotateZ(0.4);
  const dish = new THREE.Mesh(dishGeo, mats.concreteCream);
  dish.position.set(-4, 8.5, 0);
  group.add(dish);

  // Nameboard
  const boardTex = mats.createBoardTexture('কম্পিউটার ও টেক্সটাইল ক্যাড ল্যাব', 'COMPUTER & TEXTILE CAD/CAM LAB');
  const boardGeo = new THREE.PlaneGeometry(6, 1.4);
  const boardMat = new THREE.MeshBasicMaterial({ map: boardTex });
  const board = new THREE.Mesh(boardGeo, boardMat);
  board.position.set(0, 7.1, 6.05);
  group.add(board);
}

// 5. AUDITORIUM & FABRIC SHED
function createAuditorium(group, mats) {
  // Main Hall Box
  const hallGeo = new THREE.BoxGeometry(22, 10, 26);
  const hall = new THREE.Mesh(hallGeo, mats.brickRed);
  hall.position.set(0, 5, 0);
  hall.castShadow = true;
  group.add(hall);

  // Curved Barrel / Acoustic Roof
  const roofGeo = new THREE.CylinderGeometry(12, 12, 26, 16, 1, false, 0, Math.PI);
  roofGeo.rotateZ(Math.PI / 2);
  roofGeo.rotateY(Math.PI / 2);
  const roof = new THREE.Mesh(roofGeo, mats.roofIndustrial);
  roof.position.set(0, 9.8, 0);
  roof.castShadow = true;
  group.add(roof);

  // Front Foyer with tall glass doors
  const foyerGeo = new THREE.BoxGeometry(16, 6, 4);
  const foyer = new THREE.Mesh(foyerGeo, mats.concreteCream);
  foyer.position.set(0, 3, 14);
  group.add(foyer);

  // Pillars
  for (let x = -6; x <= 6; x += 4) {
    const colGeo = new THREE.CylinderGeometry(0.3, 0.3, 5.8, 12);
    const col = new THREE.Mesh(colGeo, mats.concreteCream);
    col.position.set(x, 3, 16.2);
    group.add(col);
  }

  // Nameboard
  const boardTex = mats.createBoardTexture('কেন্দ্রীয় অডিটোরিয়াম ও ফ্যাব্রিক শেড', 'AUDITORIUM & FABRIC TESTING COMPLEX');
  const boardGeo = new THREE.PlaneGeometry(8, 1.6);
  const boardMat = new THREE.MeshBasicMaterial({ map: boardTex });
  const board = new THREE.Mesh(boardGeo, boardMat);
  board.position.set(0, 5.5, 16.05);
  group.add(board);
}

// 6. WEAVING & SPINNING SHED (North-Light Industrial Sawtooth Roof)
function createWeavingShed(group, mats) {
  const shedGeo = new THREE.BoxGeometry(32, 6, 20);
  const shed = new THREE.Mesh(shedGeo, mats.brickRed);
  shed.position.set(0, 3, 0);
  shed.castShadow = true;
  group.add(shed);

  // 4 Sawtooth Industrial Roof Peaks
  for (let z = -7.5; z <= 7.5; z += 5) {
    const peakGroup = new THREE.Group();
    peakGroup.position.set(0, 6, z);

    // Sloped metal roof
    const slopeGeo = new THREE.BoxGeometry(32, 0.4, 4.2);
    slopeGeo.rotateX(0.45);
    const slope = new THREE.Mesh(slopeGeo, mats.roofIndustrial);
    slope.position.set(0, 1.2, 0.8);
    peakGroup.add(slope);

    // North vertical glass clerestory
    const clerestoryGeo = new THREE.PlaneGeometry(32, 1.8);
    const glass = new THREE.Mesh(clerestoryGeo, mats.glassBlue);
    glass.position.set(0, 1.1, -1.2);
    peakGroup.add(glass);

    group.add(peakGroup);
  }

  // Big Roll-up Industrial Shutter Door
  const doorGeo = new THREE.PlaneGeometry(6, 4.5);
  const door = new THREE.Mesh(doorGeo, mats.roofIndustrial);
  door.position.set(0, 2.25, 10.05);
  group.add(door);

  // Nameboard
  const boardTex = mats.createBoardTexture('ভারী উইভিং ও স্পিনিং শেড', 'HEAVY WEAVING & SPINNING SHED');
  const boardGeo = new THREE.PlaneGeometry(8, 1.6);
  const boardMat = new THREE.MeshBasicMaterial({ map: boardTex });
  const board = new THREE.Mesh(boardGeo, boardMat);
  board.position.set(0, 5.2, 10.05);
  group.add(board);
}

// 7. APPAREL MANUFACTURING LAB
function createApparelLab(group, mats) {
  const labGeo = new THREE.BoxGeometry(22, 6.5, 16);
  const lab = new THREE.Mesh(labGeo, mats.concreteCream);
  lab.position.set(0, 3.25, 0);
  lab.castShadow = true;
  group.add(lab);

  // Low pitched hip roof
  const roofGeo = new THREE.ConeGeometry(17, 3, 4);
  roofGeo.rotateY(Math.PI / 4);
  const roof = new THREE.Mesh(roofGeo, mats.roofTile);
  roof.position.set(0, 8, 0);
  group.add(roof);

  // Large manufacturing ribbon windows
  const winGeo = new THREE.PlaneGeometry(18, 2.4);
  const win = new THREE.Mesh(winGeo, mats.glassWindow);
  win.position.set(0, 3.5, 8.05);
  group.add(win);

  // Nameboard
  const boardTex = mats.createBoardTexture('পোশাক উৎপাদন ও গার্মেন্টস শেড', 'APPAREL MANUFACTURING LAB & SHED');
  const boardGeo = new THREE.PlaneGeometry(7.5, 1.5);
  const boardMat = new THREE.MeshBasicMaterial({ map: boardTex });
  const board = new THREE.Mesh(boardGeo, boardMat);
  board.position.set(0, 5.2, 8.05);
  group.add(board);
}

// 8. BASKETBALL COURT
function createBasketballCourt(group, mats) {
  // Court Floor (Terracotta with green borders)
  const courtGeo = new THREE.PlaneGeometry(28, 16);
  courtGeo.rotateX(-Math.PI / 2);

  // Canvas texture for basketball markings
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#065f46'; // Outer green
  ctx.fillRect(0, 0, 512, 256);

  ctx.fillStyle = '#c2410c'; // Inner terracotta court
  ctx.fillRect(20, 20, 472, 216);

  // White line markings
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 4;
  ctx.strokeRect(20, 20, 472, 216);

  // Half court line & center circle
  ctx.beginPath();
  ctx.moveTo(256, 20);
  ctx.lineTo(256, 236);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(256, 128, 35, 0, Math.PI * 2);
  ctx.stroke();

  // Key areas
  ctx.strokeRect(20, 90, 70, 76);
  ctx.strokeRect(422, 90, 70, 76);

  const courtTex = new THREE.CanvasTexture(canvas);
  const courtMat = new THREE.MeshStandardMaterial({ map: courtTex, roughness: 0.6 });
  const courtMesh = new THREE.Mesh(courtGeo, courtMat);
  courtMesh.position.set(0, 0.05, 0);
  courtMesh.receiveShadow = true;
  group.add(courtMesh);

  // 2 Basketball Hoops (Left & Right)
  [-13, 13].forEach((xPos, idx) => {
    const postGeo = new THREE.CylinderGeometry(0.1, 0.1, 3.8);
    const post = new THREE.Mesh(postGeo, mats.ironBlack);
    post.position.set(xPos, 1.9, 0);
    group.add(post);

    const boardGeo = new THREE.BoxGeometry(0.08, 1.2, 1.8);
    const backboard = new THREE.Mesh(boardGeo, mats.concreteCream);
    backboard.position.set(xPos + (idx === 0 ? 0.3 : -0.3), 3.2, 0);
    group.add(backboard);

    const rimGeo = new THREE.TorusGeometry(0.3, 0.04, 8, 16);
    rimGeo.rotateX(Math.PI / 2);
    const rim = new THREE.Mesh(rimGeo, mats.goldMetal);
    rim.position.set(xPos + (idx === 0 ? 0.6 : -0.6), 2.9, 0);
    group.add(rim);
  });

  // Floodlight towers
  [[-13, -7], [-13, 7], [13, -7], [13, 7]].forEach(([px, pz]) => {
    const lightPoleGeo = new THREE.CylinderGeometry(0.12, 0.15, 7);
    const pole = new THREE.Mesh(lightPoleGeo, mats.ironBlack);
    pole.position.set(px, 3.5, pz);
    group.add(pole);

    const lampGeo = new THREE.BoxGeometry(0.8, 0.4, 0.5);
    const lamp = new THREE.Mesh(lampGeo, mats.concreteCream);
    lamp.position.set(px, 7, pz);
    group.add(lamp);
  });
}

// 9. SWIMMING POOL
function createSwimmingPool(group, mats) {
  // Tiled Pool Deck Surround
  const deckGeo = new THREE.BoxGeometry(26, 0.3, 18);
  const deck = new THREE.Mesh(deckGeo, mats.concreteCream);
  deck.position.set(0, 0.15, 0);
  deck.receiveShadow = true;
  group.add(deck);

  // Sunken Pool Basin
  const basinGeo = new THREE.BoxGeometry(20, 2.2, 12);
  const basinMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.3 });
  const basin = new THREE.Mesh(basinGeo, basinMat);
  basin.position.set(0, -1, 0);
  group.add(basin);

  // Sparkling Blue Water Surface
  const waterGeo = new THREE.PlaneGeometry(19.8, 11.8);
  waterGeo.rotateX(-Math.PI / 2);
  const waterMat = new THREE.MeshStandardMaterial({
    color: 0x06b6d4,
    roughness: 0.1,
    metalness: 0.8,
    transparent: true,
    opacity: 0.82
  });
  const water = new THREE.Mesh(waterGeo, waterMat);
  water.position.set(0, 0.2, 0);
  group.add(water);

  // Lane Dividers
  for (let z = -4; z <= 4; z += 2.6) {
    const lineGeo = new THREE.BoxGeometry(19.5, 0.05, 0.15);
    const lineMat = new THREE.MeshBasicMaterial({ color: 0xfacc15 });
    const line = new THREE.Mesh(lineGeo, lineMat);
    line.position.set(0, 0.22, z);
    group.add(line);
  }

  // Diving Starting Blocks
  for (let z = -4; z <= 4; z += 2.6) {
    const blockGeo = new THREE.BoxGeometry(0.8, 0.6, 0.8);
    const block = new THREE.Mesh(blockGeo, mats.concreteCream);
    block.position.set(-10.4, 0.5, z);
    group.add(block);
  }

  // Poolside Umbrellas and Sun Loungers
  [[-7, 7.5], [0, 7.5], [7, 7.5]].forEach(([ux, uz]) => {
    const poleGeo = new THREE.CylinderGeometry(0.05, 0.05, 2.5);
    const pole = new THREE.Mesh(poleGeo, mats.ironBlack);
    pole.position.set(ux, 1.25, uz);
    group.add(pole);

    const umbrellaGeo = new THREE.ConeGeometry(1.4, 0.6, 8);
    const umbMat = new THREE.MeshStandardMaterial({ color: 0x059669 });
    const umb = new THREE.Mesh(umbrellaGeo, umbMat);
    umb.position.set(ux, 2.4, uz);
    group.add(umb);
  });
}

// 10. RTEC CENTRAL FIELD (Football, Cricket Pitch & Stadium Bleachers)
function createCentralField(group, mats) {
  // Lush Field Ground
  const fieldGeo = new THREE.PlaneGeometry(70, 50);
  fieldGeo.rotateX(-Math.PI / 2);

  // Field markings canvas
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 360;
  const ctx = canvas.getContext('2d');

  // Vibrant Grass
  ctx.fillStyle = '#166534';
  ctx.fillRect(0, 0, 512, 360);

  // White Football boundary & lines
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 4;
  ctx.strokeRect(20, 20, 472, 320);

  // Center circle & line
  ctx.beginPath();
  ctx.moveTo(256, 20);
  ctx.lineTo(256, 340);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(256, 180, 45, 0, Math.PI * 2);
  ctx.stroke();

  // Goal areas
  ctx.strokeRect(20, 110, 60, 140);
  ctx.strokeRect(432, 110, 60, 140);

  // Central Cricket Pitch (Clay brown strip)
  ctx.fillStyle = '#b45309';
  ctx.fillRect(240, 120, 32, 120);

  const fieldTex = new THREE.CanvasTexture(canvas);
  const fieldMat = new THREE.MeshStandardMaterial({ map: fieldTex, roughness: 0.9 });
  const fieldMesh = new THREE.Mesh(fieldGeo, fieldMat);
  fieldMesh.position.set(0, 0.05, 0);
  fieldMesh.receiveShadow = true;
  group.add(fieldMesh);

  // 400m Outer Athletic Running Track (Red Clay)
  const trackGeo = new THREE.RingGeometry(26, 32, 32);
  trackGeo.rotateX(-Math.PI / 2);
  const trackMat = new THREE.MeshStandardMaterial({ color: 0x991b1b, roughness: 0.8 });
  const track = new THREE.Mesh(trackGeo, trackMat);
  track.scale.set(1.15, 0.8, 1);
  track.position.set(0, 0.02, 0);
  group.add(track);

  // Football Goalposts (West and East ends)
  [-32, 32].forEach((xPos) => {
    const postGeo = new THREE.CylinderGeometry(0.08, 0.08, 2.5);
    const leftPost = new THREE.Mesh(postGeo, mats.concreteCream);
    leftPost.position.set(xPos, 1.25, -3);
    group.add(leftPost);

    const rightPost = new THREE.Mesh(postGeo, mats.concreteCream);
    rightPost.position.set(xPos, 1.25, 3);
    group.add(rightPost);

    const crossbarGeo = new THREE.CylinderGeometry(0.08, 0.08, 6);
    crossbarGeo.rotateX(Math.PI / 2);
    const crossbar = new THREE.Mesh(crossbarGeo, mats.concreteCream);
    crossbar.position.set(xPos, 2.5, 0);
    group.add(crossbar);
  });

  // Spectator Pavilion Bleachers (South edge)
  const bleacherGeo = new THREE.BoxGeometry(24, 2.5, 5);
  const bleacher = new THREE.Mesh(bleacherGeo, mats.concreteDark);
  bleacher.position.set(0, 1.25, 27);
  bleacher.castShadow = true;
  group.add(bleacher);

  // Pavilion Canopy Roof
  const canopyGeo = new THREE.BoxGeometry(26, 0.4, 7);
  const canopy = new THREE.Mesh(canopyGeo, mats.roofIndustrial);
  canopy.position.set(0, 3.8, 27);
  group.add(canopy);
}

// 11. GIRL'S HALL (Dormitory)
function createGirlsHall(group, mats) {
  // L-shaped Residential Complex
  const mainGeo = new THREE.BoxGeometry(26, 12, 12);
  const main = new THREE.Mesh(mainGeo, mats.brickRed);
  main.position.set(0, 6, 0);
  main.castShadow = true;
  group.add(main);

  const wingGeo = new THREE.BoxGeometry(12, 12, 16);
  const wing = new THREE.Mesh(wingGeo, mats.brickRed);
  wing.position.set(-7, 6, 12);
  wing.castShadow = true;
  group.add(wing);

  // Balconies with railings on upper floors
  for (let y = 4; y <= 10; y += 3) {
    const balGeo = new THREE.BoxGeometry(24, 0.4, 1.5);
    const bal = new THREE.Mesh(balGeo, mats.concreteCream);
    bal.position.set(0, y, 6.75);
    group.add(bal);

    const railGeo = new THREE.BoxGeometry(24, 0.8, 0.1);
    const rail = new THREE.Mesh(railGeo, mats.ironBlack);
    rail.position.set(0, y + 0.6, 7.45);
    group.add(rail);
  }

  // Windows
  const winGeo = new THREE.PlaneGeometry(22, 8);
  const win = new THREE.Mesh(winGeo, mats.glassWindow);
  win.position.set(0, 6.5, 6.05);
  group.add(win);

  // Entrance Porch
  const porchGeo = new THREE.BoxGeometry(6, 4, 3);
  const porch = new THREE.Mesh(porchGeo, mats.concreteCream);
  porch.position.set(5, 2, 7.5);
  group.add(porch);

  // Security Perimeter Fence
  const fenceGeo = new THREE.BoxGeometry(32, 2.2, 0.3);
  const fence = new THREE.Mesh(fenceGeo, mats.concreteCream);
  fence.position.set(0, 1.1, 19);
  group.add(fence);

  // Nameboard
  const boardTex = mats.createBoardTexture('ছাত্রী নিবাস (মেয়েদের হল)', "GIRL'S RESIDENTIAL HALL");
  const boardGeo = new THREE.PlaneGeometry(6.5, 1.4);
  const boardMat = new THREE.MeshBasicMaterial({ map: boardTex });
  const board = new THREE.Mesh(boardGeo, boardMat);
  board.position.set(5, 3.5, 9.05);
  group.add(board);
}

// 12. TEACHERS QUARTERS / DORMITORY
function createTeachersQuarters(group, mats) {
  // Cluster of 2 modern residential multi-unit flats
  [-8, 8].forEach((xPos) => {
    const qGeo = new THREE.BoxGeometry(12, 9, 10);
    const qMesh = new THREE.Mesh(qGeo, mats.concreteCream);
    qMesh.position.set(xPos, 4.5, 0);
    qMesh.castShadow = true;
    group.add(qMesh);

    // Pitched tile roof
    const roofGeo = new THREE.ConeGeometry(10, 2.5, 4);
    roofGeo.rotateY(Math.PI / 4);
    const roof = new THREE.Mesh(roofGeo, mats.roofTile);
    roof.position.set(xPos, 10.25, 0);
    group.add(roof);

    // Balconies
    const balGeo = new THREE.BoxGeometry(8, 0.3, 1.2);
    const bal = new THREE.Mesh(balGeo, mats.brickRed);
    bal.position.set(xPos, 4, 5.6);
    group.add(bal);

    // Windows
    const winGeo = new THREE.PlaneGeometry(8, 5);
    const win = new THREE.Mesh(winGeo, mats.glassWindow);
    win.position.set(xPos, 5, 5.05);
    group.add(win);
  });

  // Nameboard
  const boardTex = mats.createBoardTexture('শিক্ষক ও কর্মকর্তাদের আবাসন', 'TEACHERS & STAFF QUARTERS');
  const boardGeo = new THREE.PlaneGeometry(6, 1.3);
  const boardMat = new THREE.MeshBasicMaterial({ map: boardTex });
  const board = new THREE.Mesh(boardGeo, boardMat);
  board.position.set(0, 3, 6);
  group.add(board);
}

// 13. SHAHID ABU SAYED HALL (Male Student Dormitory)
function createAbuSayedHall(group, mats) {
  // Monumental U-shaped Multi-Wing Dormitory (4 Stories)
  const centerGeo = new THREE.BoxGeometry(32, 14, 12);
  const centerMesh = new THREE.Mesh(centerGeo, mats.brickRed);
  centerMesh.position.set(0, 7, 0);
  centerMesh.castShadow = true;
  group.add(centerMesh);

  // East & West Forward Wings creating the grand quadrangle
  const leftWingGeo = new THREE.BoxGeometry(10, 14, 16);
  const leftWing = new THREE.Mesh(leftWingGeo, mats.brickRed);
  leftWing.position.set(-16, 7, 8);
  leftWing.castShadow = true;
  group.add(leftWing);

  const rightWingGeo = new THREE.BoxGeometry(10, 14, 16);
  const rightWing = new THREE.Mesh(rightWingGeo, mats.brickRed);
  rightWing.position.set(16, 7, 8);
  rightWing.castShadow = true;
  group.add(rightWing);

  // Grand Entrance Hall & Portico
  const porticoGeo = new THREE.BoxGeometry(12, 6, 4);
  const portico = new THREE.Mesh(porticoGeo, mats.concreteCream);
  portico.position.set(0, 3, 8);
  portico.castShadow = true;
  group.add(portico);

  // Columns
  for (let x = -4; x <= 4; x += 2.6) {
    const colGeo = new THREE.CylinderGeometry(0.35, 0.35, 5.8, 12);
    const col = new THREE.Mesh(colGeo, mats.concreteCream);
    col.position.set(x, 3, 10.2);
    group.add(col);
  }

  // Windows array on central facade
  const winGeo = new THREE.PlaneGeometry(28, 9);
  const win = new THREE.Mesh(winGeo, mats.glassWindow);
  win.position.set(0, 8.5, 6.05);
  group.add(win);

  // Shahid Abu Sayed Memorial Plinth in Courtyard
  const plinthGeo = new THREE.CylinderGeometry(1.6, 2, 1.2, 16);
  const plinth = new THREE.Mesh(plinthGeo, mats.concreteDark);
  plinth.position.set(0, 0.6, 14);
  group.add(plinth);

  const monumentGeo = new THREE.BoxGeometry(0.6, 3.2, 1.8);
  const monMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.2, metalness: 0.8 });
  const monument = new THREE.Mesh(monumentGeo, monMat);
  monument.position.set(0, 2.5, 14);
  group.add(monument);

  // Memorial Flag
  const mastGeo = new THREE.CylinderGeometry(0.05, 0.05, 6);
  const mast = new THREE.Mesh(mastGeo, mats.ironBlack);
  mast.position.set(2.5, 3, 14);
  group.add(mast);

  // Nameboard
  const boardTex = mats.createBoardTexture('শহীদ আবু সাঈদ হল (ছাত্রাবাস)', 'SHAHID ABU SAYED HALL - RTEC');
  const boardGeo = new THREE.PlaneGeometry(9, 1.8);
  const boardMat = new THREE.MeshBasicMaterial({ map: boardTex });
  const board = new THREE.Mesh(boardGeo, boardMat);
  board.position.set(0, 5.5, 10.05);
  group.add(board);
}

// 14. PRINCIPAL'S QUARTER
function createPrincipalQuarter(group, mats) {
  // Colonial Executive Bungalow
  const houseGeo = new THREE.BoxGeometry(16, 5.5, 14);
  const house = new THREE.Mesh(houseGeo, mats.concreteCream);
  house.position.set(0, 2.75, 0);
  house.castShadow = true;
  group.add(house);

  // Red Clay Tiled Roof with Gables
  const roofGeo = new THREE.ConeGeometry(14, 3, 4);
  roofGeo.rotateY(Math.PI / 4);
  const roof = new THREE.Mesh(roofGeo, mats.roofTile);
  roof.position.set(0, 6.8, 0);
  group.add(roof);

  // Front Veranda / Portico
  const verandaGeo = new THREE.BoxGeometry(10, 3.2, 3);
  const veranda = new THREE.Mesh(verandaGeo, mats.concreteCream);
  veranda.position.set(0, 1.6, 8.5);
  group.add(veranda);

  // Classical balustrade railings
  const railGeo = new THREE.BoxGeometry(10, 0.8, 0.2);
  const rail = new THREE.Mesh(railGeo, mats.concreteCream);
  rail.position.set(0, 0.9, 10.05);
  group.add(rail);

  // Circular Private Garden Flower Bed
  const flowerBedGeo = new THREE.CylinderGeometry(3, 3.2, 0.4, 24);
  const flowerBedMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.9 });
  const flowerBed = new THREE.Mesh(flowerBedGeo, flowerBedMat);
  flowerBed.position.set(0, 0.2, 14);
  group.add(flowerBed);

  // Nameboard
  const boardTex = mats.createBoardTexture('অধ্যক্ষ মহোদয়ের বাসভবন', "PRINCIPAL'S RESIDENCE");
  const boardGeo = new THREE.PlaneGeometry(5.5, 1.2);
  const boardMat = new THREE.MeshBasicMaterial({ map: boardTex });
  const board = new THREE.Mesh(boardGeo, boardMat);
  board.position.set(0, 3.5, 10.05);
  group.add(board);
}

// 15. CENTRAL MOSQUE
function createMosque(group, mats) {
  // Main Mosque Prayer Hall
  const hallGeo = new THREE.BoxGeometry(18, 9, 18);
  const hall = new THREE.Mesh(hallGeo, mats.mosqueWhite);
  hall.position.set(0, 4.5, 0);
  hall.castShadow = true;
  group.add(hall);

  // Magnificent Emerald Dome on Roof
  const domeGeo = new THREE.SphereGeometry(5.5, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.55);
  const dome = new THREE.Mesh(domeGeo, mats.emeraldDome);
  dome.position.set(0, 9, 0);
  dome.castShadow = true;
  group.add(dome);

  // Golden Crescent Finial atop Dome
  const finialGeo = new THREE.CylinderGeometry(0.08, 0.08, 2.5);
  const finial = new THREE.Mesh(finialGeo, mats.goldMetal);
  finial.position.set(0, 15, 0);
  group.add(finial);

  const moonGeo = new THREE.TorusGeometry(0.5, 0.08, 8, 16);
  const moon = new THREE.Mesh(moonGeo, mats.goldMetal);
  moon.position.set(0, 16.2, 0);
  group.add(moon);

  // Tall Minaret Tower (Northeast Corner)
  const minaretGeo = new THREE.CylinderGeometry(1.2, 1.5, 20, 8);
  const minaret = new THREE.Mesh(minaretGeo, mats.mosqueWhite);
  minaret.position.set(11, 10, 11);
  minaret.castShadow = true;
  group.add(minaret);

  // Minaret Balcony
  const balconyGeo = new THREE.CylinderGeometry(1.8, 1.8, 0.6, 8);
  const balcony = new THREE.Mesh(balconyGeo, mats.concreteCream);
  balcony.position.set(11, 18.5, 11);
  group.add(balcony);

  // Minaret Mini Dome & Finial
  const mDomeGeo = new THREE.SphereGeometry(1.4, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.55);
  const mDome = new THREE.Mesh(mDomeGeo, mats.emeraldDome);
  mDome.position.set(11, 19.8, 11);
  group.add(mDome);

  // Arched Islamic Window Panels
  const winGeo = new THREE.PlaneGeometry(12, 5);
  const winMat = new THREE.MeshStandardMaterial({
    color: 0x065f46,
    roughness: 0.3,
    metalness: 0.2
  });
  const win = new THREE.Mesh(winGeo, winMat);
  win.position.set(0, 4.5, 9.05);
  group.add(win);

  // Marble Ablution (Wudu) Fountain in courtyard
  const wuduGeo = new THREE.CylinderGeometry(3.5, 3.5, 0.6, 16);
  const wudu = new THREE.Mesh(wuduGeo, mats.concreteCream);
  wudu.position.set(0, 0.3, 14);
  group.add(wudu);

  // Nameboard
  const boardTex = mats.createBoardTexture('ক্যাম্পাস জামে মসজিদ', 'CENTRAL CAMPUS MOSQUE');
  const boardGeo = new THREE.PlaneGeometry(6, 1.3);
  const boardMat = new THREE.MeshBasicMaterial({ map: boardTex });
  const board = new THREE.Mesh(boardGeo, boardMat);
  board.position.set(0, 8, 9.05);
  group.add(board);
}

// Fallback for any extra buildings
function createGenericBuilding(group, mats, landmark) {
  const geo = new THREE.BoxGeometry(14, 8, 10);
  const mesh = new THREE.Mesh(geo, mats.brickRed);
  mesh.position.set(0, 4, 0);
  mesh.castShadow = true;
  group.add(mesh);
}
