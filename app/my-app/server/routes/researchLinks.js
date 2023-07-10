const request = require("superagent");
const configs = require("../../CD/Configs");
const getRequest = (url) => request.get(url).set('Access-Control-Allow-Origin', '*')

const fullVideoSign = 'watch?v='
const shortsVideoSign = '/shorts/'

const isYoutubeRelated = link => link.includes('www.youtube')
const isYoutubeVideo = link => isYoutubeRelated(link) && (link.includes(fullVideoSign) || link.includes(shortsVideoSign))
const isYoutubeChannel = link => isYoutubeRelated(link) && !isYoutubeVideo(link)
const getYoutubeVideoId = link => {
  if (link.includes(fullVideoSign)) {
    var arr = link.split(fullVideoSign)[1]
    var videoId = arr.split('&')[0]

    return videoId
  }

  if (link.includes(shortsVideoSign)) {
    arr = link.split(shortsVideoSign)[1]
    videoId = arr.split('&')[0]

    return videoId
  }

  return '11111'
}

const getYoutubeVideoInfo = async videoId => {
  var videoApiLink = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${configs.GOOGLE_YOUTUBE_KEY}`

  var response = await getRequest(videoApiLink)

  var data = response.body
  console.log('getLinkName', {data})
  var snippet = data.items[0].snippet
  var title = snippet.title
  var channelId = snippet.channelId;

  return Promise.resolve({
    title, channelId
  })
}
const getYoutubeChannelInfo = async channelId => {
  // var channelApiLink = `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${channelId}&key=${configs.GOOGLE_YOUTUBE_KEY}`
  var channelApiLink = `https://www.googleapis.com/youtube/v3/channels?part=statistics,snippet&id=${channelId}&key=${configs.GOOGLE_YOUTUBE_KEY}`
  var response = await getRequest(channelApiLink)

  var data = response.body
  console.log('getLinkName', {data})

  var item = data.items[0];
  var snippet = item.snippet
  var channelName = snippet.title
  var channelUrl = snippet.customUrl;

  var statistics = item.statistics
  console.log({statistics})
  var users = statistics.hiddenSubscriberCount ? 0 : parseInt(statistics.subscriberCount)

  return Promise.resolve({
    channelName, channelUrl, users
  })
}


const getLinkName = async (req, res) => {
  var link = req.body.link;

  console.log({link})
  try {
    if (isYoutubeRelated(link)) {
      if (isYoutubeVideo(link)) {
        var videoId = getYoutubeVideoId(link)

        var {channelId, title} = await getYoutubeVideoInfo(videoId)
        var {channelName, channelUrl, users} = await getYoutubeChannelInfo(channelId)

        res.json({
          channelId,
          name: title,
          channelName,
          channelUrl,
          users
        })
        return
      }

      if (isYoutubeChannel(link)) {

      }
    }
  } catch (e) {
  }

  res.json({name: ''})
}

module.exports = {
  getLinkName
}