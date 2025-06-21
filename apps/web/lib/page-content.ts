type DataWithError = {
  text?: string;
  error?: string;
};

/**
 * Fetches the main content of a web page via the extract-content API.
 * @param url The URL of the page to fetch.
 * @param fetchImpl Optional custom fetch implementation (defaults to global fetch).
 * @returns The extracted text content of the page.
 * @throws If the network request fails or the API returns an error.
 */
export const fetchPageContent = async (
  url: string,
  fetchImpl: typeof fetch = fetch
): Promise<string[]> => {
  if (!url || typeof url !== "string") {
    throw new Error("A valid URL string must be provided.");
  }

  let response: Response;
  try {
    response = await fetchImpl(`/api/extract-content?url=${encodeURIComponent(url)}`);
  } catch (err) {
    throw new Error(`Network error: ${(err as Error).message}`);
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
  }

  let data: DataWithError;
  try {
    data = await response.json();
  } catch (err) {
    throw new Error("Failed to parse response as JSON.");
  }

  if (data?.error) {
    throw new Error(data.error);
  }

  if (typeof data?.text !== "string") {
    throw new Error("Malformed API response: missing 'text' field.");
  }

  return [url, data.text];
}
