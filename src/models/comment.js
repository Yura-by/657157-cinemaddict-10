export default class Comment {
  constructor(data) {
    this.id = data.id ? data.id : ``;
    this.author = data.author ? data.author : ``;
    this.emotion = data.emotion;
    this.comment = data.comment;
    this.date = data.date;
  }

  toRAW() {
    return {
      'emotion': this.emotion,
      'comment': this.comment,
      'date': this.date
    };
  }

  static parseComment(data) {
    return new Comment(data);
  }

  static parseComments(data) {
    return data.map(Comment.parseComment);
  }
}
