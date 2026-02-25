import { hexColors } from "../constant/hex-color";

export const generateRandomColor = (): string => {
  const minIndex = 0;
  const maxIndex = hexColors.length - 1;
  const randomIndex = Math.floor(
    Math.random() * (maxIndex - minIndex + 1) + minIndex,
  );
  return hexColors[randomIndex];
};
