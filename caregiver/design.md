Dementia-Friendly UI Design System

Purpose: This document is the single design reference for the AI generating UI components for the dementia cognitive gaming and memory-assistance app.

Rule: Components must be created only from the parameters and principles defined here. Do not introduce unrelated visual styles, trendy UI patterns, decorative effects, or arbitrary colors/fonts.

1. Core Design Philosophy

The interface should feel:

Obvious — users should immediately understand what they can do.

Gentle — calm rather than stimulating or visually noisy.

Readable — text and controls must remain easy to perceive.

Predictable — navigation and interaction patterns should stay consistent.

High-contrast — important elements must clearly separate from their surroundings.

Simple — reduce choices and cognitive load.

Familiar — repeated actions should look and behave the same everywhere.

Primary rule

Clarity > decoration.

Never add visual complexity merely to make the UI look modern.

2. Visual Language

2.1 Overall Style

Use a clean, accessible, soft visual system with:

Solid backgrounds

Large, simple visual elements

Strong separation between interactive and non-interactive elements

Generous whitespace

Rounded but not excessively pill-shaped containers

Clear hierarchy

Minimal decoration

No busy patterns

No visual clutter

No unnecessary gradients

No glassmorphism

No excessive shadows

No flashing effects

The UI should look calm and trustworthy, not like a game launcher or social-media app.

3. Color System

3.1 Color Principles

Dementia can involve reduced visual acuity, contrast sensitivity, and color discrimination. Therefore:

Prefer high-luminance, low-saturation surfaces.

Use colors that are clearly separated in hue.

Use strong accent colors without making them neon.

Use color to distinguish sections/zones.

Never depend on color alone to communicate meaning.

Every semantic color must also have a label, icon, shape, or text cue.

Keep the core palette to approximately 2–3 major colors plus neutrals.

Avoid

Neon color combinations

Busy patterns

Red/green as the only distinction

Pastel text on pastel backgrounds

Light yellow text on white

Light gray body text

Highly saturated red/orange as dominant UI colors

Multiple competing accent colors

Color-only success/error indicators

3.2 Canonical Light Theme

Use this as the default theme.

Token

Value

Usage

color.background

#FFF8EF

Warm main app background

color.surface

#FFFFFF

Cards, sheets, elevated containers

color.surface.warm

#FFF1DF

Warm highlighted cards/sections

color.text.primary

#2B2118

Main text

color.text.secondary

#5A4A3B

Supporting text, labels

color.text.muted

#766A5F

Only for genuinely secondary metadata

color.primary

#C65D3A

Main actions and selected states

color.primary.dark

#9E452A

Pressed/strong primary state

color.secondary

#2F8F83

Secondary positive actions / sections

color.accent.sun

#E6A23C

Friendly highlights/rewards

color.accent.purple

#8067A8

Optional cognitive/content accent

color.danger

#C95656

Warnings, destructive states

color.onPrimary

#FFFFFF

Text/icons on primary

color.onSecondary

#FFFFFF

Text/icons on secondary

color.onDanger

#FFFFFF

Text/icons on danger

Required relationships

Main text on background: ≥ 4.5:1

Normal text should preferably approach AAA contrast where practical.

Large text: ≥ 3:1 minimum

Interactive controls must be visually distinct from their surroundings.

Do not use #FFFFFF as the main page background unless there is a specific reason.

Prefer #F5F5F5 or a similarly gentle neutral surface.

4. Dark / Night Theme

Dark mode is optional but should be structurally supported.

Token

Value

Usage

color.background

#1F2937

Main background

color.surface

#111827

Cards / containers

color.text.primary

#F5F5F5

Main text

color.text.secondary

#E0E0E0

Supporting text

color.primary

#60A5FA

Primary action

color.danger

#F87171

Warning / destructive state

Dark mode rules

Do not use pure black as the main background.

Maintain strong text contrast.

Avoid making the UI visually brighter or more stimulating than light mode.

Use cool accents for normal interaction.

Reserve red for warnings and destructive actions.

5. Semantic Color Rules

Primary

#3B82F6

Use for:

Main CTA

Primary navigation action

Selected state

Important interactive controls

Main progress/action controls

Secondary

#10B981

Use for:

Secondary actions

Positive progress

Supporting interactive sections

Danger

#F87171

Use for:

Delete

Stop

Warning

Error

Important attention states

Never use danger red as decoration.

Neutral

Use:

#F5F5F5

#FFFFFF

#111827

#374151

#6B7280

for structure and hierarchy.

6. Typography

6.1 Font Requirement

The application will use a Northeastern font family with support for:

English / Latin

Devanagari

The implementation must use a font stack/fallback strategy so that every supported language remains readable.

Required principle

Language must never change the visual hierarchy.

English and Devanagari versions of the same component should maintain equivalent:

hierarchy

approximate visual weight

spacing

readability

button prominence

information density

If the selected Northeastern font does not contain a required Devanagari glyph, use a compatible Devanagari fallback rather than rendering broken/missing glyphs.

Font behavior

Use:

Regular for body text

Medium/Semibold for controls and labels

Bold/Semibold for headings

