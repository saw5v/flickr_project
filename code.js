class FlickrGallery {
    constructor(location) {
        this.location = location
        this.container = document.getElementById("photoContainer")
        this.page = 1
        this.perPage = 5
        this.currentPhotoIndex = 0
        this.photos = []
        document.getElementById("next").addEventListener("click", this.displayNextPhoto.bind(this))

    }
    displayNextPhoto(){
        this.currentPhotoIndex += 1 
        console.log("will display next photo")

        if(this.currentPhotoIndex < this.photos.length) {
            let photoObject = this.photos[this.currentPhotoIndex]
            this.displayPhotoObject(photoObject)
            }
        else{
            console.log("fetching another page of photos from Flickr")
            this.page += 1
            this.currentPhotoIndex = 0
            this.fetchDataFromFlickr()


        }
        
    }
    refresh(){
        this.page = 0
        this.perPage = 5
        this.currentPhotoIndex = 0
        this.photos = []
        
    }

    displayPhotoObject(photoObj) {
        let imageUrl = this.constructImageURL(photoObj);
        let img = document.createElement("img")
        img.src = imageUrl
        let container = document.getElementById("photoContainer")
        this.container.innerHTML = ""
        this.container.append(img)
        console.log(imageUrl)
    }
    processFlickrResponse(parsedResponse) {
        console.log(parsedResponse)
        this.photos = parsedResponse.photos.photo
        if(this.photos.length > 0) {
            let firstPhotoObject = this.photos[this.currentPhotoIndex]
            this.displayPhotoObject(firstPhotoObject)
        }else{
            this.refresh()
        
            }

        }




    
    fetchDataFromFlickr() {
        let url = this.generateApiUrl();
        let fetchPromise = fetch(url)
        fetchPromise
            .then(response => response.json())
            .then(parsedResponse => this.processFlickrResponse(parsedResponse))
    }

    generateApiUrl(term = "dog") {
        return 'https://shrouded-mountain-15003.herokuapp.com/https://flickr.com/services/rest/' +
            '?api_key=3b129ce6cabdea5fee73e67c89fb2132' +
            '&format=json' +
            '&nojsoncallback=1' +
            '&method=flickr.photos.search' +
            '&safe_search=1' +
            '&per_page=' + this.perPage +
            '&page=' + this.page +
            '&text=' + term +
            '&lat=' + this.location.latitude +
            '&lon=' + this.location.longitude;
    }


    constructImageURL(photoObj) {
        return "https://live.staticflickr.com/" + photoObj.server + "/" + photoObj.id + "_" + photoObj.secret + ".jpg";
    }
}








function onGeolocationSuccess(data) {
    let location = data.coords;
    let gallery = new FlickrGallery(location)
    gallery.fetchDataFromFlickr()
    console.log(data.coords)
}



function onGeolocationError() {
    console.log("we couldn't get your location so we are using a fallback location")
    let fallbackLocation = {
        latitude: 35.0456,
        longitude: 85.3097
    } //Chattanooga, TN
    let gallery = new FlickrGallery(fallbackLocation)
    // let gallery = new FlickGallery(fallbackLocation)
    // gallery.fetchDataFromFlickr()
}

navigator.geolocation.getCurrentPosition(onGeolocationSuccess, onGeolocationError)

// navigator.geolocation.watchPosition(onGeolocationSuccess,onGeolocationError)