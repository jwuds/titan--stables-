
import { supabase } from '@/lib/customSupabaseClient';
import { safeQuery, fetchWithTimeout } from '@/lib/supabaseErrorHandler';

export const getHorses = async ({ limit = 15, offset = 0 } = {}) => {
    try {
        const query = supabase
            .from('horses')
            .select('id, name, age, height, price, description, images, status, is_featured, training_level, category, slug')
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

        const { data, error } = await fetchWithTimeout(safeQuery(query, []), 8000);

        if (error) {
            console.error('Error fetching horses:', error);
            return [];
        }
        
        const horses = data?.data || data || [];
        
        return horses.map(horse => ({
            ...horse,
            images: horse.images ? (Array.isArray(horse.images) ? horse.images : []) : [],
        }));
    } catch (err) {
        console.error("Unexpected error in getHorses:", err);
        return [];
    }
};

export const getFeaturedHorses = async (limit = 3) => {
    try {
        const query = supabase
            .from('horses')
            .select('id, name, age, height, price, description, images, status, is_featured, training_level, slug, category')
            .eq('is_featured', true)
            .order('featured_order', { ascending: true })
            .order('created_at', { ascending: false })
            .limit(limit);

        const { data, error } = await fetchWithTimeout(safeQuery(query, []), 5000);

        if (error) {
            console.error('Error fetching featured horses:', error);
            return [];
        }
        
        const featuredHorses = data?.data || data || [];
        
        if (!featuredHorses || featuredHorses.length === 0) {
            // Fallback to recent horses if no featured
            const fallbackQuery = supabase
                .from('horses')
                .select('id, name, age, height, price, description, images, status, is_featured, training_level, slug, category')
                .order('created_at', { ascending: false })
                .limit(limit);
                
            const { data: fallbackData, error: fallbackError } = await fetchWithTimeout(safeQuery(fallbackQuery, []), 5000);
            
            if (fallbackError) {
                console.error('Error fetching fallback horses:', fallbackError);
                return [];
            }
            
            const fallbackHorses = fallbackData?.data || fallbackData || [];
            
            return fallbackHorses.map(horse => ({
                ...horse,
                images: horse.images ? (Array.isArray(horse.images) ? horse.images : []) : [],
            }));
        }
        
        return featuredHorses.map(horse => ({
            ...horse,
            images: horse.images ? (Array.isArray(horse.images) ? horse.images : []) : [],
        }));
    } catch (err) {
        console.error("Unexpected error in getFeaturedHorses:", err);
        return [];
    }
};

export const getHorseById = async (id) => {
    try {
        const query = supabase
            .from('horses')
            .select('*')
            .eq('id', id);

        const { data, error } = await fetchWithTimeout(safeQuery(query.single(), null), 5000);

        if (error) {
            console.error(`Error fetching horse with id ${id}:`, error);
            return null;
        }

        const horse = data?.data || data;
        
        if (!horse) return null;

        return {
            ...horse,
            images: horse.images ? (Array.isArray(horse.images) ? horse.images : []) : [],
        };
    } catch (err) {
        console.error("Unexpected error in getHorseById:", err);
        return null;
    }
};
