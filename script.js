import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.178.0/build/three.module.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.178.0/examples/jsm/controls/OrbitControls.js";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x050816);
scene.fog = new THREE.FogExp2(0x050816, 0.025);

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);

camera.position.set(0, 3, 8);

const renderer = new THREE.WebGLRenderer({
  antialias: true
});

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);

renderer.domElement.style.position = "fixed";
renderer.domElement.style.inset = "0";
renderer.domElement.style.zIndex = "-1";

document.body.prepend(renderer.domElement);


/* LIGHT */

const ambient = new THREE.AmbientLight(0x9bbcff, 1.5);
scene.add(ambient);

const moonLight = new THREE.DirectionalLight(0x9fdcff, 3);
moonLight.position.set(-5, 8, 5);
scene.add(moonLight);


/* MOON */

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(2, 48, 48),
  new THREE.MeshStandardMaterial({
    color: 0xddeaff,
    emissive: 0x5577aa,
    emissiveIntensity: 1.5
  })
);

moon.position.set(-5, 6, -8);
scene.add(moon);


/* GROUND */

const ground = new THREE.Mesh(
  new THREE.CircleGeometry(30, 64),
  new THREE.MeshStandardMaterial({
    color: 0x07111f,
    roughness: 1
  })
);

ground.rotation.x = -Math.PI / 2;
scene.add(ground);


/* STARS */

const starGeometry = new THREE.BufferGeometry();
const stars = [];

for (let i = 0; i < 1200; i++) {
  stars.push(
    (Math.random() - 0.5) * 70,
    Math.random() * 35,
    -Math.random() * 45
  );
}

starGeometry.setAttribute(
  "position",
  new THREE.Float32BufferAttribute(stars, 3)
);

const starField = new THREE.Points(
  starGeometry,
  new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.06
  })
);

scene.add(starField);


/* ANIME CHARACTER */

const character = new THREE.Group();
character.position.y = 0;
scene.add(character);


/* BODY */

const body = new THREE.Mesh(
  new THREE.CapsuleGeometry(0.65, 1.5, 8, 16),
  new THREE.MeshStandardMaterial({
    color: 0x111827
  })
);

body.position.y = 2.1;
character.add(body);


/* HEAD */

const head = new THREE.Mesh(
  new THREE.SphereGeometry(0.7, 32, 32),
  new THREE.MeshStandardMaterial({
    color: 0xffd1b8
  })
);

head.position.y = 3.7;
character.add(head);


/* HAIR */

const hair = new THREE.Mesh(
  new THREE.SphereGeometry(0.76, 32, 32),
  new THREE.MeshStandardMaterial({
    color: 0x111827
  })
);

hair.position.set(0, 3.98, -0.05);
hair.scale.y = 0.75;
character.add(hair);


/* EYES */

function eye(x) {
  const e = new THREE.Mesh(
    new THREE.SphereGeometry(0.1, 16, 16),
    new THREE.MeshBasicMaterial({
      color: 0x66eaff
    })
  );

  e.position.set(x, 3.78, 0.65);
  character.add(e);
}

eye(-0.23);
eye(0.23);


/* SWORD */

const sword = new THREE.Group();

const blade = new THREE.Mesh(
  new THREE.BoxGeometry(0.12, 2.7, 0.25),
  new THREE.MeshStandardMaterial({
    color: 0xdff7ff,
    emissive: 0x55ccff,
    emissiveIntensity: 2
  })
);

blade.position.y = 1.3;
sword.add(blade);

const handle = new THREE.Mesh(
  new THREE.CylinderGeometry(0.08, 0.08, 0.9, 16),
  new THREE.MeshStandardMaterial({
    color: 0x553322
  })
);

handle.position.y = -0.45;
sword.add(handle);

sword.position.set(0.9, 2.1, 0);
sword.rotation.z = -0.6;

character.add(sword);


/* CONTROLS */

const controls = new OrbitControls(
  camera,
  renderer.domElement
);

controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = 5;
controls.maxDistance = 14;
controls.target.set(0, 2.5, 0);


/* MOUSE EFFECT */

let mouseX = 0;
let mouseY = 0;

window.addEventListener("pointermove", (event) => {

  mouseX =
    (event.clientX / window.innerWidth) * 2 - 1;

  mouseY =
    (event.clientY / window.innerHeight) * 2 - 1;

});


/* ANIMATION */

const clock = new THREE.Clock();

function animate() {

  requestAnimationFrame(animate);

  const time = clock.getElapsedTime();

  character.position.y =
    Math.sin(time * 2) * 0.04;

  sword.rotation.z =
    -0.6 + Math.sin(time * 2.5) * 0.12;

  hair.rotation.y =
    Math.sin(time * 1.5) * 0.05;

  starField.rotation.y =
    time * 0.003;

  camera.position.x +=
    (mouseX * 1.2 - camera.position.x) * 0.02;

  camera.position.y +=
    (3 - mouseY * 0.5 - camera.position.y) * 0.02;

  controls.update();

  renderer.render(scene, camera);

}

animate();


/* RESIZE */

window.addEventListener("resize", () => {

  camera.aspect =
    window.innerWidth / window.innerHeight;

  camera.updateProjectionMatrix();

  renderer.setSize(
    window.innerWidth,
    window.innerHeight
  );

});
