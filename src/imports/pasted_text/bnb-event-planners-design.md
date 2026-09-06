# B&B EVENT PLANNERS — REACT FRONTEND DESIGN PROMPT

Design and build a **premium, elite, modern React web application** for **B&B Event Planners**, an event planning and decoration company serving **Hosur & Bangalore**.

The website will primarily be viewed by **corporate companies, premium clients, wedding clients, event organizers, and high-value customers**.

The design must feel:

**Luxury • Professional • Modern • Elegant • Creative • Premium**

The website must NOT look like a generic event-planning template.

---

# 1. CORE DESIGN DIRECTION

Use this exact visual direction:

> **Dark Luxury Glassmorphism + Immersive Editorial Design + Horizontal Parallax**

The website should have a **black/dark background** with subtle yellow/gold accents.

Use **Glassmorphism UI only where appropriate**.

Do NOT make every section a glass card.

The design should be **open, spacious and image-driven**.

The photographs should feel like they are floating inside the website rather than being trapped inside rectangular cards.

---

# 2. IMPORTANT — NO BOX/CARD-HEAVY DESIGN

Do NOT create:

* Large rectangular content boxes everywhere
* Card-based section layouts
* Generic 3-column card grids
* Excessive rounded rectangles
* Yellow rectangular backgrounds
* Dashboard-like public UI
* Generic Bootstrap layouts
* Traditional event-company templates

Instead use:

* Large typography
* Floating images
* Asymmetric layouts
* Negative space
* Overlapping imagery
* Thin borders
* Transparent glass surfaces
* Subtle blur
* Cinematic photography
* Editorial compositions
* Large whitespace
* Scroll-based movement

The **images themselves should be the visual structure**.

---

# 3. BRAND LOGO

Use the provided **B&B Event Planners logo** as the primary brand identity.

Do NOT reproduce the yellow rectangular/square appearance of the logo as the website UI.

Use the logo cleanly against the dark interface.

The logo should appear primarily in the navigation/header and footer.

Keep the website UI itself:

**Black + Dark Glass + Yellow/Gold accents**

---

# 4. COLOR SYSTEM

### Primary Background

`#050505`

### Secondary Background

`#0B0B0B`

### Glass Surface

`rgba(255,255,255,0.05)`

### Glass Hover

`rgba(255,255,255,0.08)`

### Glass Border

`rgba(255,255,255,0.12)`

### Primary Yellow

`#FFD900`

### Gold

`#E5B800`

### White

`#FFFFFF`

### Muted Text

`#A0A0A0`

### Glow

Use very subtle yellow/gold glow.

Do not overuse glow effects.

---

# 5. GLASSMORPHISM STYLE

Use glassmorphism selectively.

Glass elements should have:

* Transparent background
* Backdrop blur
* Thin translucent borders
* Very subtle shadows
* Slight background glow

Example visual direction:

```text
rgba(255,255,255,0.05)
backdrop-filter: blur(20px)
border: 1px solid rgba(255,255,255,0.12)
```

Use glass effects for:

* Navigation
* Floating category labels
* Gallery controls
* Small information overlays
* CTA elements
* Contact controls
* Admin authentication
* Small floating UI elements

Do NOT put entire sections inside glass containers.

---

# 6. NAVIGATION

Create a floating premium glass navigation.

Left:

**B&B Event Planners Logo**

Center:

* Home
* What We Do
* Our Story
* Why Choose B&B?
* Book Your Event
* Get In Touch

Right:

**Book Your Event →**

The navbar should:

* Float above the page
* Have subtle backdrop blur
* Have a thin transparent border
* Be mostly transparent
* Become slightly darker while scrolling

Use a premium hamburger menu on mobile.

### IMPORTANT

There must be:

**NO Login button**

**NO Admin button**

in the public navbar.

---

# 7. HOME HERO

Create an immersive full-screen hero.

Do NOT use a traditional hero card.

Use a large cinematic event image/video as the visual background.

Place typography directly over the composition.

### Small Label

**PREMIUM EVENT PLANNERS**

### Main Heading

# We Turn Moments Into

# Beautiful Memories

### Supporting Text

**Premium Event Planning & Decoration Services in Hosur & Bangalore**

