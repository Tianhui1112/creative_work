let img;
let edgeImg;
let drawing = false;
let step = 0;
let currentImageIndex = 0;
let images = [];
let brushSize = 5;  // Initial brush size
let brushAngle = 0;  // Initial brush angle
let delay = 30; // Delay between each frame (in milliseconds)
let startTime;  // Record the start time of drawing
let drawingDuration = 40000;  // Time limit for drawing each image (40 seconds)
let transitionDuration = 2000;  // Transition animation duration (2 seconds)

// Animation effect states
let sunflowerShake = false;
let almondBlossomRotate = false;
let wheatfieldCrowsFly = false;
let snowFall = false;

function preload() {
  let sunflowers = loadImage('vangogh_sunflowers.png');
  let almondBlossom = loadImage('vangogh_almond_blossom.png');
  let wheatfieldCrows = loadImage('vangogh_wheatfield_crows.png');
  let snowScene = loadImage('vangogh_snow_scene.png');
  
  let targetWidth = sunflowers.width;
  let targetHeight = sunflowers.height;
  
  sunflowers.resize(targetWidth, targetHeight);
  almondBlossom.resize(targetWidth, targetHeight);
  wheatfieldCrows.resize(targetWidth, targetHeight);
  snowScene.resize(targetWidth, targetHeight);
  
  // Load images in the order of spring, summer, autumn, and winter
  images.push(almondBlossom);  // Spring: Almond Blossom
  images.push(sunflowers);     // Summer: Sunflowers
  images.push(wheatfieldCrows);  // Autumn: Wheatfield with Crows
  images.push(snowScene);       // Winter: Snow Scene
}

function setup() {
  // Create a fullscreen canvas
  createCanvas(windowWidth, windowHeight, WEBGL);
  noLoop();
  loadImageData();
  startTime = millis();
}

function loadImageData() {
  img = images[currentImageIndex];
  img.loadPixels();
  edgeImg = createImage(img.width, img.height);
  edgeImg.loadPixels();

  for (let x = 0; x < img.width; x++) {
    for (let y = 0; y < img.height; y++) {
      let loc = (x + y * img.width) * 4;
      let r = img.pixels[loc];
      let g = img.pixels[loc + 1];
      let b = img.pixels[loc + 2];

      let gray = (r + g + b) / 3;
      edgeImg.pixels[loc] = gray;
      edgeImg.pixels[loc + 1] = gray;
      edgeImg.pixels[loc + 2] = gray;
      edgeImg.pixels[loc + 3] = 255;
    }
  }

  edgeImg.updatePixels();
  edgeImg.filter(THRESHOLD, 0.5);
  
  drawing = true;
  loop();
}

function draw() {
  if (drawing) {
    // Change to a soft cherry blossom background color
    background(255, 228, 255); // Soft pink-purple background
    
    step++;

    let pixelsToDraw = step * 1000;

    for (let i = 0; i < pixelsToDraw; i++) {
      let x = int(random(0, edgeImg.width));
      let y = int(random(0, edgeImg.height));
      let loc = (x + y * edgeImg.width) * 4;

      let gray = edgeImg.pixels[loc];

      if (gray < 128) {
        let x3d = map(x, 0, edgeImg.width, -width / 2, width / 2);
        let y3d = map(y, 0, edgeImg.height, -height / 2, height / 2);
        let z3d = map(gray, 0, 255, 0, 100);

        let r = img.pixels[(x + y * img.width) * 4];
        let g = img.pixels[(x + y * img.width) * 4 + 1];
        let b = img.pixels[(x + y * img.width) * 4 + 2];

        strokeWeight(brushSize + random(-1, 1));
        stroke(r, g, b, random(150, 255));
        push();
        translate(x3d, y3d, z3d);
        rotateZ(brushAngle);
        point(0, 0);
        pop();

        brushAngle += random(-0.05, 0.05);
      }
    }

    if (millis() - startTime >= drawingDuration) {
      noLoop();
      setTimeout(() => {
        step = 0;
        startTime = millis();
        currentImageIndex++;
        if (currentImageIndex >= images.length) {
          currentImageIndex = 0;
        }
        applyTransitionEffect();  // Apply transition effect
        loadImageData();
      }, 1000);
    }
  }

  // Apply transition animation effects based on the current image
  if (currentImageIndex === 0 && sunflowerShake) {
    shakeEffect();
  } else if (currentImageIndex === 1 && almondBlossomRotate) {
    rotateEffect();
  } else if (currentImageIndex === 2 && wheatfieldCrowsFly) {
    flyingCrowsEffect();
  } else if (currentImageIndex === 3 && snowFall) {
    snowFallEffect();
  }
}

function applyTransitionEffect() {
  if (currentImageIndex === 0) {
    sunflowerShake = true;  // Spring effect
  } else if (currentImageIndex === 1) {
    almondBlossomRotate = true;  // Summer effect
  } else if (currentImageIndex === 2) {
    wheatfieldCrowsFly = true;  // Autumn effect
  } else if (currentImageIndex === 3) {
    snowFall = true;  // Winter effect
  }
}

function shakeEffect() {
  let shakeAmount = sin(millis() / 100) * 5;  // Control shaking amplitude over time
  translate(shakeAmount, 0, 0);
}

function rotateEffect() {
  rotateY(millis() / 1000);
}

function flyingCrowsEffect() {
  // Simulate flying crows by generating multiple crows moving along random paths
  for (let i = 0; i < 5; i++) {
    let x = random(-width / 2, width / 2);
    let y = random(-height / 2, height / 2);
    let z = random(0, 100);
    let r = map(sin(millis() / 500), -1, 1, 0, 255);
    let g = map(cos(millis() / 500), -1, 1, 0, 255);
    let b = map(sin(millis() / 500 + 1000), -1, 1, 0, 255);

    stroke(r, g, b);
    ellipse(x + sin(millis() / 500) * 100, y + cos(millis() / 500) * 100, 10, 10);
  }
}

function snowFallEffect() {
  let numSnowflakes = 50;
  for (let i = 0; i < numSnowflakes; i++) {
    let x = random(-width / 2, width / 2);
    let y = random(-height / 2, height / 2);
    let snowSize = random(2, 5);
    fill(255, 255, 255, 200);
    ellipse(x, y + sin(millis() / 1000 + i) * height, snowSize, snowSize);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function mousePressed() {
  step = 0;
  loop();
}