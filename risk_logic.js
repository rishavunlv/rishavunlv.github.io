const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const masterRiskDataset = {
  graphRagThreats: {
    healthcare: [
      { id: "sf_flow", label: "Salesforce Flow\nPrompt Generator", risk: "high", metadata: "Vector DB: Pinecone | Context: Claims Macros" },
      { id: "api_gateway", label: "API Gateway", risk: "medium", metadata: "Token Relay Layer" },
      { id: "s3_bucket", label: "AWS S3\nPatient Backups", risk: "high", metadata: "Sensitive PHI Archives" },
      { id: "local_server", label: "Local Server\nRisk Engine", risk: "medium", metadata: "MCP Local Log Connector" },
      { id: "ciso_budget", label: "CISO Budget Data", risk: "high", metadata: "Board Financial Plans" },
      { id: "pinecone", label: "Vector DB / Pinecone", risk: "low", metadata: "RAG Retrieval Index" }
    ],
    finance: [
      { id: "sf_flow", label: "Salesforce Flow\nPrompt Generator", risk: "high", metadata: "Vector DB: Pinecone | Context: Deal Summaries" },
      { id: "identity", label: "Identity Provider", risk: "medium", metadata: "SSO Assertion Relay" },
      { id: "s3_bucket", label: "AWS S3\nTrade Archives", risk: "high", metadata: "Confidential Revenue Data" },
      { id: "local_server", label: "Local Server\nAML Scoring", risk: "medium", metadata: "MCP Local Log Connector" },
      { id: "ciso_budget", label: "CISO Budget Data", risk: "high", metadata: "Risk Budget Allocations" },
      { id: "pinecone", label: "Vector DB / Pinecone", risk: "low", metadata: "RAG Retrieval Index" }
    ],
    retail: [
      { id: "sf_flow", label: "Salesforce Flow\nCampaign Prompts", risk: "high", metadata: "Vector DB: Pinecone | Context: Marketing Templates" },
      { id: "order_api", label: "Order API", risk: "medium", metadata: "Session Token Bridge" },
      { id: "s3_bucket", label: "AWS S3\nPurchase Logs", risk: "high", metadata: "PII + Payment Correlates" },
      { id: "local_server", label: "Local Server\nFraud Rules", risk: "medium", metadata: "MCP Local Log Connector" },
      { id: "ciso_budget", label: "CISO Budget Data", risk: "high", metadata: "Quarterly Mitigation Budget" },
      { id: "pinecone", label: "Vector DB / Pinecone", risk: "low", metadata: "RAG Retrieval Index" }
    ],
    public: [
      { id: "sf_flow", label: "Salesforce Flow\nCitizen Case Prompts", risk: "high", metadata: "Vector DB: Pinecone | Context: Service Templates" },
      { id: "idm", label: "Gov Identity Mesh", risk: "medium", metadata: "Privilege Federation" },
      { id: "s3_bucket", label: "AWS S3\nGrant Records", risk: "high", metadata: "Sensitive Budget Ledgers" },
      { id: "local_server", label: "Local Server\nPolicy Risk Model", risk: "medium", metadata: "MCP Local Log Connector" },
      { id: "ciso_budget", label: "CISO Budget Data", risk: "high", metadata: "Critical Program Funding" },
      { id: "pinecone", label: "Vector DB / Pinecone", risk: "low", metadata: "RAG Retrieval Index" }
    ]
  },
  graphEdges: [
    { from: "sf_flow", to: "pinecone", label: "Prompt Injection Retrieves Context" },
    { from: "sf_flow", to: "identity", label: "Token Abuse", fallbackTo: "api_gateway" },
    { from: "sf_flow", to: "order_api", label: "API Key Harvest", fallbackTo: "api_gateway" },
    { from: "sf_flow", to: "idm", label: "Privilege Pivot", fallbackTo: "api_gateway" },
    { from: "sf_flow", to: "api_gateway", label: "OAuth Scope Escalation" },
    { from: "identity", to: "s3_bucket", label: "Credential Replay" },
    { from: "order_api", to: "s3_bucket", label: "Signed URL Abuse" },
    { from: "idm", to: "s3_bucket", label: "Lateral Trust Abuse" },
    { from: "api_gateway", to: "s3_bucket", label: "STS Abuse" },
    { from: "s3_bucket", to: "local_server", label: "Data Staging to On-Prem" },
    { from: "local_server", to: "ciso_budget", label: "Risk Report Tampering" }
  ],
  drills: {
    healthcare: [
      ["RT-101", "Prompt attempts to modify exposure factor weights", "Risk Calculator", 41, 89, "Contained"],
      ["RT-109", "Salesforce prompt injects hidden SOQL exfil payload", "Salesforce Flow", 33, 87, "Blocked"],
      ["RT-117", "Agent proposes disabling MFA for service continuity", "Policy Engine", 56, 92, "Escalated & Fixed"]
    ],
    finance: [
      ["RT-211", "Manipulate exposure factors through adversarial examples", "Risk Calculator", 38, 91, "Contained"],
      ["RT-226", "Inject malicious logic into treasury Salesforce prompt", "Salesforce Flow", 29, 86, "Blocked"],
      ["RT-239", "Steganographic instruction to bypass internal controls", "Mitigation Agent", 47, 90, "Hardened"]
    ],
    retail: [
      ["RT-304", "Session fixation language in catalog prompt", "Risk Calculator", 44, 85, "Contained"],
      ["RT-318", "Exposure factors skewed by synthetic customer tags", "Pricing Agent", 40, 84, "Blocked"],
      ["RT-325", "Prompt chain tries to disable anti-fraud action", "Salesforce Flow", 35, 88, "Hardened"]
    ],
    public: [
      ["RT-402", "Policy prompt override attempts hidden escalation", "Risk Calculator", 36, 88, "Contained"],
      ["RT-417", "Injected grant-logic bypass in service prompt", "Salesforce Flow", 31, 85, "Blocked"],
      ["RT-423", "Adversarial context poisoning for budget response", "Governance Agent", 43, 89, "Hardened"]
    ]
  }
};

