FROM oven/bun:latest

RUN apt-get update && apt-get install -y curl

COPY . .

RUN bun install

ENV NODE_ENV=production
ENV PORT=8081
ENV HOST=0.0.0.0


EXPOSE 8081

CMD ["bun", "start"]