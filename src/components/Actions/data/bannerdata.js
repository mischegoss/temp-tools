// ===========================================
// BANNER CONFIGURATION
// ===========================================
// This file controls the announcement banner that appears above the hero section.
//
// INSTRUCTIONS FOR TECHNICAL WRITERS:
// 1. To SHOW the banner: Change "showing" to true
// 2. To HIDE the banner: Change "showing" to false
// 3. To change the text: Edit the "message" field
// 4. To change the button text: Edit the "buttonText" field
// 5. To change where the button goes: Edit the "buttonLink" field
//
// IMPORTANT: Only change the values after the : and keep the quotes around text!
// ===========================================

export const bannerData = {
  // Set to true to show banner, false to hide it
  showing: true,

  // The main announcement text (keep it short and sweet!)
  message: 'New in Resolve Actions: Rita just released!',

  // What the button says
  buttonText: 'Learn More',

  // Where clicking the button takes users (must start with /)
  buttonLink: '/actions/new',

  // Optional: Make part of the message bold (put the bold part here)
  // Leave empty ("") if you don't want any bold text
  boldText: 'New in Resolve Actions:',
}

// ===========================================
// EXAMPLES OF HOW TO CHANGE THIS:
// ===========================================
//
// Example 1 - Hide the banner:
// showing: false,
//
// Example 2 - Different announcement:
// message: "🎉 Resolve Actions v2.0 is now available!",
// boldText: "🎉 Resolve Actions v2.0",
//
// Example 3 - Different button:
// buttonText: "Download Now",
// buttonLink: "/downloads",
//
// Example 4 - Simple message with no bold:
// message: "Check out our latest features and improvements!",
// boldText: "",
// ===========================================
