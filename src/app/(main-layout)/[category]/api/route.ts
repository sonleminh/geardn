import { NextRequest } from "next/server";
import { getRequest, putRequest } from "@/utils/fetch-client";
import { BASE_API_URL } from "@/constants/env";

export async function GET(request: NextRequest,{ params }: { params: { category: string } }) {
    const { searchParams } = new URL(request.url);
    const page = searchParams?.get('page') ;
    const limit = searchParams?.get('limit') ;
    // const data = await getRequest(`${BASE_API_URL}/product/category/${params?.category}`);
    const data = await getRequest(`${BASE_API_URL}/product/category/${params?.category}?page=${page ?? 1}&limit=${limit ?? 10}`);
    // return Response.json({data}) 
    // const data = [];
    return Response.json({data}) 
}