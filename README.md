[English](README.md) · [한국어](README.ko.md)

# It says done. What does that prove?

I’m Minjae Lee, a software engineer with 7+ years in booking, ordering and payments. I work across React and TypeScript frontends, GraphQL API servers built with Apollo Federation, and AI-assisted developer tools and automation.

[**Explore the portfolio · 한국어 / English →**](https://minjae-lee-kr.github.io/) · [LinkedIn](https://www.linkedin.com/in/minjae-lee-kr/)

### 01 / Intent · Recovery

**No response. Is it safe to reserve again?**

Recover the result of a request after losing its response. A separate experiment examines retries after the receiver deletes its deduplication record.

[Read the note](https://minjae-lee-kr.github.io/notes/retention-boundary/) · [Source](https://github.com/minjae-lee-kr/intent-recovery-lab)

[Base recovery recording](https://minjae-lee-kr.github.io/evidence/intent/) · [Retention experiment recording](https://minjae-lee-kr.github.io/notes/retention-boundary/#records)

### 02 / Verified Change

**The code passed. Who set the rules?**

A scripted patch disables type checking through its configuration. Compare it with fixed checker options, then bind approval to the checked commit and policy. No LLM is called.

[Read the note](https://minjae-lee-kr.github.io/notes/verified-change/) · [Source](https://github.com/minjae-lee-kr/verified-change-lab) · [Recorded run](https://minjae-lee-kr.github.io/evidence/change/)

### 03 / Cancellation Debt

**After a timeout, when should the permit be released?**

Releasing a permit before its work ends can exceed the execution limit. Four policies compare cancellation, permit lifetime and rejection of later attempts.

[Read the note](https://minjae-lee-kr.github.io/notes/cancellation-debt/) · [Source](https://github.com/minjae-lee-kr/federated-catalog-lab) · [Recorded run](https://minjae-lee-kr.github.io/evidence/cancellation/)

From the same lab: [The checks passed. The generated types were stale.](https://minjae-lee-kr.github.io/notes/generated-consumer/)

Also: [**Empty Check Guards**](https://github.com/minjae-lee-kr/empty-check-guards), a tool for telling “nothing found” from “nothing checked.”

### Reproduce & inspect

Each lab’s README includes reproduction commands. The linked reports show saved local runs; they do not execute the experiments. Preview this [portfolio’s source](docs/) with `npm start` at `http://127.0.0.1:4173`.

These are independent personal experiments with synthetic data. They do not reproduce employer code, internal architecture, private data or production results.
