import { User } from "next-auth";
import { createContext, useContext } from "react";

export interface LinkProps {
    link: string;
    label: string;
    auth: string | null;
    links?: { link: string, label: string, auth: string | null }[] | null;
}

export interface Artwork {
    title: string
    image_path: any;
    comments: string;
    location: string;
    donor: string;
    height: number;
    width: number;
    date_created_year: number;
    date_created_month: number;
    category: string;
    artist: string;
    idartwork: number;
};

interface ArtworkContextType {
    artworks: Artwork[];
    artworksMap: Map<string, Artwork[]>
    addArtwork: (newArtwork: Artwork) => void;
    setArtworksMap: (map: Map<string, Artwork[]>) => void;
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
