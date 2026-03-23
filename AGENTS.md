# AGENTS.md

## Purpose

This repository is a small Expo + React Native mobile app. Use this file as the default operating guide when making changes here.

## Project Snapshot

- App name: `busee`
- Platform: Expo / React Native
- React: `19.2.3`
- React Native: `0.84.1`
- Expo: `56.0.0-canary-20260305-5163746`
- Entry points:
  - `index.ts`
  - `App.tsx`

## Common Commands

- Install deps: `yarn`
- Start dev server: `yarn start`
- Run iOS: `yarn ios`
- Run Android: `yarn android`
- Run web: `yarn web`
- Lint: `yarn lint`
- Format: `yarn format`
- Check formatting: `yarn format-check`

## Current Structure

- `App.tsx`: current top-level app component
- `index.ts`: Expo entry file
- `app.json`: Expo app configuration
- `assets/`: icons and splash assets
- `.agents/skills/`: repo-local Codex skills and references

## Working Agreements

- Keep changes small and easy to review.
- Prefer TypeScript-safe changes and preserve `strict` compatibility.
- Follow the existing Expo and React Native patterns already in the repo.
- Do not introduce new dependencies unless they are clearly needed for the task.
- Run `yarn lint` after meaningful code changes.
- Run `yarn format` when editing code or docs that match the formatter globs.

## UI Guidance

- Preserve native mobile behavior and keep layouts responsive on iOS and Android.
- Prefer simple, maintainable components over early abstraction.
- When adding non-trivial UI, keep styles readable and colocated unless the codebase grows enough to justify extraction.

## Agent Workflow

1. Read the relevant files before editing.
2. Check for existing project conventions in nearby code.
3. Make the smallest change that fully solves the task.
4. Verify with linting and any task-specific checks that are available.
5. Summarize what changed and note any follow-up work if verification is incomplete.

## Local Skills

This repo already includes reusable local skills in `.agents/skills/`. Prefer using them when the task matches:

- `heroui-native`: HeroUI Native component work
- `expo-dev-client`: dev client setup and distribution
- `expo-api-routes`: Expo Router API routes
- `expo-deployment`: Expo deployment guidance
- `native-data-fetching`: network and data fetching work
- `react-native-best-practices`: React Native performance and architecture guidance
- `vercel-react-native-skills`: React Native implementation best practices

## Notes For Future Setup

- There is no dedicated test suite configured yet.
- The app is still close to the default Expo starter, so architecture may evolve quickly.
- If the project grows, add a short section here for folder conventions, state management, navigation, and API boundaries.
