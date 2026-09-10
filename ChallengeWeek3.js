//  Name: Morgan Lincicum
// CPSC444
// Week 3 Challenge

import * as THREE from "https://unpkg.com/three@0.179.1/build/three.module.js";
import { OrbitControls } from "https://unpkg.com/three@0.179.1/examples/jsm/controls/OrbitControls.js";

const container = document.getElementById("scene-container") || document.body;
const pressedKeys = new Set();
const cameraKeys = new Set(["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "w", "a", "s", "d", "o", "p"]);

window.addEventListener("keydown", (event) => {
    if (cameraKeys.has(event.key)) {
        pressedKeys.add(event.key);
        event.preventDefault();

        if (event.key === "ArrowUp" || event.key === "ArrowDown") {
            zoomCamera(event.key === "ArrowUp" ? -1 : 1);
        }

        if (event.key === "p" || event.key === "o") {
            camera = (event.key === "p" ? pCamera : oCamera);
            controls = (event.key === "p" ? pControls : oControls);
            refreshCamera();

            var text = (event.key === "p" ? "Perspective" : "Orthographic");
            document.getElementById("currentCamera").innerHTML = text;
        }
    }
});

window.addEventListener("keyup", (event) => {
    pressedKeys.delete(event.key);
});

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

const pCamera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
pCamera.position.set(-3, 5, 20);


const oCamera =
    new THREE.OrthographicCamera(
    -15,
     15,
     10,
    -10,
     0.1,
     100
);
oCamera.position.set(-3, 5, 20);

var camera = oCamera;

function refreshCamera(){
    const cameraOffset = camera.position.clone().sub(controls.target);
    const zoomDistance = THREE.MathUtils.clamp(
        cameraOffset.length(),
        minZoomDistance,
        maxZoomDistance
    );

    camera.position.copy(controls.target).add(cameraOffset.normalize().multiplyScalar(zoomDistance));
    controls.update();
    renderer.render(scene, camera);

    resizeRenderer();

    renderer.render(scene, camera);
}

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(Math.min(window.innerWidth * 0.9, 900), 600);
renderer.domElement.style.display = "block";
renderer.domElement.style.marginTop = "1rem";
container.appendChild(renderer.domElement);

const pControls = new OrbitControls(pCamera, renderer.domElement);
pControls.enableDamping = true;
pControls.target.set(0, 1, 0);

const oControls = new OrbitControls(oCamera, renderer.domElement);
oControls.enableDamping = true;
oControls.target.set(0, 1, 0);

var controls = oControls;

const zoomStep = 1;
const minZoomDistance = 4;
const maxZoomDistance = 40;

function zoomCamera(direction) {
    const cameraOffset = camera.position.clone().sub(controls.target);
    const zoomDistance = THREE.MathUtils.clamp(
        cameraOffset.length() + direction * zoomStep,
        minZoomDistance,
        maxZoomDistance
    );

    camera.position.copy(controls.target).add(cameraOffset.normalize().multiplyScalar(zoomDistance));
    controls.update();
    renderer.render(scene, camera);
}

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 5);
scene.add(directionalLight);

const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(40, 40),
    new THREE.MeshStandardMaterial({ color: 0x99cc00 })
);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

const cubes = [];
const cubeColors = [0x996633, 0x996633, 0x996633, 0x996633, 0x006600, 0x999966, 0x999966];

const cubeSizes = [
    [2, 7, 2], 
    [5, 1, 1], 
    [0.5, 0.5, 3], 
    [0.5, 0.5, 5],
    [10, 2, 10], 
    [4, 2, 2],
    [2, 1, 2]
];

const positions = [
[0, 3.5, 0],
[2.5, 5, 0],
[4.5, 5, 2],
[-1, 4, -1.5],
[0, 7, 0],
[-6, 1, 10],
[5, 1, -6]
];

positions.forEach(([x, y, z], index) => {
    const cube = new THREE.Mesh(
        new THREE.BoxGeometry(cubeSizes[index][0], cubeSizes[index][1], cubeSizes[index][2]),
        new THREE.MeshStandardMaterial({ color: cubeColors[index] })
    );
    cube.position.set(x, y, z);
    scene.add(cube);
    cubes.push(cube);
});

const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(1.5, 32, 32),
    new THREE.MeshStandardMaterial({ color: 0xff6600 })
);
sphere.position.set(15, 15, -20);
scene.add(sphere);

function resizeRenderer() {
    const width = Math.min(window.innerWidth * 0.9, 900);
    const height = 600;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
}

window.addEventListener("resize", resizeRenderer);
resizeRenderer();
renderer.render(scene, camera);

