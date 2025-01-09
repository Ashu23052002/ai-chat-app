import * as ai from "../services/ai.service.js";

export const getResult = async (req, res) => {
  try {
    const { prompt } = req.query;

    const result = await ai.generateResult(prompt);

    res.status(200).send(result);
  } catch (error) {
    console.log("Error in ai controller");
    res.status(500).send({ error: error.message });
  }
};
