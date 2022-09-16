const videos = {
  providers: {
    vimeo: 'vimeo',
    youtube: 'youtube'
  },

  /**
   * Store video player references on window so we can
   * programmatically work with them later
   */
  players: {
    youtube: {},
    vimeo: {}
  },
  /**
   * YT and Vimeo have very similar interfaces so in
   * this case we'll add them create a map for a cleaner impl below
   */
  libs: {
    vimeo: Vimeo,
    youtube: undefined
  },
}

/**
 * @typedef {Object} Video
 * @property {string} id
 * @property {'vimeo'|'youtube'} provider
 * // YouTube video id
 * @property {string?} videoId
 */

/**
 * @todo move this schema into a database and fetch via API
 * @type {Video[]}
 */
const videoCollection = [
  {
    id: '747329677',
    provider: videos.providers.vimeo
  },
  {
    id: '555142330',
    provider: videos.providers.vimeo
  }
]

/**
 * @param {Video} video
 */
function formatOptions(video) {
  const defaultOptions = {
    width: 500,
    height: 500
  };

  const videoCopy = {...video, ...defaultOptions};

  if (video.provider === videos.providers.vimeo) {
    videoCopy;
  }

  if (video.provider === videos.providers.youtube) {
    videoCopy.videoId = video.id;
  }

  return videoCopy;
}

/**
 * @param {Video} video
 */
function embedVideo(video) {
  if (!videos.libs[video.provider]) {
    throw new Error('Could not embed video. Unsupported video provider');
  }

  videos.players[video.provider][video.id] = new videos.libs[video.provider].Player(
    video.id,
    formatOptions(video)
  );
}

/**
 * @param {Video} video
 * @param {HTMLElement} container
 */
function appendChildWrapper(video, container) {
  const col = document.createElement('div');
  col.classList.add('col', 's12', 'm6', 'l4', 'video');

  if (video.provider === videos.providers.youtube) {
    const temporaryDiv = document.createElement('div');
    temporaryDiv.id = video.id;
    col.appendChild(temporaryDiv);
  } else {
    col.id = video.id;
  }

  container.appendChild(col);
}

function onYouTubeIframeAPIReady() {
  videos.libs.youtube = YT;
  const container = document.getElementById('videos');

  for (const video of videoCollection) {
    appendChildWrapper(video, container);
    embedVideo(video);
  }
}