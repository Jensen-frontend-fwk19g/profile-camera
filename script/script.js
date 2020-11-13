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
        const startButton = document.querySelector('.video > .start-stream');
        const stopButton = document.querySelector('.video > .stop-stream');
        const photoButton = document.querySelector('.profile button');
        const profilePic = document.querySelector('.profile > img');
        // .profile > p > button  --> 012, omständigt men mer specifikt
        // .profile       button  --> 011, enklare

        let stream;
        startButton.addEventListener('click', async () => {
            const md = navigator.mediaDevices;
            stream = await md.getUserMedia({
                video: { width: 320, height: 320 }
            })

            const video = document.querySelector('.video > video');
            video.srcObject = stream;
        })
        stopButton.addEventListener('click', () => {
            if( stream ) {
                // hur stoppa strömmen? Kolla dokumentationen
                let tracks = stream.getTracks();
                tracks.forEach(track => track.stop());
            }
        })

        photoButton.addEventListener('click', async () => {
            if( !stream )
                return;

            let tracks = stream.getTracks();
            let videoTrack = tracks[0];
            let capture = new ImageCapture(videoTrack);
            let blob = await capture.takePhoto();

            let imgUrl = URL.createObjectURL(blob);
            profilePic.src = imgUrl;
        })
    }
})
