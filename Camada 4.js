// Configuração inicial do Three.js
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("webgl-canvas") });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Configuração inicial da câmera
camera.position.z = 30; // Ajuste do zoom para uma visão mais ampla

// Luzes
const ambientLight = new THREE.AmbientLight(0x404040, 1.5); // Luz ambiente suave
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0x00ffff, 2, 50); // Luz pontual para efeito tecnológico
pointLight.position.set(5, 5, 5);
scene.add(pointLight);

// Função para criar um cubo tecnológico translúcido
function createTechCube(size) {
  const geometry = new THREE.BoxGeometry(size, size, size);

  // Material translúcido com emissividade para brilho
  const material = new THREE.MeshStandardMaterial({
    color: 0x0000ff, // Azul tecnológico
    emissive: 0x00ffff, // Brilho ciano
    emissiveIntensity: 0.5,
    metalness: 0.8,
    roughness: 0.2,
    transparent: true,
    opacity: 0.5, // Translucidez
  });

  const cube = new THREE.Mesh(geometry, material);

  // Adiciona linhas de grade para efeito tecnológico
  const edges = new THREE.EdgesGeometry(geometry);
  const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
  const wireframe = new THREE.LineSegments(edges, lineMaterial);
  cube.add(wireframe);

  return cube;
}

// Função para criar códigos translúcidos (pequenos cubos)
function createTranslucentCodes(num, size) {
  const codesGroup = new THREE.Group();
  const geometry = new THREE.BoxGeometry(size, size, size);
  const material = new THREE.MeshBasicMaterial({
    color: 0x00ff00, // Verde para os códigos
    transparent: true,
    opacity: 0.7, // Translucidez dos códigos
  });

  for (let i = 0; i < num; i++) {
    const codeCube = new THREE.Mesh(geometry, material);
    codeCube.position.set(
      Math.random() * 4 - 2, // Posição aleatória x
      Math.random() * 4 - 2, // Posição aleatória y
      Math.random() * 4 - 2  // Posição aleatória z
    );
    codesGroup.add(codeCube);
  }

  return codesGroup;
}

// Função para criar partículas translúcidas (letras, números e pequenos cubos)
function createFloatingParticles(num, size) {
  const particlesGroup = new THREE.Group();

  // Material para as partículas
  const material = new THREE.MeshBasicMaterial({
    color: 0x00ff00, // Verde brilhante
    transparent: true,
    opacity: 0.7,
  });

  // Geometria para pequenos cubos
  const cubeGeometry = new THREE.BoxGeometry(size, size, size);

  // Criando partículas de cubos
  for (let i = 0; i < num / 2; i++) {
    const particle = new THREE.Mesh(cubeGeometry, material);
    particle.position.set(
      Math.random() * 4 - 2, // Posição aleatória x
      Math.random() * 4 - 2, // Posição aleatória y
      Math.random() * 4 - 2  // Posição aleatória z
    );
    particlesGroup.add(particle);
  }

  // Criando partículas de letras e números
  const fontLoader = new THREE.FontLoader();
  fontLoader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', (font) => {
    const textMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ff00, // Verde brilhante
      transparent: true,
      opacity: 0.7,
    });

    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    for (let i = 0; i < num / 2; i++) {
      const char = characters.charAt(Math.floor(Math.random() * characters.length));
      const textGeometry = new THREE.TextGeometry(char, {
        font: font,
        size: size,
        height: 0.1,
      });

      const textMesh = new THREE.Mesh(textGeometry, textMaterial);
      textMesh.position.set(
        Math.random() * 4 - 2, // Posição aleatória x
        Math.random() * 4 - 2, // Posição aleatória y
        Math.random() * 4 - 2  // Posição aleatória z
      );
      particlesGroup.add(textMesh);
    }
  });

  return particlesGroup;
}

// Criando o cubo tecnológico
const techCube = createTechCube(10);
scene.add(techCube);

// Adiciona códigos translúcidos ao cubo
const translucentCodes = createTranslucentCodes(30, 0.5);
techCube.add(translucentCodes);

// Adiciona partículas flutuantes ao cubo
const floatingParticles = createFloatingParticles(50, 0.3);
techCube.add(floatingParticles);

// Função para criar cubos menores a partir do cubo grande
function createSmallCubesFromTechCube(parentCube, size) {
  const smallCubes = [];
  const offsets = [
    { x: -1.5, y: 1.5, z: 0 }, // Cubo superior esquerdo
    { x: 1.5, y: 1.5, z: 0 },  // Cubo superior direito
    { x: -1.5, y: -1.5, z: 0 }, // Cubo inferior esquerdo
    { x: 1.5, y: -1.5, z: 0 },  // Cubo inferior direito
    { x: 0, y: 0, z: 0 },       // Cubo central
  ];

  offsets.forEach((offset) => {
    const smallCube = createTechCube(size);
    const smallCodes = createTranslucentCodes(10, 0.2); // Adiciona códigos translúcidos aos cubos menores
    smallCube.add(smallCodes);

    const smallParticles = createFloatingParticles(20, 0.1); // Adiciona partículas flutuantes aos cubos menores
    smallCube.add(smallParticles);

    smallCube.position.set(
      parentCube.position.x + offset.x * size,
      parentCube.position.y + offset.y * size,
      parentCube.position.z + offset.z * size
    );
    smallCubes.push(smallCube);
    scene.add(smallCube);
  });

  scene.remove(parentCube); // Remove o cubo grande
  return smallCubes;
}

