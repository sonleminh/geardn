const baseURL = process.env.NEXT_PUBLIC_API;

async function fetchRequest<T>(
  url: string,
  method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE',
  data?: any,
  config?: RequestInit,
  errCallback?: () => void
): Promise<T> {
  try {
    // const response = await fetch(`${url}`, {
    const response = await fetch(`${baseURL}${url}`, {
      next: { revalidate: 3600 },
      method,
      headers: {
        'Content-Type': 'application/json',
        // Include other headers as needed
      },
      body: data ? JSON.stringify(data) : undefined,
      ...config,
      credentials: "include",
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(
        Array.isArray(responseData?.message) && responseData?.message?.length >= 0
          ? responseData?.message?.[0]
          : responseData?.message
      );
    }

    return responseData;
  } catch (error: any) {
    console.error('Error', error.message);
    errCallback?.();
    throw error;
  }
}

async function getRequest<T>(
  url: string,
  config?: RequestInit,
  errCallback?: () => void
): Promise<T> {
  return fetchRequest<T>(url, 'GET', undefined, config, errCallback);
}

async function postRequest<T>(
  url: string,
  data: any,
  config?: RequestInit,
  errCallback?: () => void
): Promise<T> {
  return fetchRequest<T>(url, 'POST', data, config, errCallback);
}

async function putRequest<T>(
  url: string,
  data?: any,
  config?: RequestInit,
  errCallback?: () => void
): Promise<T> {
  return fetchRequest<T>(url, 'PUT', data, config, errCallback);
}

async function patchRequest<T>(
  url: string,
  data: any,
  config?: RequestInit,
  errCallback?: () => void
): Promise<T> {
  return fetchRequest<T>(url, 'PATCH', data, config, errCallback);
}

async function deleteRequest<T>(
  url: string,
  config?: RequestInit,
  errCallback?: () => void
): Promise<T> {
  return fetchRequest<T>(url, 'DELETE', undefined, config, errCallback);
}

export { getRequest, postRequest, putRequest, patchRequest, deleteRequest };
