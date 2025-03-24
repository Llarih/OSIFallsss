// Configuração da cena Three.js
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("webgl-canvas") });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Luzes
const ambientLight = new THREE.AmbientLight(0x404040, 1); // Luz ambiente suave
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// Função para criar uma mesa sem pés
function createTable() {
  const tableGroup = new THREE.Group();

  // Tampo da mesa
  const tableTopGeometry = new THREE.BoxGeometry(10, 0.5, 6);
  const tableTopMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 }); // Cor de madeira
  const tableTop = new THREE.Mesh(tableTopGeometry, tableTopMaterial);
  tableTop.position.y = 1; // Altura do tampo
  tableGroup.add(tableTop);

  scene.add(tableGroup);
  return tableGroup;
}

// Função para criar o ambiente (chão, paredes e objetos decorativos detalhados)
function createEnvironment() {
  // Chão
  const floorGeometry = new THREE.PlaneGeometry(50, 50);
  const floorTexture = new THREE.TextureLoader().load("textures/floor.jpg"); // Adicionar textura ao chão
  const floorMaterial = new THREE.MeshStandardMaterial({ map: floorTexture });
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = -Math.PI / 2; // Deitar o plano para ser o chão
  scene.add(floor);

  // Paredes
  const wallTexture = new THREE.TextureLoader().load("textures/wall.jpg"); // Adicionar textura às paredes
  const wallMaterial = new THREE.MeshStandardMaterial({ map: wallTexture });
  const backWall = new THREE.Mesh(new THREE.PlaneGeometry(50, 20), wallMaterial);
  backWall.position.z = -25;
  backWall.position.y = 10;
  scene.add(backWall);

  const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(50, 20), wallMaterial);
  leftWall.rotation.y = Math.PI / 2;
  leftWall.position.x = -25;
  leftWall.position.y = 10;
  scene.add(leftWall);

  const rightWall = new THREE.Mesh(new THREE.PlaneGeometry(50, 20), wallMaterial);
  rightWall.rotation.y = -Math.PI / 2;
  rightWall.position.x = 25;
  rightWall.position.y = 10;
  scene.add(rightWall);

  // Estante
  const shelfGeometry = new THREE.BoxGeometry(8, 10, 1);
  const shelfMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 }); // Cor de madeira
  const shelf = new THREE.Mesh(shelfGeometry, shelfMaterial);
  shelf.position.set(-15, 5, -24.5); // Encostada na parede de trás
  scene.add(shelf);

  // Livros na estante
  for (let i = -3; i <= 3; i++) {
    const bookGeometry = new THREE.BoxGeometry(0.8, 2, 0.5);
    const bookMaterial = new THREE.MeshStandardMaterial({ color: Math.random() * 0xffffff }); // Cores aleatórias
    const book = new THREE.Mesh(bookGeometry, bookMaterial);
    book.position.set(-15 + i * 1.2, 6, -24);
    scene.add(book);
  }

  // Monitor
  const monitorBaseGeometry = new THREE.BoxGeometry(3, 0.2, 1.5);
  const monitorBaseMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
  const monitorBase = new THREE.Mesh(monitorBaseGeometry, monitorBaseMaterial);
  monitorBase.position.set(10, 1, -20);
  scene.add(monitorBase);

  const monitorScreenGeometry = new THREE.PlaneGeometry(4, 2.5);
  const monitorScreenMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 }); // Tela preta
  const monitorScreen = new THREE.Mesh(monitorScreenGeometry, monitorScreenMaterial);
  monitorScreen.position.set(10, 2.5, -19.9); // Levemente à frente da base
  scene.add(monitorScreen);

  // Cadeira
  const chairSeatGeometry = new THREE.BoxGeometry(2, 0.2, 2);
  const chairSeatMaterial = new THREE.MeshStandardMaterial({ color: 0x555555 });
  const chairSeat = new THREE.Mesh(chairSeatGeometry, chairSeatMaterial);
  chairSeat.position.set(10, 1, -15);
  scene.add(chairSeat);

  const chairBackGeometry = new THREE.BoxGeometry(2, 2, 0.2);
  const chairBackMaterial = new THREE.MeshStandardMaterial({ color: 0x555555 });
  const chairBack = new THREE.Mesh(chairBackGeometry, chairBackMaterial);
  chairBack.position.set(10, 2, -14);
  scene.add(chairBack);

  const chairLegGeometry = new THREE.CylinderGeometry(0.1, 0.1, 1, 32);
  const chairLegMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
  for (let i = -1; i <= 1; i += 2) {
    for (let j = -1; j <= 1; j += 2) {
      const chairLeg = new THREE.Mesh(chairLegGeometry, chairLegMaterial);
      chairLeg.position.set(10 + i * 0.8, 0.5, -15 + j * 0.8);
      scene.add(chairLeg);
    }
  }

  // Objetos decorativos
  const plantGeometry = new THREE.CylinderGeometry(0.5, 0.5, 2, 32);
  const plantMaterial = new THREE.MeshStandardMaterial({ color: 0x228B22 }); // Verde para a planta
  const plant = new THREE.Mesh(plantGeometry, plantMaterial);
  plant.position.set(-10, 1, -20);
  scene.add(plant);

  const pictureGeometry = new THREE.PlaneGeometry(5, 3);
  const pictureTexture = new THREE.TextureLoader().load("textures/picture.jpg"); // Adicionar textura de quadro
  const pictureMaterial = new THREE.MeshStandardMaterial({ map: pictureTexture });
  const picture = new THREE.Mesh(pictureGeometry, pictureMaterial);
  picture.position.set(0, 12, -24.9); // Quase encostado na parede de trás
  scene.add(picture);
}

