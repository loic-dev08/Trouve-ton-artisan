import "./Etoiles.scss";

/** 
 * Affiche une note sur 5 sous forme d'étoiles.
 * Reste lisible pour les lecteurs d'écran via un texte alternatif (WCAG).
 */
export default function Etoiles({ note }) {
  const pleines = Math.round(note); 

    return (    
        <span className="etoiles" role="img" aria-label={`Note : ${note} sur 5`}>
            {Array.from({ length: 5 }).map((_, i) => (
                <svg
                    key={i}
                    width="16"
                    height="16"     
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                    focusable="false"
                    className={i < pleines ? "etoiles__pleine" : "etoiles__vide"}
                >
                    <path d="M10 1.5l2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3.2L4.6 17.8l1.3-6L1.3 7.7l6.1-.6z" />
                </svg>
            ))}
            <span className="etoiles__valeur">{note.toFixed(1)}/5</span>    
        </span>
    );
}