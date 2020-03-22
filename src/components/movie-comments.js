import AbstractComponent from './abstract-component.js';
import {getCommentDate} from '../utils/common.js';

// const gateDifferenceDays = (dateComment) => {
//   const startDate = new Date(dateComment);
//   const dateNow = Date.now();
//   const resultDays = [];

//   while (startDate < dateNow) {
//     resultDays.push(startDate.getTime());
//     startDate.setDate(startDate.getDate() + 1);
//   }

//   return resultDays.length;
// };

const getCommentsMarkup = (comments) => {
  return comments.map((commentItem) => {
    const {id, emotion, comment, author, date} = commentItem;
    const coutnDays = getCommentDate(date);
    return (
      `<li class="film-details__comment">
        <span class="film-details__comment-emoji">
          <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji">
        </span>
        <div>
          <p class="film-details__comment-text">${comment}</p>
          <p class="film-details__comment-info">
            <span class="film-details__comment-author">${author}</span>
            <span class="film-details__comment-day">${coutnDays}</span>
            <button class="film-details__comment-delete" data-comment-id="${id}">Delete</button>
          </p>
        </div>
      </li>`
    );
  }).join(`\n`);
};

const createCommentsTemplane = (movie, urlEmoji, commentText) => {
  const {comments} = movie;
  const countComments = comments.length;
  const commentsMarkup = getCommentsMarkup(comments);
  const imageMarkup = urlEmoji ? `<image class="film-details__add-emoji-image" src="${urlEmoji}" width="100%" height="100%" alt="Emotion">` : ``;
  const commentValue = commentText ? commentText : ``;
  return (
    `<div class="form-details__bottom-container">
      <section class="film-details__comments-wrap">
      <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${countComments}</span></h3>

        <ul class="film-details__comments-list">
          ${commentsMarkup}
        </ul>

        <div class="film-details__new-comment">
          <div for="add-emoji" class="film-details__add-emoji-label">${imageMarkup}</div>

          <label class="film-details__comment-label">
          <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${commentValue}</textarea>
          </label>

          <div class="film-details__emoji-list">
            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="sleeping">
            <label class="film-details__emoji-label" for="emoji-smile">
              <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji" data-reaction="smile">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="neutral-face">
            <label class="film-details__emoji-label" for="emoji-sleeping">
              <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji" data-reaction="sleeping">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-gpuke" value="grinning">
            <label class="film-details__emoji-label" for="emoji-gpuke">
              <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji" data-reaction="puke">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="grinning">
            <label class="film-details__emoji-label" for="emoji-angry">
              <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji" data-reaction="angry">
            </label>
          </div>
        </div>
      </section>
    </div>`
  );
};

export default class MovieComments extends AbstractComponent {
  constructor(movie, urlEmoji, commentText) {
    super();
    this._movie = movie;
    this._urlEmoji = urlEmoji;
    this._commentText = commentText;
  }

  getTemplate() {
    return createCommentsTemplane(this._movie, this._urlEmoji, this._commentText);
  }
}
