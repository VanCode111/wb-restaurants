export const getStarsByRating = (rating: number): string[] => {
  const stars: string[] = [];
  for (let i = 0; i < 5; i++) {
    if (rating >= 1) {
      stars.push('star');
    } else if (rating >= 0.5) {
      stars.push('star_half');
    } else {
      stars.push('star_border');
    }
    rating--;
  }
  return stars;
};
