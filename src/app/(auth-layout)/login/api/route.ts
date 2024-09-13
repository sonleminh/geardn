// import { BASE_API_URL } from "@/constants/env";
// import { postRequest } from "@/utils/fetch-client";

// export async function POST(req: Request) {
//     try {
//         const { email, password } = await req.json();
    
//         const res:any = postRequest(`${BASE_API_URL}/auth/login`, {email, password})

//         // if (!res) {
//         //     return new Response('Login failed', { status: 401 });
//         //   }
      
//           // Parse the response body to JSON
//           return new Response(JSON.stringify({ res }), {
//             status: 200,
//           });
      
//     } catch (error) {
//         return new Response('Error processing request', { status: 500 });
//     }
    
  
//   }