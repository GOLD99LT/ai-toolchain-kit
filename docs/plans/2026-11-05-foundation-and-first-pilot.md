# Toolchain Foundation and First Pilot Implementation Plan

> **For agentic workers:** Use the approved design and execute the tasks below continuously. Parallel workers have disjoint write scopes; the main worker integrates and independently reviews the result.

**Goal:** Deliver working discovery/restore entry points, a source-aware Windows toolchain foundation, a synthetic code-context pilot, and a verified CC Switch upgrade where the local environment permits it.

**Architecture:** A small Node.js module validates JSON and produces plans; PowerShell entry points invoke known native commands without evaluating profile text. Mature tools retain installation ownership. Candidate projects that require additional samples, accounts or isolation remain explicitly pending.

**Tech Stack:** Node.js >=22.20, native node:test, Windows PowerShell 5.1/PowerShell 7, npm lockfiles, Git, skills@1.7.6, repomix@1.18.1.

**Spec:** [Approved third design](../design/2026-11-04-ai-toolchain-design-v3.md), approved by the user on 2026-11-05 with “没什么问题，继续推进”.

## Global constraints

- Work in the current new repository on `codex/toolchain-foundation`; no existing code or commits require a separate checkout. This is source-code isolation, not an isolated Windows-user test environment.
- Preserve required_targets; distinguish installed, CLI-checked, agent-discovered and task-passed.
- No remote template, model or installer executes merely by reading the catalog.
- Ordinary independent Skills, native plugins and full applications have separate owners.
- No real firmware, company template, PCB, hardware, VPS or private credentials are used in synthetic tests.
- Skills/UA global restore is not tested by rewriting HOME; unavailable full isolation is reported honestly.
- Private profiles, machine paths, backups, downloads, runtime output and logs stay in ignored `.local/`; node_modules are ignored.
- User already approved execution; no extra approval gate between these reversible steps.

## File and interface map

| Task | Owns | Produces/consumes |
| --- | --- | --- |
| 1. Catalog and guides | catalog/, profiles/examples/, prompts/, playbooks/, recipes/, root README/AGENTS/LICENSE | schema_version=1 catalog and source records; human discovery and restore flows |
| 2. Planner and Windows entry points | scripts/, tests/, package.json, runtime/ | consumes the schema below; validates, plans, invokes fixed npm tools and verifies actual outcomes |
| 3. Synthetic embedded sample | examples/stm32-context/ | small original C fixture, known answers, Repomix config; no real STM32 HAL dependency |
| 4. Tool installation and pilot | ignored .local outputs, runtime lockfiles, validation report | installs fixed package versions locally; runs the fixture and records actual completeness |
| 5. CC Switch and final review | local backup/install, docs/validation/ | pinned official asset, private backup, version and safe metadata checks, independent code review |

### JSON contract

`catalog/capabilities.json`: `{schema_version:1,capabilities:[{capability_id,title,description,implementations:[{implementation_id,source_id,targets:["codex","dsh"],recipe,limitations:[]}],evidence:[]}]}`.

`catalog/sources.lock.json`: `{schema_version:1,sources:[{source_id,kind,owner,restore_mode,status,...}]}`. npm fields are package/version/integrity/runtime_dir/bin; private-local fields are root_key/relative_path/checksum_status; host-managed/upstream-guided/msi entries provide official source and manual recipe until verified. No arbitrary command field is executed.

Profile: `{schema_version:1,profile_id,capabilities:[{capability_id,implementation_id,source_id,required_targets:[],required,verification_id}]}`.

The core exports `loadCatalog(root)`, `validateProfile(profile,catalog,sources)`, `buildPlan({root,profile,catalog,sources,privateRoots})`, `resolvePrivatePath(root,relativePath)`, and `inspectRuntime(root,source)`.

## Task 1: useful catalog and both user entry points

- [ ] Create the 12 researched task-project entries plus baseline managers; preserve evidence dates and support limitations.
- [ ] Create fixed npm source records and non-executable manual/candidate records for other projects.
- [ ] Create a minimal pilot profile (Skills CLI + Repomix), a broader documented example, onboarding prompt, work guides and installation recipes.
- [ ] Explain the real working commands and how another user generates a different profile; document manual/blocked outcomes rather than promising complete automation.
- [ ] Validate JSON through the production validator after Task 2; review docs against actual scripts.

