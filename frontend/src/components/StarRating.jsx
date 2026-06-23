/**
 * StarRating — affiche une note /5 sous forme d'étoiles pleines, demi-étoiles et vides.
 * Accessible : la note numérique est fournie en aria-label.
 * @param {number} note  — valeur entre 0 et 5 (décimales acceptées)
 */
function StarRating({ note }) {
  const MAX = 5;
  const stars = [];

  for (let i = 1; i <= MAX; i++) {
    if (note >= i) {
      // Étoile pleine
      stars.push(
        <span key={i} className="star star--full" aria-hidden="true">★</span>
      );
    } else if (note >= i - 0.5) {
      // Demi-étoile
      stars.push(
        <span key={i} className="star star--half" aria-hidden="true">⯨</span>
      );
    } else {
      // Étoile vide
      stars.push(
        <span key={i} className="star star--empty" aria-hidden="true">☆</span>
      );
    }
  }

  return (
    <span
      className="star-rating"
      role="img"
      aria-label={`Note : ${note} sur 5`}
    >
      {stars}
      <span className="star-value">{note}/5</span>
    </span>
  );
}

export default StarRating;
