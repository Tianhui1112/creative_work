# Creative Work:

You can view the generated effect by visiting the following link:

[View Creative Work Effect](  https://tianhui1112.github.io/creative_work/)


## Overview

We chose “Art from Rules” as the theme, using four of Van Gogh’s paintings—Sunflowers, Almond Blossom, Wheatfield with Crows, and Snowy Scene—to symbolize the four seasons of spring, summer, autumn, and winter. By using lines of varying colors and thicknesses, we gradually form these lines into Van Gogh’s four masterpieces. Through this approach, we aim to allow readers to experience Van Gogh’s artistic creation process and feel the transformation of the seasons, as if they were immersed in the ever-changing seasons through Van Gogh’s eyes.


### Main Functions Implemented:

1. **Loading Four Paintings by Van Gogh (Spring, Summer, Autumn, and Winter)**
   - The program loads four paintings that represent the four seasons: "Almond Blossom" (Spring), "Sunflowers" (Summer), "Wheatfield with Crows" (Autumn), and "Snowy Landscape" (Winter).

2. **Extracting Image Information**
   - The program extracts pixel information from the images and processes them for further operations.

3. **Step-by-Step Drawing of Images**
   - The images are progressively drawn by generating 3D point clouds based on the pixel data, giving the impression of a gradual unfolding of the image.

4. **Different Effects for Each Image:**
   - **Spring - Almond Blossom (sunflowerShake):** Simulates the rotation of the almond blossom.
   - **Summer - Sunflowers (almondBlossomRotate):** Simulates the swaying motion of the sunflowers.
   - **Autumn - Wheatfield with Crows (wheatfieldCrowsFly):** Simulates the flight of crows in the wheat field.
   - **Winter - Snowy Landscape (snowFall):** Simulates the falling snowflakes in the winter scene.


## Project workflow
Since the technical content was previously introduced in the workshop, here we will only explain the implementation of Extracting Image Information and Step-by-Step Drawing of Images.

1.1:  Image Loading and Preprocessing
This code loads four works by Van Gogh and resizes them to the same size, ensuring consistency for subsequent drawing.

```javascript
let sunflowers = loadImage('vangogh_sunflowers.png');
let almondBlossom = loadImage('vangogh_almond_blossom.png');
let wheatfieldCrows = loadImage('vangogh_wheatfield_crows.png');
let snowScene = loadImage('vangogh_snow_scene.png');

// Resize all images to the same size
let targetWidth = sunflowers.width;
let targetHeight = sunflowers.height;
sunflowers.resize(targetWidth, targetHeight);
almondBlossom.resize(targetWidth, targetHeight);
wheatfieldCrows.resize(targetWidth, targetHeight);
snowScene.resize(targetWidth, targetHeight);
```



1.2: Extracting Image Information 
The purpose of this step is to create a binary edge map of the original image, which will be useful for further drawing and visualization. The edge map helps to isolate significant features in the image, which can then be drawn or animated with more attention to the outlines or structures in the image.


```javascript
img.loadPixels();  // Get the pixel data of the image
edgeImg = createImage(img.width, img.height);  // Create a blank image with the same size as the original image
edgeImg.loadPixels();  // Get the pixel data of the blank image

for (let x = 0; x < img.width; x++) {
  for (let y = 0; y < img.height; y++) {
    let loc = (x + y * img.width) * 4;
    let r = img.pixels[loc];       // Get the red channel value of the current pixel
    let g = img.pixels[loc + 1];   // Get the green channel value of the current pixel
    let b = img.pixels[loc + 2];   // Get the blue channel value of the current pixel

    let gray = (r + g + b) / 3;    // Calculate the grayscale value
    edgeImg.pixels[loc] = gray;    // Assign the grayscale value to the edge image
    edgeImg.pixels[loc + 1] = gray;
    edgeImg.pixels[loc + 2] = gray;
    edgeImg.pixels[loc + 3] = 255; // Set the alpha value to 255 (fully opaque)
  }
}

edgeImg.updatePixels();   // Update the pixel data of the edge image
edgeImg.filter(THRESHOLD, 0.5); // Apply a threshold filter to generate a black-and-white binary image

```

This step is for edge detection and creating a grayscale version of the original image, followed by thresholding to generate a binary image. Here’s a breakdown of each part of the process:


	1.	 img.loadPixels();: This loads the pixel data of the original image so that it can be accessed and manipulated.

	2.	edgeImg = createImage(img.width, img.height);: Creates an empty image with the same dimensions as the original image to store the processed pixel data.
 
	3.	edgeImg.loadPixels();: Loads the pixel data for the empty image, which will be updated in the next steps.

	4.	Looping over each pixel: The loop iterates over every pixel in the original image (img). For each pixel, it:
 
	•	Extracts the RGB values (red, green, and blue channels).

	•	Calculates a grayscale value by averaging the RGB values, which represents the pixel’s brightness.

	•	Assigns this grayscale value to the corresponding pixel in the edgeImg. This effectively converts the original image into a grayscale image.

	5.	edgeImg.pixels[loc + 3] = 255;: Sets the alpha (transparency) of each pixel to 255, making it fully opaque.
	6.	edgeImg.updatePixels();: Updates the edgeImg pixel data after processing.
	7.	edgeImg.filter(THRESHOLD, 0.5);: Applies a threshold filter that converts the grayscale image into a binary (black and white) image. The threshold value of 0.5 means that any pixel with a grayscale value above 128 (half of 255) will be set to white, and any pixel with a grayscale value below 128 will be set to black. This is useful for detecting the edges in the image.



1.3: Step-by-Step Drawing of Images

1.  Randomly select pixels from the image and determine the z-coordinate in 3D space based on the pixel’s grayscale value.
	Code: The pixel location is randomly selected using random(0, edgeImg.width) and random(0, edgeImg.height). The grayscale value gray is used to calculate the corresponding z-coordinate in 3D space.

```javascript
let x = int(random(0, edgeImg.width));  // Randomly select a pixel location
let y = int(random(0, edgeImg.height));
let loc = (x + y * edgeImg.width) * 4;

let gray = edgeImg.pixels[loc];  // Get the grayscale value of the edge image

```



2. Map these pixel points to x, y, z coordinates in 3D space.
Code: The x and y coordinates from the image are mapped to x and y coordinates in 3D space. The z-coordinate is determined by the grayscale value.
```javascript
let x3d = map(x, 0, edgeImg.width, -width / 2, width / 2);  // Map to 3D space
let y3d = map(y, 0, edgeImg.height, -height / 2, height / 2);
let z3d = map(gray, 0, 255, 0, 100); // Determine the z-coordinate based on the grayscale value

```



3. Use randomized brush attributes (such as brush angle, size, transparency, etc.) to draw each pixel point and create a dynamic effect.
Code: strokeWeight is used to randomly adjust the brush size, stroke randomly adjusts the color and transparency, rotateZ randomly rotates the brush angle, and each pixel point is drawn. The brushAngle is randomly adjusted to increase rotational diversity.

```javascript
let r = img.pixels[(x + y * img.width) * 4];  // Get the color from the original image
let g = img.pixels[(x + y * img.width) * 4 + 1];
let b = img.pixels[(x + y * img.width) * 4 + 2];

strokeWeight(brushSize + random(-1, 1));  // Brush size
stroke(r, g, b, random(150, 255)); // Set the stroke color

push();
translate(x3d, y3d, z3d);  // Convert the coordinates to 3D space
rotateZ(brushAngle);  // Rotate the brush
point(0, 0);  // Draw the point
pop();

```

Randomization Effects

To enhance the artistic feel, several randomization factors are introduced during drawing:
	•	Randomly adjust the brush angle: brushAngle += random(-0.05, 0.05); The brush angle is randomly changed in each draw to create more dynamic results.
	•	Randomly vary the brush size: strokeWeight(brushSize + random(-1, 1)); The brush size changes randomly with each stroke, making the drawing more artistic.
	•	Random changes in transparency and color: stroke(r, g, b, random(150, 255)); Each pixel’s color and transparency change randomly, giving the drawing a sense of depth and variation.

These random factors make each drawing unique and artistic.


Through these steps, we successfully draw an artistic effect in 3D space based on the edges of the image, and by randomizing brush attributes, every drawing result is unique and full of artistic expression.
