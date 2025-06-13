import * as THREE from 'https://unpkg.com/three@0.177.0/build/three.module.js';
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

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

function createClouds(){
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    const textureLoader = new THREE.TextureLoader();
    const opacities = [];
    const sprite = textureLoader.load('./Cloud.png');

    for (let i = 0; i < 100; i++){
        const x = Math.random() * 100-50;
        const y = Math.random() * 20 + 10;
        const z = Math.random() * 100 - 50;
        vertices.push(x,y,z);

        opacities.push(Math.random() * 0.4 + 0.2);
    }
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('opacity', new THREE.Float32BufferAttribute(opacities, 1))

    const material = new THREE.PointsMaterial({
        size: 5,
        sizeAttenuation: true,
        map: sprite,
        alphaTest: 0.1,
        transparent: true,
        opacity: 1.0,
        color: 0xffffff
    });
    const clouds = new THREE.Points(geometry, material);
    return clouds;
    
}
const clouds = createClouds();
scene.add(clouds);

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