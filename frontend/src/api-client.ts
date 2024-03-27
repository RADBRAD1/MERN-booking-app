// where we put all fetch requests
//put in this separate file b/c separating requests from other code makes things cleaner


import {RegisterFormData} from "./pages/Register";
import { SignInFormData } from "./pages/SignIn";
import {
  HotelSearchResponse,
  HotelType,
  PaymentIntentResponse,
  UserType,
} from "../../Backend/src/shared/types";
import { BookingFormData } from "./forms/BookingForm/BookingForm";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
//const API_BASE_URL = `http://localhost:7000`; //not 5179, because it just matters about the backend port number, not frontend. we hard coded the 
//environment variable number here as opposed to accessing the API_BASE_URL which was `undefined` before. 


//const API_BASE_URL = `http://localhost:7000`

export const fetchCurrentUser = async (): Promise<UserType> => {
    const response = await fetch(`${API_BASE_URL}/api/users/me`, {
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error("Error fetching user");
    }
    return response.json();
  };

// the async function takes in data from registerForm data, which is defined in type registerformdata in register.tsx
export const register = async (formData:RegisterFormData) => {
    console.log(API_BASE_URL);
    const response = await fetch(`${API_BASE_URL}/api/users/register`, { method: 'POST', headers :{
        "Content-type": "application/json"}, credentials: "include", body: JSON.stringify(formData),
    });


//get body of the response, awaits for it and converts it to json
const responseBody = await response.json();

if(!response.ok){
    throw new Error(responseBody.message);
}
return responseBody; 

/////
//////
/////
// is this necessary? i didnt have this before but the signIn api endpoint had return body so i added this?
}; 

//this signin function for the api client defines an arrow function that takes in formdata defined in SignInFormData
//sign in endpoint creation here
// call this sign in function whenever the user submits valid form.
export const signIn = async (formData: SignInFormData) => {
const response = await fetch(`${API_BASE_URL}/api/auth/login`, { method: "POST", credentials: "include",
headers: { "Content-Type": "application/json"}, body: JSON.stringify(formData),
});

const body = await response.json();

//response.json returns error details under the message property, so we can call for it when handling errors
if(!response.ok){
    throw new Error(body.message);
}
return body;

}

export const validateToken = async ()=> {
    const response = await fetch(`${API_BASE_URL}/api/auth/validate-token`, {  
        credentials: "include" //tells browser to send any cookies with the request given to the endpoint. 
    }); //sets validateToken endpoint here. 

    if(!response.ok)
    {
        throw new Error("token Invalid");
    }

    return response.json();

};

//endpoint for logging out, access the backend signout function from the auth.ts in routes folder from backend. 
export const signOut = async ()=> {
    const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {credentials : "include", method: "POST", })
    if(!response.ok)
    {
        throw new Error("Error during signout");
    }
};

//accepts form data after its submitted, fetch request.
export const addMyHotel = async (hotelFormData: FormData)=>
{
    const response = await fetch(`${API_BASE_URL}/api/my-hotels`, { 
        method: "POST", credentials: "include", body: hotelFormData, // doesnt  matter what format, all hotelFormData gets sent to the body here
        
    });
    //if we get to this error, likely something went wrong on the server
    if(!response.ok){
        throw new Error("Failed to add hotel");
    }
    //if response is good, return response.json. gives us json data on hotel we just created.
    return response.json();
};

//first line, Promise<HotelType[]> after async specifies the return type of our data. 


