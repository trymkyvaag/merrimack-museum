// import { User } from "next-auth";
import { createContext, useContext } from "react";

export interface LinkProps {
    link: string;
    label: string;
    auth: string | null;
    links?: { link: string, label: string, auth: string | null }[] | null;
}

export interface RequestType {
    id?: number;
    email?: string;
    artwork_id?: number;
    artwork_title?: string;
    artwork_creation_date?: string;
    artwork_description?: string;
    request_date?: string;
    current_location_id?: number;
    current_location_name?: string;
    current_location_address?: string;
    current_location_city?: string;
    current_location_state?: string;
    current_location_country?: string;
    new_location_name?: string;
    new_location_address?: string;
    new_location_city?: string;
    new_location_state?: string;
    new_location_country?: string;
    status?: string;
}



interface RequestContextType {
    requests: RequestType[];
    addRequest: (newReques: RequestType) => void;
}

export const RequestContext = createContext<RequestContextType | undefined>(undefined);

export const useRequest = () => {
    const context = useContext(RequestContext);
    if (!context) {
        throw new Error('useRequest must be used within an ArtworkProvider');
    }
    return context;
}

export interface ArtworkType {
    id?: number;
    artist_id?: number;
    artist_name?: string;
    artist_birth_date?: string;
    artist_nationality?: string;
    artist_bio?: string;
    title?: string;
    creation_date?: string;
    description?: string;
    category_id?: number;
    category_name?: string;
    category_description?: string;
    location_id?: number;
    location_name?: string;
    location_address?: string;
    location_city?: string;
    location_state?: string;
    location_country?: string;
    donor_id?: number;
    donor_name?: string;
    donor_contact_email?: string;
    donor_donation_date?: string;
}



interface ArtworkContextType {
    artworks: ArtworkType[];
    addArtwork: (newArtwork: ArtworkType) => void;
}

export const ArtworkContext = createContext<ArtworkContextType | undefined>(undefined);

export const useArtwork = () => {
    const context = useContext(ArtworkContext);
    if (!context) {
        throw new Error('useArtwork must be used within an ArtworkProvider');
    }
    return context;
};

export interface UserType {
    id: number;
    username: string;
    email: string;
    is_admin: boolean;
    is_faculty: boolean;
    is_student: boolean;
};

interface UserContextType {
    user: UserType | null;
    setUser: (u: UserType) => void;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}

interface ArtworkImageData {
    id?: number;
    artist_id?: number;
    artist_name?: string;
    artist_birth_date?: string;
    artist_nationality?: string;
    artist_bio?: string;
    title?: string;
    creation_date?: string;
    description?: string;
    category_id?: number;
    category_name?: string;
    category_description?: string;
    location_id?: number;
    location_name?: string;
    location_address?: string;
    location_city?: string;
    location_state?: string;
    location_country?: string;
    donor_id?: number;
    donor_name?: string;
    donor_contact_email?: string;
    donor_donation_date?: string;
}

export interface ArtworkImageType {
    id?: number;
    artwork_data?: ArtworkImageData;
    image_file?: string;
    description?: string;
}

interface ArtworkImageContextType {
    artworkImages: ArtworkImageType[];
    addArtworkImage: (newArtwork: ArtworkImageType) => void;
}

export const ArtworkImageContext = createContext<ArtworkImageContextType | undefined>(undefined);

export const useArtworkImage = () => {
    const context = useContext(ArtworkImageContext);
    if (!context) {
        throw new Error('useArtworkImage must be used within an ArtworkProvider');
    }
    return context;
};

