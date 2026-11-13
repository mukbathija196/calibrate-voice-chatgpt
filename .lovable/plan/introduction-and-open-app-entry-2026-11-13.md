# Introduction and open app entry

## Goal
Replace the sign-in experience with an app-specific introduction and allow anyone to continue into the existing chat and voice setup without an account.

## User-facing changes
- Make the introduction the first page, explaining voice conversations and accent/speaking-style calibration in plain language.
- Add a clear action to open the chat.
- Remove the sign-in route and account-dependent redirects/menu actions.
- Keep chat and voice setup usable without signing in; retain voice setup completion on the same device.

## Technical details
- Reassign routes so `/` shows the introduction and a separate route opens the existing chat.
- Remove the unused sign-in page and Supabase auth/profile checks from the client-side flow.
- Store voice setup completion locally because accounts are no longer part of the flow.
- Verify the introduction-to-chat action and direct access to chat/voice setup, plus the resulting preview build.