## Task 2: plan first, execute explicitly

- [ ] Write behavior tests before the core: unknown source rejection, target preservation, floating version rejection, integrity mismatch, traversal/symlink escape, private-source missing state, pending source blocking, no write during plan, installed content verification and selecting only requested tools.

Example behavioral expectation:

```js
assert.throws(() => resolvePrivatePath(root, '../outside'), /outside|escape|relative/i);
assert.deepEqual(plan.items[0].required_targets, ['codex', 'dsh']);
assert.equal(plan.items[0].agent_task_passed, false);
```

- [ ] Run `node --test tests/*.test.mjs`; observe missing implementation failures before adding the module.
- [ ] Implement small validation/planning functions with typed, allowlisted source kinds, strict source references and bounded paths. `plan` is read-only.
- [ ] Implement `doctor.ps1`, `setup.ps1`, `verify.ps1`; setup defaults to a plan and runs native npm only with `-Apply`. Do not use Invoke-Expression or commands from JSON.
- [ ] Use separate `runtime/skills-cli` and `runtime/repomix` package manifests/locks so profiles do not install unselected tool groups.
- [ ] Run tests plus real PowerShell 5.1 and PowerShell 7 entry points.

## Task 3: independent synthetic code sample

- [ ] Build a tiny, original STM32-style C sample containing main, initialization, IRQ/HAL callback path, compile-time configuration and two static symbols of the same name.
- [ ] Provide known answers and an explicit note that this is a host-readable fixture, not vendor firmware or a flashable project.
- [ ] Add a Repomix config selecting source/config/doc files, keeping implementation and comments; output goes to a caller-chosen ignored directory.
- [ ] Verify expected files and facts from the actual generated bundle; no automatic claim of firmware correctness.

## Task 4: real fixed-version tool validation

- [ ] Resolve npm metadata, persist package integrity and generate lockfiles for exactly the approved versions.
- [ ] Install using npm with lifecycle scripts disabled unless a known required build step is separately reviewed; run each CLI's help/version.
- [ ] Run Repomix on the synthetic sample, verify expected files and known facts survive; record time/size but do not invent a productivity percentage.
- [ ] Run setup again and show that satisfied tools are skipped. Run invalid/candidate profiles to demonstrate no unapproved installation.
- [ ] Check whether a complete isolated Windows environment is available. If absent, keep Understand-Anything and global skill restore pending; do not pretend a directory is a sandbox.

## Task 5: approved CC Switch upgrade and final review

- [ ] Query the v4.0.25 official release with authenticated gh read access if anonymous API is limited; download the selected Windows installer into .local and verify published digest where available.
- [ ] Confirm process state; make a private consistent backup of the existing app data. Only use graceful shutdown if necessary; do not force-close unresolved work.
- [ ] Install through the official installer, record exit code and installed version. Compare safe counts/integrity metadata only; do not expose provider keys or database contents.
- [ ] Record MCP/client actions requiring native UI or login as pending, without synthesizing successful connections.
- [ ] Review all public files for accidental machine-private material, run the final checks, obtain independent spec/code review, fix findings and commit the local engineering result.
- [ ] When local work is reviewable, determine the remote repository name/visibility required to publish; no guessed public destination.

## Preflight consistency review

| Boundary | Check | Decision |
| --- | --- | --- |
| Catalog ↔ planner | all identifiers and target arrays have one schema | validator is authoritative; bad profile fails before any installation |
| npm sources ↔ runtime | each tool has its own package manifest/lock and validated bin path | no generic downloaded command execution |
| fixture ↔ pilot | sample output must stay outside public inputs | caller selects ignored output; known-answer check reads actual result |
| Windows entrypoints ↔ tests | Node implements policy, PowerShell invokes fixed native commands | test policies in Node, smoke-test both shells |
| live installation ↔ recovery tests | real authorized installation differs from isolated restore | record separate statuses; no HOME rewrite |

No existing tests or code were present before this plan. Worktree consent is not needed because no additional worktree is created; work remains in the user-selected new workspace on a new branch.
