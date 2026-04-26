import { useState } from "react";
import type { ProjectDetail } from "../../types/project";
import DefaultProjectHero from "./DefaultProjectHero";
import "./LockedIn.css";

interface LockedInProjectLayoutProps {
  project: ProjectDetail;
  onBack: () => void;
}

export default function LockedInProjectLayout({ project, onBack }: LockedInProjectLayoutProps) {
  const [activeReflection, setActiveReflection] = useState<string | null>(null);
  const [activeWireframe, setActiveWireframe] = useState<{ src: string; alt: string; label: string } | null>(null);

  const wireframes = [
    { src: "/assets/LockedIn/WIREFRAME-LOGIN.png", alt: "Login Wireframe", label: "Login" },
    { src: "/assets/LockedIn/WIREFRAME-MAP.png", alt: "Map Wireframe", label: "Map View" },
    { src: "/assets/LockedIn/WIREFRAME-CALENDAR.png", alt: "Calendar Wireframe", label: "Calendar" },
    { src: "/assets/LockedIn/WIREFRAME-PROFILE.png", alt: "Profile Wireframe", label: "Home & Profile" },
  ] as const;

  const teamMembers = [
    {
      name: "Emily Apel",
      role: "Wireframes, prototype finishing, testing, and portfolio",
      contributions: [
        "Designed wireframes",
        "Prototype development and finishing touches",
        "Conducted interview",
        "Note taker for user testing",
        "Aided with project management",
        "Developed portfolio",
      ],
      reflection: [
        "Reflection text was not included in the source document excerpt for Emily Apel.",
      ],
    },
    {
      name: "Belinda Morales",
      role: "Affinity mapping, requirements, competitor analysis, prototype support",
      contributions: [
        "Created new affinity diagram",
        "Created design requirements",
        "Established the pros and cons for the first two competitors in the competitor analysis",
        "Prototyped the map overlay section",
      ],
      reflection: [
        "Reflection text was not included in the source document excerpt for Belinda Morales.",
      ],
    },
    {
      name: "Jaden Thompson",
      role: "Competitor analysis, interviews, personas, testing",
      contributions: [
        "Created a summary of the project idea",
        "Conducted competitor analysis for Muggerino and Study Space",
        "Created the competitor analysis matrix",
        "Helped create survey questions",
        "Conducted an interview",
        "Created the personas",
        "Conducted user testing",
        "Designed the ads on the home page",
        "Helped prototype the home page",
        "Annotated the wireframes",
      ],
      reflection: [
        "I was in charge of creating the competitor analysis for two of the four apps. Creating a competitor analysis was a lot harder than I originally thought it was going to be. Finding study apps that were competitors to the app we wanted to design was very hard, because there are not many apps on the app store that offer what we wanted to give to students. A lot of the apps I found were general study tips or study timer apps. However, I eventually found Study Space and Muggerino. These apps were exactly the competitors I was looking for. I think that doing an analysis of these apps helped refine what features we did and didn’t want to include in our app. Once I had a clear pros and cons list of all four apps, creating the Matrix was easy.",
        "Conducting the interviews was fun and a great learning experience. One of the main things I learned while conducting an interview was how to make sure I am delivering the question in a clear manner. My interviewee asked for clarity on the meaning of one of the questions since she is not too familiar with tech-related terms, and I was able to provide her with an example of what I was talking about.",
        "User testing was a great experience for me. I enjoyed seeing our work be used by real people and observing how they interacted with our design. It was hard to stay quiet and not help guide the user through the app, but it was also very important that using our app is intuitive. I enjoyed asking our users questions about our app and seeing an outside perspective on how our design could be improved.",
        "Additionally, designing fake ads for our app really opened my eyes to how much work goes into a single prototype. I also learned that I enjoy prototyping a lot because that’s what really pulls all your work together. Creating features on the home page was very difficult for me because I am new to Figma, and it was hard to execute what I wanted. Furthermore, there were times when something would look off with the design, but I couldn’t figure out what it was. The carousel animation was also very hard for me to do, and I had to start over three times before I could get it to work.",
        "I think a lot of things went well while creating our prototype, but there are definitely some things we could have done to polish our app. For example, we didn’t get the chance to create the slide-down animation for the map overlay page. We also missed easy fixes like labeling things more clearly, such as our promotions of the week section. I think another thing that could be good to include in our prototype is a way for students to find other people to study with. During the interviews, I learned that some users were interested in group study but did not know how to find other people studying the same topic as them. Implementing a way for users to better connect and study with others, without making it feel like a social media feature, could really help address an important issue that some of our users noted having. I think the design could be simple, such as showing other users nearby who are studying the same topic as you, and the times that they want to study. If your preferences match with that user, then you could use the app to pick a spot to meet and study.",
      ],
    },
    {
      name: "Olivia Harper",
      role: "Strategy, visual direction, requirements, prototyping",
      contributions: [
        "Led brainstorming in Miro for the affinity diagrams and design requirements",
        "Defined the project objective",
        "Helped develop survey questions",
        "Created the scenario",
        "Helped with wireframes and prototyping",
        "Conducted user testing",
        "Analyzed survey results and user testing to refine requirements and improve the prototype",
        "Designed the Details wireframe",
      ],
      reflection: [
        "I was in charge of developing the requirements for our app and creating the user scenario to explore how our app might solve our target user’s issues. I also conducted my own user testing outside of class to determine pain points in our app while we were wireframing and prototyping. Finally, I developed the cosmetic features of our app, including the color scheme, typography, and the logo.",
        "I led many of the brainstorming sessions using Miro to create charts and maps to facilitate team member collaboration in the development of our app. I also created organized documents to ensure that our team met all the rubric requirements for our assignments. I used the Miro board as a guide to help develop questions for our survey and interviews based on the ideas and suggestions we made. For example, some of us wanted gamification while others felt it might distract from the app’s overall purpose, so I designed questions to gauge user interest in this feature.",
        "Once we had a better idea of the features our users wanted, I used Miro again to make a general list of the wants and needs we should focus on when creating the prototype. I also used our affinity diagram to inform the user journey of the scenario I created. For project three, I tested the app on my roommates, finding that they were struggling with the old version of our prototype mainly due to some errors in hooking things up in Figma. With this, I designed and implemented the Details section of our wireframes to represent the key information users cared about in both visual and written formats to improve efficiency and accessibility.",
        "While I found the conceptualization portion to be relatively easy, I struggled greatly with implementing changes to our wireframes and prototypes in Figma. This was my first time using Figma, so I had to watch tutorials for everything, even simple things like editing text. While Figma is very powerful, it’s not as user-friendly as other programs I’m more familiar with, like Canva or the Adobe Suite. This really slowed down my workflow, and I wasn’t able to contribute as much as I would have liked in the timeframe we had.",
        "To support my team more, I relied on my strengths in design and digital art and pivoted to focus on the look of our app. Emily had wanted a 1970s, vintage look with a muted, mellow color scheme. I used Pinterest to create a moodboard for the app’s design. Since our app was targeting UF students, I stuck with greens, blues, and oranges that would help us associate our app more with the university. For the logo, I designed a gator reading a book to show that we are a study-focused app for UF. I turned the book into an L to link the logo back to our name, Locked In. For a name like Locked In, it might seem obvious to include a lock in our design. However, I felt that a lock would confuse users into thinking that we offered privacy services since locks are commonly used as icons to represent privacy and protection. If I had more time, I would learn more about the smart animations in Figma to enhance not just the look, but also the feel of our app.",
      ],
    },
    {
      name: "Andres Maldonado",
      role: "Stakeholder map, survey goals, testing, prototype support",
      contributions: [
        "Created the stakeholder map",
        "Established survey goals",
        "Condensed survey insights",
        "Conducted user testing",
        "Contributed to the prototype",
      ],
      reflection: [
        "I was in charge of creating the stakeholder map, identifying survey goals and insights, and contributing to the prototype and user testing. Creating the stakeholder map was a straightforward task since we had a pretty clear vision of exactly who we wanted to appeal to and who we would have to work with to accomplish our goals from the outset. Still, the exercise helped me recognize how wide-ranging the effects of our program could be on many parties. We wouldn’t affect just students and libraries, but transportation systems, professors, and study services.",
        "Furthermore, contributing questions to the survey was a team effort, but I narrowed down exactly what we were hoping to learn from the questionnaire. We wanted to identify what features our target users would want most, but beyond that, we wanted to challenge our key assumptions. We posited that our app would be able to redistribute students across campus, lightening the load on the most populated spaces and sending students to other spaces that were regularly far from reaching capacity.",
        "However, we recognized that in order to accomplish this, we were assuming that students would readily move their studying to another location if our app suggested it. Students may have personal connections, planned-out schedules, aesthetic preferences, or just a plain habit that ties them to a library or coffee shop. On further thought, we could not simply assume that those students would be willing to switch study spaces when they had become so accustomed to studying at a specific few.",
        "Once we had completed our survey, I also went through and articulated our key findings. Notably, roughly half of respondents study in groups, and 72% of respondents preferred silent spaces or spaces with few people. With this in mind, we recognized that loudness and crowdedness reporting were our most crucial features to include, and that we should focus on features that enable and benefit group studying, like the group scheduling feature we would implement in our prototype. Also, around half of users claim they primarily study at home, so we realized we needed to provide features in our app to justify users leaving their homes to attend study spaces. After all, we pitched ourselves as being able to drive business to local shops where students can study. We ended up adding ads and promotions for local coffee shops in our prototype to achieve this effect.",
        "During user testing, I tested one user and contributed their feedback to our rework of our prototype. It went rather smoothly as our app was fairly straightforward even in the form it was in during the testing phase. My user was able to proceed effectively through the prototype to achieve the goals we laid out.",
        "As for working on the prototype, I found Figma to be a more frustrating and unintuitive program than I had anticipated. With experience in Adobe programs and Unity, I found some elements of Figma convenient, such as the easy implementation of scrolling, but others were bothersome and obtuse. Specifically, I found no immediately clear way to program buttons to interact with each other and change sophisticated global stats. Nonetheless, I did inefficient but workable solutions to accomplish what I needed to, and I still feel I am walking away with some valuable new knowledge about the program.",
      ],
    },
    {
      name: "Carter Braun",
      role: "Team member listed in project summary",
      contributions: [
        "Conducted market trend analysis",
        "Analyzed key research takeaways",
        "Prototype development and demonstration",
        "Conducted interview and user testing",
      ],
      reflection: [
        "The supplied document does not include Carter Braun’s individual reflection text, so I can’t present it as source-based copy without inventing details.",
      ],
    },
  ] as const;

  const activeMember = teamMembers.find((member) => member.name === activeReflection) ?? null;

  return (
    <>
      <DefaultProjectHero project={project} onBack={onBack} />
      <div className="lockedin-custom-layout">
        <div className="lockedin-page-shell">
          <nav className="chapter-sidebar" aria-label="LockedIn case study sections">
            <ol className="chapter-tree">
              <li className="chapter-node">
                <a href="#project-background" className="chapter-link">
                  <span className="chapter-index">01</span>
                  <span className="chapter-title">Background &amp; Market</span>
                </a>
                <ul className="chapter-subtree">
                  <li><a href="#project-background" className="chapter-sub-link">Project Background</a></li>
                  <li><a href="#goals" className="chapter-sub-link">Goals &amp; Users</a></li>
                  <li><a href="#market-context" className="chapter-sub-link">Market Analysis</a></li>
                  <li><a href="#competitor-analysis" className="chapter-sub-link">Competitor Analysis</a></li>
                </ul>
              </li>
              <li className="chapter-node">
                <a href="#user-research" className="chapter-link">
                  <span className="chapter-index">02</span>
                  <span className="chapter-title">User Research</span>
                </a>
                <ul className="chapter-subtree">
                  <li><a href="#user-research" className="chapter-sub-link">Survey Findings</a></li>
                  <li><a href="#user-personas" className="chapter-sub-link">Personas</a></li>
                  <li><a href="#journey-map" className="chapter-sub-link">Journey Map</a></li>
                </ul>
              </li>
              <li className="chapter-node">
                <a href="#design-requirements" className="chapter-link">
                  <span className="chapter-index">03</span>
                  <span className="chapter-title">Design Process</span>
                </a>
                <ul className="chapter-subtree">
                  <li><a href="#design-requirements" className="chapter-sub-link">Requirements</a></li>
                  <li><a href="#wireframes" className="chapter-sub-link">Wireframes</a></li>
                </ul>
              </li>
              <li className="chapter-node">
                <a href="#final-prototype" className="chapter-link">
                  <span className="chapter-index">04</span>
                  <span className="chapter-title">Final Prototype</span>
                </a>
              </li>
              <li className="chapter-node">
                <a href="#user-testing" className="chapter-link">
                  <span className="chapter-index">05</span>
                  <span className="chapter-title">User Testing</span>
                </a>
              </li>
              <li className="chapter-node">
                <a href="#contribution" className="chapter-link">
                  <span className="chapter-index">06</span>
                  <span className="chapter-title">Contribution &amp; Reflection</span>
                </a>
              </li>
            </ol>
          </nav>

          <section className="project-background col-centered">

            {/* ══════════════════════════════════════════
              SECTION 1 — PROJECT BACKGROUND & MARKET ANALYSIS
              ══════════════════════════════════════════ */}
            {/* ── PROJECT BACKGROUND ── */}
            <section id="project-background" className="group">
              <h3>Project Background</h3>
              <hr />

              <div id="problem" className="subgroup">
                <h4>Problem</h4>
                <p>
                  UF students need clear, real-time information about where they can study. Existing options are fragmented and often out of date, so students spend time walking between locations, checking crowd levels in person, and settling for spaces that do not match their needs.
                </p>
                <h4>Solution</h4>
                <p>
                  LockedIn is a mobile-first study space platform for UF students. The app combines on-campus and nearby off-campus options into one place, with filters for noise, occupancy, amenities, and group needs. Students can quickly find a location, reserve a space when available, and stay motivated through lightweight gamification and study-session tracking.
                </p>
              </div>
            </section>

            {/* ── GOALS & USERS ── */}
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

            {/* ── MARKET ANALYSIS ── */}
            <section id="market-context" className="group" style={{ marginTop: "40px" }}>
              <h3>Market Analysis</h3>
              <hr />

              <div className="subgroup">
                <div className="market-analysis-grid">
                  <div className="market-map-col">
                    <img src="/assets/LockedIn/stakeholder.svg" alt="Stakeholder Map" className="full-img" />
                  </div>

                  <div className="market-text-col">
                    <div className="stakeholder-map-header">
                      <h4>Stakeholder Map</h4>
                      <p>
                        LockedIn sits at the intersection of students, campus infrastructure, and local businesses. Understanding each stakeholder was key to scoping the right feature set.
                      </p>
                    </div>
                    <div className="market-size">
                      <h4>Market Size</h4>
                      <p>
                        Our market is focused rather than broad, which is a strength. General-purpose discovery tools can show places, but they do not provide the study-specific context UF students need, like noise, real-time crowding, and room suitability.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="stats-row">
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

            {/* ── COMPETITOR ANALYSIS ── */}
            <section id="competitor-analysis" className="group" style={{ marginTop: "40px" }}>
              <h3>Competitor Analysis</h3>
              <hr />
              <div className="subgroup">
                <p>
                  We benchmarked LockedIn against existing tools students already use to find study spaces, then mapped feature-level strengths and gaps.
                </p>
                <p>
                  The analysis showed a consistent pattern: competitors may offer one or two strong capabilities (for example, live occupancy, map UX, or favorites), but none combine campus-specific study data, flexible filtering, and a focused student workflow in one coherent experience.
                </p>
                <div className="ca-wrap">
                  <table className="ca-table">
                    <thead>
                      <tr>
                        <th className="ca-th ca-th-label">Feature</th>
                        <th className="ca-th">Waitz University</th>
                        <th className="ca-th">Nook</th>
                        <th className="ca-th">Muggerino</th>
                        <th className="ca-th">Study Space</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="ca-row">
                        <td className="ca-td ca-td-label">Real-time crowdedness data</td>
                        <td className="ca-td"><span className="ca-badge ca-yes">✓ Yes</span></td>
                        <td className="ca-td"><span className="ca-badge ca-ltd">⚠ Limited</span></td>
                        <td className="ca-td"><span className="ca-badge ca-yes">✓ Yes</span></td>
                        <td className="ca-td"><span className="ca-badge ca-ltd">⚠ Limited</span></td>
                      </tr>
                      <tr className="ca-row ca-row-alt">
                        <td className="ca-td ca-td-label">Noise-level information</td>
                        <td className="ca-td"><span className="ca-badge ca-no">✕ No</span></td>
                        <td className="ca-td"><span className="ca-badge ca-ltd">⚠ Limited</span></td>
                        <td className="ca-td"><span className="ca-badge ca-no">✕ No</span></td>
                        <td className="ca-td"><span className="ca-badge ca-no">✕ No</span></td>
                      </tr>
                      <tr className="ca-row">
                        <td className="ca-td ca-td-label">Amenities display</td>
                        <td className="ca-td"><span className="ca-badge ca-ltd">⚠ Limited</span></td>
                        <td className="ca-td"><span className="ca-badge ca-yes">✓ Yes</span></td>
                        <td className="ca-td"><span className="ca-badge ca-yes">✓ Yes</span></td>
                        <td className="ca-td"><span className="ca-badge ca-ltd">⚠ Limited</span></td>
                      </tr>
                      <tr className="ca-row ca-row-alt">
                        <td className="ca-td ca-td-label">Ability to favorite spots</td>
                        <td className="ca-td"><span className="ca-badge ca-no">✕ No</span></td>
                        <td className="ca-td"><span className="ca-badge ca-yes">✓ Yes</span></td>
                        <td className="ca-td"><span className="ca-badge ca-yes">✓ Yes</span></td>
                        <td className="ca-td"><span className="ca-badge ca-no">✕ No</span></td>
                      </tr>
                      <tr className="ca-row">
                        <td className="ca-td ca-td-label">Gamification elements</td>
                        <td className="ca-td"><span className="ca-badge ca-no">✕ No</span></td>
                        <td className="ca-td"><span className="ca-badge ca-no">✕ No</span></td>
                        <td className="ca-td"><span className="ca-badge ca-yes">✓ Yes</span></td>
                        <td className="ca-td"><span className="ca-badge ca-no">✕ No</span></td>
                      </tr>
                      <tr className="ca-row ca-row-alt">
                        <td className="ca-td ca-td-label">Interactive map</td>
                        <td className="ca-td"><span className="ca-badge ca-yes">✓ Yes</span></td>
                        <td className="ca-td"><span className="ca-badge ca-yes">✓ Yes</span></td>
                        <td className="ca-td"><span className="ca-badge ca-yes">✓ Yes</span></td>
                        <td className="ca-td"><span className="ca-badge ca-ltd">⚠ Limited</span></td>
                      </tr>
                      <tr className="ca-row">
                        <td className="ca-td ca-td-label">Sign-in requirement</td>
                        <td className="ca-td"><span className="ca-badge ca-no">✕ No</span></td>
                        <td className="ca-td"><span className="ca-badge ca-ltd">⚠ Optional</span></td>
                        <td className="ca-td"><span className="ca-badge ca-ltd">⚠ Required</span></td>
                        <td className="ca-td"><span className="ca-badge ca-no">✕ No</span></td>
                      </tr>
                      <tr className="ca-row ca-row-alt">
                        <td className="ca-td ca-td-label">Platform availability</td>
                        <td className="ca-td"><span className="ca-plain">iOS &amp; Android</span></td>
                        <td className="ca-td"><span className="ca-plain">iOS only</span></td>
                        <td className="ca-td"><span className="ca-plain">iOS only</span></td>
                        <td className="ca-td"><span className="ca-plain">iOS &amp; Android</span></td>
                      </tr>
                      <tr className="ca-row">
                        <td className="ca-td ca-td-label">App coverage</td>
                        <td className="ca-td"><span className="ca-plain">Partner campuses</span></td>
                        <td className="ca-td"><span className="ca-plain">Multiple cities</span></td>
                        <td className="ca-td"><span className="ca-plain">Select campuses</span></td>
                        <td className="ca-td"><span className="ca-plain">UT Dallas only</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* ══════════════════════════════════════════
              SECTION 2 — USER RESEARCH
              ══════════════════════════════════════════ */}
            {/* ── SURVEY & FINDINGS ── */}
            <section id="user-research" className="group">
              <h3>User Research</h3>
              <hr />
              <div className="subgroup">
                <p>
                  To understand real student behavior, we ran a 20-question survey and conducted interviews with 3 UF students.
                </p>

                <h4 style={{ marginBottom: "8px" }}>Survey</h4>
                <p>
                  The survey captured study habits, environment preferences, recurring frustrations, and openness to behavior-change features like reminders and rewards. We collected 29 responses to establish directional patterns before moving into design.
                </p>

                <div className="ur-charts">
                  <div className="ur-chart-card">
                    <div className="ur-chart-header">
                      <span className="ur-star ur-star-orange">✦</span>
                      <div>
                        <div className="ur-chart-title">Study Space Preferences</div>
                        <div className="ur-chart-desc"><strong>72.4%</strong> of respondents prioritize quiet spaces or spaces with few people</div>
                      </div>
                    </div>
                    <svg className="ur-donut" viewBox="0 0 120 120">
                      <circle cx="60" cy="60" r="46" fill="none" stroke="#7A9E7E" strokeWidth="14" />
                      <circle cx="60" cy="60" r="46" fill="none" stroke="#2D6B6B" strokeWidth="14"
                        strokeDasharray={`${2 * Math.PI * 46 * 0.276} ${2 * Math.PI * 46}`}
                        strokeDashoffset={`${2 * Math.PI * 46 * 0.25}`}
                        transform="rotate(-90 60 60)" />
                    </svg>
                  </div>

                  <div className="ur-chart-card">
                    <div className="ur-chart-header">
                      <span className="ur-star ur-star-gold">✦</span>
                      <div>
                        <div className="ur-chart-title">Studying Out of Home</div>
                        <div className="ur-chart-desc"><strong>55.2%</strong> of survey respondents study outside of their apartment most often</div>
                      </div>
                    </div>
                    <svg className="ur-donut" viewBox="0 0 120 120">
                      <circle cx="60" cy="60" r="46" fill="none" stroke="#7A9E7E" strokeWidth="14" />
                      <circle cx="60" cy="60" r="46" fill="none" stroke="#2D6B6B" strokeWidth="14"
                        strokeDasharray={`${2 * Math.PI * 46 * 0.448} ${2 * Math.PI * 46}`}
                        strokeDashoffset={`${2 * Math.PI * 46 * 0.25}`}
                        transform="rotate(-90 60 60)" />
                    </svg>
                  </div>

                  <div className="ur-chart-card">
                    <div className="ur-chart-header">
                      <span className="ur-star ur-star-sage">✦</span>
                      <div>
                        <div className="ur-chart-title">Group Studying</div>
                        <div className="ur-chart-desc"><strong>44.8%</strong> of survey respondents say they typically study in groups</div>
                      </div>
                    </div>
                    <svg className="ur-donut" viewBox="0 0 120 120">
                      <circle cx="60" cy="60" r="46" fill="none" stroke="#7A9E7E" strokeWidth="14" />
                      <circle cx="60" cy="60" r="46" fill="none" stroke="#2D6B6B" strokeWidth="14"
                        strokeDasharray={`${2 * Math.PI * 46 * 0.552} ${2 * Math.PI * 46}`}
                        strokeDashoffset={`${2 * Math.PI * 46 * 0.25}`}
                        transform="rotate(-90 60 60)" />
                    </svg>
                  </div>
                </div>
              </div>
            </section>

            {/* ── USER PERSONAS ── */}
            <section id="user-personas" className="group" style={{ marginTop: "40px" }}>
              <h3>User Personas</h3>
              <hr />

              <div className="subgroup">
                <p>
                  We developed two primary personas to represent the core needs of our student users.
                </p>

                <div className="personas-row">
                  <div className="persona-card">
                    <div className="persona-header">
                      <div className="persona-avatar">A</div>
                      <div>
                        <h4>Arlyn</h4>
                        <div className="persona-sub">UF Undergraduate Student</div>
                      </div>
                    </div>
                    <p className="persona-text">
                      <strong>Needs:</strong> A quiet place to study with optional group collaboration and low setup friction.
                    </p>
                    <p className="persona-text">
                      <strong>Pain Points:</strong> Home environments are often too loud, and it is hard to find peers or spaces that match her current study goals.
                    </p>
                    <p className="persona-text">
                      <strong>Goals:</strong> Maintain a consistent routine, reduce stress near exams, and stay motivated through clear progress signals.
                    </p>
                  </div>

                  <div className="persona-card">
                    <div className="persona-header">
                      <div className="persona-avatar">S</div>
                      <div>
                        <h4>Sophie</h4>
                        <div className="persona-sub">UF Student</div>
                      </div>
                    </div>
                    <p className="persona-text">
                      <strong>Needs:</strong> A fast way to find quiet, reliable spaces without navigating cluttered interfaces.
                    </p>
                    <p className="persona-text">
                      <strong>Pain Points:</strong> Existing tools feel inconsistent, require too many steps, and do not clearly communicate noise or crowd conditions.
                    </p>
                    <p className="persona-text">
                      <strong>Goals:</strong> Quickly compare options, verify study conditions, and avoid distractions while staying focused.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* ── SCENARIO & JOURNEY MAP ── */}
            <section id="journey-map" className="group" style={{ marginTop: "40px" }}>
              <h3>Scenario &amp; Journey Map</h3>
              <hr />

              <div className="subgroup">
                <p>
                  We translated research insights into a practical scenario flow: discover, evaluate, reserve, and stay engaged. These journeys helped us prioritize only the features that directly reduce search friction and support focused study sessions.
                </p>
                <figure className="scenario-figure">
                  <img src="/public/assets/LockedIn/user_scenario.png" alt="User Journey Map" className="full-img" />
                  <figcaption className="scenario-caption">
                    Group study scenario showing how students search for the right space, how local businesses gain visibility, and how gamified features support engagement.
                  </figcaption>
                </figure>

                <div className="rr-list">
                  <div className="rr-item">
                    <div className="rr-text">
                      <div className="journey-step">1</div>
                      <h4>Find Available Study Space</h4>
                      <p>As a student, I want to quickly find a quiet study space near my current location so that I can start studying immediately without wasting time searching.</p>
                    </div>
                    <div className="rr-gif">
                      <img src="/assets/LockedIn/gif/MAP-HOME.gif" alt="Map home view" className="rr-img" />
                    </div>
                  </div>

                  <div className="rr-item rr-item-flip">
                    <div className="rr-gif">
                      <img src="/assets/LockedIn/gif/MAP-FILTER.gif" alt="Map filter" className="rr-img" />
                    </div>
                    <div className="rr-text">
                      <div className="journey-step">2</div>
                      <h4>Filter &amp; Choose Space</h4>
                      <p>As a student, I want to filter spaces by noise level, group size, and amenities (e.g., outlets, whiteboard) so that I can find a spot that perfectly matches my needs.</p>
                    </div>
                  </div>

                  <div className="rr-item">
                    <div className="rr-text">
                      <div className="journey-step">3</div>
                      <h4>Reserve &amp; Track Time</h4>
                      <p>As a student, I want to reserve a room for a specific duration and be notified when my time is almost up so that I can manage my study sessions effectively.</p>
                    </div>
                    <div className="rr-gif">
                      <img src="/assets/LockedIn/gif/CALENDAR-LOCKIN.gif" alt="Lock In session" className="rr-img" />
                    </div>
                  </div>

                  <div className="rr-item rr-item-flip">
                    <div className="rr-gif">
                      <img src="/assets/LockedIn/gif/PROFILE.gif" alt="Gator Points profile" className="rr-img" />
                    </div>
                    <div className="rr-text">
                      <div className="journey-step">4</div>
                      <h4>Earn Rewards</h4>
                      <p>As a student, I want to earn Gator Points for completing study sessions so that I can stay motivated and track my academic productivity.</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* ══════════════════════════════════════════
              SECTION 3 — DESIGN PROCESS
              ══════════════════════════════════════════ */}
            {/* ── DESIGN REQUIREMENTS ── */}
            <section id="design-requirements" className="group">
              <h3>Design Requirements</h3>
              <hr />
              <div className="subgroup">
                <p>
                  From affinity mapping and interview synthesis, we defined five requirement clusters: discovery, location context, booking workflow, engagement loops, and profile history.
                </p>

                <div className="dr-grid">
                  <div className="dr-card">
                    <h5 className="dp-heading">Real-Time Space Discovery</h5>
                    <ul className="dp-list">
                      <li>Find quiet spots near your current location</li>
                      <li>Filter by noise level, occupancy, and group size</li>
                      <li>View detailed amenity info before visiting</li>
                    </ul>
                  </div>

                  <div className="dr-card">
                    <h5 className="dp-heading">Map &amp; Location Data</h5>
                    <ul className="dp-list">
                      <li>Interactive map of campus libraries</li>
                      <li>Curated list of local Gainesville cafes</li>
                      <li>Parking and transit information per location</li>
                    </ul>
                  </div>

                  <div className="dr-card">
                    <h5 className="dp-heading">Booking &amp; Reservations</h5>
                    <ul className="dp-list">
                      <li>Reserve library rooms in 1–2 hour increments</li>
                      <li>Schedule group study sessions with teammates</li>
                      <li>In-app session timer with end-of-session reminders</li>
                    </ul>
                  </div>

                  <div className="dr-card">
                    <h5 className="dp-heading">Gamification System</h5>
                    <ul className="dp-list">
                      <li>Gator Points earned for check-ins and completed sessions</li>
                      <li>Daily and weekly study streaks</li>
                      <li>Leaderboards and achievement badges</li>
                    </ul>
                  </div>

                  <div className="dr-card">
                    <h5 className="dp-heading">User Profiles</h5>
                    <ul className="dp-list">
                      <li>Track accumulated Gator Points and streaks</li>
                      <li>Save and revisit favorite study spots</li>
                      <li>View full session history and stats</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* ── WIREFRAMES ── */}
            <section id="wireframes" className="group" style={{ marginTop: "40px" }}>
              <h3>Wireframes</h3>
              <hr />

              <div className="subgroup">
                <p>
                  These wireframes represent our initial vision for the app's key screens. They focus on clarity, ease of navigation, and a clean, uncluttered interface.
                </p>

                <div className="wireframes-grid">
                  {wireframes.map((wireframe) => (
                    <button
                      type="button"
                      className="wf-card wf-card-btn"
                      key={wireframe.src}
                      onClick={() => setActiveWireframe(wireframe)}
                      aria-label={`Open ${wireframe.alt}`}
                    >
                      <img src={wireframe.src} alt={wireframe.alt} className="wf-img" />
                      <div className="wf-label">{wireframe.label}</div>
                    </button>
                  ))}
                </div>

                <div className="proto-cta">
                  <a
                    href="https://www.figma.com/design/ICezDX54AaIJOqftzLCIWp/LockedIn?node-id=0-1&t=xQ7tPBBTaXE6YyPz-1"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="proto-btn"
                  >
                    View Wireframes in Figma ↗
                  </a>
                </div>
              </div>
              <h3>Flow Diagram</h3>
              <p>
                This flow diagram illustrates the user journey through the app, from onboarding to space discovery, booking, and profile engagement. It helped us ensure a logical, intuitive navigation structure that supports our users' goals at every step.
                </p>
              <img src="/assets/LockedIn/FLOW-DIAGRAM.png" alt="Flow Diagram" className="flow-img" />
            </section>

            {/* ══════════════════════════════════════════
              SECTION 4 — FINAL PROTOTYPE
              ══════════════════════════════════════════ */}
            <section id="final-prototype" className="group">
              <h3>Final Prototype</h3>
              <hr />

              <div className="subgroup">
                <p>
                  The final prototype combines the key task flows validated during testing: search and filter, room booking, session management, and profile-based progress tracking.
                </p>
              </div>

              <div className="figma-embed-wrap">
                <iframe
                  className="figma-embed"
                  src="https://embed.figma.com/proto/ICezDX54AaIJOqftzLCIWp/LockedIn?node-id=103-1480&p=f&scaling=scale-down&content-scaling=fixed&page-id=30%3A439&starting-point-node-id=103%3A1480&show-proto-sidebar=1&embed-host=share"
                  allowFullScreen
                  title="LockedIn Figma Prototype"
                />
              </div>

              <div className="proto-cta">
                <a
                  href="https://www.figma.com/proto/ICezDX54AaIJOqftzLCIWp/LockedIn?node-id=103-1480&p=f&viewport=648%2C156%2C0.17&t=9MHiVriYwpW1IY1T-1&scaling=scale-down&content-scaling=fixed&starting-point-node-id=103%3A1480&show-proto-sidebar=1&page-id=30%3A439"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="proto-btn"
                >
                  Open in Figma ↗
                </a>
              </div>

              <div className="subgroup" style={{ marginTop: "48px" }}>
                <h4 style={{ marginBottom: "24px" }}>Feature Walkthrough</h4>

                <div className="fp-row">
                  <div className="fp-text">
                    <h5 className="dp-heading">Real-Time Space Discovery</h5>
                    <ul className="dp-list">
                      <li>Find quiet spots near your current location</li>
                      <li>Filter by noise level, occupancy, and group size</li>
                      <li>View detailed amenity info before visiting</li>
                    </ul>
                  </div>
                  <div className="fp-gif">
                    <img src="/assets/LockedIn/gif/MAP-HOME.gif" alt="Map home view" className="fp-img" />
                  </div>
                </div>

                <div className="fp-row fp-row-flip">
                  <div className="fp-gif">
                    <img src="/assets/LockedIn/gif/MAP-FILTER.gif" alt="Map filter" className="fp-img" />
                  </div>
                  <div className="fp-text">
                    <h5 className="dp-heading">Map &amp; Location Data</h5>
                    <ul className="dp-list">
                      <li>Interactive map of campus libraries</li>
                      <li>Curated list of local Gainesville cafes</li>
                      <li>Parking and transit information per location</li>
                    </ul>
                  </div>
                </div>

                <div className="fp-row">
                  <div className="fp-text">
                    <h5 className="dp-heading">Booking &amp; Reservations</h5>
                    <ul className="dp-list">
                      <li>Reserve library rooms in 1–2 hour increments</li>
                      <li>Schedule group study sessions with teammates</li>
                      <li>In-app session timer with end-of-session reminders</li>
                    </ul>
                  </div>
                  <div className="fp-gif">
                    <img src="/assets/LockedIn/gif/CALENDAR-SCHEDULE.gif" alt="Schedule a booking" className="fp-img" />
                  </div>
                </div>

                <div className="fp-row fp-row-flip">
                  <div className="fp-gif">
                    <img src="/assets/LockedIn/gif/HOME-POPULAR.gif" alt="Popular spaces" className="fp-img" />
                  </div>
                  <div className="fp-text">
                    <h5 className="dp-heading">Gamification System</h5>
                    <ul className="dp-list">
                      <li>Gator Points earned for check-ins and completed sessions</li>
                      <li>Daily and weekly study streaks</li>
                      <li>Leaderboards and achievement badges</li>
                    </ul>
                  </div>
                </div>

                <div className="fp-row">
                  <div className="fp-text">
                    <h5 className="dp-heading">User Profiles</h5>
                    <ul className="dp-list">
                      <li>Track accumulated Gator Points and streaks</li>
                      <li>Save and revisit favorite study spots</li>
                      <li>View full session history and stats</li>
                    </ul>
                  </div>
                  <div className="fp-gif">
                    <img src="/assets/LockedIn/gif/PROFILE.gif" alt="Profile view" className="fp-img" />
                  </div>
                </div>
              </div>
            </section>

            {/* ══════════════════════════════════════════
              SECTION 5 — USER TESTING
              ══════════════════════════════════════════ */}
            <section id="user-testing" className="group">
              <h3>User Testing</h3>
              <hr />

              <div className="subgroup">
                <p>
                  After building the prototype, we conducted 4 user tests with classmates. Participants completed two tasks: find a quiet, low-crowd study space from the home flow, then reserve a study space for a morning session. We observed navigation behavior, hesitation points, and interaction errors to identify where clarity broke down.
                </p>

                <div className="ut-grid">
                  <div className="ut-card">
                    <div className="ut-label">User A</div>
                    <ul className="ut-list">
                      <li>Was able to locate the proper study space with no issues</li>
                      <li>Unable to get to the calendar from the home page</li>
                      <li>Could not select a date or time</li>
                      <li>Wanted to click on a full row of available libraries</li>
                    </ul>
                  </div>

                  <div className="ut-card">
                    <div className="ut-label">User B</div>
                    <ul className="ut-list">
                      <li>Unlabeled map pins were confusing and too small</li>
                      <li>Colors on occupancy and noise levels didn't make sense</li>
                      <li>Capacity number should be larger and shown as a fraction</li>
                      <li>Tried to scroll the homepage to use the scheduling function</li>
                      <li>Scheduled a session through the pin and then new session button</li>
                    </ul>
                  </div>

                  <div className="ut-card">
                    <div className="ut-label">User C</div>
                    <ul className="ut-list">
                      <li>Couldn't bring down the overlay with the button on top</li>
                      <li>Had to open each pin to see more info</li>
                      <li>Tried to click on the name of the study space in available libraries</li>
                    </ul>
                  </div>

                  <div className="ut-card">
                    <div className="ut-label">User D</div>
                    <ul className="ut-list">
                      <li>Clicked on the search/filter on the map view</li>
                      <li>Clicked multiple categories on the home screen before going to the map</li>
                      <li>Top button was unclear</li>
                      <li>Check mark needed to be clearer — showing confirmation more explicitly</li>
                    </ul>
                  </div>
                </div>

                <div className="ut-suggestions">
                  <div className="ut-suggestions-label">Notable Suggestions</div>
                  <ul className="ut-list">
                    <li>Add a label to the ads on top → promos of the week</li>
                    <li>Clarify if "Schedule Session" includes scheduling a study room</li>
                    <li>Link sessions to Google Calendar</li>
                  </ul>
                </div>

                <p style={{ marginTop: "32px" }}>
                  Additionally, we identified a list of specific actions to take to redesign our prototype based on the elements our testers found the most confusing or unintuitive. We annotated these notes to guide our redesign.
                </p>

                <h4 style={{ marginTop: "28px" }}>Key Findings</h4>
                <ul className="ut-list">
                  <li>Color-only indicators were not clear enough for occupancy and noise, so visual labels needed stronger redundancy.</li>
                  <li>Several flows lacked explicit feedback, especially around calendar selection and reservation confirmation.</li>
                  <li>Some controls and labels were ambiguous, so we prioritized clearer naming, larger touch targets, and better content hierarchy.</li>
                </ul>
              </div>
            </section>

            {/* ══════════════════════════════════════════
              SECTION 6 — CONTRIBUTION & REFLECTION
              ══════════════════════════════════════════ */}
            <section id="contribution" className="group">
              <h3>Contribution &amp; Reflection</h3>
              <hr />

              <div className="subgroup">
                <h4>Team Members</h4>
                <div className="team-member-grid">
                  {teamMembers.map((member) => (
                    <article className="team-member-card" key={member.name}>
                      <div className="team-member-header">
                        <div>
                          <h4>{member.name}</h4>
                          <div className="team-member-role">{member.role}</div>
                        </div>
                      </div>

                      <ul className="team-member-list">
                        {member.contributions.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>

                      <button
                        type="button"
                        className="reflection-link"
                        onClick={() => setActiveReflection(member.name)}
                      >
                        <span>See reflection</span>
                        <span aria-hidden="true">→</span>
                      </button>
                    </article>
                  ))}
                </div>
              </div>
            </section>

            {activeMember ? (
              <div className="reflection-overlay" role="dialog" aria-modal="true" aria-labelledby="reflection-title">
                <button
                  type="button"
                  className="reflection-backdrop"
                  aria-label="Close reflection overlay"
                  onClick={() => setActiveReflection(null)}
                />
                <div className="reflection-panel">
                  <div className="reflection-panel-header">
                    <div>
                      <p className="reflection-kicker">Individual Reflection</p>
                      <h3 id="reflection-title">{activeMember.name}</h3>
                      <p className="reflection-subtitle">{activeMember.role}</p>
                    </div>
                    <button type="button" className="reflection-close" onClick={() => setActiveReflection(null)}>
                      Close
                    </button>
                  </div>

                  <div className="reflection-body">
                    {activeMember.reflection.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}

            {activeWireframe ? (
              <div className="wireframe-lightbox" role="dialog" aria-modal="true" aria-label={`${activeWireframe.label} preview`}>
                <button
                  type="button"
                  className="wireframe-lightbox-backdrop"
                  aria-label="Close wireframe preview"
                  onClick={() => setActiveWireframe(null)}
                />
                <div className="wireframe-lightbox-panel">
                  <button
                    type="button"
                    className="wireframe-lightbox-close"
                    aria-label="Close wireframe preview"
                    onClick={() => setActiveWireframe(null)}
                  >
                    ×
                  </button>
                  <img src={activeWireframe.src} alt={activeWireframe.alt} className="wireframe-lightbox-img" />
                  <p className="wireframe-lightbox-label">{activeWireframe.label}</p>
                </div>
              </div>
            ) : null}

          </section>
        </div>
      </div>
    </>
  );
}