// Função para criar o roteador translúcido (menos translúcido) e antenas melhoradas
function createRoteador() {
  const roteadorGroup = new THREE.Group();

  // Corpo principal do roteador
  const bodyGeometry = new THREE.BoxGeometry(4, 1, 3);
  const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x333333, opacity: 0.8, transparent: true });
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
  roteadorGroup.add(body);

  // Tela do roteador
  const screenGeometry = new THREE.PlaneGeometry(2, 0.5);
  const screenMaterial = new THREE.MeshBasicMaterial({ color: 0x00ffcc, opacity: 0.8, transparent: true });
  const screen = new THREE.Mesh(screenGeometry, screenMaterial);
  screen.position.set(0, 0.3, 1.51); // Posicionar na frente do roteador
  roteadorGroup.add(screen);

  // Botões do roteador
  const buttonGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.05, 32);
  const buttonMaterial = new THREE.MeshStandardMaterial({ color: 0x555555 });
  for (let i = -1; i <= 1; i++) {
    const button = new THREE.Mesh(buttonGeometry, buttonMaterial);
    button.rotation.x = Math.PI / 2;
    button.position.set(i * 0.5, -0.3, 1.51); // Distribuir botões na frente
    roteadorGroup.add(button);
  }

  // Antenas melhoradas
  const antennaBaseGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.3, 32);
  const antennaBaseMaterial = new THREE.MeshStandardMaterial({ color: 0x555555 });
  const antennaRodGeometry = new THREE.CylinderGeometry(0.05, 0.05, 2, 32);
  const antennaRodMaterial = new THREE.MeshStandardMaterial({ color: 0xaaaaaa });

  for (let i = -1; i <= 1; i++) {
    const antennaBase = new THREE.Mesh(antennaBaseGeometry, antennaBaseMaterial);
    antennaBase.position.set(i * 1.5, 0.5, -1.5);
    roteadorGroup.add(antennaBase);

    const antennaRod = new THREE.Mesh(antennaRodGeometry, antennaRodMaterial);
    antennaRod.position.set(i * 1.5, 1.5, -1.5);
    roteadorGroup.add(antennaRod);
  }

  roteadorGroup.position.y = 1;
  scene.add(roteadorGroup);
  return roteadorGroup;
}

// Criar antenas simples
function createAntenna(x, y, z) {
  const antennaGeometry = new THREE.CylinderGeometry(0.05, 0.05, 3);
  const antennaMaterial = new THREE.MeshStandardMaterial({ color: 0xaaaaaa });
  const antenna = new THREE.Mesh(antennaGeometry, antennaMaterial);
  antenna.rotation.x = Math.PI / 2;
  antenna.position.set(x, y, z);
  scene.add(antenna);
}

// Criar a tela holográfica com dados criptografados animados
function createHologram() {
  const hologramGeometry = new THREE.PlaneGeometry(4, 2);
  const hologramMaterial = new THREE.MeshBasicMaterial({ color: 0x00ffcc, opacity: 0.8, transparent: true });
  const hologram = new THREE.Mesh(hologramGeometry, hologramMaterial);
  hologram.position.set(0, 2, 0);
  hologram.rotation.x = -Math.PI / 4;
  scene.add(hologram);

  // Adicionar animação de dados criptografados
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 256;
  const context = canvas.getContext("2d");
  const texture = new THREE.CanvasTexture(canvas);
  hologram.material.map = texture;

  let offset = 0;
  function updateHologramData() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "rgba(0, 255, 204, 0.8)";
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = "black";
    context.font = "20px Arial";
    const data = [
      "3F2A9C...E7B1",
      "A1B2C3...D4E5",
      "F9E8D7...C6B5",
      "Encrypted Data Stream",
    ];
    data.forEach((line, index) => {
      context.fillText(line, 10, 30 + index * 40 + offset);
    });

    offset -= 2;
    if (offset < -40) offset = 0;

    texture.needsUpdate = true;
    requestAnimationFrame(updateHologramData);
  }
  updateHologramData();

  return hologram;
}

// Função para criar o raio de luz em zigzag
function createZigzagRay() {
  const rayMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00, linewidth: 3 });
  const points = [];
  let x = 0, y = 0, z = 0;
  for (let i = 0; i < 10; i++) {
    x += (Math.random() - 0.5) * 2; // Movimento aleatório no eixo X
    y += 0.5; // Movimento constante para cima no eixo Y
    z += (Math.random() - 0.5) * 2; // Movimento aleatório no eixo Z
    points.push(new THREE.Vector3(x, y, z));
  }
  const rayGeometry = new THREE.BufferGeometry().setFromPoints(points);
  const zigzagRay = new THREE.Line(rayGeometry, rayMaterial);
  scene.add(zigzagRay);
  return zigzagRay;
}

