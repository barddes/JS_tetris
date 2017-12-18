function setup(){
  c = document.getElementById("tetris");
  ctx = c.getContext("2d");
  ctx.lineWidth = 4;

  game = {
    x: 100,
    y: 100,
    width: 10,
    height: 20,
    bSize: 20
  };

  left = false;
  right = false;
  space = false;

  points = 0;
  console.log('Points: ', points);

  // List of blocks
  blocks = [];
  blocks.unshift(generateNew());

  drawFrame();
  drawState();

  window.onkeydown = keyPress;

  if(typeof interval == 'undefined')
    interval = setInterval(update, 500);
  else{
    clearInterval(interval);
    interval = setInterval(update, 500);
  }
}

function keyPress(event){
  // console.log(event);
  if(event.keyCode == 37){
    if(canMoveBlockLeft())
      drawState();
  }
  else if(event.keyCode == 39){
    if(canMoveBlockRight())
      drawState();
  }
  else if(event.keyCode == 38){
    if(canRotateBlockCW())
      drawState();
  }
  else if(event.keyCode == 40){
    // if(canRotateBlockCCW())
    //   drawState();
    update();
  }
  else if(event.keyCode == 32){
    update();
  }
}

function rotateCW(){
  for(let i=0; i<blocks[0].parts.length; i++){
    let p = blocks[0].parts[i];
    p.x += 0.5;
    p.y += 0.5;

    let aux = p.y;
    p.y = -p.x;
    p.x = aux;

    p.x -= 0.5;
    p.y -= 0.5;
  }
}

function rotateCCW(){
  for(let i=0; i<blocks[0].parts.length; i++){
    let p = blocks[0].parts[i];
    p.x += 0.5;
    p.y += 0.5;

    let aux = p.y;
    p.y = p.x;
    p.x = -aux;

    p.x -= 0.5;
    p.y -= 0.5;
  }
}

function canRotateBlockCCW(){
  let ac = blocks[0];

  rotateCCW();

  for(let i=0; i<ac.parts.length; i++){
    bc = ac.parts[i];
    if(hasSomething({x: ac.pos.x+bc.x, y: ac.pos.y+bc.y})){
      rotateCW();
      return false;
    }
  }

  return true;
}

function canRotateBlockCW(){
  let ac = blocks[0];

  rotateCW();

  for(let i=0; i<ac.parts.length; i++){
    bc = ac.parts[i];
    if(hasSomething({x: ac.pos.x+bc.x, y: ac.pos.y+bc.y})){
      rotateCCW();
      return false;
    }
  }

  return true;
}

function drawFrame(){
  ctx.font = "15pt Arial";

  ctx.fillText('Tetris', (c.width-ctx.measureText('Tetris').width)/2, 50);

  rectangle = new Path2D();
  rectangle.rect(100, 100, 200, 400);

  ctx.stroke(rectangle);
}

function drawGrid(){
  let bk = ctx.lineWidth;
  ctx.lineWidth = 0.1;

  for(let i = 0; i<=game.width; i+=1){
    ctx.beginPath();
    ctx.moveTo(game.x + i*game.bSize, game.y);
    ctx.lineTo(game.x + i*game.bSize, game.y + game.height*game.bSize);
    ctx.stroke();
  }

  for(let i = 0; i<=game.height; i+=1){
    ctx.beginPath();
    ctx.moveTo(game.x, game.y + i*game.bSize);
    ctx.lineTo(game.x + game.width*game.bSize, game.y + i*game.bSize);
    ctx.stroke();
  }

  ctx.lineWidth = bk;
}

function getBlockType(type){
  switch (type) {
    case 0: // LInha n 0
      return [
          {x: -2, y: -1},
          {x: -1, y: -1},
          {x: 0, y: -1},
          {x: 1, y: -1}
      ];

    case 1:
      return [
          {x: -1, y: -1},
          {x: 0, y: -1},
          {x: 1, y: -1},
          {x: -1, y: 0}
      ];

    case 2: // L direita 2
      return [
          {x: -2, y: -1},
          {x: -1, y: -1},
          {x: 0, y: -1},
          {x: 0, y: 0}
      ];

    case 3: // Quadrado n 3
      return [
          {x: -1, y: -1},
          {x: -1, y: 0},
          {x: 0, y: 0},
          {x: 0, y: -1}
      ];

    case 4: // S n 4
      return [
        {x: -2, y: 0},
        {x: -1, y: 0},
        {x: -1, y: -1},
        {x: 0, y: -1}
      ];

    case 5: // Coiso feio n 5
      return [
          {x: -1, y: -1},
          {x: 0, y: -1},
          {x: 0, y: 0},
          {x: 1, y: -1}
      ];

    case 6: // Z
      return [
        {x: -1, y: -1},
        {x: 0, y: -1},
        {x: 0, y: 0},
        {x: 1, y: 0}
      ];
    }

}