Avoid decorative or script fonts

Avoid excessive italics

Avoid all-caps for long text

7. Typography Scale

The research recommends approximately 14–16pt minimum body text with generous line spacing.

For the app, use a large, scalable hierarchy.

Token

Recommended size

Weight

Usage

text.display

32–36px

Bold

Major screen title

text.h1

28–32px

Bold

Primary heading

text.h2

24–28px

Semibold/Bold

Section heading

text.h3

20–24px

Semibold

Card/subsection heading

text.bodyLarge

18–20px

Regular

Important instructions

text.body

16–18px

Regular

Default body

text.label

16px

Medium/Semibold

Buttons and labels

text.caption

14–16px

Regular/Medium

Secondary information

Important

Do not create components whose essential information requires tiny text.

Avoid text smaller than 14px unless it is genuinely non-essential metadata.

8. Line Height & Text Layout

Use generous spacing.

Recommended:

Body: 1.5× line height or greater

Headings: approximately 1.2–1.3×

Buttons: vertically centered with generous padding

Paragraphs: short and chunked

Text layout rules

Prefer left alignment for English.

Use appropriate natural alignment for Devanagari.

Do not justify paragraphs.

Avoid centered blocks of long text.

Avoid walls of text.

Break instructions into short steps.

Use bullets where useful.

Keep labels concise.

9. Spacing System

Use a consistent spacing scale.

Recommended base unit: 4px

Token

Value

space.xs

4px

space.sm

8px

space.md

12px

space.lg

16px

space.xl

24px

space.2xl

32px

space.3xl

40px

space.4xl

48px

Rules

Prefer generous whitespace.

Do not compress unrelated information.

Keep repeated spacing consistent.

Use larger spacing between conceptual sections.

Use smaller spacing within a single component.

10. Component Geometry

Cards

Cards should:

Use solid surfaces

Have clear boundaries

Have comfortable internal padding

Have moderate corner radius

Avoid excessive shadows

Avoid decorative backgrounds

Recommended:

Radius: 12–16px

Padding: 16–24px

Buttons

Buttons should be:

Large

Obvious

High contrast

Easy to tap

Consistent across the application

Recommended:

Minimum height: 48px

Prefer 52–56px for primary actions

Horizontal padding: 20–24px

Radius: 12–16px

Clear label

Optional icon + text

Never make the primary action tiny or visually subtle.

Inputs

Inputs should:

Be large enough to identify immediately

Have clear labels

Have strong borders/contrast

Have generous internal padding

Show clear focus/active states

Avoid placeholder-only labels

Recommended minimum height: 48px.

11. Navigation

Navigation must be:

Consistent

Predictable

Visible

Simple

Do not hide essential navigation behind ambiguous icons.

Rules

The same action must appear in the same general location across screens.

Back navigation should be obvious.

Do not change navigation behavior between screens without a strong reason.

Avoid deep navigation hierarchies.

Prefer fewer choices.

12. One Task Per Screen

For dementia-focused workflows, prioritize one primary task per screen.

Examples:

Read today's reminder

Start a memory game

Choose an answer

Confirm medication

Find today's date

Start music

Screen rule

Every screen should have:

Clear title

One obvious primary purpose

Minimal secondary information

One obvious primary action

Do not overload a screen with multiple competing CTAs.

13. Interaction States

Every interactive component should support clear states.

Required where applicable:

Default

Pressed

Focused

Disabled

Selected

Success

Error

Loading

States must not depend only on color.

For example:

Selected button

Different background color

Visible label/icon/state indicator

Optional border or shape difference

14. Icons & Illustrations

Use icons to reinforce meaning, not replace important text.

Rules

Use simple, recognizable pictograms.

Keep icon style consistent.

Prefer icons with labels for important actions.

Use large icons when they are the main recognition cue.

Avoid abstract icons for critical actions.

Avoid decorative icon overload.

Do not require users to interpret a complex symbol when a simple word can clarify the action.

15. Images & Visual Content

Images should be:

Large

Sharp

Simple

High contrast

Uncluttered

Avoid:

Tiny images

Complex collages

Busy backgrounds

Low-contrast imagery

Decorative visual noise

If an image represents an action or object, pair it with a clear label when necessary.

16. Game UI

Games must still follow the same dementia-friendly design system.

Do not create a completely different visual language for games.

Game principles

Calm background

Large target areas

Clear instructions

One task at a time

Limited choices

Strong differentiation between choices

Immediate but gentle feedback

No flashing effects

No rapid visual transitions

No unnecessarily complex animations

Difficulty

Difficulty should primarily increase through:

memory load

number of choices

sequence length

task complexity

Do not increase difficulty primarily through smaller text, smaller buttons, lower contrast, or faster animations.

17. Feedback & Errors

Feedback must be explicit and reassuring.

Never communicate errors using red alone.

Example:

Icon

"That wasn't quite right."

Clear next action

Avoid:

Aggressive error screens

Shaking interfaces

Flashing red

Loud visual effects

Shame-oriented language

The user should always understand what happened and what to do next.

18. Animation & Motion

Motion should be subtle and functional.

Use animation only to:

indicate a transition

confirm an action