### Description

> From elegant wedding decorations to unforgettable birthday celebrations, B&B Event Planners brings creativity, style and flawless execution to every event.

### CTA

**Explore Our Work ↓**

Secondary CTA:

**Book Your Event →**

Use a subtle glass effect for the CTA, not a large card.

---

# 8. HERO MOTION

Use:

* Smooth image scale
* Parallax movement
* Text reveal
* Letter/word animation
* Fade-in
* Subtle yellow glow
* Scroll indicator

As the user scrolls:

The image should slowly move.

The typography should subtly shift.

The hero should transition naturally into the next section.

---

# 9. WHAT WE DO

This is the **signature section**.

Heading:

# What We Do

Description:

**Creating extraordinary celebrations through design, decoration and flawless execution.**

Do not create a card grid.

Instead create a large editorial composition.

The event photographs should occupy most of the viewport.

---

# 10. HORIZONTAL PARALLAX GALLERY

This is the most important interaction.

Create a **multi-row horizontal parallax gallery**.

The user scrolls vertically.

The images move horizontally.

Example:

```text id="e4u5q0"
ROW 01       IMAGE → → → → → →

ROW 02       ← ← ← ← ← IMAGE

ROW 03       IMAGE → → → → → →

ROW 04       ← ← ← ← ← IMAGE
```

Each row should:

* Move at a different speed
* Move in the opposite direction
* Have different image sizes
* Have different vertical positions

Use an editorial composition instead of a grid.

Images should feel like they are floating through space.

---

# 11. IMAGE COMPOSITION

Use:

* Large landscape images
* Portrait images
* Cropped images
* Floating images
* Overlapping images
* Different aspect ratios

Do not put every image inside the same rectangular card.

Allow images to overlap and extend outside normal layout boundaries.

Create depth through:

* Scale
* Blur
* Movement
* Layering
* Parallax

---

# 12. FEATURED WORK

Initially show only **ONE featured image**.

Example:

```text id="8s8e1s"
                    ENGAGEMENT

                [ LARGE IMAGE ]

                    01 / 10

              Engagement Decoration

                 View Works →
```

The image should be the main focus.

The category information can appear as floating typography/glass UI.

---

# 13. VIEW WORKS

When the user clicks:

**View Works →**

open the corresponding category gallery.

Do not make this look like a normal modal/card gallery.

Use a cinematic full-screen gallery experience.

Show:

**ENGAGEMENT**

**01 / 10**

with large images moving horizontally.

Allow:

* Next
* Previous
* Fullscreen
* Close

Use subtle glass controls.

---

# 14. EVENT CATEGORIES

The dynamic application must support these categories:

* Engagement
* Reception
* Wedding
* Birthday
* Baby Shower
* Naming Ceremony
* Garlands
* Photography & Videography
* LED Walls
* Haldi
* Games
* Celebrity Bookings
* House Warming Ceremony
* Opening Ceremonies
* Corporate Events
* Other Services

---

# 15. DYNAMIC ADMIN IMAGE SYSTEM

The website must be dynamic.

The admin should be able to upload images and assign them to a category.

Admin functionality:

* Upload image
* Select category
* Add title
* Add description
* Mark Featured
* Replace image
* Delete image
* Reorder images
* Create category
* Edit category
* Delete category

The public gallery should automatically update based on the admin's uploaded content.

---

# 16. ADMIN ACCESS

The public website must have **NO visible login system**.

There should be:

* No Login in navbar
* No Admin button in navbar
* No Login in hero
* No Login in main sections

Only add a very subtle:

**Admin Panel**

link at the very bottom of the footer.

Example:

```text id="4x4t0j"
© B&B Event Planners. All Rights Reserved.

Admin Panel
```

The Admin Panel link should be small and visually secondary.

---

# 17. ADMIN AUTHENTICATION

Clicking:

**Admin Panel**

opens a separate authentication page.

Flow:

```text id="7y9c3n"
PUBLIC WEBSITE
      ↓
FOOTER
      ↓
ADMIN PANEL
      ↓
AUTHENTICATION
      ↓
EMAIL / USERNAME
PASSWORD
      ↓
LOGIN
      ↓
ADMIN DASHBOARD
```

