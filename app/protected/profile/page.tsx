import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import ProfileForm from "@/components/profile/profile-form";
import { Profile } from "@/types";

export default async function ProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  console.log("Authenticated user:", { id: user.id, email: user.email });

  // Fetch user profile
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profileError) {
    console.error("Error fetching profile:", profileError);
  }

  // If profile doesn't exist, create it
  if (!profile) {
    console.log("Creating new profile for user:", user.id);
    
    const { error: insertError } = await supabase.from("profiles").insert({
      id: user.id,
      email: user.email!,
      full_name: user.user_metadata.full_name || null,
      avatar_url: user.user_metadata.avatar_url || null,
    });

    if (insertError) {
      console.error("Error creating profile:", insertError);
    }

    // Fetch the newly created profile
    const { data: newProfile, error: newProfileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (newProfileError) {
      console.error("Error fetching newly created profile:", newProfileError);
      // Return minimal profile if we couldn't fetch the created one
      return (
        <div className="flex-1 w-full max-w-3xl mx-auto py-8 px-4">
          <h1 className="text-2xl font-bold mb-6">Your Profile</h1>
          <ProfileForm 
            profile={{ 
              id: user.id, 
              email: user.email!, 
              full_name: null, 
              avatar_url: null, 
              created_at: new Date().toISOString(), 
              updated_at: new Date().toISOString() 
            } as Profile} 
          />
        </div>
      );
    }

    console.log("New profile created:", newProfile);
    
    return (
      <div className="flex-1 w-full max-w-3xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6">Your Profile</h1>
        <ProfileForm profile={newProfile as Profile} />
      </div>
    );
  }

  console.log("Existing profile found:", profile);

  return (
    <div className="flex-1 w-full max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Your Profile</h1>
      <ProfileForm profile={profile as Profile} />
    </div>
  );
} 