show progress

guide attention

Avoid:

flashing

rapid movement

bouncing elements

parallax

excessive transitions

continuous decorative animation

Recommended interaction feel:

smooth → slow enough to perceive → predictable → never distracting

19. Accessibility Requirements

Every component generated from this document must follow these principles:

Contrast

Normal text: ≥ 4.5:1

Large text: ≥ 3:1

Prefer 7:1 where practical.

Text scaling

The UI should support enlargement up to approximately 200% without destroying usability.

Use relative/scalable sizing where possible.

Color

Never communicate essential meaning through color alone.

Touch

Controls must be comfortably tappable.

Focus

Keyboard/focus states must remain clearly visible where applicable.

Labels

Interactive elements need clear accessible labels.

Multimedia

If audio/video is introduced:

captions where applicable

simple controls

clear play/pause behavior

no complex control clusters

20. Responsive Design

The UI must work across:

phones

tablets

portrait

landscape

Do not simply scale everything proportionally.

Instead:

preserve readable text size

preserve button size

maintain comfortable spacing

allow content to reflow

maintain clear hierarchy

Tablet layouts can use more whitespace rather than adding more information.

21. Theme Architecture

Implement design tokens rather than hard-coding arbitrary component colors.

Example conceptual structure:

:root {
  --color-bg: #F5F5F5;
  --color-surface: #FFFFFF;
  --color-text-primary: #111827;
  --color-text-secondary: #374151;
  --color-text-muted: #6B7280;

  --color-primary: #3B82F6;
  --color-secondary: #10B981;
  --color-danger: #F87171;

  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 12px;
  --space-lg: 16px;
  --space-xl: 24px;
  --space-2xl: 32px;

  --radius-md: 12px;
  --radius-lg: 16px;
}

For React Native/Expo, represent these as centralized theme constants rather than CSS variables.

22. Component Consistency Rules

Every generated component must answer:

Visual

Does it use the approved palette?

Does it have sufficient contrast?

Does it use the approved typography hierarchy?

Does it use the spacing system?

Does it use the same corner-radius language?

Cognitive

Is the purpose immediately obvious?

Is there unnecessary information?

Is there only one dominant action?

Could an older user distinguish the important element immediately?

Interaction

Is the touch target large enough?

Is the pressed/selected state obvious?

Is feedback explicit?

Does the component behave consistently with the same component elsewhere?

Language

Does it work in English?

Does it work in Devanagari?

Does the font/fallback render all glyphs?

Does text expansion avoid breaking the layout?

If any answer is "no", revise the component.

23. Forbidden Design Patterns

The AI must not introduce these unless explicitly requested and proven necessary:

Neon palettes

Busy patterns

Glassmorphism

Excessive gradients

Excessive shadows

Tiny controls

Tiny labels

Thin low-contrast text

Decorative script fonts

Long all-caps text

Fully justified paragraphs

Color-only status indicators

Red/green-only distinctions

Flashing animations

Rapid animations

Dense dashboards

Multiple competing primary CTAs

Hidden essential navigation

Excessive icon-only controls

Visually noisy game screens

24. Language / Devanagari Rules

The application supports English and Devanagari.

Components must be designed for text expansion and different glyph metrics.

Required

Use the Northeastern font where supported.

Provide a compatible Devanagari fallback.

Never assume English text width.

Never hard-code widths around English labels.

Allow buttons to grow horizontally.

Allow headings to wrap naturally.

Test both languages on every major component.

Maintain the same semantic hierarchy across languages.

Avoid

width: 120px;

for buttons containing variable-language text.

Prefer content-driven sizing with minimum dimensions.

25. Design Token Priority

When generating a component, apply rules in this order:

Accessibility

Cognitive clarity

Readability

Consistency

Interaction predictability

Visual aesthetics

A prettier component must never violate a higher-priority rule.

26. AI Component Generation Contract

When generating a new component:

MUST

Use only the approved color tokens.

Use only the approved typography hierarchy.

Use the spacing scale.

Use the approved corner-radius range.

Maintain high contrast.

Support English + Devanagari.

Make the primary action obvious.

Keep cognitive load low.

Keep interaction states explicit.

Maintain consistency with existing components.

MUST NOT

Invent a new color because it "looks nice".

Invent a new font.

Introduce a new design style.

Add decorative effects without purpose.

use color as the only semantic signal.

Reduce font/button sizes to fit content.

create dense layouts merely to fit more content.

27. Reference Component Set

The design system should be built around reusable primitives such as:

AppShell

ScreenHeader

BackButton

PrimaryButton

SecondaryButton

DangerButton

LargeActionCard

InfoCard

ReminderCard

GameCard

ChoiceButton

ProgressIndicator

StatusMessage

ConfirmationDialog

TextInput

LanguageSelector

ThemeSelector

IconLabel

BottomNavigation

These components should share the same tokens and interaction language.

28. Final Design Test

Before accepting any generated screen/component, check:

Could an older person with reduced vision and cognitive impairment understand what this screen is for within a few seconds?

Then verify:

Large readable text

Strong contrast

Clear primary action

No unnecessary choices

No busy patterns

