import React, { createContext, useState } from "react";

const ImageSearchContext = createContext();

export const ImageSearchProvider = ({ children }) => {
  const [imageSearchResults, setImageSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  return (
    <ImageSearchContext.Provider
      value={{ imageSearchResults, setImageSearchResults, loading, setLoading }}
    >
      {children}
    </ImageSearchContext.Provider>
  );
};

export default ImageSearchContext;
