import Fastify, { FastifyRequest, FastifyReply } from 'fastify';
import { Prisma, PrismaClient } from "@prisma/client";
import { gato } from "@prisma/client";
import cors from '@fastify/cors';
import { request } from 'http';

const prisma = new PrismaClient();
const app = Fastify();
app.register(cors, {
    origin: "*",
});

app.post('/create', async (request: FastifyRequest, reply: FastifyReply) => {
    const { id, name, age, description, vaccinated } = request.body as gato;
    const gato = await prisma.gato.create({
        data: {
            id,
            name,
            age,
            description,
            vaccinated
        },
    });
    reply.send('Gato created')
});


app.get('/gatos', async (request: FastifyRequest, reply: FastifyReply) => {
    const gatos = await prisma.gato.findMany();
    reply.send(gatos)
})

app.get('/gatos/search', async (request: FastifyRequest, reply: FastifyReply) => {
    const { query } = request.query as { query: string };
    try {
        const gatos = await prisma.gato.findMany({
            where: {
                OR: [
                    { name: { contains: query, mode: 'insensitive' } },
                    { description: { contains: query, mode: 'insensitive' } },
                ],
            },
        });
        reply.send(gatos);
    } catch (error) {
        console.error('Something went wrong:', error);
    }
});

app.put('/gatos/:name', async (request: FastifyRequest, reply: FastifyReply) => {
    const { name } = request.params as { name: string };
    const gatoData = request.body as Prisma.gatoUpdateInput;;

    try {
        const updatedGato = await prisma.gato.updateMany({
            where: { name: name },
            data: gatoData, 
        });

        reply.send('gato updated!')
    } catch (error) {
        console.error('Something went wrong:', error);
    }
});

app.delete('/gatos/:name', async (request: FastifyRequest, reply: FastifyReply) => {
    const { name } = request.params as { name: string };

    try {
        const deletedGatos = await prisma.gato.deleteMany({
            where: { name: name },
        });

        reply.send('Gatos deleted.')

    } catch (error) {
        console.error('Something went wrong:', error);
    }
});

const start = async () => {
    try {
        await app.listen({ port: 3333 });
        console.log('Server listening at http://localhost:3333');
    } catch (error) {
        console.error('Something went wrong.');
        process.exit(1);
    }
};

start();