# USB-Website-Revamp

Purdue USB Main Website (last updated December 2025 by Ryan Sierra)


# Main Layout
- public folder: Holds images and json files for all statically stored data like blog posts, student wiki posts, current members, and other miscelaneous images used on the site sorted into differnt sub folder
- src folder: Broken down into sub folders that include all the initiative pages, the blog pages and components, student wiki pages and posts, as well as the main home page stored on the same level as the app.jsx and index.jsx used for routing and containing the rest of the site

# Tech Stack
- React JS
- Tailwind CSS
- Both of these are pretty user friendly technologies where the CSS is stored directly in the react files instead of having to have dedicated CSS files for every differnt page, component, or class

# Future Updates
- Instagram Posts: Currently, Instagram posts are stored statically in the public folder becasue instagram just wouldnt give me an API Key. In the future, we can add a flask backend component that uses Instaloader to automatically pull the most recent posts from the USB insta. The only issue I have with this is that whatever hosts our backend will have to be a paid service that is constantly on or else the free tier will periodically shut off which leads to like a 1 minute boot up time for images to render in when a new user logs on. This is the main reason I haven't done this yet
