# Streaming Markdown Parser

## Overview
This project implements a basic **streaming Markdown parser**.  
The Markdown text is processed **in small chunks**, similar to how AI tools stream responses.

The parser mainly supports:
- Inline code using single backticks (` `)
- Code blocks using triple backticks (```)

Other Markdown features are intentionally ignored as per the task instructions.

---

## How Streaming Works
- The Markdown content is split into random-length tokens.
- Each token is processed one at a time.
- The parsed output is appended to the page without re-rendering existing content.

This allows users to select and copy text while it is still streaming.

---

## Parsing Logic
A simple **state-based approach** is used:

- **Normal** – regular text
- **Inline Code** – text inside single backticks
- **Code Block** – text inside triple backticks

The parser switches states whenever backticks are detected.

---

## Handling Backticks
Since tokens can split backticks across chunks, a small buffer is used to track:
- One backtick → inline code start/end
- Three backticks → code block start/end

This ensures correct parsing even with randomly split tokens.

---

## Optimistic Rendering
As soon as a code block or inline code start is detected, styling is applied immediately without waiting for the closing backticks.

---

## DOM Updates
The parser only **appends new elements** to the DOM instead of replacing it.  
This improves performance and keeps previously streamed content selectable.

---

## Output Behavior
- Inline code and code blocks are visually differentiated
- Other Markdown syntax is shown as plain text
- Minor formatting issues are expected and acceptable

---

## How to Run

```bash
npm install
npm run build
