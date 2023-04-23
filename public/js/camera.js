let cameraView;

let constraints = {
    audio: false,
    video: {
        facingMode: "environment",
    }
};

// Access the device camera and stream to cameraView
function cameraStart() {
    cameraView = document.querySelector("#webcam");
    navigator.mediaDevices
        .getUserMedia(constraints)
        .then(function(stream) {
        cameraView.srcObject = stream;
    })
    .catch(function(error) {
        console.error("Oops. Something is broken.", error);
    });
}

// Start the video stream when the window loads
window.addEventListener("load", cameraStart, false);