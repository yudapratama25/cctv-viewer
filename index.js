// const videoPlayer = document.getElementById('video-player');
const elementListCctv  = document.getElementById('list-cctv');
const elementContainer = document.getElementById('container');
const elementInputLocation = document.getElementById('search-location')
const modalInfo = document.getElementById('modal-info')
const buttonInfo = document.getElementById('button-info')
const buttonCloseModal = document.getElementById('button-close-modal')
const body = document.getElementsByTagName('body')[0]
const basePath = (window.location.hostname === 'yudapratama25.github.io') ? 'https://yudapratama25.github.io/cctv-viewer/' : '/'

let widthDevice = screen.width

let apis = []

let listCctv = []

let selectedLocations = []

const buildListCctv = () => {
    let html = ``;

    listCctv.map((data, index) => {
        html += `<li class="px-2 py-1 text-sm rounded-lg shadow">
                    <input type="checkbox" id="location-${data.id}" class="me-1" onchange="selectCctv(${index},'${data.id}')"${selectedLocations.includes(data.id.toString()) ? ' checked' : ''}/>
                    <label for="location-${data.id}" class="text-white">${data.location}</label>
                </li>`;
    });

    if (widthDevice > 640) {
        if (listCctv.length < 15) {
            elementListCctv.style.gridTemplateRows = 'repeat(3, auto)'
        } else if (listCctv.length < 25) {
            elementListCctv.style.gridTemplateRows = 'repeat(5, auto)'
        } else {
            elementListCctv.style.gridTemplateRows = 'repeat(10, auto)'
        }
    } else {
        elementListCctv.style.gridTemplateRows = 'repeat(5, auto)'
    }

    elementListCctv.innerHTML = html
}

const adjustVideoPlayerSize = () => {
    let numberOfSelectedLocation = selectedLocations.length

    const videoPlayers = document.getElementsByClassName('video-player')

    if (widthDevice > 768) {
        if (numberOfSelectedLocation == 1) {
            elementContainer.classList.add('h-screen')
        } else {
            elementContainer.classList.remove('h-screen')
        }
    }

    for (let index = 0; index < videoPlayers.length; index++) {
        if (numberOfSelectedLocation == 1) {
            videoPlayers[index].classList.add('h-full')
            videoPlayers[index].classList.add('w-full')
        } else {
            videoPlayers[index].classList.remove('h-full')
            videoPlayers[index].classList.remove('w-full')
        }
    }
}

const selectCctv = (indexData, cctvId) => {

    if (selectedLocations.includes(cctvId)) { // unselect location
        selectedLocations = selectedLocations.filter((id) => id !== cctvId)

        document.getElementById(`container-video-player-${cctvId}`).remove();

        setTimeout(() => {
            adjustVideoPlayerSize()
        }, 600);

        return false;
    }

    if (selectedLocations.length == 6) {
        document.getElementById(`location-${cctvId}`).checked = false
        alert('Maksimal hanya dapat menampilkan 6 lokasi.')
        return false;
    }

    const dataCctv = listCctv[indexData];

    const padding = (widthDevice < 640) ? '' : ' p-3'

    const infoCctv = (widthDevice < 640) ? 'bottom-0 left-0' : 'bottom-3 left-3'

    const refreshButton = (widthDevice < 640) ? 'bottom-0 right-0' : 'bottom-3 right-3'

    let html = `<div id="container-video-player-${cctvId}" class="video-player relative${padding}">
                    <video
                        id="video-player-${cctvId}" 
                        class="h-full block rounded-lg" 
                        name="media" 
                        autoplay="" 
                        muted="" 
                        playsinline="" 
                        poster="${basePath}assets/images/loading.jpg"
                        src="${dataCctv.api}"
                        type="video/fmp4">
                    </video>
                    <span class="absolute ${infoCctv} px-1 bg-slate-800 text-white text-sm rounded rounded-bl-lg">${dataCctv.location}</span>
                    <div class="absolute ${refreshButton} px-1 bg-slate-800/30 text-white text-sm rounded rounded-br-lg backdrop-opacity-10 hover:cursor-pointer" onclick="refreshVideo('${cctvId}')">
                        <img src="${basePath}assets/images/ic-refresh.png" class="w-7"/>
                    </div>
                </div>`;

    elementContainer.insertAdjacentHTML('afterbegin', html);

    selectedLocations.push(cctvId)

    setTimeout(() => {
        adjustVideoPlayerSize()
    }, 600);
}

const fetchDataApi = async () => {
    await fetch('./cctvSamarinda.json')
            .then(response => response.json())
            .then(data => {
                apis = data.apis
                listCctv = apis
            })
            .catch(error => console.log(error))
}

const searchLocation = (e) => {
    let keyword = e.target.value.toLowerCase().trim()

    if (keyword === '') {
        listCctv = apis
    } else {
        listCctv = apis.filter(data => data.location.toLowerCase().includes(keyword))
    }

    buildListCctv()
}

const refreshVideo = (id) => {
    let videoPlayer = document.getElementById(`video-player-${id}`)
    let src = videoPlayer.getAttribute('src')
    videoPlayer.setAttribute('src', '')
    
    setTimeout(() => {
        videoPlayer.setAttribute('src', src)
    }, 500);
}

( async function() {
    fetchDataApi().then(response => {
        buildListCctv()
    })

    elementInputLocation.addEventListener('keyup', searchLocation)

    buttonInfo.onclick = function () {
        modalInfo.style.display = 'block'
        body.style.overflow = 'hidden'
    }

    buttonCloseModal.onclick = function () {
        modalInfo.style.display = 'none'
        body.style.overflow = 'auto'
    }

    window.onclick = function (event) {
        if (event.target == modalInfo) {
            modalInfo.style.display = 'none'
            body.style.overflow = 'auto'
        }
    }
})();