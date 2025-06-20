// README.md
# Kliment Ho - Portfolio Website (khfolio)

This repository contains the source code for Kliment Ho's personal portfolio website.

The website is designed with a modern, sleek aesthetic, showcasing projects, professional experience, and skills. It dynamically fetches and displays GitHub repositories and features a prominent rotating banner for curated projects. A key personal touch is the 3D "Memories & Moments" photo gallery.

## Progress

### Iteration 1: Core Structure, Data, and Styling Foundation (Steam-Inspired)
-   **Status**: Completed.
-   **Details**: Initial setup with dynamic project display from `projects.js`, resume page, project detail page, and Steam-like styling.

### Iteration 2: Modern Aesthetic & New Features
-   **Objective**: Implement a new sleek design, a large rotating banner for curated projects, a sidebar rotator for recent GitHub activity, a grid for all GitHub repos, and an automated 3D photo gallery.
-   **Status**: Completed.

### Iteration 3: Enhanced Polaroid Photo Gallery
-   **Objective**: Refine the photo gallery into a polaroid style with a glossy laminated finish. The cards are now fully responsive to each photo's dimensions, draggable with momentum, and feature a more compact grid layout.
-   **Status**: Completed.

## Key Features & Usage

### Memories & Moments Photo Gallery

A new section has been added to display personal photos in an interactive 3D gallery. Each photo is presented on a laminated polaroid-style card that can be flipped over to reveal details. The cards feature advanced physics-based interactions.

**Features:**
-   **Perfect Polaroid Ratios:** Cards automatically resize to create a perfect polaroid frame around each photo, regardless of its original dimensions, with zero cropping.
-   **Click & Drag to Spin:** Grab a card and "throw" it to make it spin with realistic momentum.
-   **Click to Flip:** A simple, quick click will flip the card over to see the details on the back.
-   **Subtle Hover & Lamination:** When idle, cards have a gentle 3D hover effect. A glossy sheen is applied to each card face to simulate a laminated finish.

#### How to Update Your Photos

**Requirement:** You must have **Node.js** installed.

**Step 1: Install Dependencies**
-   If this is your first time running the script, open your terminal in the project's root directory and run:
    ```bash
    npm install image-size
    ```

**Step 2: Add Your Image Files**
-   Place your `.jpg` or `.png` images directly inside the `data/pictures/` folder.

**Step 3: Generate the Picture List**
-   This is the **only command you need to run** after changing your images.
-   In your terminal, run:
    ```bash
    node utils/generate_picture_list.js
    ```
-   This script automatically finds all images in `data/pictures/`, reads their dimensions, sorts them by date, and generates a `data/picture-manifest.json` file.

**Step 4: Add Descriptions (Optional)**
-   To add a personal story, date, or location to a photo, open the `data/memories.json` file. If it doesn't exist, you can create it.
-   Add a new entry where the **key is the exact filename** of the picture.

-   **Example `data/memories.json` structure:**
    ```json
    {
      "tokyo_trip_2021.jpg": {
        "description": "Exploring the vibrant streets of Shibuya Crossing. The energy was electric!",
        "date": "October 2021",
        "location": "Tokyo, Japan"
      },
      "iceland_aurora_2023.jpeg": {
        "description": "Witnessing the magic of the Northern Lights. No photo can do it justice.",
        "date": "February 2023",
        "location": "Vik, Iceland"
      }
    }
    ```
-   If you don't add an entry for a picture, it will still appear in the gallery with default placeholder text on the back.

**Step 5: View Your Changes**
-   Save any changes and refresh `index.html` in the browser to see the updated gallery.

---
*This README will be updated as development progresses.*