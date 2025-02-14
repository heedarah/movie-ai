import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { id } = req.query;

  if (!id || typeof id !== "string") {
    return res.status(400).json({ error: "Invalid or missing ID" });
  }

  try {
    const recommendation = await prisma.recommendation.findUnique({
      where: { id },
      include: { movies: true }, // Fetch movies along with the recommendation
    });

    if (!recommendation) {
      return res.status(404).json({ error: "Recommendation not found" });
    }

    res.status(200).json(recommendation);
  } catch (error) {
    console.error("Error fetching recommendation:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
