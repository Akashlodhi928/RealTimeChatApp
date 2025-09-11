

// utils/getImageUrl.js
export const getImageUrl = (image) => {
  if (!image) return null;
  // clean "public\" or "public/"
  const cleanPath = image.replace("public\\", "").replace("public/", "");
  return `http://localhost:8000/${cleanPath}`;
};
