class Cell {
  constructor(type) {
    this.type = type
    this.x = width/2
    this.y = height/2
    this.size = 300
    this.swelled = false
  }
  
  display() {
    fill(this.type === "plant" ? "#028B02" : "orange")
    if (this.type === "plant") {
      stroke("#005500")
      strokeWeight(5)
    } else {
      noStroke()
    }
    
    if (this.swelled) {
      noStroke()
      rectMode(CENTER)
      rect(this.x, this.y, this.size, this.size)
      
      if (this.type === "plant") {
        stroke("#005500")
        strokeWeight(5)
      }
      
      beginShape()
      curveVertex(this.x - this.size/2, this.y - this.size/2)
      curveVertex(this.x + this.size/2, this.y - this.size/2)
      curveVertex(this.x + this.size/2, this.y + this.size/2)
      curveVertex(this.x - this.size/2, this.y + this.size/2)
      endShape()
      
      beginShape()
      curveVertex(this.x + this.size/2, this.y - this.size/2)
      curveVertex(this.x + this.size/2, this.y + this.size/2)
      curveVertex(this.x - this.size/2, this.y + this.size/2)
      curveVertex(this.x - this.size/2, this.y - this.size/2)
      endShape()
      
      beginShape()
      curveVertex(this.x + this.size/2, this.y + this.size/2)
      curveVertex(this.x - this.size/2, this.y + this.size/2)
      curveVertex(this.x - this.size/2, this.y - this.size/2)
      curveVertex(this.x + this.size/2, this.y - this.size/2)
      endShape()
      
      beginShape()
      curveVertex(this.x - this.size/2, this.y + this.size/2)
      curveVertex(this.x - this.size/2, this.y - this.size/2)
      curveVertex(this.x + this.size/2, this.y - this.size/2)
      curveVertex(this.x + this.size/2, this.y + this.size/2)
      endShape()
    } else {
      rectMode(CENTER)
      rect(this.x, this.y, this.size, this.size)
    }
    
    //draw nucleus
    fill("purple")
    noStroke()
    ellipse(this.x, this.y, this.size/2)
    
    //energy number within nucleus
    fill(255)
    textSize(16)
    textAlign(CENTER, CENTER)
    text(`Energy Level: ${cellState.energy}`, this.x, this.y)
  }
  
  nucleusContains(molecule) {
    return dist(this.x, this.y, molecule.x, molecule.y) < this.size/4
  }
  
  contains(molecule) {
    return (
      abs(molecule.x - this.x) < this.size/2 &&
      abs(molecule.y - this.y) < this.size/2
    )
  }
}