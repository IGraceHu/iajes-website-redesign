Navigation, Landmarks, and Page Structure
- Added a visible skip link to jump to ‘#main-content’.
- Added ‘main’ landmarks to routed pages that use the shared navigation.
- Wrapped the shared header/navigation in semantic ‘header’ and ‘nav’ landmarks with accessible labels.
- Added footer navigation semantics with ‘aria-label="Footer navigation"’.
- Improved current-page and pagination semantics with ‘aria-current="page"’ and named pagination buttons.
- Confirmed the root document language is set to English and added a default site title fallback.

WCAG references: 1.3.1 Info and Relationships, 2.4.1 Bypass Blocks, 2.4.2 Page Titled, 2.4.3 Focus Order, 2.4.6 Headings and Labels, 3.1.1 Language of Page.

Keyboard and Focus Support
- Replaced hover-only navigation dropdown behavior with native ‘details’/ ‘summary’ disclosure controls.
- Added global ‘:focus-visible’ styling so keyboard users can see where focus is.
- Added accessible mobile menu state with ‘aria-expanded’, ‘aria-controls’, and ‘inert’ when closed.
- Added dialog focus management: focus moves into popups, Tab is trapped inside open dialogs, Escape closes the dialog, and focus returns to the opener.

WCAG references: 2.1.1 Keyboard, 2.1.2 No Keyboard Trap, 2.4.3 Focus Order, 2.4.7 Focus Visible.

Images, Icons, and Decorative Graphics
- Added meaningful alt text for logos, member/profile photos, task force images, meeting images, webinar images, resource thumbnails, and about-page images.
- Marked decorative discs, decorative SVGs, repeated placeholder artwork, carousel background images, and purely visual icons with ‘alt=""’, ‘aria-hidden="true"’, or ‘focusable="false"’ as appropriate.
- Removed duplicate inline SVG IDs from shared decorative graphics.

WCAG reference: 1.1.1 Non-text Content.

Buttons, Links, and Interactive Names
- Added accessible names to icon-only buttons such as edit, delete, clear, move earlier/later, carousel, pagination, newsletter, and media controls.
- Kept extra decorative icons visible, but prevented screen readers from reading them so users only hear the button text.
- Replaced invalid nested interactive patterns like links inside buttons or buttons inside links.
- Made generic card actions more descriptive, for example changing "Learn more" to "Learn more about IAJES."
- Added labels to dialogs and modal forms.

WCAG references: 2.4.4 Link Purpose, 2.5.3 Label in Name, 4.1.2 Name, Role, Value.

Forms and Inputs
- Added programmatic labels or accessible names to sign-in, sign-up, password reset, newsletter, search, profile photo, article editing, regional meeting, webinar, video resource, and task force editor fields.
- Added email input types and autocomplete where appropriate.
- Removed a custom tab index from sign-in to preserve natural focus order.
- Converted newsletter subscription UI to a real form.
- Converted visual-only regional meeting editor labels into plain text and added ‘aria-label’ to the actual form controls.

WCAG references: 1.3.1 Info and Relationships, 3.3.2 Labels or Instructions, 4.1.2 Name, Role, Value.

Embedded Media and Documents
- Added titles to embedded iframes for maps, webinar recordings/slides, meeting reports, agendas, attendees, programs, and videos.
- Added accessible names to PDF preview toggles and media preview controls.



WCAG references: 2.4.1 Bypass Blocks, 4.1.2 Name, Role, Value.

Headings and Content Cleanup
- Reduced repeated ‘h1’ usage in carousel/card content and preserved a clearer heading hierarchy.
- Added or preserved one primary ‘h1’ structure for routed pages.
- Fixed content typos noted during the review:
- ‘Columbia’ to ‘Colombia’
- ‘Bhubaneshwar’ to ‘Bhubaneswar’
- ‘Engineering &Science’ to ‘Engineering & Science’
- Fixed two pagination range bugs in webinar/video resource listings while reviewing keyboard-accessible pagination.


WCAG references: 1.3.1 Info and Relationships, 2.4.6 Headings and Labels.

Verification Performed

- ‘git diff --check’: passed.
- Static scans for unlabeled Bootstrap icons and stray ‘target="blank"’: passed.
- Removed duplicate SVG IDs from shared graphics.
- ‘npm run build’: passed after installing project dependencies.
