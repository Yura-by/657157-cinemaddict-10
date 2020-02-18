export const createFooterTemplate = (movies) => {
  const countMovies = movies.length;
  return (
    `<footer class="footer">
      <section class="footer__logo logo logo--smaller">Cinemaddict</section>
      <section class="footer__statistics">
        <p>${countMovies} movies inside</p>
      </section>
    </footer>`
  );
};