// Função para criar o raio de luz dentro do roteador com movimento visível
function createInternalZigzagRay() {
  const rayMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00, opacity: 0.6, transparent: true });
  const points = [];
  for (let i = 0; i < 10; i++) {
    points.push(
      new THREE.Vector3(
        (Math.random() - 0.5) * 4, // Limitar ao tamanho do roteador no eixo X
        (Math.random() - 0.5) * 1 + 1, // Ajustar ao centro do roteador no eixo Y
        (Math.random() - 0.5) * 3 // Limitar ao tamanho do roteador no eixo Z
      )
    );
  }
  const rayGeometry = new THREE.BufferGeometry().setFromPoints(points);
  const zigzagRay = new THREE.Line(rayGeometry, rayMaterial);
  scene.add(zigzagRay);
  return zigzagRay;
}

// Atualizar a tela do roteador para exibir informações
function updateRouterScreen(screen) {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 128;
  const context = canvas.getContext("2d");

  // Desenhar informações na tela
  context.fillStyle = "rgba(0, 255, 204, 0.8)";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "black";
  context.font = "16px Arial";
  context.fillText("Status: Online", 10, 30);
  context.fillText("Dispositivos Conectados: 5", 10, 60);
  context.fillText("Velocidade: 120 Mbps", 10, 90);

  const texture = new THREE.CanvasTexture(canvas);
  screen.material.map = texture;
  screen.material.needsUpdate = true;
}

// Criar o ambiente
createEnvironment();

// Criar a mesa
const table = createTable();

// Posicionar o roteador em cima da mesa
const roteador = createRoteador();
roteador.position.y = 1.25; // Altura da mesa + altura do roteador

const screen = roteador.children.find(child => child.geometry instanceof THREE.PlaneGeometry);
updateRouterScreen(screen);
createAntenna(1.5, 3, 0);
createAntenna(-1.5, 3, 0);
const hologram = createHologram();
const zigzagRay = createZigzagRay();

// Criar apenas raios internos
const internalRays = Array.from({ length: 5 }, createInternalZigzagRay);

// Atualizar a posição da câmera para focar no roteador e no ambiente
camera.position.set(0, 5, 12); // Aproximar a câmera um pouco mais
camera.lookAt(0, 1.25, 0); // Focar no roteador

// Adicionar luzes adicionais para melhorar a iluminação
const pointLight = new THREE.PointLight(0xffffff, 1, 50);
pointLight.position.set(0, 10, 10); // Luz acima do roteador
scene.add(pointLight);

const spotLight = new THREE.SpotLight(0xffffff, 0.8);
spotLight.position.set(0, 15, 5); // Luz direcionada ao roteador
spotLight.target.position.set(0, 1.25, 0);
scene.add(spotLight);
scene.add(spotLight.target);

// Atualizar o raio de luz em zigzag
function animateZigzagRay(ray) {
  const positions = ray.geometry.attributes.position.array;
  for (let i = 1; i < positions.length / 3; i++) {
    positions[i * 3 + 1] += 0.05; // Movimento para cima no eixo Y
    if (positions[i * 3 + 1] > 5) positions[i * 3 + 1] = 0; // Reiniciar posição
  }
  ray.geometry.attributes.position.needsUpdate = true;
}

// Atualizar os raios internos para se moverem dentro do roteador
function animateInternalRays(rays) {
  rays.forEach(ray => {
    const positions = ray.geometry.attributes.position.array;
    for (let i = 0; i < positions.length / 3; i++) {
      positions[i * 3] += (Math.random() - 0.5) * 0.1; // Movimento aleatório no eixo X
      positions[i * 3 + 1] += (Math.random() - 0.5) * 0.1; // Movimento aleatório no eixo Y
      positions[i * 3 + 2] += (Math.random() - 0.5) * 0.1; // Movimento aleatório no eixo Z

      // Manter os raios dentro do roteador
      positions[i * 3] = Math.max(-2, Math.min(2, positions[i * 3])); // Limite no eixo X
      positions[i * 3 + 1] = Math.max(0.5, Math.min(1.5, positions[i * 3 + 1])); // Limite no eixo Y
      positions[i * 3 + 2] = Math.max(-1.5, Math.min(1.5, positions[i * 3 + 2])); // Limite no eixo Z
    }
    ray.geometry.attributes.position.needsUpdate = true;
  });
}

// Função de animação
function animate() {
  requestAnimationFrame(animate);

  // Atualizar o raio de luz em zigzag
  animateZigzagRay(zigzagRay);

  // Atualizar os raios internos
  animateInternalRays(internalRays);

  // Renderizar a cena
  renderer.render(scene, camera);
}

animate();

// Ajustar a tela para o tamanho da janela
window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

