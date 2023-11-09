import { createContext, useContext } from "react";

export interface LinkProps {
    link: string;
    label: string;
    auth: string | null;
    links?: { link: string, label: string, auth: string | null }[] | null;
}


export interface Artwork {
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

export interface DjangoImage {
    image_id: string;
    artwork: string
    cover: string,
    description: string | null,
}

interface ArtworkContextType {
    artwork: Artwork[];
    map: Map<string, DjangoImage[]>
    addArtwork: (newArtwork: Artwork) => void;
    setMap: (map: Map<string, DjangoImage[]>) => void;
}

export const ArtworkContext = createContext<ArtworkContextType | undefined>(undefined);

export const useArtwork = () => {
    const context = useContext(ArtworkContext);
    if (!context) {
        throw new Error('useArtwork must be used within an ArtworkProvider');
    }
    return context;
};
