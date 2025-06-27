//global variables
let currentScreen = "start"
let cellType = ""
let waterRate = ""
let glucoseRate = ""
let oxygenRate = ""
let simulationStarted = false
let lastSpawnTime = {
  water: 0,
  glucose: 0,
  oxygen: 0
}
let spawnIntervals = {
  water: 0,
  glucose: 0,
  oxygen: 0
}
let cellState = {
  energy: 10,
  water: 15,
  swelled: false,
  burst: false,
  plasmolysed: false,
  reason: ""
}

let molecules = []
let cell
let mitochondriaArray = []
let initialEnergyBufferTime = 5000 //5 seconds buffer time to allow particles to spawn
let lastDepletionTime
let depletionStarted = false
let startTime

function setup() {
  createCanvas(800, 600)
}

function draw() {
  background (255)
  if (currentScreen === "start") {
    drawStartScreen()
  } else if (currentScreen === "setup") {
    drawSetupScreen()
  } else if (currentScreen === "simulation") {
    drawSimulation()
  } else if (currentScreen === "end") {
    drawEndScreen()
  }
}

function drawStartScreen() {
  //background
  background(34, 139, 34)
  fill(255)
  textAlign(CENTER, CENTER)
  textSize(48)
  text("Cell-ebrate Biology", width/2, height/2 - 50)
  
  //begin button
  fill(255)
  rectMode(CENTER)
  rect(width/2, height/2 + 50, 200, 50, 10)
  
  fill(0)
  textSize(24)
  text("Begin", width/2, height/2 + 50)
}

function drawSetupScreen() {
  //background
  background(220)
  textSize(32)
  textAlign(CENTER, TOP)
  text("Setup Your Simulation", width/2, 20)
  
  //button use introduction
  textSize(20)
  textAlign(LEFT, CENTER)
  text("Select Cell Type:", 100, 100)
  text("Select Water Rate:", 100, 150)
  text("Select Glucose Rate:", 100, 200)
  text("Select Oxygen Rate:", 100, 250)
  
  //cell type buttons
  drawButton(400, 100, "Animal Cell", cellType === "animal")
  drawButton(550, 100, "Plant Cell", cellType === "plant")
  
  //water rate buttons
  drawButton(400, 150, "Low", waterRate === "low")
  drawButton(550, 150, "Medium", waterRate === "medium")
  drawButton(700, 150, "High", waterRate === "high")
  
  //glucose rate buttons
  drawButton(400, 200, "Low", glucoseRate === "low")
  drawButton(550, 200, "High", glucoseRate === "high")
  
  //oxygen rate buttons
  drawButton(400, 250, "Low", oxygenRate === "low")
  drawButton(550, 250, "High", oxygenRate === "high")
  
  //begin simulation button once all selections made
  if (cellType && waterRate && glucoseRate && oxygenRate) {
    fill(0, 255, 0)
    rectMode(CENTER)
    rect(width/2, height - 100, 200, 50, 10)
    
    fill(0)
    textAlign(CENTER, CENTER)
    text("Begin Simulation!", width/2, height - 100)
  }
}

function drawSimulation() {
  background (220)
  textSize(16)
  fill(0)
  textAlign(LEFT, CENTER)
  text(`Water Level: ${cellState.water}\n30: Swelling\n60: Cytolysis - ANIMAL CELLS ONLY`, 50, 50)
  text("Red: Glucose\nWhite: Oxygen\nBlue: Water\nBrown: Mitochondria\nPurple: Nucleus\nYellow: ATP", 50, height - 100)
  if (!simulationStarted) {
    simulationStarted = true
    initialiseSimulation()
    startTime = millis()
  }
  
  //draw cell
  cell.display()
  for (let mito of mitochondriaArray) {
    mito.display()
  }
  
  //spawn molecules
  spawnMolecules()
  
  //draw and update molecule locations
  for (let i = molecules.length - 1; i >= 0; i--) {
    let molecule = molecules[i]
    molecule.update()
    molecule.display()
    
    if (molecule.type === "W") {
      if (waterRate === "low") {
        if (!cell.contains(molecule)) {
          molecules.splice(i, 1) //removes water molecule once it exits the cell
          cellState.water--
        }
      } else if (waterRate === "high" && cell.contains(molecule)) {
        molecules.splice(i, 1)
        cellState.water++
        
        if (cellState.water > 30) {
          cell.swelled = true
        }
        
        if (cellState.water > 60 && cellType === "animal") {
          cellState.burst = true
          cellState.reason = "Cytolysis"
          currentScreen = "end"
        }
      }
    } else if (molecule.type === "G" || molecule.type === "O") {
      for (let mito of mitochondriaArray) {
        if (mito.contains(molecule)) {
          mito.absorb(molecule)
          molecules.splice(i, 1)
          break
        }
      }
    } else if (molecule.type === "ATP") {
      if (cell.nucleusContains(molecule)) {
        molecules.splice (i, 1)
        cellState.energy = Math.round(cellState.energy + 1) //whole number to be visually appealing
      }
    }
  }
  
  //check for plasmolysis
  if (waterRate === "low" && cellState.water <= 0) {
    cellState.plasmolysed = true
    cellState.reason = "Plasmolysis"
    currentScreen = "end"
  }
  
  if (millis() - startTime > initialEnergyBufferTime) {
    if (!depletionStarted) {
      depletionStarted = true
      cellState.energy = Math.round(cellState.energy - 1)
      lastDepletionTime = millis()
    } else {
      if (millis() - lastDepletionTime >= 1250) {
        cellState.energy = Math.round(cellState.energy - 1)
        lastDepletionTime = millis()
      }
    }
    
    if (cellState.energy <= 0) {
      cellState.reason = "Lack of Energy"
      currentScreen = "end"
    }
  }
}

