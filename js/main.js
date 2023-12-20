// Copyright 2023 The MediaPipe Authors.

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at

//      http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import {
    ObjectDetector,
    FilesetResolver,
  } from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.2";
    
  let objectDetector;
  let runningMode = "IMAGE";
  
  // Initialize the object detector
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
  
  /********************************************************************
   // Demo 1: Grab a bunch of images from the page and detection them
   // upon click.
   ********************************************************************/
  
  const imageContainers = document.getElementsByClassName(
    "detectOnClick"
  );
  
  for (let imageContainer of imageContainers) {
    imageContainer.children[0].addEventListener("click", handleClick);
  }
  
  /**
   * Detect objects in still images on click
   */
  async function handleClick(event) {
    const highlighters = event.target.parentNode.getElementsByClassName(
      "highlighter"
    );
    while (highlighters[0]) {
      highlighters[0].parentNode.removeChild(highlighters[0]);
    }
  
    const infos = event.target.parentNode.getElementsByClassName("info");
    while (infos[0]) {
      infos[0].parentNode.removeChild(infos[0]);
    }
  
    if (!objectDetector) {
      alert("Object Detector is still loading. Please try again.");
      return;
    }
  
    // if video mode is initialized, set runningMode to image
    if (runningMode === "VIDEO") {
      runningMode = "IMAGE";
      await objectDetector.setOptions({ runningMode: "IMAGE" });
    }
  
    const ratio = event.target.height / event.target.naturalHeight;
  
    // objectDetector.detect returns a promise which, when resolved, is an array of Detection objects
    const detections = objectDetector.detect(event.target);
    displayImageDetections(detections, event.target);
  }
  
  function displayImageDetections(
    result,
    resultElement,
  ) {
    const ratio = resultElement.height / resultElement.naturalHeight;
    console.log(ratio);
  
    for (let detection of result.detections) {
      // Description text
      const p = document.createElement("p");
      p.setAttribute("class", "info");
      p.innerText =
        detection.categories[0].categoryName +
        " - with " +
        Math.round(parseFloat(detection.categories[0].score) * 100) +
        "% confidence.";
      // Positioned at the top left of the bounding box.
      // Height is whatever the text takes up.
      // Width subtracts text padding in CSS so fits perfectly.
      p.style =
        "left: " +
        detection.boundingBox.originX * ratio +
        "px;" +
        "top: " +
        detection.boundingBox.originY * ratio +
        "px; " +
        "width: " +
        (detection.boundingBox.width * ratio - 10) +
        "px;";
      const highlighter = document.createElement("div");
      highlighter.setAttribute("class", "highlighter");
      highlighter.style =
        "left: " +
        detection.boundingBox.originX * ratio +
        "px;" +
        "top: " +
        detection.boundingBox.originY * ratio +
        "px;" +
        "width: " +
        detection.boundingBox.width * ratio +
        "px;" +
        "height: " +
        detection.boundingBox.height * ratio +
        "px;";
  
      resultElement.parentNode.appendChild(highlighter);
      resultElement.parentNode.appendChild(p);
    }
  } 







































let savedItems = JSON.parse(localStorage.getItem('savedItems')) || [];

function fetchApi(query) {

    fetch(`https://api.pexels.com/v1/search?query=${query}&per_page=8000`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': "9JQeNTTdYaKFEnuG9ZmWAfT2o7avaB2IyxA8h67Kn2JAkRZTCg5uIn16"
        }
    })
    .then(response => response.json())
    .then(data => {
        let output = document.getElementById('searchOutput');
        output.innerHTML = '';
        data.photos.forEach(photo => {
            let img = document.createElement('img');
            img.src = photo.src.medium;
            img.onclick = function() {
                document.getElementById('dialogImg').src = photo.src.large;
                document.getElementById('dialog').showModal();
            };
            output.appendChild(img);
        });
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

// Added EventListener to my search button to display search popup box
document.getElementById('search').addEventListener('click', function() {
    document.getElementById('searchBox').style.display = "block"; 
});

// Added EventListener to run search when click the button,
document.getElementById('runSearch').addEventListener('click', function() {
    let query = document.getElementById('searchInput').value;
    fetchApi(query); // Calling the function fetchApi when enter the value and run the search
    document.getElementById('searchBox').style.display = "none";
    document.getElementById('searchOutput__text').innerText = 'Result for ' + query;
});

// Added EventListener to cancel and close the search box
document.getElementById('cancelAction').addEventListener('click', function() {
    document.getElementById('searchBox').style.display = "none";
});

// Added EventListener for cancel button to close dialog box when picture is opened
document.getElementById('cancel').addEventListener('click', function() {
    document.getElementById('dialog').close();
});

document.getElementById('savedCancel').addEventListener('click', function() {
    document.getElementById('savedDialog').close();
});

// EventListener for saving image and close the dialog box
document.getElementById('save').addEventListener('click', function() {
    let url = document.getElementById('dialogImg').src;
    savedItems.push(url);
    localStorage.setItem('savedItems', JSON.stringify(savedItems));
    caches.open('images').then(cache => cache.add(url));
    document.getElementById('dialog').close();
});


// Added eventListener for saved button
document.getElementById('saved').addEventListener('click', function() {
    let output = document.getElementById('searchOutput');
    output.innerHTML = '';
    savedItems.forEach(url => {
        caches.match(url).then(response => {
            if (response) {
                let img = document.createElement('img');
                img.src = url;
                img.onload = function() {
                    img.onclick = function() {
                        document.getElementById('saved-dialogImg').src = url;
                        document.getElementById('savedDialog').showModal();
                    };
                };
                output.appendChild(img);
            }
        });
    });
});

// EventListener for delete image button in the saved local storage box
document.getElementById('saved-Save').addEventListener('click', function() {
    let url = document.getElementById('saved-dialogImg').src;
    let index = savedItems.indexOf(url);
    if (index !== -1) {
        savedItems.splice(index, 1);
        localStorage.setItem('savedItems', JSON.stringify(savedItems));
    }
    document.getElementById('savedDialog').close();
    // Added click() to refresh the saved images
    document.getElementById('saved').click();
});





