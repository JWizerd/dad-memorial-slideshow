# Grandma Barb Memorial Slideshow

## Integrations
- Flickr API: [flickr.photosets.getPhotos](https://www.flickr.com/services/api/flickr.photosets.getPhotos.html)
- [Tiny Slider](https://github.com/ganlanyuan/tiny-slider)

## Commands

Source images from Flickr API, then build a dataset to be consumed by the client
```shell
node scripts/source-flickr-data.js
```

Delete local images and re-run build
```shell
node scripts/source-flickr-data.js --fresh
```
