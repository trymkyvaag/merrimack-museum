// import { User } from "next-auth";
import { createContext, useContext } from "react";
import { DateTime } from 'luxon';

export interface LinkProps {
    link: string;
    label: string;
    auth: string | null;
    links?: { link: string, label: string, auth: string | null }[] | null;
}

export interface RequestType {
    move_request: {
        idmove_request: number | null;
        user: {
            address: string | null;
        },
        artwork: {
            idartwork: number | null;
            artist: {
                artist_name: string | null;
            },
            donor: {
                donor_name: string | null;
            }
            location: {
                location: string | null;
            },
            category: {
                category: string | null;
            },
            image_path: {
                image_path: string | null;
            },
            title: string | null;
            date_created_month: number | null;
            date_created_year: number | null;
            comments: string | null;
            width: number | null;
            height: number | null;
        },
        to_location: string | null;
        is_pending: boolean | null;
        is_approved: boolean | null;
        comments: string | null;
        time_stamp: DateTime | null;
    }
}

interface RequestContextType {
    request: RequestType | null
    setRequest: (r: RequestType) => void;
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

export interface ArtworkTypeFiltered {
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

interface ArtworkContextTypeFiltered {
    artworks: ArtworkTypeFiltered[];
    artworksMap: Map<number, ArtworkTypeFiltered[]>
    addArtwork: (newArtwork: ArtworkTypeFiltered) => void;
    setArtworksMap: (map: Map<number, ArtworkTypeFiltered[]>) => void;
}

export const ArtworkContextFiltered = createContext<ArtworkContextTypeFiltered | undefined>(undefined);

export const useArtworkFiltered = () => {
    const context = useContext(ArtworkContextFiltered);
    if (!context) {
        throw new Error('useArtwork must be used within an ArtworkProvider');
    }
    return context;
};