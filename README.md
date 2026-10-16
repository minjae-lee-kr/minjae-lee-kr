<p align="left"><img src="assets/header.svg" alt="Minjae Lee — Ambitious products. Dependable decisions." width="100%"></p>

[English](README.md) · [한국어](README.ko.md)

I’m Minjae, a software engineer at NAVER. My work spans commerce experiences, GraphQL API servers and developer productivity. I want ambitious ideas to become products people can depend on—and I like making the difficult engineering decisions inspectable.

[LinkedIn](https://www.linkedin.com/in/minjae-lee-kr/) · [Engineering note](https://www.linkedin.com/pulse/when-findings-isnt-enough-coverage-heartbeats-lee-minjae-vre0c/)

### Selected engineering experiments

These are independent implementations with synthetic data. The questions are practical; the limits are explicit.

| Work                  | The question                                                                   | Evidence                                                                                                                                                |
| --------------------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Intent / Recovery** | After a response disappears, how do we recover the same durable intent?        | Real HTTP response loss, SQLite and process crashes. [Recorded local run](docs/evidence/intent/).                                                       |
| **Verified Change**   | Did we select the code—and the verification policy—that was actually reviewed? | Immutable Git candidates, real checker processes and conditional ref updates. [Recorded local run](docs/evidence/change/).                              |
| **Cancellation Debt** | When the gateway stops waiting, what work still occupies capacity?             | Four policies compare request cancellation, permits and physical completion. [Recorded local run](docs/evidence/cancellation/). An experimental branch. |

The source repositories are pending publication. These report bundles are read-only records of local execution, not live services or production claims. The [local portfolio hub](docs/index.html) provides Korean and English views.

A smaller public tool: [**Empty Check Guards**](https://github.com/minjae-lee-kr/empty-check-guards) distinguishes “nothing found” from “nothing checked.”

### How I work

- Connect the user’s intent to client state, API contracts and a durable result.
- Reproduce a plausible failure before claiming the protected path works.
- Keep the source revision, evidence and boundaries close to the claim.

React · TypeScript · GraphQL · Apollo Federation · Node.js · developer automation

All examples are original personal work. They do not reproduce employer code, internal architecture, private data or production results.