No confusing color combinations

No color-only meaning

Comfortable tap targets

Consistent navigation

English works

Devanagari works

Text can expand

Motion is calm

Visual hierarchy is obvious

If the answer is not clearly yes, simplify the design.

Source Basis

This design system is derived from the supplied dementia-focused UI research. The research emphasizes high contrast, large/simple visuals, calm cool hues, low-saturation/high-luminance surfaces, simple typography, generous spacing, WCAG accessibility, predictable navigation, one-task-at-a-time interaction, and real-user observational testing.

The supplied research specifically recommends large/simple visuals and high-contrast differentiation because dementia can affect visual acuity, contrast sensitivity, and color discrimination. It also recommends avoiding busy patterns, low-contrast combinations, and color-only cues. fileciteturn0file0L3-L16

For typography and accessibility, the research recommends approximately 14–16pt or larger body text, generous line spacing, simple sans-serif typography, WCAG contrast targets, text scaling, and consistent navigation. fileciteturn0file0L25-L43

The supplied research's example palettes and implementation guidance provide the canonical color values used above, including the light #FFF8EF / #2B2118 / #C65D3A system and the corresponding dark-mode values. fileciteturn0file0L63-L76

The research also emphasizes observational usability testing with dementia users, measuring task completion, completion time, errors, and qualitative observations rather than relying heavily on cognitively demanding questionnaires. fileciteturn0file0L49-L61

29. SmritiYog Product-Specific Frontend Rules

The following rules are specific to SmritiYog, the proposed SIH26003 solution. They extend this design system without replacing its accessibility and dementia-friendly principles.

These rules are frontend-only. Backend architecture, APIs, databases, AI orchestration, encryption implementation, and infrastructure are outside this document.

29.1 Product Experience Model

SmritiYog has three connected user experiences:

Patient App

Cognitive games

Reminders

Personalized memory activities

Music

Voice-led guidance

Rewards and progress

Caretaker App/View

Patient progress

Daily activity

Domain-wise performance

Reminders/status

Alerts

Web Dashboard

Domain-wise trends

Progress visualization

Alerts

Patient-level summaries

Consistency rule

All three experiences must share the same visual design language:

same colors

same typography hierarchy

same semantic colors

same card language

same status language

same icon style

same spacing system

The web dashboard may be denser than the patient app, but it must still use the same design tokens.

30. Patient App Information Architecture

The patient-facing app should prioritize the following areas:

HOME
├── Today's reminder
├── Start today's session
├── Quick actions
└── Today's progress

GAMES
├── Emotional
├── Memory
├── Attention
└── Pattern & Object Recognition

REMINDERS
├── Today
├── Upcoming
└── Completed

MORE
├── Music
├── Favourites
├── Language
└── Settings

Navigation rule

Do not expose every feature simultaneously.

The home screen should surface the most important current task and a small number of obvious next actions.

31. Cognitive Domain UI

Every cognitive game must visibly belong to a cognitive domain.

Supported domains:

Emotional

Memory

Attention

Pattern & Object Recognition

Use the existing approved color system to distinguish domains, but never rely on color alone.

Each game card should communicate:

[DOMAIN ICON]

Game name

Short one-line description

[Start]

The domain should also be represented using:

icon

text label

game description

Do not create four completely different visual themes for the four domains.

32. Game Categories & Frontend Patterns

Emotional

Frontend game types:

Music therapy

Event recall

Face–name matching

Photo questions

Favourites

UI principles:

Familiar imagery

Large photos

Gentle feedback

Simple prompts

Minimal choices

For personalized content, display familiar names/photos clearly and avoid presenting a large gallery at once.

Memory

Frontend game types:

Remember-the-objects

Daily routine recall

UI principles:

Show one task at a time

Keep object images large

Use clear instructions

Provide sufficient response time

Avoid unnecessary timers unless explicitly required by the game design

Attention

Frontend game types:

Catch-the-cat

Find-the-odd-object

UI principles:

Large interaction targets

Strong object/background separation

Minimal competing elements

No distracting animation

No rapid flashing

Difficulty must not be increased by making targets tiny or low contrast.

Pattern & Object Recognition

Frontend game types:

Pattern sequences

Colour sequences

Sorting familiar objects

Spot-the-difference on local scenes

UI principles:

Large visual targets

Clear separation between choices

Simple layouts

Familiar/local imagery where appropriate

Avoid visually noisy backgrounds

33. Voice-Led UI

Voice is a core part of the patient experience.

The UI should visually reinforce voice guidance rather than requiring the patient to constantly read instructions.

Voice Guidance Component

Use a reusable:

VoiceGuide

Structure:

┌────────────────────────────────────────┐
│                                        │
│        [ Family Voice Avatar ]         │
│                                        │
│        "Let's play a game."            │
│                                        │
│             [ 🔊 ]                     │
│                                        │
└────────────────────────────────────────┘

Rules

Voice instructions should also appear as readable text.

Never make essential instructions audio-only.

Provide obvious play/pause/replay controls.

Use a calm visual indicator while speech is playing.

Do not use a continuously animated waveform as decoration.

Avoid rapid pulsing animations.

