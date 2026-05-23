// utils/supabase/queries.ts (or data-access/base-queries.ts)
import { cache } from "react";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { Database, Tables } from "@/types/supabase";


/**
 * Generic fetcher for getting records where a column matches a value.
 * Fully typed against Supabase schema.
 */
export const getRecordsByColumn = cache(async <
    T extends keyof Database["public"]["Tables"],
    C extends keyof Tables<T> & string
>(
    tableName: T,
    columnName: C,
    value: Tables<T>[C]
): Promise<Tables<T>[]> => {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data, error } = await supabase
        .from(tableName)
        .select("*")
        .eq(columnName as string, value);

    if (error) {
        throw new Error(`Error fetching from ${tableName}: ${error.message}`);
    }

    return data as Tables<T>[];
});

/**
 * Generic fetcher for getting single record where a column matches a value.
 * Fully typed against Supabase schema.
 */

export const getSingleRecordByColumn = cache (async <
    T extends keyof Database["public"]["Tables"],
    C extends keyof Tables<T> & string
>(
    tableName: T,
    columnName: C,
    value: Tables<T>[C]
): Promise<Tables<T> | null> => {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data, error } = await supabase
        .from(tableName)
        .select("*")
        .eq(columnName as string, value)
        .single();

    if (error && error.code !== "PGRST116") {
        // PGRST116 = "No rows found" → not a real error
        throw new Error(`Error fetching from ${tableName}: ${error.message}`);
    }

    return data as Tables<T> | null;
});