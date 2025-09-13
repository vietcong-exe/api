const ping = require('ping');

export default async function handler(req, res) {
  const { domain } = req.query;

  if (!domain) {
    return res.status(400).json({ error: 'O domínio não foi especificado.' });
  }

  try {
    const result = await ping.promise.probe(domain, {
      timeout: 10,
      extra: ['-c', '4'], // Envia 4 pacotes de ping
    });

    if (result.alive) {
      res.status(200).json({
        host: result.host,
        ip: result.numeric_host,
        avg: result.avg,
        min: result.min,
        max: result.max,
        stddev: result.stddev,
        packetLoss: result.packetLoss,
        output: result.output,
      });
    } else {
      res.status(500).json({ 
        host: result.host,
        error: 'Host inalcançável',
        output: result.output,
      });
    }
  } catch (error) {
    res.status(500).json({ error: 'Ocorreu um erro ao tentar pingar o host.', message: error.message });
  }
}
