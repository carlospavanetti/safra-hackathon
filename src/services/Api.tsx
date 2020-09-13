const backendUrl = "http://localhost:5000";

export async function fetchMorningCalls() {
  const response = await fetch(backendUrl + "/api/morningcalls");
  const { data } = await response.json();
  return data;
}