// Função para juntar os cubos menores em um cubo grande
function recombineSmallCubes(smallCubes, size) {
  const newCube = createTechCube(size);
  const newCodes = createTranslucentCodes(30, 0.5); // Adiciona códigos translúcidos ao novo cubo grande
  newCube.add(newCodes);

  const newParticles = createFloatingParticles(50, 0.3); // Adiciona partículas flutuantes ao novo cubo grande
  newCube.add(newParticles);

  // Calcula a posição média dos cubos menores para centralizar o novo cubo
  let avgX = 0, avgY = 0, avgZ = 0;
  smallCubes.forEach((cube) => {
    avgX += cube.position.x;
    avgY += cube.position.y;
    avgZ += cube.position.z;
    scene.remove(cube); // Remove os cubos menores
  });
  avgX /= smallCubes.length;
  avgY /= smallCubes.length;
  avgZ /= smallCubes.length;

  newCube.position.set(avgX, avgY, avgZ);
  scene.add(newCube);

  return newCube;
}

// Função para mover os cubos pequenos para fora da tela
function sendSmallCubes(smallCubes) {
  smallCubes.forEach((cube) => {
    cube.position.x += 0.2; // Movimento para a direita
    cube.rotation.x += 0.02;
    cube.rotation.y += 0.02;
  });
}

// Função para verificar se todos os cubos pequenos saíram da tela
function allCubesOutOfView(smallCubes) {
  return smallCubes.every((cube) => cube.position.x > 20); // Considera fora da tela se x > 20
}

// Função para reiniciar o ciclo com um novo cubo grande
function resetCycle() {
  // Remove os cubos pequenos restantes
  smallCubes.forEach((cube) => scene.remove(cube));
  smallCubes = [];
  isFragmented = false;
  isSending = false;

  // Cria um novo cubo grande entrando pela esquerda
  currentCube = createTechCube(10);
  currentCube.position.x = -20; // Começa fora da tela, à esquerda
  const newCodes = createTranslucentCodes(30, 0.5);
  const newParticles = createFloatingParticles(50, 0.3);
  currentCube.add(newCodes);
  currentCube.add(newParticles);
  scene.add(currentCube);

  // Anima o cubo grande entrando na tela
  const interval = setInterval(() => {
    currentCube.position.x += 0.5; // Movimento para a direita
    if (currentCube.position.x >= 0) {
      clearInterval(interval); // Para o movimento quando o cubo estiver centralizado
      startCycle(); // Reinicia o ciclo
    }
  }, 16); // Atualiza a posição a cada 16ms (~60fps)
}

// Ciclo de fragmentação e envio contínuo
let isFragmented = false;
let isSending = false;
let currentCube = techCube;
let smallCubes = [];

function startCycle() {
  // Exibe o cubo grande por 5 segundos antes de fragmentar
  setTimeout(() => {
    fragmentCube();
  }, 5000);
}

function fragmentCube() {
  // Fragmenta o cubo grande em pequenos
  smallCubes = createSmallCubesFromTechCube(currentCube, 5);
  isFragmented = true;

  // Inicia o envio imediatamente após a fragmentação
  sendCubes();
}

// Função para movimentar os cubos pequenos imediatamente após a fragmentação
function animateSmallCubes(smallCubes) {
  smallCubes.forEach((cube) => {
    cube.position.x += (Math.random() - 0.5) * 0.1; // Oscilação leve no eixo X
    cube.position.y += (Math.random() - 0.5) * 0.1; // Oscilação leve no eixo Y
    cube.rotation.x += 0.01; // Rotação no eixo X
    cube.rotation.y += 0.01; // Rotação no eixo Y
  });
}

// Função de envio dos cubos pequenos
function sendCubes() {
  isSending = true;

  // Move os cubos pequenos para fora da tela
  const interval = setInterval(() => {
    sendSmallCubes(smallCubes);

    // Verifica se todos os cubos pequenos saíram da tela
    if (allCubesOutOfView(smallCubes)) {
      clearInterval(interval);
      resetCycle();
    }
  }, 16); // Atualiza a posição a cada 16ms (~60fps)
}

// Função de animação
function animate() {
  requestAnimationFrame(animate);

  if (!isFragmented && !isSending) {
    // Rotacionando o cubo grande
    currentCube.rotation.x += 0.01;
    currentCube.rotation.y += 0.01;

    // Movendo os códigos translúcidos e partículas dentro do cubo grande
    animateParticles(currentCube.children[0]);
  } else if (isFragmented && !isSending) {
    // Movimentando os cubos pequenos imediatamente após a fragmentação
    animateSmallCubes(smallCubes);
  } else if (isSending) {
    // Movendo os cubos pequenos para fora da tela
    sendSmallCubes(smallCubes);
  }

  // Renderizando a cena
  renderer.render(scene, camera);
}

// Atualiza a movimentação das partículas dentro dos cubos
function animateParticles(particlesGroup) {
  particlesGroup.children.forEach((particle) => {
    particle.position.x += (Math.random() - 0.5) * 0.05;
    particle.position.y += (Math.random() - 0.5) * 0.05;
    particle.position.z += (Math.random() - 0.5) * 0.05;
    particle.rotation.x += 0.01;
    particle.rotation.y += 0.01;
  });
}

// Iniciar animação
animate();

// Inicia o ciclo
startCycle();

// Ajuste de tamanho da tela
window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});