export const fetchMyHotels = async (): Promise<HotelType[]> => {
    const response = await fetch(`${API_BASE_URL}/api/my-hotels`, {
      credentials: "include",
    });
  
    if (!response.ok) {
      throw new Error("Error fetching hotels");
    }
  
    return response.json();
  };
  
  export const fetchMyHotelById = async (hotelId: string): Promise<HotelType> => {
    const response = await fetch(`${API_BASE_URL}/api/my-hotels/${hotelId}`, {
      credentials: "include",
    });
  
    if (!response.ok) {
      throw new Error("Error fetching Hotels");
    }
  
    return response.json();
  };
  
  export const updateMyHotelById = async (hotelFormData: FormData) => {
    const response = await fetch(
      `${API_BASE_URL}/api/my-hotels/${hotelFormData.get("hotelId")}`,
      {
        method: "PUT",
        body: hotelFormData,
        credentials: "include",
      }
    );
  
    if (!response.ok) {
      throw new Error("Failed to update Hotel");
    }
  
    return response.json();
  };
  
  export type SearchParams = {
    destination?: string;
    checkIn?: string;
    checkOut?: string;
    adultCount?: string;
    childCount?: string;
    page?: string;
    facilities?: string[];
    types?: string[];
    stars?: string[];
    maxPrice?: string;
    sortOption?: string;
  };
  
  export const searchHotels = async (
    searchParams: SearchParams
  ): Promise<HotelSearchResponse> => {
    const queryParams = new URLSearchParams();
    queryParams.append("destination", searchParams.destination || "");
    queryParams.append("checkIn", searchParams.checkIn || "");
    queryParams.append("checkOut", searchParams.checkOut || "");
    queryParams.append("adultCount", searchParams.adultCount || "");
    queryParams.append("childCount", searchParams.childCount || "");
    queryParams.append("page", searchParams.page || "");
  
    queryParams.append("maxPrice", searchParams.maxPrice || "");
    queryParams.append("sortOption", searchParams.sortOption || "");
  
    //if there are any facilities selected by the user on the UI, 
    //append them to the query under the "facailities" key
    searchParams.facilities?.forEach((facility) =>
      queryParams.append("facilities", facility)
    );
  

    searchParams.types?.forEach((type) => queryParams.append("types", type));
    searchParams.stars?.forEach((star) => queryParams.append("stars", star));
  
    const response = await fetch(
      `${API_BASE_URL}/api/hotels/search?${queryParams}`
    );
  
    if (!response.ok) {
      throw new Error("Error fetching hotels");
    }
  
    return response.json();
  };
  
  export const fetchHotels = async (): Promise<HotelType[]> => {
    const response = await fetch(`${API_BASE_URL}/api/hotels`);
    if (!response.ok) {
      throw new Error("Error fetching hotels");
    }
    return response.json();
  };
  
  //goes to backend and fetches hotel from the database
  export const fetchHotelById = async (hotelId: string): Promise<HotelType> => {
    const response = await fetch(`${API_BASE_URL}/api/hotels/${hotelId}`);
    if (!response.ok) {
      throw new Error("Error fetching Hotels");
    }
  
    return response.json();
  };
  

  //need hotelID and numberofNights to calculate payment intent info
  export const createPaymentIntent = async (
    hotelId: string,
    numberOfNights: string
  ): Promise<PaymentIntentResponse> => {
    const response = await fetch(
      `${API_BASE_URL}/api/hotels/${hotelId}/bookings/payment-intent`,
      {
        credentials: "include",
        method: "POST",
        body: JSON.stringify({ numberOfNights }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  
    if (!response.ok) {
      throw new Error("Error fetching payment intent");
    }
  
    return response.json();
  };
  
  //puts the booking into the database
  export const createRoomBooking = async (formData: BookingFormData) => {
    const response = await fetch(
      `${API_BASE_URL}/api/hotels/${formData.hotelId}/bookings`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      }
    );
  
    if (!response.ok) {
      throw new Error("Error booking room");
    }
  };
  
  export const fetchMyBookings = async (): Promise<HotelType[]> => {
    const response = await fetch(`${API_BASE_URL}/api/my-bookings`, {
      credentials: "include",
    });
  
    if (!response.ok) {
      throw new Error("Unable to fetch bookings");
    }
  
    return response.json();
  };

