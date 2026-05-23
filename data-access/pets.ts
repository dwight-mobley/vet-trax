

import { getRecordsByColumn, getSingleRecordByColumn } from "./base-queries";


export const getUserPets = async (userId: string) => {
    return getRecordsByColumn("pets", "owner_id", userId);
}

export const getPetById = async (petId: string) => {
    console.log("Fetching pet with ID:", petId);
    const pet = await getSingleRecordByColumn("pets", "id", petId);
    return pet;
}