import type { ProjectDetail } from "../../types/project";
import DefaultProjectHero from "./DefaultProjectHero";
import "./LockedIn.css";

interface LockedInProjectLayoutProps {
  project: ProjectDetail;
  onBack: () => void;
}

export default function LockedInProjectLayout({ project, onBack }: LockedInProjectLayoutProps) {
  return (
    <>
      <DefaultProjectHero project={project} onBack={onBack} />
      <div className="lockedin-custom-layout">
        <section className="project-background col-centered">

          {/* ── OVERVIEW SECTION ── */}
          <section id="overview" className="group">
            <h3>Overview</h3>
            <hr />

            <div id="problem" className="subgroup">
              <h4>Problem</h4>
              <p>
                Students waste significant time wandering between libraries and cafes with no reliable way to know noise levels, seat availability, or whether outlets exist — before making the trip. Existing information is not centralized or up to date, resulting in difficulty finding suitable spaces and <span className="highlight highlight-orange">decreased focus on academic work</span>.
              </p>
              <h4>Solution</h4>
              <p>
                I designed <span className="highlight highlight-teal">LockedIn</span>, an app that centralizes real-time data on noise, occupancy, amenities, and room booking for both on-campus libraries and local Gainesville cafes. With a reward system that keeps the community data accurate, LockedIn reduces the time and frustration UF students experience when searching for quiet, less-crowded study spaces.
              </p>
            </div>
          </section>

          {/* ── GOALS & USERS SECTION ── */}
          <section id="goals" className="group">
            <div className="row">
              <div className="subgroup-left-side">
                <h4>Target Users</h4>
                <ul className="users-list">
                  <li>
                    <div className="user-icon ui-teal">🎓</div>
                    <div>
                      <div style={{ fontWeight: 500, fontSize: ".9rem", color: "var(--text-dark)", marginBottom: "2px" }}>UF In-Person Students</div>
                      <div style={{ fontSize: ".78rem", color: "var(--text-muted)" }}>Our primary user. 55,000+ students on campus who need study space discovery and booking.</div>
                    </div>
                  </li>
                  <li>
                    <div className="user-icon ui-orange">☕</div>
                    <div>
                      <div style={{ fontWeight: 500, fontSize: ".9rem", color: "var(--text-dark)", marginBottom: "2px" }}>Local Businesses & Libraries</div>
                      <div style={{ fontSize: ".78rem", color: "var(--text-muted)" }}>Secondary stakeholders who gain visibility and foot traffic through our platform listings.</div>
                    </div>
                  </li>
                </ul>
                <br />
              </div>

              <div className="subgroup-right-side">
                <h4>Product Goals</h4>
                <ul className="goals-list">
                  <li>Help students efficiently discover study spaces that match their noise and crowding preferences</li>
                  <li>Provide real-time, centralized data on availability, amenities, and parking</li>
                  <li>Enable seamless room booking and scheduling, solo or in groups</li>
                  <li>Motivate sustained focus through gamified study sessions and Gator Points rewards</li>
                </ul>
              </div>
            </div>
          </section>

          {/* ── MARKET CONTEXT SECTION ── */}
          <section id="market-context" className="group" style={{ marginTop: "40px" }}>
            <h3>Market Analysis</h3>
            <hr />

            <div className="subgroup">
              <p>
                Our user base is focused and specific — which creates an opportunity to build something deeply tailored to UF students that general apps like Google Maps simply can't match.
              </p>

              <div className="stats-row" style={{ marginTop: "20px" }}>
                <div className="stat">
                  <div className="stat-num">55<span>K+</span></div>
                  <div className="stat-desc">in-person UF students in the addressable market</div>
                </div>
                <div className="stat">
                  <div className="stat-num">7</div>
                  <div className="stat-desc">main campus libraries students rely on</div>
                </div>
                <div className="stat">
                  <div className="stat-num">60<span>+</span></div>
                  <div className="stat-desc">local Gainesville coffee shops near campus</div>
                </div>
                <div className="stat">
                  <div className="stat-num">72<span>%</span></div>
                  <div className="stat-desc">of surveyed students prioritize quiet or low-occupancy spaces</div>
                </div>
              </div>
            </div>
          </section>

          {/* ── STAKEHOLDERS SECTION ── */}
          <section id="stakeholders" className="group" style={{ marginTop: "40px" }}>
            <h3>Stakeholders</h3>
            <hr />

            <div className="subgroup">
              <p>
                LockedIn sits at the intersection of students, campus infrastructure, and local businesses. Understanding each stakeholder was key to scoping the right feature set.
              </p>

              <div className="stakeholder-row">
                <div className="sh-card">
                  <div className="sh-card-label">Internal</div>
                  <div className="sh-card-title">Development Team & Management</div>
                  <p className="sh-card-body">Responsible for the product vision, roadmap, and ensuring the app meets course and business requirements.</p>
                </div>
                <div className="sh-card">
                  <div className="sh-card-label">External — Primary</div>
                  <div className="sh-card-title">UF Students</div>
                  <p className="sh-card-body">Our core users. In-person undergrad and graduate students who need to find quiet, available study spaces quickly and reliably.</p>
                </div>
                <div className="sh-card">
                  <div className="sh-card-label">External — Secondary</div>
                  <div className="sh-card-title">Campus Libraries</div>
                  <p className="sh-card-body">Affected by changes in student traffic distribution. A partnership model could allow live room availability data via our platform.</p>
                </div>
                <div className="sh-card">
                  <div className="sh-card-label">External — Secondary</div>
                  <div className="sh-card-title">Local Cafes & The University</div>
                  <p className="sh-card-body">Cafes gain visibility and foot traffic; UF benefits from better utilization of study infrastructure across campus.</p>
                </div>
              </div>
            </div>
          </section>

        </section>
      </div>
    </>
  );
}
