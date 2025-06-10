const express = require('express');
const bodyParser = require('body-parser');
const k8s = require('@kubernetes/client-node');

const app = express();
app.use(bodyParser.json());

// simple build endpoint
app.post('/build', (req, res) => {
  const { appId, repo } = req.body;
  console.log(`Building ${appId} from ${repo}`);
  // placeholder build logic
  return res.json({ status: 'build-started', appId });
});

// deploy endpoint using k8s client
app.post('/deploy', async (req, res) => {
  const { appId, image } = req.body;
  const kc = new k8s.KubeConfig();
  try {
    kc.loadFromDefault();
    const k8sApi = kc.makeApiClient(k8s.AppsV1Api);
    const deployment = {
      metadata: { name: appId },
      spec: {
        selector: { matchLabels: { app: appId } },
        replicas: 1,
        template: {
          metadata: { labels: { app: appId } },
          spec: {
            containers: [{ name: appId, image }]
          }
        }
      }
    };
    await k8sApi.createNamespacedDeployment('default', deployment);
    return res.json({ status: 'deployed', appId });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});

// list deployments
app.get('/deployments', async (req, res) => {
  const kc = new k8s.KubeConfig();
  try {
    kc.loadFromDefault();
    const k8sApi = kc.makeApiClient(k8s.AppsV1Api);
    const result = await k8sApi.listNamespacedDeployment('default');
    res.json(result.body.items.map(d => d.metadata.name));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});
