export default class Movie {
  constructor(data) {
    this.id = data.id;
    this.filmInfo = {
      title: data.filmInfo.title,
      alternativeTitle: data.filmInfo.alternativeTitle,
      totalRating: data.filmInfo.totalRating,
      poster: data.filmInfo.poster,
      ageRating: data.filmInfo.ageRating,
      director: data.filmInfo.director,
      writers: data.filmInfo.writers,
      actors: data.filmInfo.actors,
      release: {
        date: new Date(data.filmInfo.release.date),
        releaseCountry: data.filmInfo.release.releaseCountry
      },
      runtime: data.filmInfo.runtime,
      genre: data.filmInfo.genre,
      description: data.filmInfo.description
    };
    this.userDetails = {
      personalRating: data.userDetails.personalRating,
      watchlist: data.userDetails.watchlist,
      alreadyWatched: data.userDetails.alreadyWatched,
      watchingDate: data.userDetails.watchingDate ? new Date(data.userDetails.watchingDate) : null,
      favorite: data.userDetails.favorite
    };
    this.comments = data.comments;
  }

  toRAW() {
    return {
      'id': this.id,
      'filmInfo': {
        'title': this.filmInfo.title,
        'alternativeTitle': this.filmInfo.alternativeTitle,
        'totalRating': this.filmInfo.totalRating,
        'poster': this.filmInfo.poster,
        'ageRating': this.filmInfo.ageRating,
        'director': this.filmInfo.director,
        'writers': this.filmInfo.writers,
        'actors': this.filmInfo.actors,
        'release': {
          'date': this.release.date.toISOString(),
          'releaseCountry': this.release.releaseCountry
        },
        'runtime': this.filmInfo.runtime,
        'genre': this.filmInfo.genre,
        'description': this.filmInfo.description
      },
      'userDetails': {
        'personalRating': this.userDetails.personalRating,
        'watchlist': this.userDetails.watchlist,
        'alreadyWatched': this.userDetails.alreadyWatched,
        'watchingDate': this.userDetails.watchingDate.toISOString(),
        'favorite': this.userDetails.favorite
      },
      'comments': this.comments
    };
  }
}
