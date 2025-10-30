import express from "express";
import { EmpresaController } from "./Controller/EmpresaController";
import { EPIController } from "./Controller/EpiController";
import { FuncionarioController } from "./Controller/Funcionario";
export const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

app.use(express.json());

EmpresaController();

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

EPIController();

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

FuncionarioController();

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});