The UI must remain understandable if the user cannot hear the voice.

34. Personalized Memory UI

SmritiYog can use the patient's own:

Photos

Family relationships

Life events

Familiar objects

Favourites

The frontend should present personalized content in a familiar, human way.

Example:

Who is this?

[ LARGE FAMILY PHOTO ]

Ravi

[ I remember ]       [ Not sure ]

Rules

Large image

Large name

Very few choices

Clear action labels

No unnecessary metadata

No dense profile information

Personalization should make the experience feel familiar, not expose technical concepts such as "RAG", "AI agent", or "generated content" to the patient.

35. Local / Northeastern Cultural Content

The solution targets elderly users in the North Eastern Region.

Frontend content can support state/language-specific packs containing:

Local scenes

Local festivals

Familiar foods

Folk music

Familiar cultural objects

Regional language content

UI rule

Cultural personalization should happen through content, not by creating a completely different UI theme for every state.

The design system stays consistent.

Only content such as:

imagery

language

names

music

questions

examples

changes.

36. Language Selection

Language is a first-class patient-facing setting.

The language selector should be extremely simple.

Example:

Choose your language

┌─────────────────────────┐
│ English              ✓  │
└─────────────────────────┘

┌─────────────────────────┐
│ हिन्दी                  │
└─────────────────────────┘

┌─────────────────────────┐
│ অসমীয়া                 │
└─────────────────────────┘

Additional Northeastern languages may be introduced through content packs.

Rules

Show the language name in its own script where possible.

Use large selectable rows.

Do not use flags as the primary language identifier.

Selection must be visible through icon + label + state.

Do not rely on color alone.

The selected language must persist across the app.

37. Reminders UI

Reminders are a core patient workflow.

A reminder should communicate:

WHAT
WHEN
STATUS
ACTION

Example:

TODAY

Morning medicine

9:00 AM

[ Mark as done ]

Rules

One reminder should be visually dominant when it is currently relevant.

Use clear icons.

Use large time typography.

Keep descriptions short.

Avoid showing excessive historical reminders on the main screen.

Completed state must use text/icon + visual styling, not color alone.

38. Gamification UI

SmritiYog includes:

Rewards

Streaks

Levels

Family leaderboards

These should encourage continued participation without making the patient experience competitive or stressful.

Rewards

Use simple, positive feedback:

Great job!

+10 points

[ Continue ]

Streaks

Keep them understandable:

3 day streak

You played today.

Avoid complex achievement systems.

Levels

Use simple progression:

Level 2

████████░░

2 sessions to Level 3

Family Leaderboard

The patient-facing leaderboard should be optional and emotionally gentle.

Prefer:

Family Progress

You       120
Anita     115
Ravi      108

Avoid aggressive competitive language such as:

"DESTROY"

"BEAT"

"LOSER"

"RANK #1 OR FAIL"

The purpose is engagement and family connection, not pressure.

39. Progress Visualization

Progress must be understandable without requiring data literacy.

Patient-facing progress should prioritize:

Today

This week

Completed activities

Streak

Simple domain progress

Use:

progress bars

simple counts

large labels

simple icons

Avoid:

complex charts

dense statistical tables

excessive percentages

multi-axis graphs

Example:

Today's Progress

2 of 3 activities completed

████████████░░░

Memory       ✓
Attention    ✓
Emotional    ○

40. Caretaker Frontend

The caretaker view can expose more information than the patient view.

Prioritize:

Patient
↓
Today's activity
↓
Domain performance
↓
Recent changes
↓
Alerts

Useful frontend components:

PatientSummaryCard

TodayActivityCard

DomainScoreCard

ProgressChart

ActivityHistory

AlertCard

ReminderStatus

RecentSessions

Caretaker dashboard rules

Keep important alerts visually prominent.

Do not overwhelm with raw data.

Use plain-language labels.

Domain scores must have text labels.

Charts need legends and accessible labels.

Never make a chart the only way to understand an important status.

41. Web Dashboard

The web dashboard is intended for higher-level monitoring.

It can be more information-dense than the patient app, but must retain:

approved colors

approved typography

consistent cards

clear hierarchy

accessible charts

predictable navigation

Recommended structure:

Dashboard
├── Overview
├── Patients
├── Cognitive Domains
├── Trends
├── Alerts
└── Reports

Dashboard visualizations

Prefer simple:

line charts for trends

bar charts for domain comparison

progress indicators for completion

status cards for alerts

Avoid:

3D charts

decorative charts

excessive chart colors

charts without labels

red/green-only data encoding

42. Alert UI

Alerts should communicate:

WHAT HAPPENED
WHY IT MATTERS
WHAT TO DO

Example:

Attention needed

Activity completion has decreased
over the last few sessions.

[ View progress ]

Do not expose raw AI-generated reasoning to the patient.

For caretakers, explanations should remain concise and actionable.

Alert colors

Use the approved danger color only where genuine attention is required.

Never make the entire dashboard red.

43. Onboarding

Patient onboarding should be short and guided.

Recommended sequence:

Welcome
↓
Choose language
↓
Set up basic profile
↓
Optional family/personalization setup
↓
Voice introduction
↓
First simple activity

