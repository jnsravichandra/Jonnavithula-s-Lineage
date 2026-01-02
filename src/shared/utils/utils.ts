// Convert names to Title Case
export const toTitleCase = (str: string) => {
  return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase());
};

export const getLifeSpan = (birth_date: Date, death_date: Date | null) => {
    const birthYear = birth_date ? new Date(birth_date).getFullYear() : '';
    const deathYear = death_date ? new Date(death_date).getFullYear() : '';
    return `(${birthYear} - ${deathYear})`;
  };