// import { User } from "next-auth";
import { createContext, useContext } from "react";

export interface LinkProps {
    link: string;
    label: string;
    auth: string | null;
    links?: { link: string, label: string, auth: string | null }[] | null;
}

export interface RequestType {
    move_request: {
        idmove_request: number,
        user: {
            address: string,
            user_type: {
                user_type: string
            }
        },
        artwork: {
            idartwork: number,
            artist: {
                artist_name: string
            },
            donor: null,
            location: {
                location: string
            },
            category: {
                category: string
            },
            image_path: {
                image_path: string
            },
            title: string,
            date_created_month: null,
            date_created_year: null,
            comments: null,
            width: string,
            height: string
        },
        to_location: string,
        is_pending: number,
        is_approved: number,
        comments: string,
        time_stamp: string
    } | null
}

interface RequestContextType {
    request: RequestType | null
    setRequest: (r : RequestType) => void;
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
    idartwork: number;
    title: string;
    date_created_month: null | string;
    date_created_year: null | string;
    comments: null | string;
    width: string;
    height: string;
    artist: number;
    donor: null | number;
    location: number;
    category: number;
    image_path: number;
}

interface ArtworkContextType {
    artworks: ArtworkType[];
    artworksMap: Map<number, ArtworkType[]>
    addArtwork: (newArtwork: ArtworkType) => void;
    setArtworksMap: (map: Map<number, ArtworkType[]>) => void;
}

export const ArtworkContext = createContext<ArtworkContextType | undefined>(undefined);

export const useArtwork = () => {
    const context = useContext(ArtworkContext);
    if (!context) {
        throw new Error('useArtwork must be used within an ArtworkProvider');
    }
    return context;
};

interface UserContextType {
    isAdmin: boolean;
    isFaculty: boolean;
    setIsAdmin: (cond: boolean) => void;
    setIsFaculty: (cond: boolean) => void;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}
