import {createDescriptionTemplate} from './movie-description.js';
import {createRatingTemplate} from './movie-rating.js';
import {createCommentsTemplane} from './movie-comments.js';

export const createMovieInfoTemplane = (movie) => {
  const descriptionTemplate = createDescriptionTemplate(movie);
  const ratingTemplate = createRatingTemplate(movie);
  const commentsTemplate = createCommentsTemplane(movie);
  return (
    `<section class="film-details">
      <form class="film-details__inner" action="" method="get">
        ${descriptionTemplate}
        ${ratingTemplate}
        ${commentsTemplate}
      </form>
    </section>`
  );
};
