import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Home from './Pages/Home.jsx'
import Profile, { loader as loaderProfile } from './Pages/Profile.jsx'
import CreatePalette from './Pages/CreatePalette.jsx'
import Authentication from './Pages/Authentication.jsx'
import Post, { loader as loaderPost } from './Pages/Post.jsx'
import Bookmarks from './Pages/Bookmarks.jsx'
import Followings from './Pages/Followings.jsx'
import EditProfile, { loader as loaderEditProfile } from './Pages/EditProfile.jsx'
import About from './Pages/About.jsx'
import MakeSuggestion from './Pages/MakeSuggestion.jsx'
import Statistics from './Pages/Statistics.jsx'
import Settings from './Pages/Settings.jsx'
import NextUpdates from './Pages/NextUpdates.jsx'
import OtherProjects from './Pages/OtherProjects.jsx'
import FollowingDetails, { loader as loaderFollowingDetails } from './Pages/FollowingDetails.jsx'
import FollowerDetails, { loader as loaderFollowerDetails } from './Pages/FollowerDetails.jsx'

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                index: true,
                element: <Home />
            },
            {
                path: '/profile/:username',
                element: <Profile />,
                loader: loaderProfile
            },
            {
                path: '/bookmarks',
                element: <Bookmarks />
            },
            {
                path: '/create-palette',
                element: <CreatePalette />,
            },
            {
                path: '/authentication',
                element: <Authentication />
            },
            {
                path: '/followings',
                element: <Followings />
            },
            {
                path: '/post/:username/:post_id',
                element: <Post />,
                loader: loaderPost
            },
            {
                path: '/edit-profile/:username',
                element: <EditProfile />,
                loader: loaderEditProfile
            },
            {
                path: '/about',
                element: <About />
            },
            {
                path: '/make-a-suggestion',
                element: <MakeSuggestion />
            },
            {
                path: '/statistics',
                element: <Statistics />
            },
            {
                path: '/settings',
                element: <Settings />
            },
            {
                path: '/next-updates',
                element: <NextUpdates />
            },
            {
                path: '/other-projects',
                element: <OtherProjects />
            },
            {
                path: '/:username/following-details',
                element: <FollowingDetails />,
                loader: loaderFollowingDetails
            },
            {
                path: '/:username/follower-details',
                element: <FollowerDetails />,
                loader: loaderFollowerDetails
            }
        ]
    }
])

ReactDOM.createRoot(document.getElementById('root')).render(
    <RouterProvider router={router} />
)
