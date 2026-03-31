import { Router, Request, Response } from "express";
import {db} from "../db"

const router = Router();

router.get("/", (req: Request, res: Response) => {
    db.all("SELECT * FROM livros", (erro, linhas) => {
        if(erro) {
            return res.status(500).json (
                {erro: "Erro ao buscar livro"}
            );
        }
        res.json(linhas);
    });
}); 

router.post("/", (req: Request, res: Response) => {
    const {titulo, autores} = req.body;

    db.run(
        "INSERT INTO livros (titulo, autores) VALUES (?, ?)",
        [titulo, autores],
        function (erro) {
            if(erro) {
                return res.status(500).json(
                    {erro: "Erro ao cadastrar livro"}
                );
            }
            res.status(201).json({
                id: this.lastID,
                titulo, 
                autores
            });
        }
    );
});

router.put("/:id", (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const {titulo, autores} = req.body;

    db.run(
        "UPDATE livros SET titulo = ?, autores = ? WHERE id = ?",
    [titulo, autores, id],
    function (erro) {
            if(this.changes === 0) {
                return res.status(404).json(
                    {erro: "Livro não encontrado"}
                );
            }
            res.json({
                id, 
                titulo, 
                autores
            });
        }
    );
});

export default router;