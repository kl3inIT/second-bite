# Launch Screen Assets

The wordmark in white, 200 points wide, centred on Tasco blue (#0061AF) by `Base.lproj/LaunchScreen.storyboard`. The images
are rendered from `packages/app_ui/assets/brand/wordmark.svg` (Figma logo/wordmark, node 7:5639) with its fill set
to white, at 1x, 2x and 3x on a transparent ground, by taking a Chromium screenshot of the SVG (Playwright's
`locator.screenshot({ omitBackground: true })`). Render them again the same way when the wordmark changes.
