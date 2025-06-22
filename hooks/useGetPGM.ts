/** 
 * 
 */


import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";


export default function useGetPGM() {
    

    const getPGMData = async () => {
        try {
          const { data, error } = await supabase.rpc('get_pgm_data');
      
      
          if(error) {
            console.log("Get pgm data error", error.message);
            return
          }

          return data
        } catch (error) {
          console.log('PGM Data Error:', error)
        }
      
      
      }


  return  getPGMData 
}