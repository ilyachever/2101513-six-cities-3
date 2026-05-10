export const calculateRatingWidth = (rating: number): string => {
  const roundedRating = Math.round(rating);
  return `${roundedRating * 20}%`;
};