Authentication UI should use:

* Dark background
* Glassmorphism
* Yellow accent
* Minimal form
* Subtle blur
* Premium typography

The authentication page should not visually interfere with the public website.

---

# 18. ADMIN DASHBOARD

Create a separate private admin interface.

Dashboard sections:

* Overview
* Gallery
* Categories
* Featured Works
* Upload Image
* Settings
* Logout

Admin can manage all gallery content.

The private dashboard can use conventional cards/tables because it is a management interface.

However, keep it visually consistent with the B&B black/yellow brand.

---

# 19. OUR STORY

Create an editorial storytelling section.

Use **2 default images**.

Do not use cards.

Use an asymmetric layout.

Example:

```text id="f7psq3"
           LARGE IMAGE


                       SMALL IMAGE


OUR STORY

We Make Your Celebrations
Memorable
```

### Heading

# We Make Your Celebrations Memorable

### Content

> B&B Event Planners is an event planning and decoration brand focused on creating beautiful, memorable and professionally executed celebrations.

> We specialise in Wedding Decoration, Birthday Parties, Baby Showers, Opening Ceremonies, House Ceremonies and Corporate Events.

### Location

**Hosur • Bangalore**

Use subtle image parallax.

---

# 20. WHY CHOOSE B&B?

Create an editorial feature section.

Do not use six cards.

Use large numbers and typography.

### 01

**Creative Designs**

Unique and customised decoration concepts.

### 02

**Professional Execution**

Every detail is carefully planned and executed.

### 03

**Premium Quality**

Quality decoration materials and elegant designs.

### 04

**Complete Event Support**

From planning to final setup, we manage the details.

### 05

**Customised Themes**

Every celebration gets a setup designed around your vision.

### 06

**Memorable Experiences**

We focus on creating experiences that guests remember.

Use large yellow numbers.

On hover:

* Number changes position
* Text shifts
* Supporting visual appears
* Yellow accent line animates

---

# 21. BOOK YOUR EVENT

Create a premium enquiry section.

Heading:

# Let's Create Something Unforgettable

Description:

> Planning an event? Tell us what you're imagining and our team will help bring it to life.

Form:

* Name
* Phone Number
* Email
* Event Type
* Event Date
* Location
* Number of Guests
* Message

CTA:

**Book Your Event →**

Use glassmorphism only around the form controls where appropriate.

Do not create one giant glass box.

---

# 22. GET IN TOUCH

Create a large editorial contact section.

Heading:

# Let's Talk About Your Next Event.

Description:

> From intimate celebrations to large-scale corporate events, let's create something memorable together.

---

# 23. CONTACT INFORMATION

Use floating editorial contact items rather than traditional cards.

### PHONE

SVG Phone Icon

**80569 94721 · 88700 76021**

### WHATSAPP

SVG WhatsApp Icon

**+91 80569 94721**

### INSTAGRAM

SVG Instagram Icon

**@bnbeventplanners**

### SERVICE AREAS

SVG Location Icon

**Hosur • Bangalore**

Use:

* Yellow icons
* White text
* Muted labels
* Thin separators
* Glass hover states

---

# 24. CONTACT INTERACTION

Phone:

`80569 94721`

`88700 76021`

should appear clickable.

WhatsApp:

`+91 80569 94721`

should appear clickable.

Instagram:

`@bnbeventplanners`

should appear clickable.

Use subtle hover animations.

---

# 25. FINAL CTA

Create a dramatic cinematic CTA.

Large heading:

# MAKE YOUR NEXT EVENT

# UNFORGETTABLE.

CTA:

**Get In Touch →**

Use an event image in the background.

Apply a dark overlay.

Add subtle yellow glow.

Do not place the content inside a huge rectangular card.

---

# 26. FOOTER

Create a minimal luxury footer.

### B&B Event Planners

**Hosur • Bangalore**

Navigation:

* Home
* What We Do
* Our Story
* Why Choose B&B?
* Book Your Event
* Get In Touch

Contact:

**80569 94721**
**88700 76021**

WhatsApp:

**+91 80569 94721**

Instagram:

**@bnbeventplanners**

---

# 27. FOOTER ADMIN LINK