Rules

One decision per screen where practical.

Large controls.

Voice + text guidance.

Visible progress through onboarding.

Always provide a clear next action.

Avoid long forms.

Avoid technical terminology.

44. Session Flow

A typical patient session should feel like:

HOME
 ↓
Start today's session
 ↓
Voice introduction
 ↓
Simple instruction
 ↓
ONE GAME
 ↓
Gentle feedback
 ↓
Reward / progress
 ↓
Next activity OR finish
 ↓
Return to HOME

Avoid forcing the user through a complicated multi-level navigation structure during a session.

45. Session Completion

End sessions positively and clearly.

Example:

Session complete

You completed 3 activities.

Today's progress
3 of 3 ✓

[ Done ]

Optional:

You earned
+20 points

Do not overload the completion screen with analytics.

46. Patient Error Recovery

If a patient taps the wrong control:

Do not punish the user visually.

Do not use alarming animations.

Explain the next action clearly.

Keep the recovery path obvious.

Example:

That's okay.

Let's try again.

[ Try again ]

The interface should never make a mistake feel like a failure.

47. Offline UX

The product is designed as an offline-first patient experience.

The frontend should clearly distinguish:

Offline

from:

Syncing...

and:

Synced

Rules

Offline status should not block core patient activities.

Games, cached content, reminders, and available personalized content should remain usable offline.

Do not show technical networking errors such as:

HTTP 503
Network request failed
API timeout

to the patient.

Instead use human-readable messages:

You're offline.

You can keep playing.
Your progress will sync later.

48. Sync Status

For patient UI, sync should be subtle.

Preferred:

✓ Saved

or

Saved on this device

Avoid making synchronization a prominent dashboard feature for patients.

For caretakers, a clearer status may be shown:

Last synced:
Today, 9:42 AM

49. Frontend Privacy Presentation

Because the product handles personal/family content, the frontend should use clear consent language.

For patient/caretaker-facing screens:

Explain what is being shared.

Explain who can access it.

Use plain language.

Make permission states visible.

Provide clear controls for access where applicable.

Do not display technical security terminology as the primary explanation.

Prefer:

Your family photos are stored securely.

You can change access anytime.

[ Manage access ]

rather than:

AES-256 encrypted RAG datastore

50. Frontend Architecture Rules

Use reusable components and centralized design tokens.

Recommended layers:

Screens
  ↓
Feature Components
  ↓
Shared Components
  ↓
Design Tokens

Feature-specific components should still consume the same shared tokens.

Example:

GameScreen
 ├── VoiceGuide
 ├── GameInstruction
 ├── GameContent
 ├── ChoiceButton
 └── GameFeedback

Do not duplicate visual styles across individual games.

51. Cross-Experience Consistency

The same semantic concepts must look the same everywhere.

Example:

Primary Action
→ Blue #3B82F6

Secondary Positive Action
→ Green #10B981

Danger / Attention
→ Red #F87171

Primary Text
→ #111827

A "Start" button must not be blue on one screen and purple on another.

A completed state must not have different visual semantics in Games and Reminders.

A card must not suddenly gain a different radius/shadow system in the dashboard.

52. Frontend Content Tone

Patient-facing copy should be:

short

warm

direct

reassuring

easy to understand

Prefer:

Let's try this.
Good job.
Take your time.
Try again.
You're done.

Avoid:

Cognitive performance suboptimal.
Incorrect response detected.
Task failure.
Performance below expected threshold.

Caretaker/dashboard language can be more precise, but should still avoid unnecessarily technical AI terminology.

53. Frontend Definition of Done

A SmritiYog frontend component is complete only when:

[ ] Uses design.md tokens
[ ] Works in English
[ ] Works in Devanagari
[ ] Supports text expansion
[ ] Has sufficient contrast
[ ] Has a clear purpose
[ ] Has an obvious primary action
[ ] Does not depend on color alone
[ ] Has large enough interaction targets
[ ] Works without unnecessary animation
[ ] Handles loading/error/empty states
[ ] Works offline where the feature is intended to work offline
[ ] Uses reusable shared components
[ ] Does not expose technical AI/backend concepts to patients
[ ] Looks consistent with the rest of SmritiYog

54. Product-Specific Anti-Patterns

The frontend AI must NOT introduce:

A generic fintech-style dashboard for the patient

Dense analytics on the patient home screen

Competitive game-show styling

Casino-like rewards

Flashing "correct!" effects

Countdown timers by default

Tiny game targets

Tiny leaderboard text

Technical AI terminology in patient UI

Backend/API terminology in patient UI

Different visual themes for each cognitive domain

State-specific redesigns that break the design system

Complex onboarding forms

Audio-only instructions

Internet-required messaging for offline-capable features

Raw error codes

Red screens for ordinary mistakes

Excessive notifications

Multiple equally dominant CTAs

55. Product UX Principle

SmritiYog should feel like a familiar guided daily companion, not a medical dashboard.

The patient experience should communicate:

I know where I am.
I know what to do.
I can understand the instruction.
I can make a mistake safely.
I can continue without internet.
I can recognize familiar people and memories.
I can finish a session and feel successful.