function drawEndScreen() {
  background(0)
  fill(255)
  textSize(48)
  textAlign(CENTER, CENTER)
  text("Simulation End", width/2, height/2 - 50)
  textSize(24)
  text(`Reason for Cell Death: ${cellState.reason}`, width/2, height/2 + 50)
}

function drawButton(x, y, label, selected) {
  fill(selected ? "#ADD8E6" : 200) //button will highlight if selected
  rectMode(CENTER)
  rect(x, y, 100, 40, 10)
  
  fill(0)
  textSize(16)
  textAlign(CENTER, CENTER)
  text(label, x, y)
}

function mousePressed() {
  if (currentScreen === "start") {
    if (mouseX > width/2 - 100 && mouseX < width/2 + 100 && mouseY > height/2 + 25 && mouseY < height/2 + 75) {
      currentScreen = "setup"
    }
  } else if (currentScreen === "setup") {
    setupScreenClicks()
  }
}

function setupScreenClicks() {
  //cell type buttons
  if (mouseY > 80 && mouseY < 120) {
    if (mouseX > 350 && mouseX < 450) cellType = "animal"
    else if (mouseX > 500 && mouseX < 600) cellType = "plant"
  }
  
  //water rate buttons
  if (mouseY > 130 && mouseY < 170) {
    if (mouseX > 350 && mouseX < 450) waterRate = "low"
    else if (mouseX > 500 && mouseX < 600) waterRate = "medium"
    else if (mouseX > 650 && mouseX < 750) waterRate = "high"
  }
  
  //glucose rate buttons
  if (mouseY > 180 && mouseY < 220) {
    if (mouseX > 350 && mouseX < 450) glucoseRate = "low"
    else if (mouseX > 500 && mouseX < 600) glucoseRate = "high"
  }
  
  //oxygen rate buttons
  if (mouseY > 230 && mouseY < 270) {
    if (mouseX > 350 && mouseX < 450) oxygenRate = "low"
    else if (mouseX > 500 && mouseX < 600) oxygenRate = "high"
  }
  
  //begin simulation button
  if (cellType && waterRate && glucoseRate && oxygenRate) {
    if (mouseX > width/2 - 100 && mouseX < width/2 + 100 && mouseY > height - 125 && mouseY < height - 75) {
      currentScreen = "simulation"
    }
  }
}

function initialiseSimulation() {
  //create cell and mitochondria
  cell = new Cell(cellType)
  for (let i = 0; i < 5; i++) {
    let angle = TWO_PI * i / 5
    let x = cell.x + cos(angle) * (cell.size/3)
    let y = cell.y + sin(angle) * (cell.size/3)
    mitochondriaArray.push(new Mitochondria(x, y))
  }
  
  //set spawn intervals based on rates selected
  spawnIntervals.water = waterRate === "low" ? 1500 : 400
  spawnIntervals.glucose = glucoseRate === "low" ? 2000 : 600
  spawnIntervals.oxygen = oxygenRate === "low" ? 2000 : 600
}

function spawnMolecules() {
  let currentTime = millis()
  
  //spawn water molecules
  if (currentTime - lastSpawnTime.water >= spawnIntervals.water) {
    if (waterRate === "low") {
      spawnMoleculeWithinCell("W", "blue")
    } else if (waterRate === "high" && !(cellType === "plant" && cellState.water >= 60)) {
      spawnMoleculeOutsideCell("W", "blue")
    }
    lastSpawnTime.water = currentTime
  }
  
  //spawn glucose molecules
  if (currentTime - lastSpawnTime.glucose >= spawnIntervals.glucose) {
    spawnMoleculeOutsideCell("G", "red")
    lastSpawnTime.glucose = currentTime
  }
  
  //spawn oxygen molecules
  if (currentTime - lastSpawnTime.oxygen >= spawnIntervals.oxygen) {
    spawnMoleculeOutsideCell("O", "white")
    lastSpawnTime.oxygen = currentTime
  }
}

function spawnMoleculeWithinCell(type, colour) {
  let x = random(cell.x - cell.size/2, cell.x + cell.size/2)
  let y = random(cell.y - cell.size/2, cell.y + cell.size/2)
  molecules.push(new Molecule(x, y, type, colour))
}

function spawnMoleculeOutsideCell(type, colour) {
  let x, y
  do {
    x = random(width)
    y = random(height)
  } while (cell.contains({ x, y }))
  molecules.push(new Molecule(x, y, type, colour))
}