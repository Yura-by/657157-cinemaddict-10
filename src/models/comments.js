export default class Comments {
  constructor() {
    this._comments = [];
  }

  addComments(newComments) {
    if(newComments instanceof Array) {
      this._comments = this._comments.concat(...newComments);
    } else {
      this._comments = this._comments.concat(newComments);
    }
  }

  getComment(id) {
    return this._comments.find((it) => it.id = id);
  }

  removeComment(id) {
    const index = this._comments.find((comment) => {
      comment.id === id;
    });
    if(index === -1) {
      return false;
    }
    this._comments = [].concat(this._comments.slice(0, index), this._comments.slice(index + 1));
    return true;
  }

  clearComments() {
    this._comments = [];
  }
}
