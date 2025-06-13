import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
const loader = new GLTFLoader();
const renderer = new THREE.WebGLRenderer();

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);
const gridHelper = new THREE.GridHelper(100, 10);
scene.add(gridHelper);

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
const defaultSettings = {
    enableDamping: true,
    dampingFactor: 0.05,
    rotateSpeed: 0.5,
    maxPolarAngle: Math.PI / 1.8,
    minPolarAngle: Math.PI / 2.5,
    enableZoom: false,
    enablePan: false,
    minAzimuthAngle: -Math.PI / 4,
    maxAzimuthAngle: Math.PI / 4
}

const devSettings = {
    enableDamping: true,
    dampingFactor: 0.05,
    rotateSpeed: 0.5,
    enableZoom: true,
    enablePan: true,
    minDistance: 2,
    maxDistance: 100,
    minPolarAngle: 0,
    maxPolarAngle: Math.PI,
    minAzimuthAngle: -Infinity,
    maxAzimuthAngle: Infinity
};
function toggleControlMode(isDev = false){
    const settings = isDev ? devSettings : defaultSettings;
    Object.assign(controls, settings);
}
toggleControlMode(false);

const toonMaterial = new THREE.MeshToonMaterial({
    color: 0xf0f8ff,     
    emissive: 0x406f9c,   
    emissiveIntensity: 1,
});
const toonMaterial2 = new THREE.MeshToonMaterial({
    color: 0xf0f8ff,
    emissive: 0xf0f8ff,
    emissiveIntensity: 0.38
});

loader.load('./Cloud1.glb',
    function(gltf){
        const model = gltf.scene;
        model.scale.set(1,1,1);
        model.position.set(140,40,-180);
        model.traverse((child) => {
            if (child.isMesh){
                child.material = toonMaterial;
            }
        })
        scene.add(model);

        console.log('Model loaded successfully');
    },
    function (xhr){
        console.log((xhr.loaded/xhr.total * 100) + '% loaded');
    },
    function (error){
        console.error('An error occured loading the model:', error);
    }
)
loader.load('./Cloud2.glb', 
    function(gltf){
        const model = gltf.scene;
        model.scale.set(1,1,1);
        model.position.set(-140, 30, -180);
        model.traverse((child) => {
            if(child.isMesh){
                child.material = toonMaterial;
            }
        })
        scene.add(model);
    }
)
loader.load('./Cloud3.glb',
    function(gltf){
        const model = gltf.scene;
        model.scale.set(1,1,1);
        model.position.set(-80, -30, -100);
        model.traverse((child) => {
            if(child.isMesh){
                child.material = toonMaterial2;
                child.material.transparent = true;
                child.material.opacity = 0.9;
            }
        })
        scene.add(model);
    }
)


const vertexShader = `
 varying vec3 vWorldPosition;
 void main() {
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); 
 }`;

const fragmentShader = `
varying vec3 vWorldPosition;
void main() {
    vec3 topColor = vec3(0.173, 0.498, 0.757); //Light blue
    vec3 bottomColor = vec3(0.702, 0.953, 1); //Dark blue
    float h = normalize(vWorldPosition).y;
    gl_FragColor = vec4(mix(bottomColor, topColor, max(h + 0.2, 0.0)), 1.0);
}`;


const skyGeo = new THREE.SphereGeometry(300, 32, 32);
const skyMat = new THREE.ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    side: THREE.BackSide
});

const sky = new THREE.Mesh(skyGeo, skyMat);
scene.add(sky);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(0,1,1);
scene.add(directionalLight);

const mainLight = new THREE.DirectionalLight(0xffffff, 1);
mainLight.position.set(0,1,0);
scene.add(mainLight);

const fillLight = new THREE.DirectionalLight(0xffffff,0.5);
fillLight.position.set(-1,0.5,-1);
scene.add(fillLight);



camera.position.set(0,0,0);

function animate(){
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();

window.addEventListener('keydown', (event) => {
    if(event.key.toLowerCase() === 'd'){
        toggleControlMode(true);
        console.log('Developer mode enabled');
    }
    if(event.key.toLowerCase() === 's'){
        toggleControlMode(false);
        console.log('Subtle movement mode enabled');
    }
})

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
})