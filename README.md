# Image Fetching & Mediapipe

This project uses the Mediapipe library to detect objects in images. user can search for images and save/delete from cache

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You need to import the following libraries:

```javascript
import {
    ObjectDetector,
    FilesetResolver,
  } from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.2";
```

### Running the Project

1. Initialize the object detector:

```javascript
let objectDetector;
let runningMode = "IMAGE";

const initializeObjectDetector = async () => {
    const vision = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.2/wasm"
    );
    objectDetector = await ObjectDetector.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: `https://storage.googleapis.com/mediapipe-models/object_detector/efficientdet_lite0/float16/1/efficientdet_lite0.tflite`,
        delegate: "GPU"
      },
      scoreThreshold: 0.5,
      runningMode: runningMode
    });
  };
initializeObjectDetector();
```

2. Grab a bunch of images from the page and detect them upon click:

```javascript
const imageContainers = document.getElementsByClassName(
    "detectOnClick"
  );
  
for (let imageContainer of imageContainers) {
    imageContainer.children[0].addEventListener("click", handleClick);
}
```

3. Detect objects in still images on click:

```javascript
async function handleClick(event) {
    // ... your code here ...
}
```

4. Display image detections:

```javascript
function displayImageDetections(
    result,
    resultElement,
  ) {
    // ... your code here ...
}
```

## Built With

* [Mediapipe](https://mediapipe.dev/) - Cross-platform, customizable ML solutions for live and streaming media.

## Authors

* **Rocien Nkunga** - *Initial work* - [Rocien](https://github.com/Rocien)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Hat tip to anyone whose code was used
* Inspiration
