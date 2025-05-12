import { Usuario } from "../types/user";
import fs from "fs";
import path from "path";

export async function getAllUsers(): Promise<Usuario[]> {
  const dataPath = path.join(process.cwd(), "src", "data", "usuarios.json");

  try {
    const data = fs.readFileSync(dataPath, "utf-8");
    const { usuarios } = JSON.parse(data);
    return Array.isArray(usuarios) ? usuarios : [];
  } catch (error) {
    return [];
  }
}
