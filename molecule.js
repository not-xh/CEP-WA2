class Molecule {
  constructor(x, y, type, colour) {
    this.x = x
    this.y = y
    this.type = type
    this.colour = colour
  }
  
  update() {
    if (this.type === "W" && waterRate === "low") {
      this.moveAwayFrom(cell)
    } else if (this.type === "W" && waterRate === "high") {
      this.moveTowards(cell)
    } else if (this.type === "G" || this.type === "O" || this.type === "ATP") {
      let target = this.type === "ATP" ? cell : this.findClosestMitochondria()
      this.moveTowards(target)
    }
  }
  
  display() {
    fill(this.colour)
    noStroke()
    ellipse(this.x, this.y, 10, 10)
    
    fill(0)
    textAlign(CENTER, CENTER)
    textSize(8)
    text(this.type, this.x, this.y)
  }
  
  moveTowards(target) {
    let angle = atan2(target.y - this.y, target.x - this.x)
    this.x += cos(angle)*2
    this.y += sin(angle)*2
  }
  
  moveAwayFrom(target) {
    let angle = atan(this.y - target.y, this.x - target.x)
    this.x += cos(angle)*2
    this.y += sin(angle)*2
  }
  
  findClosestMitochondria() {
    let closest = null
    let shortestDistance = Infinity
    for (let mito of mitochondriaArray) {
      let d = dist(this.x, this.y, mito.x, mito.y)
      if (d < shortestDistance) {
        shortestDistance = d
        closest = mito
      }
    }
    return closest
  }
}