The caretaker experience should communicate:

I can quickly understand how the patient is doing.
I can see meaningful progress.
I can notice important changes.
I know when I need to act.

The web dashboard should communicate:

I can see trends.
I can identify domain-level changes.
I can understand alerts.
I can inspect relevant history without unnecessary complexity.

These goals must be achieved without breaking the core dementia-friendly design system.

56. SmritiYog Warm Visual Direction

The previous neutral palette is intentionally replaced by a warmer,
more human visual direction.

The app must not feel sterile, clinical, or like a generic healthcare dashboard.

The target feeling is:

warm + familiar + joyful + calm + trustworthy

Warmth must come from the background, illustrations, pictograms, and restrained
accent colors — not from reducing contrast or making the interface pastel and faint.

56.1 Warm Background

Default patient-app background:

#FFF8EF

This is the canonical SmritiYog page background.

Use:

#FFFFFF

for primary cards and important content surfaces.

Use:

#FFF1DF

for occasional warm-highlighted sections.

Do NOT turn every card into a different pastel color.

The background should feel warmer than the previous #F5F5F5, while text remains dark and highly readable.

57. SmritiYog Primary Color

The new primary brand/action color is:

#C65D3A

This warm terracotta is the main SmritiYog primary color.

Use it for:

Primary CTA buttons

Important selected states

Main active navigation

Key interaction indicators

Important action icons

Primary progress emphasis

Pressed/strong state:

#9E452A

Primary button

Important actions should be visually substantial.

Recommended:

Height: 56–64px

Minimum horizontal padding: 24px

Radius: 16px

Label: 18–20px Semibold

Optional icon: 22–26px

Strong contrast

Clear pressed state

For the most important patient action, prefer a large full-width or near-full-width CTA.

Example:

┌──────────────────────────────────────────────┐
│                                              │
│       ▶  START TODAY                         │
│                                              │
└──────────────────────────────────────────────┘

The primary CTA should never look like a small text link.

58. Secondary Color System

Use a restrained but colorful supporting palette.

Teal

#2F8F83

Use for:

Positive secondary actions

Completed activity indicators

Calm progress states

Memory/game category accents

Sun

#E6A23C

Use for:

Rewards

Streaks

Celebration

Friendly highlights

Achievement pictograms

Purple

#8067A8

Use sparingly for:

Emotional/cultural content

Music-related UI

Optional category accents

Danger

#C95656

Use only for:

Destructive actions

Genuine warnings

Important attention states

Never use danger red as decoration.

59. Colorful Pictogram System

Use Font Awesome pictograms instead of emojis throughout the application wherever a suitable icon exists.

Do NOT use platform emoji characters such as:

🧠
🎵
💊
❤️
🏆

as the primary UI icon system.

Use Font Awesome icons instead.

Examples:

brain
music
pills
heart
trophy
calendar
bell
house
gamepad
clock
user
users
image
star
check
arrow-right
volume-high

Use the appropriate Font Awesome icon package/style available in the project.

59.1 Colorful Font Awesome Icons

Font Awesome pictograms may use semantic accent colors.

Example:

Brain / Memory
→ #C65D3A

Music
→ #8067A8

Reminder
→ #2F8F83

Reward
→ #E6A23C

Warning
→ #C95656

Important

Colorful icons are allowed.

Colorful entire UI sections are not.

The icon should provide warmth and recognition while the surrounding UI remains calm.

60. Icon Containers

For important feature cards, place the Font Awesome icon inside a simple colored circular or rounded-square container.

Example:

┌───────────────────────────────────────┐
│                                       │
│     ┌───────┐                         │
│     │      │   Morning Reminder     │
│     └───────┘                         │
│                                       │
│     Take your medicine                │
│                                       │
└───────────────────────────────────────┘

Recommended icon container:

48–64px

Radius: 14–18px for rounded square

Or circular

Solid/light semantic accent background

Font Awesome pictogram centered

Icon size: approximately 24–32px

Do not use tiny 16px icons for primary recognition.

61. Graphics & Illustrations

The UI should contain more visual warmth and personality than the previous minimalist version.

Use:

Friendly flat illustrations

Simple local/cultural scenes

Familiar household objects

Family-oriented imagery

Gentle botanical/nature motifs

Large recognizable objects

Simple illustrated characters where appropriate

Graphics should be:

flat or lightly dimensional

simple

warm

high contrast

uncluttered

culturally appropriate

recognizable at a glance

Avoid

photorealistic medical imagery

hospital-style stock illustrations

overly childish cartoon styling

complex 3D renders

busy decorative scenes

visual noise behind text

highly saturated neon illustrations

62. Illustration Placement

Graphics should support comprehension, not compete with controls.

Good:

┌───────────────────────────────────────┐
│  [friendly illustration]              │
│                                       │
│  Good morning                         │
│  Let's start today's activities.     │
│                                       │
│  [ START TODAY ]                      │
└───────────────────────────────────────┘

Bad:

Huge illustration
+ multiple decorative objects
+ tiny text
+ tiny CTA
+ many competing colors

