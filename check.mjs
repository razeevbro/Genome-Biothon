import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
Promise.all([
  sb.from("goals").select("*").limit(1).then(r => console.log("goals:", r.error?.message || "exists")),
  sb.from("user_goals").select("*").limit(1).then(r => console.log("user_goals:", r.error?.message || "exists")),
  sb.from("profiles").select("*").limit(1).then(r => console.log("profiles:", r.error?.message || "exists"))
]).catch(console.error);
