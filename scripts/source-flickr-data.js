const fs = require('fs');
const SLIDE_DIR = 'assets/img/slides';
const DATA_PATH = 'data/slides.js';
const https = require('https');

function getFilename(imgUrl) {
  const imgUrlArr = imgUrl.split('/');
  return imgUrlArr[imgUrlArr.length - 1]
}

function setInitialMap({ photo }) {
  imageMap = {};

  for (let index = 0; index < photo.length; index++) {
    const img = photo[index];
    imageMap[img.id] = {
      order: index + 1,
      url: img.url_m || img.url_o,
      id: img.id
    }
  }

  return imageMap;
}

function download(url, dest) {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(dest)) {
      return resolve(dest);
    }

    const file = fs.createWriteStream(dest);
    https.get(url, function(response) {
      response.on('error', (error) => {
        reject(error);
      });

      response.pipe(file);

      file.on('finish', function() {
        file.close(() => console.log(`File downloaded to ${dest}`));
        resolve(dest);
      });
    });
  });
}

function getEndpoint() {
  const url = new URL("https://api.flickr.com/services/rest");
  let params = new URLSearchParams();
  params.set('method', 'flickr.photosets.getPhotos');
  params.set('api_key', '87b8cc4a3b91905bef80d87830eb658c');
  params.set('user_id', '164697344@N07');
  params.set('photoset_id', '72177720295822995');
  params.set('extras', 'url_o,url_m');
  params.set('format', 'json')
  params.set('nojsoncallback', 1);
  url.search = params.toString();
  return url.toString();
}

function makeRequest() {
  return new Promise((resolve, reject) => {
    try {
      const endpoint = getEndpoint();
      https.get(endpoint, (res) => {

        if (res?.statusCode !== 200) {
          return reject('Could not fetch data from Flickr');
        }

        const photoset = [];

        res.on('data', chunk => {
          photoset.push(chunk);
        })

        res.on('end', () => {
          resolve(JSON.parse(Buffer.concat(photoset).toString()));
        })
      });
    } catch (error) {
      reject(error);
    }
  });
}

async function buildDataset(images) {
  if (fs.existsSync(DATA_PATH)) {
    fs.unlinkSync(DATA_PATH);
  }

  const sortByOrder = (a, b) => images[a] < images[b] ? -1 : 1;
  const transformToSlideShape = (key) => ({ url: images[key].url });
  const mapToArray = Object.keys(images).sort(sortByOrder).map(transformToSlideShape);
  fs.writeFileSync(DATA_PATH, `window.SLIDE_DATA = ${JSON.stringify(mapToArray)};`);
}

(async function run() {
  try {
    if (process.argv[2] === '--fresh') {
      fs.rmdirSync(SLIDE_DIR, { recursive: true });
    }

    if (!fs.existsSync(SLIDE_DIR)) {
      fs.mkdirSync(SLIDE_DIR);
    }

    const { photoset } = await makeRequest();

    // to retain order we keep an original mapping of the photoset
    const imageMap = setInitialMap(photoset);

    for (const photo of photoset.photo) {
      if (photo.url_o) {
        const filename = getFilename(photo.url_o);
        const dest = `${SLIDE_DIR}/${filename}`;
        const localPath = await download(photo.url_o, dest);
        imageMap[photo.id] = {
          url: localPath
        };
      } else {
        throw new Error(`Couldn't locate url_o on file: ${JSON.stringify(photo)}`);
      }
    }

    await buildDataset(imageMap);
  } catch (error) {
    console.error(error);
  }
})()