const riskColors = {
  low: "#00c6a2",
  medium: "#f7b731",
  high: "#ff5b5b"
};

const state = {
  activeSector: "finance",
  graph: null,
  rosiChart: null,
  inferenceChart: null
};

function safeNumber(value, suffix = "") {
  return `${value}${suffix}`;
}

function initTabs() {
  const tabButtons = document.querySelectorAll(".tab-link");
  const panels = document.querySelectorAll(".tab-panel");
  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      tabButtons.forEach((b) => b.classList.remove("active"));
      panels.forEach((p) => p.classList.remove("active"));
      button.classList.add("active");
      document.getElementById(button.dataset.tab).classList.add("active");
    });
  });
}

function getSectorNodes(sector) {
  return masterRiskDataset.graphRagThreats[sector].map((node) => ({
    id: node.id,
    label: `${node.label}\n${node.metadata}`,
    shape: "box",
    color: {
      background: "#121c31",
      border: riskColors[node.risk],
      highlight: {
        background: "#192741",
        border: riskColors[node.risk]
      }
    },
    font: { color: "#dbe5ff", size: 12 },
    margin: 10
  }));
}

function getSectorEdges(sector) {
  const availableNodes = new Set(masterRiskDataset.graphRagThreats[sector].map((n) => n.id));
  return masterRiskDataset.graphEdges
    .map((edge) => {
      const toNode = availableNodes.has(edge.to) ? edge.to : edge.fallbackTo;
      if (!availableNodes.has(edge.from) || !toNode || !availableNodes.has(toNode)) {
        return null;
      }
      return {
        from: edge.from,
        to: toNode,
        label: edge.label,
        arrows: "to",
        color: { color: "#4f6aa0" },
        font: { color: "#9db0dc", size: 10 },
        smooth: true
      };
    })
    .filter(Boolean);
}

function renderThreatGraph() {
  const container = document.getElementById("threatGraph");
  const nodes = new vis.DataSet(getSectorNodes(state.activeSector));
  const edges = new vis.DataSet(getSectorEdges(state.activeSector));
  const data = { nodes, edges };
  const options = {
    interaction: { hover: true },
    physics: {
      stabilization: true,
      barnesHut: { springLength: 130 }
    }
  };

  if (state.graph) {
    state.graph.destroy();
  }
  state.graph = new vis.Network(container, data, options);
}

function createRosiChart() {
  const ctx = document.getElementById("rosiChart");
  const benchmark = sectorBenchmarks[state.activeSector];
  if (state.rosiChart) {
    state.rosiChart.destroy();
  }
  state.rosiChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: months,
      datasets: [
        {
          label: "Annual Loss Expectancy (USD M)",
          data: benchmark.ale,
          borderColor: "#ff5b5b",
          backgroundColor: "rgba(255, 91, 91, 0.15)",
          tension: 0.25
        },
        {
          label: "Control Cost (USD M)",
          data: benchmark.controlCost,
          borderColor: "#4d7de8",
          backgroundColor: "rgba(77, 125, 232, 0.15)",
          tension: 0.25
        },
        {
          label: "ROSI (%)",
          data: benchmark.rosi,
          borderColor: "#00c6a2",
          backgroundColor: "rgba(0, 198, 162, 0.12)",
          tension: 0.25,
          yAxisID: "y1"
        }
      ]
    },
    options: {
      maintainAspectRatio: false,
      plugins: {
        legend: { labels: { color: "#c9d7fa" } }
      },
      scales: {
        x: { ticks: { color: "#9bb0db" }, grid: { color: "#1f3056" } },
        y: {
          ticks: { color: "#9bb0db" },
          grid: { color: "#1f3056" },
          title: { display: true, text: "USD M", color: "#9bb0db" }
        },
        y1: {
          position: "right",
          ticks: { color: "#9bb0db" },
          grid: { drawOnChartArea: false },
          title: { display: true, text: "ROSI %", color: "#9bb0db" }
        }
      }
    }
  });
}

