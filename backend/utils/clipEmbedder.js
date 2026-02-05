import axios from "axios";
import fs from "fs";
import FormData from "form-data";

export const getImageEmbedding = async (imagePath) => {
  const form = new FormData();
  form.append("image", fs.createReadStream(imagePath));

  const response = await axios.post("http://localhost:8001/embed", form, {
    headers: form.getHeaders(),
  });

  return { embedding: response.data.embedding };
};
