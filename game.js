import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const loader = new GLTFLoader();

loader.load('./Cloud1.glb',
    function(gltf){
        const model = gltf.scene;
        model.scale.set(1,1,1);
        model.position.set(0,0,0)
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

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

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
    gl_FragColor = vec4(mix(bottomColor, topColor, max(h + 0.5, 0.0)), 1.0);
}`;


const skyGeo = new THREE.SphereGeometry(100, 32, 32);
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

camera.position.z = 5;

function animate(){
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
})