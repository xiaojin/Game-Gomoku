import { GoogleGenAI, Type } from "@google/genai";
import { BoardState, Coordinates, Player } from "../types";
import { BOARD_SIZE } from "../constants";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are a grandmaster Gomoku (Five-in-a-Row) player. 
You are playing White (Player 2). 
The opponent is Black (Player 1).
The board is 15x15.
0 = Empty, 1 = Black, 2 = White.

Your Goal: Win the game.
Rules:
1. Connect 5 stones of your color (2) in a row horizontally, vertically, or diagonally.
2. Block the opponent (1) if they are about to connect 5.
3. Prioritize winning over blocking if you have a guaranteed win.
4. Do not make illegal moves (placing on top of non-zero cells).

Return ONLY the JSON object with coordinates: {"row": number, "col": number}.
`;

export const getAiMove = async (board: BoardState): Promise<Coordinates> => {
  try {
    const flatBoard = board.map(row => row.join(',')).join('\n');
    const prompt = `Current Board State (15x15):\n${flatBoard}\n\nMake your move as White (2).`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            row: { type: Type.INTEGER, description: "Row index (0-14)" },
            col: { type: Type.INTEGER, description: "Column index (0-14)" },
          },
          required: ["row", "col"],
        },
        temperature: 0.1, // Low temperature for more deterministic/strategic play
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const move = JSON.parse(text) as Coordinates;

    // Validate move
    if (
      move.row >= 0 &&
      move.row < BOARD_SIZE &&
      move.col >= 0 &&
      move.col < BOARD_SIZE &&
      board[move.row][move.col] === Player.None
    ) {
      return move;
    } else {
      console.warn("AI returned invalid move, falling back to random.");
      return getFallbackMove(board);
    }
  } catch (error) {
    console.error("Gemini AI Error:", error);
    return getFallbackMove(board);
  }
};

// Simple fallback if AI fails or errors
const getFallbackMove = (board: BoardState): Coordinates => {
  const emptyCells: Coordinates[] = [];
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (board[r][c] === Player.None) {
        emptyCells.push({ row: r, col: c });
      }
    }
  }
  
  // Heuristic: try to play near the center or existing stones if possible, 
  // but for a pure fallback, random is acceptable safety net.
  if (emptyCells.length === 0) return { row: -1, col: -1 };
  
  // Pick a random empty cell
  const randomIndex = Math.floor(Math.random() * emptyCells.length);
  return emptyCells[randomIndex];
};