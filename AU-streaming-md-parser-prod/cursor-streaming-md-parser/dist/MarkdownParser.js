"use strict";
const blogpostMarkdown = `# control

*humans should focus on bigger problems*

## Setup

\`\`\`bash
git clone git@github.com:anysphere/control
\`\`\`

\`\`\`bash
./init.sh
\`\`\`

## Folder structure

**The most important folders are:**

1. \`vscode\`: this is our fork of vscode, as a submodule.
2. \`milvus\`: this is where our Rust server code lives.
3. \`schema\`: this is our Protobuf definitions for communication between the client and the server.

Each of the above folders should contain fairly comprehensive README files; please read them. If something is missing, or not working, please add it to the README!

Some less important folders:

1. \`release\`: this is a collection of scripts and guides for releasing various things.
2. \`infra\`: infrastructure definitions for the on-prem deployment.
3. \`third_party\`: where we keep our vendored third party dependencies.

## Miscellaneous things that may or may not be useful

##### Where to find rust-proto definitions

They are in a file called \`aiserver.v1.rs\`. It might not be clear where that file is. Run \`rg --files --no-ignore bazel-out | rg aiserver.v1.rs\` to find the file.

## Releasing

Within \`vscode/\`:

- Bump the version
- Then:

\`\`\`
git checkout build-todesktop
git merge main
git push origin build-todesktop
\`\`\`

- Wait for 14 minutes for gulp and ~30 minutes for todesktop
- Go to todesktop.com, test the build locally and hit release
`;
let currentContainer = null;
/* =======================
   PARSER STATE (GLOBAL)
======================= */
var ParseState;
(function (ParseState) {
    ParseState[ParseState["NORMAL"] = 0] = "NORMAL";
    ParseState[ParseState["INLINE_CODE"] = 1] = "INLINE_CODE";
    ParseState[ParseState["CODE_BLOCK"] = 2] = "CODE_BLOCK";
})(ParseState || (ParseState = {}));
let state = ParseState.NORMAL;
let backtickBuffer = "";
let currentSpan = null;
/* =======================
   HELPERS
======================= */
function createSpan(className) {
    const span = document.createElement("span");
    if (className)
        span.className = className;
    currentContainer.appendChild(span);
    return span;
}
// Do not edit this method
function runStream() {
    currentContainer = document.getElementById('markdownContainer');
    const tokens = [];
    let remainingMarkdown = blogpostMarkdown;
    while (remainingMarkdown.length > 0) {
        const tokenLength = Math.floor(Math.random() * 18) + 2;
        const token = remainingMarkdown.slice(0, tokenLength);
        tokens.push(token);
        remainingMarkdown = remainingMarkdown.slice(tokenLength);
    }
    const toCancel = setInterval(() => {
        const token = tokens.shift();
        if (token) {
            addToken(token);
        }
        else {
            clearInterval(toCancel);
        }
    }, 20);
}
/* =======================
   MAIN LOGIC (EDITED)
======================= */
function addToken(token) {
    if (!currentContainer)
        return;
    for (let i = 0; i < token.length; i++) {
        const char = token[i];
        // Track backticks across tokens
        if (char === "`") {
            backtickBuffer += "`";
        }
        else {
            backtickBuffer = "";
        }
        // Handle triple backticks (code block)
        if (backtickBuffer === "```") {
            backtickBuffer = "";
            if (state === ParseState.CODE_BLOCK) {
                state = ParseState.NORMAL;
                currentSpan = null;
            }
            else {
                state = ParseState.CODE_BLOCK;
                currentSpan = createSpan("code-block");
            }
            continue;
        }
        // Handle single backtick (inline code)
        if (backtickBuffer === "`") {
            backtickBuffer = "";
            if (state === ParseState.INLINE_CODE) {
                state = ParseState.NORMAL;
                currentSpan = null;
            }
            else if (state === ParseState.NORMAL) {
                state = ParseState.INLINE_CODE;
                currentSpan = createSpan("inline-code");
            }
            continue;
        }
        // Append visible characters
        if (!currentSpan) {
            currentSpan = createSpan();
        }
        currentSpan.innerText += char;
    }
}
//# sourceMappingURL=MarkdownParser.js.map