function generateNew(){
  let cor = Math.floor(Math.random() * 7);
  let type = Math.floor(Math.random() * 7);

  var block = {pos: {
      x: game.width/2,
      y: 1
    },
    color: cor,
    parts: getBlockType(type),
    type: type
  };

  return block;
}

function setColor(b){
  switch (b.color) {
    case 0:
      ctx.fillStyle = "red";
      break;

    case 1:
      ctx.fillStyle = "orange";
      break;

    case 2:
      ctx.fillStyle = "yellow";
      break;

    case 3:
      ctx.fillStyle = "pink";
      break;

    case 4:
      ctx.fillStyle = "green";
      break;

    case 5:
      ctx.fillStyle = "blue";
      break;

    case 6:
      ctx.fillStyle = "purple";
      break;

  }
}

function resetColor(){
  ctx.fillStyle = "black";
}

function drawBlocks(){
  for(let i=0; i<blocks.length; i++){
    b = blocks[i];

    setColor(b);

    for(let j=0; j<b.parts.length; j++){
      p = b.parts[j];

      let piece = new Path2D();
      piece.rect(game.x + (b.pos.x + p.x)*game.bSize, game.y + (b.pos.y + p.y)*game.bSize, game.bSize, game.bSize);
      ctx.fill(piece);
    }
  }

  resetColor();
}

function moveBlock(){
  blocks[0].pos.y = blocks[0].pos.y + 1;
}

function hasSomething(pos){
  if(pos.x < 0 || pos.x >= game.width || pos.y < 0 || pos.y >= game.height)
    return true;

  for(let i=1; i<blocks.length; i++){
    b = blocks[i];
    for(let j=0; j<b.parts.length; j++){
      p = b.parts[j];
      if(pos.x == b.pos.x+p.x && pos.y == b.pos.y+p.y)
        return true;
    }
  }
  return false;
}

function canExistBlock(){
  let ac = blocks[0];

  for(let i=0; i<ac.parts.length; i++){
    bc = ac.parts[i];
    if(hasSomething({x: ac.pos.x+bc.x, y: ac.pos.y+bc.y})){
      return false;
    }
  }

  return true;
}

function canMoveBlockDown(){
  let ac = blocks[0];
  ac.pos.y += 1;

  for(let i=0; i<ac.parts.length; i++){
    bc = ac.parts[i];
    if(hasSomething({x: ac.pos.x+bc.x, y: ac.pos.y+bc.y})){
      ac.pos.y -= 1;
      return false;
    }
  }

  return true;
}

function canMoveBlockLeft(){
  let ac = blocks[0];
  ac.pos.x -= 1;

  for(let i=0; i<ac.parts.length; i++){
    bc = ac.parts[i];
    if(hasSomething({x: ac.pos.x+bc.x, y: ac.pos.y+bc.y})){
      ac.pos.x += 1;
      return false;
    }
  }

  return true;
}

function canMoveBlockRight(){
  let ac = blocks[0];
  ac.pos.x += 1;

  for(let i=0; i<ac.parts.length; i++){
    bc = ac.parts[i];
    if(hasSomething({x: ac.pos.x+bc.x, y: ac.pos.y+bc.y})){
      ac.pos.x -= 1;
      return false;
    }
  }

  return true;
}

function drawState(){
  ctx.clearRect(game.x, game.y, game.width*game.bSize, game.height*game.bSize);
  drawBlocks();
  drawGrid();
}

function checkCompleteLines(){
  let freq = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  for(let i=0; i<blocks.length; i++){
    b = blocks[i];
    for(let j=0; j<b.parts.length; j++){
      p = b.parts[j];
      freq[b.pos.y + p.y]++;
    }
  }

  for(let k=0; k<freq.length; k++){
    if(freq[k] == 10){
      points++;
      console.log('Points: ', points);
      for(let i=0; i<blocks.length; i++){
        b = blocks[i];
        for(let j=0; j<b.parts.length; j++){
          p = b.parts[j];
          if(b.pos.y + p.y == k){
            b.parts.splice(j, 1);
            j--;
          }
          else if(b.pos.y + p.y < k){
            p.y += 1;
          }
        }
      }
    }
  }
}

function update(){
  if(!canMoveBlockDown()){
    checkCompleteLines();
    blocks.unshift(generateNew());
    if(!canExistBlock()){
      setup();
      return;
    }
  }
  drawState();
}
