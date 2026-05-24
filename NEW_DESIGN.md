# Chores App — UI Design System & Prompt Guide

## Product Overview

A modern mobile chores app for families where:

- Parents create tasks and rewards
- Children complete chores and earn points
- The experience feels playful, emotional, premium, and motivating

Core vibe:

- Duolingo-level friendliness
- Apple-quality spacing and polish
- Soft 3D + flat hybrid style
- Large rounded UI
- Child-safe and emotionally warm

---

# Visual Style

## Design Mood

The interface should feel:

- Friendly
- Soft
- Clean
- Rewarding
- Premium but playful
- Gamified
- Emotional and safe

Think:

- Duolingo
- Pok Pok
- Finch App
- Modern Apple onboarding
- Family-oriented fintech UI

---

# Color Palette

## Primary Background

Gradient blue/lavender:

Top:
#7B92FF

Bottom:
#93A7FF

Alternative:
#8196FF → #9EB0FF

---

## Accent Colors

### Purple CTA

#A855F7
#9333EA

### Orange CTA

#FFA726
#FF9800

### Mint / Mascot

#7DFFC0
#A8FFD6

### Soft White Cards

rgba(255,255,255,0.18)

---

# Typography

## Font Style

Use rounded modern fonts:

Recommended:

- SF Pro Rounded
- Nunito
- Poppins
- Inter Rounded

---

## Text Rules

### Headlines

- Large
- Bold
- Centered
- Very little text

### Body

- Soft gray-white
- Minimal wording

### Buttons

- Uppercase optional
- Very bold
- Large padding

---

# Layout Rules

## General Layout

- Huge spacing
- Airy UI
- Rounded everything
- Large touch targets
- No sharp corners

---

## Border Radius

Cards:
32px

Buttons:
999px

Inputs:
24px

Bottom navigation:
28px

---

# Shadows

Use very soft shadows only.

Example:
0 10px 30px rgba(0,0,0,0.12)

No hard dark shadows.

---

# Glassmorphism Rules

Cards should use:

- Light transparency
- Soft blur
- White overlays

Example:
background: rgba(255,255,255,0.18)
backdrop-filter: blur(20px)

---

# Mascot Rules

## Mascot

Cute mint elephant mascot.

Style:

- Big eyes
- Tiny body
- Chubby proportions
- Friendly smile
- Duolingo-inspired personality

Mascot should appear:

- On onboarding
- Empty states
- Reward screens
- Celebration moments

Mascot must NEVER look realistic.

---

# Icon Style

Icons:

- Rounded
- Cartoonish
- 3D soft icons allowed
- Large and readable

Use:

- stars
- coins
- gifts
- sparkles
- trophies
- checkmarks

---

# Animation Style

Motion should feel:

- Soft
- Bouncy
- Rewarding

Use:

- scale animations
- floating cards
- smooth transitions
- cheerful microinteractions

Avoid:

- aggressive motion
- cyberpunk effects
- dark transitions

---

# Main User Flow

# 1. Welcome Screen

## Goal

Choose role.

## Layout

- Blue gradient background
- Large mascot centered
- App logo/title
- Two giant buttons

Buttons:

1. I'm Parent
2. I'm Child

Buttons must:

- be huge
- rounded pill style
- floating
- purple/orange gradients

---

# 2. Parent Intro Screen

## Content

Illustration of happy family.

Three bullet benefits:

- Create chores
- Set rewards
- Track progress

Bottom CTA:
Continue

---

# 3. Child Intro Screen

## Content

Happy child holding star/reward.

Three benefits:

- Complete tasks
- Earn coins
- Unlock rewards

---

# 4. Profile Setup

## Parent Setup

Fields:

- Name
- Email
- Family name

Large avatar upload circle.

---

## Child Setup

Fields:

- Name
- Age

Fun avatar selection.

---

# 5. Avatar Selection

## Layout

- Large mascot preview
- Horizontal avatar options
- Cute creatures and characters

Bottom CTA:
Done

---

# 6. Child Home Screen

## Structure

### Top Area

- Coin balance
- Child avatar
- Greeting

Example:
"Hi, Tim!"

---

### Tasks Card

White glass card with tasks list.

Task item:

- icon
- task name
- reward amount

Example:
🧹 Clean room — +100

---

### Rewards Section

Horizontal reward cards:

- toy
- football
- gamepad
- candy

---

### Bottom Navigation

4 tabs:

- Home
- Tasks
- Shop
- Profile

Floating active state.

---

# 7. Parent Dashboard

## Main Sections

### Family Progress

Weekly completion progress.

### Active Tasks

List of assigned chores.

### Reward Requests

Children can request rewards.

### Add Task Button

Large floating CTA.

---

# 8. Task Completion Screen

## Celebration Moment

Huge success state:

- elephant cheering
- confetti
- earned coins animation

Text:
"Great Job!"

Reward counter increases.

---

# UI Density Rules

The UI must NEVER feel crowded.

Use:

- large margins
- large padding
- oversized cards
- very few elements per screen

---

# Important Design Constraints

## DO NOT

- use dark mode
- use sharp corners
- use tiny text
- use complex dashboards
- use corporate fintech style
- use minimal black/white aesthetic
- use realistic illustrations

---

# MUST HAVE

- playful gradients
- rounded components
- emotional design
- child-friendly visuals
- premium spacing
- glassmorphism cards
- mascot personality

---

# Screen Generation Prompt

Use this prompt for generating new screens:

"Modern premium mobile chores app UI for families and children, soft blue gradient background, mint elephant mascot, Duolingo-inspired playful design, rounded glassmorphism cards, large CTA buttons, soft shadows, premium spacing, child-friendly fintech aesthetic, cute 3D illustrations, Apple-quality layout, highly polished mobile interface, onboarding and dashboard screens"

---

# Component Reference

## Buttons

- pill shape
- gradient fill
- bold white text
- floating shadow

## Cards

- translucent white
- blurred background
- rounded 32px

## Inputs

- large height
- soft borders
- floating style

## Navigation

- floating bottom dock
- rounded container
- soft active states

---

# Design Goal

The app should make children WANT to complete chores and make parents feel emotionally connected and in control.

The UI should feel like:
"A game children love and parents trust."