For the patient home screen, one meaningful hero illustration is preferable to many small decorative graphics.

63. Home Screen Visual Priority

The main patient screen should have a stronger visual hierarchy:

1. Greeting / familiar visual
        ↓
2. IMPORTANT TODAY CARD
        ↓
3. BIG PRIMARY CTA
        ↓
4. 2–3 QUICK ACTIONS
        ↓
5. SIMPLE PROGRESS
        ↓
6. NAVIGATION

The most important action should visually dominate.

64. Hero / Welcome Area

The home screen may use a warm hero area.

Recommended:

┌──────────────────────────────────────────────┐
│                                              │
│   [simple friendly illustration]             │
│                                              │
│   Good morning,                              │
│   Ayush                                      │
│                                              │
│   Let's take it one step at a time.          │
│                                              │
└──────────────────────────────────────────────┘

Use:

warm background

one simple illustration

large typography

generous whitespace

Do not create a marketing-style hero with excessive text.

65. Important Buttons

The following actions should receive large buttons:

Start today's session

Start game

Continue

Mark reminder as done

Try again

Finish

Confirm important action

Recommended hierarchy

Primary

56–64px height
Terracotta #C65D3A

Secondary

52–56px height
Teal #2F8F83 or neutral outlined button

Tertiary

48–52px minimum
Neutral / low emphasis

Never make an important patient action visually smaller than a decorative element.

66. Button Content

Prefer:

[ icon ] Start today's session

over:

START

when additional clarity is useful.

Prefer concrete language:

Start Game
Try Again
Mark as Done
Play Music
View Reminders
Continue

Avoid ambiguous:

Go
OK
Next
Do It

unless the context makes the meaning unmistakable.

67. Card Visual Language

Cards may have slightly more personality than the previous system.

Allowed:

white surface

warm surface

colored icon container

subtle border

very subtle shadow

moderate corner radius

Recommended:

Background:
#FFFFFF

Border:
subtle neutral border

Radius:
16–20px

Padding:
20–24px

Use shadows sparingly.

Cards should feel tactile and friendly, not floating dramatically above the screen.

68. Patient Home Quick Actions

Quick-action cards should use colorful Font Awesome pictograms.

Example:

┌───────────────────┐    ┌───────────────────┐
│                   │    │                   │
│      [brain]      │    │     [music]       │
│                   │    │                   │
│    Memory Game    │    │    Play Music     │
│                   │    │                   │
└───────────────────┘    └───────────────────┘

Each card:

large pictogram

short label

same dimensions

same padding

same radius

same interaction behavior

Use different semantic icon colors to improve recognition.

69. Rewards & Celebration

Celebration can be colorful, but must remain calm.

Use:

Sun accent #E6A23C

Teal #2F8F83

Terracotta #C65D3A

Large Font Awesome trophy/star/check icons

Example:

          [ trophy icon ]

          Great job!

        +10 points

       [ Continue ]

Do not use:

confetti explosions

flashing screens

rapid scaling

loud visual effects

casino-like reward animations

Celebration should feel warm and satisfying, not overstimulating.

70. Emotional Tone of Visuals

SmritiYog is not supposed to look like a hospital administration system.

Use visual cues associated with:

home

family

familiar memories

nature

music

everyday life

warmth

gentle achievement

The visual language should communicate:

"This is a familiar place where I can take my time."

not:

"This is a clinical system measuring me."

71. Strict Balance Rule

More colorful does not mean more visually busy.

Use this balance:

Warm background
      +
Dark readable typography
      +
One strong primary color
      +
2–3 restrained accent colors
      +
Large Font Awesome pictograms
      +
A few meaningful illustrations
      =
SmritiYog visual identity

Do not turn every component into a rainbow.

72. Updated AI Generation Rule

When generating any new frontend component, the AI must now follow both:

The original dementia-friendly accessibility system

The SmritiYog Warm Visual Direction

If these appear to conflict:

Accessibility and readability always win.

The UI should be warmer and more visually engaging, but never at the expense of:

contrast

simplicity

predictability

large touch targets

readable typography

cognitive clarity

language support

73. Updated Forbidden Patterns

In addition to all previous forbidden patterns, do not introduce:

Emoji as the primary icon system when a suitable Font Awesome pictogram exists

Random icon colors

More than 3–4 accent colors on a single screen

Rainbow dashboards

Neon pictograms

Giant decorative illustrations that compete with CTAs

Tiny primary buttons

Tiny game controls

Generic hospital/clinical visual styling

Excessive pastel cards

Excessive colored backgrounds

Childish cartoon UI

Casino-style gamification

74. Updated Component Acceptance Test

Before accepting a generated component, ask:

Does it feel warmer than the old neutral design?
Does it use the SmritiYog terracotta primary?
Does it have enough visual personality?
Could a Font Awesome pictogram improve recognition?
Is the pictogram large enough?
Is the important action BIG enough?
Is the background warm?
Are the colors still restrained?
Is text still highly readable?
Does it work in English?
Does it work in Devanagari?
Does it remain dementia-friendly?
Does it still look like the same app?

The ideal answer is:

Warm, colorful, recognizable, calm, accessible, and consistent.