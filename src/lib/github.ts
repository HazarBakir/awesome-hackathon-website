import { Octokit } from "octokit";

const octokit = new Octokit({
  auth: import.meta.env.VITE_GITHUB_TOKEN,
});

export async function FetchReadme() {
  try {
    const response = await octokit.request("GET /repos/{owner}/{repo}/readme", {
      owner: "happyhackingspace",
      repo: "awesome-hackathon",
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });
    console.log("README Data:", response.data);
  } catch (error) {
    console.error("Error fetching README:", error);
  }
}