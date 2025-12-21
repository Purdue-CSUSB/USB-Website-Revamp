import Homepage from './Homepage.jsx'
import BlogList from './Blog/BlogList.jsx'
import BlogPost from './Blog/BlogPost.jsx'
import StudentWiki from './StudentWiki/StudentWikiList.jsx'
import StudentWikiPost from './StudentWiki/StudentWikiPost.jsx'
import InitiativesIndex from './Initiatives/Index.jsx'
import ClubHub from './Initiatives/ClubHub/ClubHub.jsx'
import CareerResources from './Initiatives/CareerResources/CareerResources.jsx'
import HelpRoom from './Initiatives/HelpRoom/HelpRoom.jsx'
import Mentorship from './Initiatives/Mentorship/Mentorship.jsx'
import TownHall from './Initiatives/TownHall/TownHall.jsx'
import SocialWellness from './Initiatives/SocialWellness/SocialWellness.jsx'
import Panels from './Initiatives/Panels/Panels.jsx'
import CS193 from './Initiatives/CS193/CS193.jsx'
import Contact from './Contact/Contact.jsx'
import { BrowserRouter, HashRouter, Routes, Route } from "react-router-dom"
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/initiatives/blog" element={<BlogList />} />
        <Route path="/initiatives/blog/:slug" element={<BlogPost />} />
        <Route path="/initiatives" element={<InitiativesIndex />} />
        <Route path="/initiatives/club-hub" element={<ClubHub />} />
        <Route path="/initiatives/career-resources" element={<CareerResources />} />
        <Route path="/initiatives/help-room" element={<HelpRoom />} />
        <Route path="/initiatives/mentorship" element={<Mentorship />} />
        <Route path="/initiatives/town-hall" element={<TownHall />} />
        <Route path="/initiatives/social-wellness" element={<SocialWellness />} />
        <Route path="/initiatives/panels" element={<Panels />} />
        <Route path="/initiatives/cs193" element={<CS193 />} />
        <Route path="/student-wiki" element={<StudentWiki />} />
        <Route path="/student-wiki/:slug" element={<StudentWikiPost />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
