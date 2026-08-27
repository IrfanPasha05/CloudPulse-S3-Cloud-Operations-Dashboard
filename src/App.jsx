import { useMemo, useState } from "react";

const services = [
  { name: "Amazon S3", status: "Operational", detail: "Static website hosting", metric: "99.99%" },
  { name: "GitHub Actions", status: "Operational", detail: "CI/CD deployment", metric: "24 runs" },
  { name: "CloudFront", status: "Ready", detail: "Optional CDN layer", metric: "Edge ready" },
  { name: "Route 53", status: "Ready", detail: "Optional DNS layer", metric: "DNS ready" }
];

const deployments = [
  { id: "#1042", branch: "main", message: "Improve cloud dashboard cards", time: "2 min ago", result: "Success" },
  { id: "#1041", branch: "main", message: "Update S3 deployment workflow", time: "18 min ago", result: "Success" },
  { id: "#1040", branch: "main", message: "Fix responsive navigation", time: "1 hr ago", result: "Success" },
  { id: "#1039", branch: "feature/ui", message: "Add operations table", time: "3 hrs ago", result: "Success" }
];

function App() {
  const [active, setActive] = useState("Overview");
  const [search, setSearch] = useState("");

  const filteredDeployments = useMemo(
    () =>
      deployments.filter((item) =>
        `${item.id} ${item.branch} ${item.message}`.toLowerCase().includes(search.toLowerCase())
      ),
    [search]
  );

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">CP</div>
          <div>
            <strong>CloudPulse</strong>
            <span>S3 Operations</span>
          </div>
        </div>

        <nav>
          {["Overview", "Deployments", "Infrastructure", "Runbook"].map((item) => (
            <button
              key={item}
              className={active === item ? "nav-item active" : "nav-item"}
              onClick={() => setActive(item)}
            >
              <span>{item === "Overview" ? "◈" : item === "Deployments" ? "↻" : item === "Infrastructure" ? "◇" : "☰"}</span>
              {item}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="mini-status"><span className="dot"></span> All systems healthy</div>
          <small>Static frontend • S3 ready</small>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <p className="eyebrow">CLOUD OPERATIONS CENTER</p>
            <h1>{active}</h1>
          </div>
          <div className="top-actions">
            <div className="search">
              <span>⌕</span>
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search deployments..." />
            </div>
            <div className="avatar">IP</div>
          </div>
        </header>

        {active === "Overview" && (
          <>
            <section className="hero">
              <div>
                <span className="pill"><span className="dot"></span> Production healthy</span>
                <h2>Ship with confidence.</h2>
                <p>CloudPulse demonstrates a production-style S3 hosting workflow powered by GitHub Actions.</p>
                <div className="hero-actions">
                  <button className="primary" onClick={() => setActive("Deployments")}>View deployments →</button>
                  <button className="secondary" onClick={() => setActive("Runbook")}>Open runbook</button>
                </div>
              </div>
              <div className="hero-orbit">
                <div className="orbit outer"></div>
                <div className="orbit inner"></div>
                <div className="core">S3</div>
              </div>
            </section>

            <section className="stats">
              <Stat label="Availability" value="99.99%" change="+0.02%" />
              <Stat label="Deployments" value="24" change="+6 this week" />
              <Stat label="Build time" value="38s" change="-12s vs last week" />
              <Stat label="Bucket sync" value="Healthy" change="Last sync 2 min ago" />
            </section>

            <section className="grid-two">
              <div className="panel">
                <div className="panel-heading">
                  <div><span className="section-kicker">SERVICE HEALTH</span><h3>Infrastructure</h3></div>
                  <span className="healthy">● Healthy</span>
                </div>
                <div className="service-list">
                  {services.map((service) => (
                    <div className="service-row" key={service.name}>
                      <div className="service-icon">{service.name === "Amazon S3" ? "S3" : service.name === "GitHub Actions" ? "GH" : "AWS"}</div>
                      <div className="service-copy"><strong>{service.name}</strong><span>{service.detail}</span></div>
                      <div className="service-metric"><strong>{service.metric}</strong><span>{service.status}</span></div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="panel pipeline">
                <div className="panel-heading">
                  <div><span className="section-kicker">DELIVERY PIPELINE</span><h3>Build → Deploy</h3></div>
                  <span className="healthy">● Passed</span>
                </div>
                <div className="pipeline-line">
                  {["Push", "Build", "Test", "S3 Sync"].map((step, index) => (
                    <div className="pipe-step" key={step}>
                      <div className="pipe-node">✓</div>
                      <strong>{step}</strong>
                      <span>{index === 0 ? "GitHub" : index === 1 ? "Vite" : index === 2 ? "CI gate" : "Amazon S3"}</span>
                    </div>
                  ))}
                </div>
                <div className="deploy-note">Latest deployment <strong>#1042</strong> completed successfully.</div>
              </div>
            </section>

            <section className="panel table-panel">
              <div className="panel-heading">
                <div><span className="section-kicker">RECENT ACTIVITY</span><h3>Latest deployments</h3></div>
                <button className="text-button" onClick={() => setActive("Deployments")}>View all →</button>
              </div>
              <DeploymentTable rows={filteredDeployments.slice(0, 3)} />
            </section>
          </>
        )}

        {active === "Deployments" && (
          <section className="panel full-panel">
            <div className="panel-heading">
              <div><span className="section-kicker">CI/CD</span><h3>Deployment history</h3></div>
              <span className="healthy">● All passed</span>
            </div>
            <DeploymentTable rows={filteredDeployments} />
          </section>
        )}

        {active === "Infrastructure" && (
          <section className="grid-two">
            <div className="panel full-panel">
              <span className="section-kicker">AWS</span><h3>S3 architecture</h3>
              <div className="architecture">
                <div className="arch-box">Developer<br/><small>git push</small></div>
                <div className="arrow">→</div>
                <div className="arch-box">GitHub Actions<br/><small>build + deploy</small></div>
                <div className="arrow">→</div>
                <div className="arch-box">Amazon S3<br/><small>static hosting</small></div>
              </div>
              <p className="muted">Optional next layer: CloudFront for HTTPS, caching and a global edge distribution.</p>
            </div>
            <div className="panel full-panel">
              <span className="section-kicker">BUCKET</span><h3>Recommended configuration</h3>
              <ul className="check-list">
                <li>Block public access policy reviewed</li>
                <li>Static website index configured</li>
                <li>Versioning enabled for recovery</li>
                <li>Least-privilege IAM deployment role</li>
                <li>CloudFront + Origin Access Control for production</li>
              </ul>
            </div>
          </section>
        )}

        {active === "Runbook" && (
          <section className="panel full-panel runbook">
            <span className="section-kicker">OPERATIONS</span>
            <h3>S3 deployment runbook</h3>
            <div className="run-step"><b>01</b><div><strong>Change application code</strong><p>Update React/Vite source and validate locally with <code>npm run build</code>.</p></div></div>
            <div className="run-step"><b>02</b><div><strong>Push to main</strong><p>Run <code>git add . && git commit -m "update" && git push origin main</code>.</p></div></div>
            <div className="run-step"><b>03</b><div><strong>GitHub Actions executes</strong><p>The runner checks out code, installs packages, builds the app and syncs <code>dist/</code> to S3.</p></div></div>
            <div className="run-step"><b>04</b><div><strong>Validate production</strong><p>Open the S3 website endpoint or CloudFront distribution and confirm the new release.</p></div></div>
          </section>
        )}
      </main>
    </div>
  );
}

function Stat({ label, value, change }) {
  return <div className="stat"><span>{label}</span><strong>{value}</strong><small>{change}</small></div>;
}

function DeploymentTable({ rows }) {
  return (
    <div className="table-wrap">
      <table>
        <thead><tr><th>Run</th><th>Branch</th><th>Commit</th><th>Time</th><th>Status</th></tr></thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}><td><strong>{row.id}</strong></td><td><span className="branch">{row.branch}</span></td><td>{row.message}</td><td>{row.time}</td><td><span className="success">✓ {row.result}</span></td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;