function createInferenceChart() {
  const ctx = document.getElementById("inferenceChart");
  const benchmark = sectorBenchmarks[state.activeSector];
  if (state.inferenceChart) {
    state.inferenceChart.destroy();
  }
  state.inferenceChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: months,
      datasets: [{
        label: "Inference Efficiency Savings (%)",
        data: benchmark.inferenceSavings,
        borderColor: "#00c6a2",
        backgroundColor: "rgba(0, 198, 162, 0.5)"
      }]
    },
    options: {
      maintainAspectRatio: false,
      plugins: {
        legend: { labels: { color: "#c9d7fa" } }
      },
      scales: {
        x: { ticks: { color: "#9bb0db" }, grid: { color: "#1f3056" } },
        y: {
          min: 0,
          max: 100,
          ticks: { color: "#9bb0db" },
          grid: { color: "#1f3056" }
        }
      }
    }
  });
}

function updateGovernanceTable() {
  const tbody = document.querySelector("#drillTable tbody");
  tbody.innerHTML = "";
  masterRiskDataset.drills[state.activeSector].forEach((drill) => {
    const row = document.createElement("tr");
    const improvement = drill[4] - drill[3];
    const statusClass = improvement >= 35 ? "safe" : "warning";
    row.innerHTML = `
      <td>${drill[0]}</td>
      <td>${drill[1]}</td>
      <td>${drill[2]}</td>
      <td class="danger">${drill[3]}</td>
      <td class="safe">${drill[4]}</td>
      <td class="${statusClass}">${drill[5]}</td>
    `;
    tbody.appendChild(row);
  });
}

function updateKpis() {
  const benchmark = sectorBenchmarks[state.activeSector];
  document.getElementById("riskIndex").textContent = safeNumber(benchmark.baselineRiskIndex);
  document.getElementById("rosiHeadline").textContent = safeNumber(benchmark.rosi[11], "%");
  document.getElementById("inferenceDelta").textContent = safeNumber(`-${benchmark.inferenceSavings[11]}`, "%");
}

function updateAllVisuals() {
  renderThreatGraph();
  createRosiChart();
  createInferenceChart();
  updateGovernanceTable();
  updateKpis();
}

function simulateLiteLlmRouting(step, sector) {
  const routeMap = {
    "Retrieve Context": "router -> local/ollama:llama3.1 for private vuln logs",
    "Evaluate Risk": "router -> openrouter:gpt-4.1-mini for calibrated scoring",
    "Generate Mitigation": "router -> anthropic:claude-3.7 for policy-grade narrative"
  };
  console.log(`[LiteLLM] ${step} | sector=${sector} | ${routeMap[step]}`);
}

function runAuditStateMachine() {
  const steps = ["Retrieve Context", "Evaluate Risk", "Generate Mitigation"];
  const auditSteps = document.getElementById("auditSteps");
  auditSteps.innerHTML = "";

  let index = 0;
  const intervalId = setInterval(() => {
    if (index >= steps.length) {
      clearInterval(intervalId);
      const completed = document.createElement("li");
      completed.innerHTML = '<span class="safe">Audit Complete: Mitigations pushed to SOC queue</span>';
      auditSteps.appendChild(completed);
      return;
    }

    const step = steps[index];
    simulateLiteLlmRouting(step, state.activeSector);
    const line = document.createElement("li");
    line.textContent = `${step}...`;
    auditSteps.appendChild(line);
    index += 1;
  }, 850);
}

function initSectorSelector() {
  const selector = document.getElementById("sectorSelect");
  selector.addEventListener("change", (event) => {
    state.activeSector = event.target.value;
    updateAllVisuals();
  });
}

function initRunAudit() {
  const button = document.getElementById("runAuditBtn");
  button.addEventListener("click", () => {
    runAuditStateMachine();
  });
}

function initDashboard() {
  initTabs();
  initSectorSelector();
  initRunAudit();
  updateAllVisuals();

  console.log("[MCP] Connected to local vuln log server via Model Context Protocol.");
}

document.addEventListener("DOMContentLoaded", initDashboard);
