// Import core modules
import * as THREE from './lib/three.module.js';
import { OrbitControls } from './lib/OrbitControls.js';
import { GLTFLoader } from './lib/GLTFLoader.js';

const scene = new THREE.Scene();

// Skybox
const loader = new THREE.CubeTextureLoader();
const skybox = loader.load([
  './skybox/px.jpg', './skybox/nx.jpg',
  './skybox/py.jpg', './skybox/ny.jpg',
  './skybox/pz.jpg', './skybox/nz.jpg'
]);
scene.background = skybox;

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 5, 10);

// Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);

// Lighting
scene.add(new THREE.AmbientLight(0xffffff, 2));
const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
keyLight.position.set(10, 20, 10);
scene.add(keyLight);
const fillLight = new THREE.DirectionalLight(0xffffff, 0.8);
fillLight.position.set(-5, -10, 5);
scene.add(fillLight);

// Stars
const textureLoader = new THREE.TextureLoader();
const starTexture = textureLoader.load('./textures/star.jpg');
for (let i = 0; i < 100; i++) {
  const mat = new THREE.MeshBasicMaterial({ map: starTexture, transparent: true });
  const geo = new THREE.PlaneGeometry(0.5, 0.5);
  const star = new THREE.Mesh(geo, mat);
  star.position.set((Math.random() - 0.5) * 100, (Math.random() - 0.5) * 100, (Math.random() - 0.5) * 100);
  star.lookAt(camera.position);
  scene.add(star);
}

// Meteor Shower
const meteorGroup = new THREE.Group();
scene.add(meteorGroup);
function spawnMeteor() {
  const geo = new THREE.SphereGeometry(0.05, 6, 6);
  const mat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const meteor = new THREE.Mesh(geo, mat);
  meteor.position.set(Math.random() * 20 - 10, 10, Math.random() * 20 - 10);
  meteor.velocity = new THREE.Vector3(0, -0.2, 0);
  meteorGroup.add(meteor);
}

// Swirl Galaxy (stationary)
let swirl = null;
const gltfLoader = new GLTFLoader();
gltfLoader.load('./models/swirl.glb', (gltf) => {
  swirl = gltf.scene;
  swirl.scale.set(10, 10, 10);
  swirl.position.set(0, -20, -50);
  swirl.rotation.x = Math.PI / 2;
  scene.add(swirl);
});

// Boom Planet (opposite side)
let boomPlanet = null;
gltfLoader.load('./models/boom.glb', (gltf) => {
  boomPlanet = gltf.scene;
  boomPlanet.scale.set(1.5, 1.5, 1.5);
  boomPlanet.position.set(0, 5, 50);
  scene.add(boomPlanet);
});

// Comets + Trails
const cometCount = 3;
const comets = [];
const cometAngles = [];
const cometParams = [];
for (let i = 0; i < cometCount; i++) {
  const comet = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), new THREE.MeshBasicMaterial({ color: 0xffffff }));
  scene.add(comet);

  const trailMat = new THREE.LineBasicMaterial({ color: 0xff8888 });
  const trailGeo = new THREE.BufferGeometry().setFromPoints([]);
  const trail = new THREE.Line(trailGeo, trailMat);
  trail.history = [];
  scene.add(trail);

  comets.push({ comet, trail });
  cometAngles.push(i * Math.PI / 2);
  cometParams.push({ radius: 12 + i * 3, speed: 0.01 + i * 0.005 });
}

// Rocket
let rocket = null;
let rocketTarget = null;
const rocketSpeed = 0.1;
const rocketQueue = [];
const rocketLight = new THREE.PointLight(0xffddaa, 0.6, 6);
scene.add(rocketLight);
gltfLoader.load('./models/rocket.glb', (gltf) => {
  rocket = gltf.scene;
  rocket.scale.set(0.2, 0.2, 0.2);
  rocket.position.set(0, 0, 0);
  rocket.traverse((child) => {
    if (child.isMesh && child.material) {
      child.material.emissive = new THREE.Color(0xffffff);
      child.material.emissiveIntensity = 0;
    }
  });
  scene.add(rocket);
});

// Satellite
let satellite = null;
const satelliteLight = new THREE.PointLight(0x6699ff, 0.5, 5);
scene.add(satelliteLight);
gltfLoader.load('./models/satellite.glb', (gltf) => {
  satellite = gltf.scene;
  satellite.scale.set(0.5, 0.5, 0.5);
  satellite.traverse((child) => {
    if (child.isMesh && child.material) {
      child.material.emissive = new THREE.Color(0xffffff);
      child.material.emissiveIntensity = 0;
    }
  });
  scene.add(satellite);
});

// Solar system
let solarSystem = null;
gltfLoader.load('./models/solar_system.glb', (gltf) => {
  solarSystem = gltf.scene;
  solarSystem.scale.set(3, 3, 3);
  scene.add(solarSystem);
});

// Mouse interaction
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
window.addEventListener('click', (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  const point = raycaster.ray.origin.clone().add(raycaster.ray.direction.clone().multiplyScalar(20));
  rocketQueue.push(point);
});

// Animate
function animate() {
  requestAnimationFrame(animate);

  if (solarSystem) solarSystem.rotation.y += 0.001;
  if (boomPlanet) boomPlanet.rotation.y += 0.005;

  if (satellite) {
    satellite.rotation.y += 0.01;
    const t = Date.now() * 0.001;
    satellite.position.set(Math.sin(t) * 3, 2, Math.cos(t) * 3);
    satelliteLight.position.copy(satellite.position);
  }

  comets.forEach(({ comet, trail }, i) => {
    cometAngles[i] += cometParams[i].speed;
    const angle = cometAngles[i];
    const r = cometParams[i].radius;
    const pos = new THREE.Vector3(Math.cos(angle) * r, Math.sin(angle * 0.5) * 2 + 2, Math.sin(angle) * r);
    comet.position.copy(pos);
    trail.history.push(pos.clone());
    if (trail.history.length > 60) trail.history.shift();
    trail.geometry.setFromPoints(trail.history);
  });

  if (rocket && (rocketTarget || rocketQueue.length > 0)) {
    if (!rocketTarget && rocketQueue.length > 0) rocketTarget = rocketQueue.shift();
    if (rocketTarget) {
      const dir = rocketTarget.clone().sub(rocket.position);
      const dist = dir.length();
      if (dist > 0.1) {
        dir.normalize();
        rocket.position.add(dir.multiplyScalar(rocketSpeed));
        rocket.lookAt(rocketTarget);
        rocketLight.position.copy(rocket.position);
      } else {
        rocketTarget = null;
      }
    }
  }

  if (Math.random() < 0.05) spawnMeteor();
  meteorGroup.children.forEach((m) => m.position.add(m.velocity));
  meteorGroup.children = meteorGroup.children.filter(m => m.position.y > -10);

  controls.update();
  renderer.render(scene, camera);
}

animate();
