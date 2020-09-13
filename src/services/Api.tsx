const backendUrl = "http://localhost:5000";

export async function fetchMorningCalls() {
  const response = await fetch(backendUrl + "/api/morningcalls");
  const { data } = await response.json();
  return data;
}

export async function fetchReport() {
  const response = await fetch(
    backendUrl + "/api/account/00711234533/graphics"
  );
  const { Url: link } = await response.json();
  return link;
}
