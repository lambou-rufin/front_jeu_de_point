// src/utils/formatDate.ts

/**
 * Formate une date en fonction du format souhaité.
 * @param date - La date à formater (peut être une string ou un objet Date)
 * @param locale - La locale pour le formatage (ex: 'fr-FR' ou 'en-US')
 * @returns La date formatée sous forme de string
 */
export const formatDate = (date: string | Date, locale: string = 'en-US'): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
  
    if (isNaN(dateObj.getTime())) {
      return 'Invalid Date'; // Gérer les dates invalides
    }
  
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(dateObj);
  };
  