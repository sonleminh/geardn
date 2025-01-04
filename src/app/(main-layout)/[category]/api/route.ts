import { NextRequest } from "next/server";
import { getRequest, putRequest } from "@/utils/fetch-client";
import { BASE_API_URL } from "@/constants/env";

export async function GET(request: NextRequest,{ params }: { params: { category: string } }) {
    const data = await getRequest(`/product/category/${params?.category}`)
    console.log(data);
    return Response.json({data}) 
}