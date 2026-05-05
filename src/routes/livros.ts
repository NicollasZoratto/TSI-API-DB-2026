import { Router, Request, Response } from "express";
import { prisma } from "../prisma"
import { json } from "node:stream/consumers";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
    const livros = await prisma.livro.findMany({
        include: {
            genero: true
        }
    });

    res.json(livros);
});

router.post("/", async (req: Request, res: Response) => {
    const { titulo, generoId } = req.body;

    if(!titulo || !generoId) {
        return res.status(400).json({
            erro: "Titulo e generoId são obrigatórios."
        });
    }

    const genero = await prisma.genero.findUnique({
        where: {id: Number(generoId)}
    });

    if(!genero) {
        return res.status(404).json({
            erro: "Genero não encontrado."
        })
    }

    if (!titulo || typeof titulo !== "string" || titulo.trim() === "") {
        return res.status(400).json({
            erro: "O campo título é obrigatório."
        });
    }

    if (!generoId || typeof generoId !== "number") {
        return res.status(400).json({
            erro: "O campo generoId é obrigatório e deve ser um número."
        });
    }

    try {
        const livro = await prisma.livro.create({
            data: {
                titulo: titulo.trim(),
                generoId: generoId
            },
            include: {
                genero: true
            }
        });

        res.status(201).json(livro);
    } catch (ex) {
        console.error(ex);
        res.status(500).json({
            erro: "Erro ao cadastrar livro."
        });
    }
});

router.put("/:id", async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const { titulo, generoId } = req.body;

    const livroAtualizado = await prisma.livro.update({
        where: {id},
        data: {
            titulo: titulo,
            generoId: Number(generoId)
        },
        include: {
            genero: true
        }
    });

    res.json(livroAtualizado);
} );

export default router;