import { Router, Request, Response } from "express";
import { prisma } from "../prisma";

const router = Router();

// Listar todos os gêneros
router.get("/", async (req: Request, res: Response) => {
    try {
        const generos = await prisma.genero.findMany({
            include: {
            livros: true
            }
        });
        
        res.json(generos);
    } catch (ex) {
        res.status(500).json({
            erro: "Erro ao buscar gêneros"
        });
    }
});

// Buscar um gênero por ID
router.get("/:id", async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    try {
        const generoExistente = await prisma.genero.findUnique({
            where: { id }
        });

        if (!generoExistente) {
            return res.status(404).json({
                erro: "Gênero não encontrado"
            });
        }

        const { nome } = generoExistente;
        const genero = await prisma.genero.findUnique({
            where: { id }
        });

        const generoAtualizado = await prisma.genero.update({
            where: { id },
            data: {
                nome: nome.trim()
            }
        });

        res.json(generoAtualizado);
    } catch (ex) {
        res.status(500).json({
            erro: "Erro ao buscar gênero"
        });
    }
});

// Cadastrar um novo gênero
router.post("/", async (req: Request, res: Response) => {
    const { nome } = req.body;

    if (!nome || typeof nome !== "string" || nome.trim() === "") {
        return res.status(400).json({
            erro: "O campo nome do gênero é obrigatório."
        });
    }

    try {
        const genero = await prisma.genero.create({
            data: {
                nome: nome.trim()
            }
        });

        res.status(201).json(genero);
    } catch (ex) {
        res.status(500).json({
            erro: "Erro ao cadastrar gênero."
        });
    }
});

// Atualizar um gênero
router.put("/:id", async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const { nome } = req.body;

    if (!nome || typeof nome !== "string" || nome.trim() === "") {
        return res.status(400).json({
            erro: "O campo nome do gênero é obrigatório."
        });
    }

    try {
        const genero = await prisma.genero.update({
            where: { id },
            data: {
                nome: nome.trim()
            }
        });

        res.json(genero);
    } catch (ex) {
        // P2025 é o código do Prisma para "Record to update not found"
        if ((ex as any).code === 'P2025') {
            return res.status(404).json({
                erro: "Gênero não encontrado"
            });
        }
        res.status(500).json({
            erro: "Erro ao atualizar gênero."
        });
    }
});

// Remover um gênero
router.delete("/:id", async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    try {
        await prisma.genero.delete({
            where: { id }
        });

        res.status(204).send();
    } catch (ex) {
        // P2025 é o código do Prisma para "Record to delete not found"
        if ((ex as any).code === 'P2025') {
            return res.status(404).json({
                erro: "Gênero não encontrado"
            });
        }
        res.status(500).json({
            erro: "Erro ao remover gênero."
        });
    }
});

export default router;