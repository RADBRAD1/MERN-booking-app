import { FormProvider, useForm } from "react-hook-form";
import DetailsSection from "./DetailsSection";

import TypeSection from "./TypeSection";
import FacilitiesSection from "./FacilitiesSection";
import GuestsSection from "./GuestsSection";
import ImagesSection from "./ImagesSection";
import { HotelType } from "../../../../backend/src/shared/types";
import { useEffect } from "react";



// all the components for our managehotelform Form
export type HotelFormData = {
name:string;
city:string;
country:string;
description:string;
type:string;
pricePerNight: number;
starRating: number;
facilities: string[];
imageFiles: FileList;
imageUrls: string[];
adultCount: number;
childCount: number;
};
//similar to hotelformdata type we created on the backend, but imageFiles datatype expected is FileList type, not a stringarray, so we can't reuse 
// this type on the backend. 

//have to tell managehotelform component what props to expect
type Props = {
    hotel?: HotelType;
    onSave: (hotelFormData: FormData) => void;
    isLoading: boolean;
  };
  
const ManageHotelForm = ({ onSave, isLoading, hotel }: Props) => {
const formMethods = useForm<HotelFormData>();
const { handleSubmit, reset } = formMethods;


//allows us to populate form
useEffect(() => {
    reset(hotel);
}, [hotel, reset]);

const onSubmit = handleSubmit((formDataJson: HotelFormData) => {
    //Create new FormData object and call the API
    const formData = new FormData();
    if (hotel) {
    formData.append("hotelId", hotel._id);
    }
    formData.append("name", formDataJson.name);
    formData.append("city", formDataJson.city);
    formData.append("country", formDataJson.country);
    formData.append("description", formDataJson.description);
    formData.append("type", formDataJson.type);
    formData.append("pricePerNight", formDataJson.pricePerNight.toString());
    formData.append("starRating", formDataJson.starRating.toString());
    formData.append("adultCount", formDataJson.adultCount.toString());
    formData.append("childCount", formDataJson.childCount.toString());

    // each time the code runs, appends an facility to the array. (can have multiple)
    //use this format when needing to append formdata with indexes
    formDataJson.facilities.forEach((facility, index) => {
    formData.append(`facilities[${index}]`, facility);
    });

    if (formDataJson.imageUrls) {
    formDataJson.imageUrls.forEach((url, index) => {
        formData.append(`imageUrls[${index}]`, url);
    });
    }

    //array.from takes images from filelist(image collection) and converts imagefiles to array so we can apply array functions
    Array.from(formDataJson.imageFiles).forEach((imageFile) => {
    formData.append(`imageFiles`, imageFile);
    //multer package takes image file on backend and processes for us. no need to specify url or attach iti to a request.
    });

    onSave(formData);
});

//disabled = {isLoading} makes sure the button cannot be used again if its loading.
//also reduces number of requests to server.
return (
    <FormProvider {...formMethods}>
    <form className="flex flex-col gap-10" onSubmit={onSubmit}>
        <DetailsSection />
        <TypeSection />
        <FacilitiesSection />
        <GuestsSection />
        <ImagesSection />
        <span className="flex justify-end">
        <button
            disabled={isLoading}
            type="submit"
            className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-xl disabled:bg-gray-500"
        >
            {isLoading ? "Saving..." : "Save"}
        </button>
        </span>
    </form>
    </FormProvider>
);
};

export default ManageHotelForm;






/*
const ManageHotelForm = ()=> {
    const formMethods = useForm<HotelFormData>(); //use form provider, break up forms, so child forms can get access to all the react hook form methods
    //the FormProvider tag has the {...formMethods} because 
    return(<FormProvider {...formMethods }> 
     <form> 
        <DetailsSection/>
        </form> </FormProvider>)
} 

export default ManageHotelForm; */