import axios from 'axios';


export const searchImages = async (search = 'dogs', page = 1, limit = 12) => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `https://api.flickr.com/services/rest/?method=flickr.photos.getRecent&per_page=20&page=1&api_key=6f102c62f41998d151e5a1b48713cf13&format=json&nojsoncallback=1&extras=url_s`,
        {},
      )
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        reject(err);
      });
  });
};
