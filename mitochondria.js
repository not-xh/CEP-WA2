class Mitochondria {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.size = 40
    this.glucoseStored = 0
    this.oxygenStored = 0
  }
  
  display() {
    fill("brown")
    noStroke()
    ellipse(this.x, this.y, this.size, this.size/2)
    fill(0)
    textAlign(CENTER, CENTER)
    textSize(10)
    text("M", this.x, this.y)
  }
  
  contains(molecule) {
    return dist(this.x, this.y, molecule.x, molecule.y) < this.size/2
  }
  
  absorb(molecule) {
    if (molecule.type === "G") {
      this.glucoseStored++
    } else if (molecule.type === "O") {
      this.oxygenStored++
    }
    
    if (this.glucoseStored >= 1 && this.oxygenStored >= 1) {
      this.glucoseStored--
      this.oxygenStored--
      this.active = true
      molecules.push(new Molecule(this.x, this.y, "ATP", "yellow"))
    }
  }
}