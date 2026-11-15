// Recebe a geometria enviada pela composição ExportaFigma e grava em JSON.
import http from "node:http";
import fs from "node:fs";
const [, , pasta = "out/figma", porta = "4599"] = process.argv;
fs.mkdirSync(pasta, { recursive: true });
http
  .createServer((req, res) => {
    let corpo = "";
    req.on("data", (c) => (corpo += c));
    req.on("end", () => {
      res.writeHead(200, { "Access-Control-Allow-Origin": "*" });
      res.end("ok");
      if (req.method !== "POST") return;
      const { tela } = JSON.parse(corpo);
      fs.writeFileSync(`${pasta}/${tela}.json`, corpo);
      console.log("recebido", tela);
    });
  })
  .listen(Number(porta), () => console.log("coletor em", porta));
