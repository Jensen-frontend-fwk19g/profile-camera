if( 'serviceWorker' in navigator ) {
    navigator.serviceWorker.register('sw.js')
    .then(reg => {
        console.log('Service worker registered.');
    })
}

// async function allowCamera() {
//     if( 'mediaDevices' in navigator ) {
//         const md = navigator.mediaDevices;
//         let stream = await md.getUserMedia({
//             audio: false,
//             video: true
//         });
//     }
// }
//allowCamera();


window.addEventListener('load', () => {
    if( 'mediaDevices' in navigator ) {
        cameraSettings();
    }
})

function cameraSettings() {
    const errorMessage = document.querySelector('.video > .error');
    const startButton = document.querySelector('.video .start-stream');
    const stopButton = document.querySelector('.video .stop-stream');
    const photoButton = document.querySelector('.profile button');
    const profilePic = document.querySelector('.profile > img');
    const startRecording = document.querySelector('.video .start-recording');
    const stopRecording = document.querySelector('.video .stop-recording');
    const downloadLink = document.querySelector('.video .downloadLink');
    // .profile > p > button  --> 012, omständigt men mer specifikt
    // .profile       button  --> 011, enklare

    let stream;
    startButton.addEventListener('click', async () => {
        errorMessage.innerHTML = '';
        try {
            const md = navigator.mediaDevices;
            stream = await md.getUserMedia({
                video: { width: 320, height: 320 }
            })

            const video = document.querySelector('.video > video');
            video.srcObject = stream;
            stopButton.disabled = false;
            photoButton.disabled = false;
            startButton.disabled = true;
            startRecording.disabled = false;
        } catch (e) {
            // Visa felmeddelande för användaren:
            errorMessage.innerHTML = 'Could not show camera window.';
        }
    })
    stopButton.addEventListener('click', () => {
        errorMessage.innerHTML = '';
        if( !stream ) {
            errorMessage.innerHTML = 'No video to stop.';
            return;
        }
        // hur stoppa strömmen? Kolla dokumentationen
        let tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
        stopButton.disabled = true;
        photoButton.disabled = true;
        startButton.disabled = false;
        startRecording.disabled = true;
        stopRecording.disabled = true;
    })

    photoButton.addEventListener('click', async () => {
        errorMessage.innerHTML = '';
        if( !stream ) {
            errorMessage.innerHTML = 'No video to take photo from.';
            return;
        }

        let tracks = stream.getTracks();
        let videoTrack = tracks[0];
        let capture = new ImageCapture(videoTrack);
        let blob = await capture.takePhoto();

        let imgUrl = URL.createObjectURL(blob);
        profilePic.src = imgUrl;
    })

    let mediaRecorder;
    startRecording.addEventListener('click', async () => {
        if( !stream ) {
            errorMessage.innerHTML = 'No video available';
            return;
        }
        startRecording.disabled = true;
        stopRecording.disabled = false;
        mediaRecorder = new MediaRecorder(stream);
        let chunks = [];
        mediaRecorder.addEventListener('dataavailable', event => {
            console.log('mediaRecorder.dataavailable: ', event);
            const blob = event.data;
            if( blob.size > 0 ) {
                chunks.push(blob);
            }
        });
        mediaRecorder.addEventListener('stop', event => {
            const blob = new Blob(chunks, { type: 'video/webm' });

        })
        mediaRecorder.start();
    })
    stopRecording.addEventListener('click', async () => {
        if( mediaRecorder ) {
            stopRecording.disabled = true;
            startRecording.disabled = false;
            mediaRecorder.stop();
            mediaRecorder = null;
        } else {
            errorMessage.innerHTML = 'No recording to stop.';
        }
    })
}