At the absolute bottom:

**Admin Panel**

Keep this link:

* Small
* Subtle
* Gray/white
* Yellow on hover

This is the ONLY public link to administration.

---

# 28. MOTION DESIGN

Use premium motion throughout the application.

Use:

* Framer Motion
* GSAP
* GSAP ScrollTrigger
* Lenis smooth scrolling
* CSS transforms
* CSS backdrop-filter

Animations:

* Text reveal
* Image reveal
* Scale
* Parallax
* Horizontal movement
* Fade
* Mask transitions
* Hover movement
* Magnetic CTA
* Cursor interaction

Do not over-animate.

Everything should feel smooth and expensive.

---

# 29. HORIZONTAL PARALLAX TECHNICAL BEHAVIOR

The main gallery should behave like:

```text id="y2f7x3"
VERTICAL SCROLL
       ↓

IMAGE ROW 1
→ → → → → →

IMAGE ROW 2
← ← ← ← ←

IMAGE ROW 3
→ → → → → →

IMAGE ROW 4
← ← ← ← ←
```

The user should never feel like they are manually dragging a slider.

The movement should be controlled by the page scroll.

Use smooth interpolation.

---

# 30. IMAGE HOVER

On hover:

* Slight image scale
* Slight image translation
* Small yellow line
* Category/title appears
* Optional cursor interaction

Keep it subtle.

---

# 31. RESPONSIVE DESIGN

Design:

### Desktop

1440 × 1024

### Laptop

1366 × 768

### Tablet

768 × 1024

### Mobile

390 × 844

On mobile:

* Simplify horizontal parallax
* Reduce image sizes
* Keep movement smooth
* Use hamburger navigation
* Stack contact information
* Maintain the dark luxury aesthetic

---

# 32. REACT FRONTEND DESIGN SYSTEM

The final UI should be suitable for implementation in React.

Use reusable components such as:

```text
Navbar
Hero
SectionHeading
ParallaxGallery
ParallaxRow
FeaturedWork
CategoryGallery
ImageViewer
OurStory
WhyChooseUs
BookingForm
ContactSection
Footer
AdminLink
AdminLogin
AdminDashboard
GalleryManager
ImageUploader
CategoryManager
```

Use reusable data-driven components so gallery content can come from the backend/API.

Do not hardcode the public gallery structure.

---

# 33. COMPONENT DESIGN

Create reusable variants for:

### Buttons

* Default
* Hover
* Active
* Disabled
* Loading

### Glass UI

* Default
* Hover
* Active

### Form Fields

* Default
* Focus
* Error
* Success

### Gallery

* Default
* Hover
* Selected
* Loading
* Empty

---

# 34. ACCESSIBILITY

Maintain:

* High contrast
* Readable typography
* Keyboard navigation
* Focus states
* Clear CTA
* Form validation
* Alt text for images
* Reduced-motion consideration

The visual effects must never make the website difficult to use.

---

# 35. OVERALL VISUAL REFERENCE

The website should feel inspired by:

* Awwwards creative agency websites
* Premium editorial websites
* Luxury fashion websites
* Immersive photography websites
* Interactive storytelling websites
* Modern WebGL/GSAP experiences

The final visual direction should be:

> **Dark Luxury Glassmorphism + Editorial Photography + Horizontal Parallax + Kinetic Typography**

The website should feel **premium, sophisticated and expensive**.

---

# 36. FINAL DESIGN RULE

The most important rule:

**DO NOT DESIGN THE PUBLIC WEBSITE AS A COLLECTION OF BOXES.**

Use the screen as an open canvas.

Let the:

**TYPOGRAPHY + PHOTOGRAPHY + MOTION + NEGATIVE SPACE**

create the design.

Glassmorphism should be used as a **supporting layer**, not the entire design.

The photographs should appear to **float, overlap and move through the page**.

The signature experience must be:

# SCROLL → IMAGES MOVE HORIZONTALLY → LEFT / RIGHT PARALLAX → CINEMATIC TRANSITIONS

Build the complete Figma design as a **production-ready responsive React UI/UX system** for the B&B Event Planners dynamic website, including the public experience, footer-only admin access, authentication, and private gallery management interface.
