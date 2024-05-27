const Deployment = require("../models/Deployment");
const { helmInstall } = require("../utils/helmClient");
const { createNamespace } = require("../utils/k8sService");

exports.deployApp = async (req, res) => {
  const { namespace, appName, chart } = req.body;
  const userId = req.user?.id;
  try {
    const deployment = await Deployment.findOne({ appName, namespace });
    if (deployment) {
      return res.status(400).json({ error: "Deployment already exists" });
    }
    await createNamespace(namespace);

    await helmInstall(appName, namespace, chart);
    const newDeployment = new Deployment({
      namespace,
      appName,
      status: "IN_PROGRESS",
      userId,
    });
    await newDeployment.save();
    res.status(201).json(newDeployment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
