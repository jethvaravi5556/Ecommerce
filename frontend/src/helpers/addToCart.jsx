import SummaryApi from "../common";
import {toast} from 'react-toastify'
const addToCart=async(e,id)=>{
    e?.stopPropagation()
    e?.preventDefault()
   
     // Ensure the URL is correctly formatted
  let apiUrl = SummaryApi.addToCartProduct.url.trim();
  apiUrl = apiUrl.replace(/\u200B/g, ""); // Remove hidden ZWSP characters

  //console.log("Requesting API at:", apiUrl); // Debugging log

    try {
      const response = await fetch(apiUrl, {
        method: SummaryApi.addToCartProduct.method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId:id
        }),
      });
  
      const responseData = await response.json();
      
      if(responseData.success){
        toast.success(responseData.message)
      }

      if(responseData.error){
        toast.error(responseData.message)
      }

      
    } catch (error) {
      console.error("Signup error:", error);
      alert("Error connecting to the server");
    }
}

export default addToCart