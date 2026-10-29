Portfolio Application — Security and Data Flow

Overview

This repository contains a browser-based professional portfolio built with HTML, CSS, and JavaScript. The application displays resume information, professional experience, skills, education, and related portfolio materials.

The application also supports client-side resume editing, JSON import and export, local image previews, encrypted image asset loading, and optional interaction analytics.

1. Main Application Logic

File: "js/app.js"

The application JavaScript is responsible for rendering portfolio views, displaying experience details, filtering content, switching between dashboard and resume views, and supporting the local editing interface.

The application reads resume information already available in the browser. It constructs the displayed interface from that data.

2. Local File Handling

The editing interface supports selecting an image and importing a JSON file.

The application uses browser APIs such as "FileReader" to read selected files locally. JSON files are parsed in the browser, and generated JSON exports are downloaded using a browser-created data URL.

The inspected code does not contain an upload request for these editor files. Selecting a file for editing should not be interpreted as uploading its contents to an external service.

3. Encrypted Image Assets

The function "decryptPortfolioAsset()" retrieves an encrypted image asset using a browser "fetch()" request.

The browser then uses the Web Crypto API to decrypt the asset locally and creates a temporary object URL so the image can be displayed.

The use of "crypto.subtle.importKey()" is a browser cryptographic operation, not a request to an external AI or embedding service.

This mechanism is intended to discourage casual inspection of image files in the repository. It does not provide confidentiality against a determined visitor because the public website must possess the means to decrypt displayed images.

4. Analytics

File: "js/analytics.js"

The analytics client sends limited interaction events to the project's Cloudflare Worker endpoint.

Supported event types include:

- "page_view"
- "experience_open"
- "work_file_open"
- "resume_download"

The event payload contains an event name, page path, short event detail, and referring hostname.

The analytics client is designed not to send full resume text, document contents, cookies, or personal form data. Analytics requests omit browser credentials.

The analytics endpoint stores interaction records in Cloudflare D1. The dashboard and summary API are intended to be protected by Cloudflare Access.

5. External Services

The inspected "app.js" does not show a call to an external AI or embedding API.

The encrypted image loader retrieves assets using paths provided by the portfolio data. Analytics requests are implemented separately in "analytics.js".

External profile links, such as LinkedIn, are intended to direct visitors to the relevant profile rather than transmit the portfolio's document contents.

6. Security Limitations

This documentation describes the inspected client-side implementation; it is not a guarantee that every dependency, hosting configuration, or deployment setting is secure.

The browser must receive the public portfolio data and the information needed to display its images. Consequently, public resume information and displayed images should not be treated as confidential.

The application should not contain API secrets, passwords, private access tokens, or other credentials in its public source code.

The Cloudflare Worker, D1 database, and Access policies should be reviewed separately because their security depends on server-side code and deployment configuration.

7. Scope of Review

This document describes the application's intended data flow and the relevant code paths inspected in "app.js" and "analytics.js".

It does not claim that an independent security audit, penetration test, or complete dependency audit has been performed.
