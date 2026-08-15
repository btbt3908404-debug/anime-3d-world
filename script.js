import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.178.0/build/three.module.js";

const scene = new THREE.Scene();

scene.fog = new THREE.Fog(0x050816, 8, 35);

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);

camera.position.set(0, 3.2, 9);

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true
});

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);

renderer.domElement.style.position = "fixed";
renderer.domElement.style.inset = "0";
renderer.domElement.style.zIndex = "0";
renderer.domElement.style.pointerEvents = "none";

document.body.prepend(renderer.domElement);


/* KEEP PORTFOLIO ABOVE 3D */

Array.from(document.body.children).forEach((element) => {
  if (element !== renderer.domElement) {
    element.style.position =
      element.tagName === "NAV" ? "fixed" : "relative";

    element.style.zIndex =
      element.tagName === "NAV" ? "100" : "1";
  }
});


/* LIGHT */

const ambientLight = new THREE.AmbientLight(
  0x9bbcff,
  2
);

scene.add(ambientLight);

const mainLight = new THREE.DirectionalLight(
  0x66ccff,
  4
);

mainLight.position.set(-5, 8, 6);
scene.add(mainLight);


/* MOON */

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(2.2, 48, 48),
  new THREE.MeshStandardMaterial({
    color: 0xddeaff,
    emissive: 0x5577aa,
    emissiveIntensity: 1.5
  })
);

moon.position.set(-5, 6, -8);
scene.add(moon);


/* STARS */

const starGeometry = new THREE.BufferGeometry();

const starPositions = [];

for (let i = 0; i < 1200; i++) {

  starPositions.push(
    (Math.random() - 0.5) * 60,
    Math.random() * 35,
    -Math.random() * 45
  );

}

starGeometry.setAttribute(
  "position",
  new THREE.Float32BufferAttribute(
    starPositions,
    3
  )
);

const stars = new THREE.Points(
  starGeometry,
  new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.07
  })
);

scene.add(stars);


/* ANIME CHARACTER */

const character = new THREE.Group();

character.position.set(0, 0, 0);

scene.add(character);


/* BODY */

const body = new THREE.Mesh(
  new THREE.CapsuleGeometry(
    0.65,
    1.5,
    8,
    16
  ),
  new THREE.MeshStandardMaterial({
    color: 0x111827
  })
);

body.position.y = 2.1;

character.add(body);


/* HEAD */

const head = new THREE.Mesh(
  new THREE.SphereGeometry(
    0.72,
    32,
    32
  ),
  new THREE.MeshStandardMaterial({
    color: 0xffd1b8
  })
);

head.position.y = 3.75;

character.add(head);


/* HAIR */

const hair = new THREE.Mesh(
  new THREE.SphereGeometry(
    0.78,
    32,
    32
  ),
  new THREE.MeshStandardMaterial({
    color: 0x101522
  })
);

hair.position.set(
  0,
  4.05,
  -0.08
);

hair.scale.y = 0.75;

character.add(hair);


/* EYES */

function createEye(x) {

  const eye = new THREE.Mesh(
    new THREE.SphereGeometry(
      0.11,
      16,
      16
    ),
    new THREE.MeshBasicMaterial({
      color: 0x66eaff
    })
  );

  eye.position.set(
    x,
    3.78,
    0.66
  );

  character.add(eye);
}

createEye(-0.23);
createEye(0.23);


/* SWORD */

const sword = new THREE.Group();


const blade = new THREE.Mesh(
  new THREE.BoxGeometry(
    0.14,
    2.8,
    0.22
  ),
  new THREE.MeshStandardMaterial({
    color: 0xdff7ff,
    emissive: 0x55ccff,
    emissiveIntensity: 2
  })
);

blade.position.y = 1.35;

sword.add(blade);


const handle = new THREE.Mesh(
  new THREE.CylinderGeometry(
    0.08,
    0.08,
    0.9,
    16
  ),
  new THREE.MeshStandardMaterial({
    color: 0x553322
  })
);

handle.position.y = -0.45;

sword.add(handle);


sword.position.set(
  1,
  2.1,
  0
);

sword.rotation.z = -0.6;

character.add(sword);


/* GROUND */

const ground = new THREE.Mesh(
  new THREE.CircleGeometry(
    20,
    64
  ),
  new THREE.MeshStandardMaterial({
    color: 0x07111f,
    roughness: 1
  })
);

ground.rotation.x = -Math.PI / 2;

ground.position.y = 0;

scene.add(ground);


/* MOUSE / TOUCH CAMERA */

let targetX = 0;
let targetY = 0;

window.addEventListener(
  "pointermove",
  (event) => {

    targetX =
      (event.clientX /
        window.innerWidth) *
        2 -
      1;

    targetY =
      (event.clientY /
        window.innerHeight) *
        2 -
      1;

  }
);


/* ANIMATION */

const clock = new THREE.Clock();

function animate() {

  requestAnimationFrame(animate);

  const time =
    clock.getElapsedTime();


  /* FLOATING CHARACTER */

  character.position.y =
    Math.sin(time * 2) * 0.08;


  /* CHARACTER ROTATION */

  character.rotation.y =
    Math.sin(time * 0.7) * 0.18;


  /* SWORD MOVEMENT */

  sword.rotation.z =
    -0.6 +
    Math.sin(time * 2.5) * 0.08;


  /* HAIR MOVEMENT */

  hair.rotation.y =
    Math.sin(time * 1.5) * 0.05;


  /* STAR MOVEMENT */

  stars.rotation.y =
    time * 0.004;


  /* MOON ROTATION */

  moon.rotation.y =
    time * 0.05;


  /* CAMERA MOVEMENT */

  camera.position.x +=
    (
      targetX * 1.5 -
      camera.position.x
    ) * 0.02;

  camera.position.y +=
    (
      3.2 -
      targetY * 0.5 -
      camera.position.y
    ) * 0.02;


  camera.lookAt(
    0,
    2.5,
    0
  );


  renderer.render(
    scene,
    camera
  );
}

animate();


/* RESPONSIVE */

window.addEventListener(
  "resize",
  () => {

    camera.aspect =
      window.innerWidth /
      window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
      window.innerWidth,
      window.innerHeight
    );

  }
);
