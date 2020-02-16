const Status = {
  NOVISE: `Novice`,
  FAN: `Fan`,
  BUFF: `Movie Buff`
};

export const createProfileTemplate = (countWatched) => {
  let status = ``;
  switch (true) {
    case countWatched > 0 && countWatched <= 10 :
      status = Status.NOVISE;
      break;
    case countWatched > 10 && countWatched <= 20 :
      status = Status.FAN;
      break;
    case countWatched > 20:
      status = Status.BUFF;
      break;
  }

  return (
    `<section class="header__profile profile">
      <p class="profile__rating">${status}</p>
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>`
  );
};
