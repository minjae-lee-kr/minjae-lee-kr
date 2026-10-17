[English](README.md) · [한국어](README.ko.md)

# It says done. What does that prove?

I’m Minjae Lee, a software engineer with 7+ years in booking, ordering and payments. I work across React and TypeScript frontends, GraphQL API servers built with Apollo Federation, and AI-assisted developer tools and automation.

[**Explore the portfolio · 한국어 / English →**](https://minjae-lee-kr.github.io/) · [LinkedIn](https://www.linkedin.com/in/minjae-lee-kr/)

### 01 / Intent · Recovery

**No response. Is it safe to reserve again?**

Keep the reservation key and command across retries and reloads; ignore replies from superseded UI requests. A separate retention experiment shows why a missing remote record is not enough to decide whether to retry.

[Recovery UI decisions](https://github.com/minjae-lee-kr/intent-recovery-lab/blob/main/docs/design.md) · [Source](https://github.com/minjae-lee-kr/intent-recovery-lab)

[Base recovery recording](https://minjae-lee-kr.github.io/evidence/intent/) · [Retention experiment recording](https://minjae-lee-kr.github.io/notes/retention-boundary/#records)

[Compare two locally identical runs with different downstream outcomes →](https://minjae-lee-kr.github.io/research/what-the-client-knows/)

### 02 / Verified Change

**The code passed. Who set the rules?**

A scripted patch leaves type errors but disables the check. Fixed compiler options expose the errors; approval and application must remain tied to the checked commit and policy. No LLM is called.

[Read the note](https://minjae-lee-kr.github.io/notes/verified-change/) · [Source](https://github.com/minjae-lee-kr/verified-change-lab) · [Recorded run](https://minjae-lee-kr.github.io/evidence/change/)

Follow-up: [Roll back the code. Reuse the approval?](https://minjae-lee-kr.github.io/research/approval-memory/) Compare what a rollback preserves when code selection and approval receipts share one state.

### 03 / Cancellation Debt

**After a timeout, when should the execution slot be released?**

A timeout can free an execution slot while its work keeps running. Four policies show the tradeoff: holding the slot until work ends preserves the limit, but can reject later attempts.

[Read the note](https://minjae-lee-kr.github.io/notes/cancellation-debt/) · [Source](https://github.com/minjae-lee-kr/federated-catalog-lab) · [Recorded run](https://minjae-lee-kr.github.io/evidence/cancellation/)

From the same lab: [The checks passed. The generated types were stale.](https://minjae-lee-kr.github.io/notes/generated-consumer/)

[One failed lookup. How much disappears?](https://minjae-lee-kr.github.io/research/partial-data/) Compare actual responses under three batch-error and nullability choices.

[Why does the next query have no error?](https://minjae-lee-kr.github.io/research/client-cache/) Follow the same partial response into Apollo Client: keeping data, keeping an earlier value, or making another HTTP request each leaves a different cost.

[The error disappeared. The recheck still failed.](https://minjae-lee-kr.github.io/research/react-recheck/?lang=en) Compare the value left on a React screen with the recheck outcome through actual DOM and HTTP observations.

[Does guarding request state also protect the cache?](https://minjae-lee-kr.github.io/research/react-attempts/?lang=en) Compare automatic cache writes with writes accepted only for the current lookup, using controlled response order in a real React component.

Also: [**Empty Check Guards**](https://github.com/minjae-lee-kr/empty-check-guards), a tool for telling “nothing found” from “nothing checked.”

### Reproduce & inspect

Each lab’s README includes reproduction commands. The linked reports show saved local runs; they do not execute the experiments. Preview this [portfolio’s source](docs/) with `npm start` at `http://127.0.0.1:4173`.

These are independent personal experiments with synthetic data. They do not reproduce employer code, internal architecture, private data or production results.
