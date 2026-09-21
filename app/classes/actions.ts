"use server";

import { createClient } from "@/lib/supabase/server";

export async function bookClass(classId:string){
 const supabase=await createClient();
 const {data:{user}}=await supabase.auth.getUser();
 if(!user)return {ok:false,error:"Please log in before booking a class."};
 const {data,error}=await supabase.rpc("book_class",{p_class_id:classId});
 if(error)return {ok:false,error:error.message};
 return {ok:true,message:data||"Class booked successfully."};
}

export async function cancelClass(classId:string){
 const supabase=await createClient();
 const {data:{user}}=await supabase.auth.getUser();
 if(!user)return {ok:false,error:"Please log in before cancelling a booking."};
 const {error}=await supabase.from("class_bookings").update({status:"cancelled"}).eq("class_id",classId).eq("user_id",user.id).eq("status","confirmed");
 if(error)return {ok:false,error:error.message};
 return {ok:true,message:"Booking cancelled."};
}