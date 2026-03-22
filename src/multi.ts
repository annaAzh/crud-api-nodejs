import { availableParallelism } from 'node:os'
import { loadEnvFile } from 'node:process'
import cluster from 'node:cluster'
import http from 'node:http'
import type { Message, WorkerType } from 'schemas/index.js'

loadEnvFile()

const numInstances = availableParallelism() - 1
const mainPort = Number(process.env['PORT'] ?? 8080)

if (cluster.isPrimary) {
  const workers: WorkerType[] = []
  let currentWorker = 0

  for (let i = 0; i < numInstances; i += 1) {
    const port = mainPort + i + 1
    const worker = cluster.fork({ PORT: port })
    workers.push({ port, worker })
  }

  const server = http.createServer((req, res) => {
    currentWorker = (currentWorker + 1) % numInstances
    const currentPort = workers[currentWorker]?.port

    const proxy = http.request(
      {
        hostname: 'localhost',
        port: currentPort,
        path: req.url,
        method: req.method,
        headers: req.headers
      },
      proxyRes => {
        res.writeHead(proxyRes.statusCode || 200, proxyRes.headers)
        proxyRes.pipe(res)
      }
    )

    req.pipe(proxy)

    proxy.on('error', () => {
      res.writeHead(502, 'Bad Gateway')
    })
  })

  server.listen(mainPort, () => console.log(`Load balancer listening on port ${mainPort}`))

  cluster.on('message', (_, message: Message) => {
    if (message.type === 'sync_master') {
      if (cluster.workers) {
        Object.values(cluster.workers).forEach(w => {
          if (w) {
            w.send({ type: 'sync_products', data: message.data })
          }
        })
      }
    }
  })
} else {
  await import('./index.js')
}
