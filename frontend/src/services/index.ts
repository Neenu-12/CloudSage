export async function fetchCostOptimizationsRecommendation() {
  const API_URL =
    "https://2ol6y2den67qp6fuizelzjmxt40orzvi.lambda-url.ap-south-1.on.aws/";
  try {
    const response = await fetch(API_URL);
    return response.json();
  } catch (error) {
    console.error("Something went wrong while fetching records", error);
  }
}
