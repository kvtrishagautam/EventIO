
const { createClient } = require('@supabase/supabase-js') 

const supabaseUrl = 'https://omtevmhzoatpogbhiufq.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9tdGV2bWh6b2F0cG9nYmhpdWZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTc3OTQzMTIsImV4cCI6MjAzMzM3MDMxMn0.35-r44VCO6a18yitje3ND12MH2sSQKzFnvSIs2KtBJE'
const supabase = createClient(supabaseUrl, supabaseKey)

async function signUpNewUser() {
    const { data, error } = await supabase.auth.signUp({
      email: ,
      password: 'example-password',
      options: {
        emailRedirectTo: 'https://example.com/welcome',
      },
    })
  }
module.exports = {supabase}